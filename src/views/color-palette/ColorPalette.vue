<template>
  <!-- Color Palette 관리 페이지 -->
  <div class="color-palette-page">
    <!-- 페이지 헤더 -->
    <div class="page-header">
      <div class="header-top">
        <h1 class="page-title">Color Palette</h1>
        <p class="page-description">서비스의 주요 색상을 설정할 수 있습니다</p>
      </div>

      <div class="header-actions">
        <a-button
          type="default"
          :disabled="!hasChanges"
          @click="handleReset"
          class="action-button"
        >
          <template #icon>
            <ReloadOutlined />
          </template>
          초기화
        </a-button>

        <a-button
          type="primary"
          danger
          :loading="isDeploying"
          @click="handleDeploy"
          :disabled="!hasChanges"
          class="action-button"
        >
          <template #icon>
            <SaveOutlined />
          </template>
          저장
        </a-button>
      </div>
    </div>

    <!-- 로딩 상태 -->
    <a-spin v-if="loading" tip="로딩 중..." class="loading-spinner" />

    <!-- 에러 메시지 -->
    <a-alert
      v-if="error"
      type="error"
      :message="`오류: ${error}`"
      closable
      @close="clearError"
      class="error-alert"
    />

    <!-- 색상 팔레트 에디터 -->
    <div class="color-palette-editor">
      <!-- 주 색상 그룹 -->
      <ColorGroupEditor
        title="Main Color"
        :color="colorPalette.mainColorHexCode"
        :hover-color="colorPalette.mainHoverColorHexCode"
        @update-color="updateColor('mainColorHexCode', $event)"
        @update-hover-color="updateColor('mainHoverColorHexCode', $event)"
      />

      <!-- 보조 색상 그룹 -->
      <ColorGroupEditor
        title="Sub Color"
        :color="colorPalette.subColorHexCode"
        :hover-color="colorPalette.subHoverColorHexCode"
        @update-color="updateColor('subColorHexCode', $event)"
        @update-hover-color="updateColor('subHoverColorHexCode', $event)"
      />

      <!-- 그라데이션 색상 그룹 -->
      <GradientColorEditor
        :start-color="colorPalette.startGradientColor"
        :end-color="colorPalette.endGradientColor"
        @update-start="updateColor('startGradientColor', $event)"
        @update-end="updateColor('endGradientColor', $event)"
      />
    </div>

    <!-- 색상 미리보기 -->
    <div class="color-preview">
      <h3 class="preview-title">Color Preview</h3>
      <ColorPalettePreview :colors="colorPalette" />
    </div>

    <!-- 배포 결과 모달 -->
    <DeploymentModal
      v-model:visible="deploymentModalVisible"
      :status="deploymentStatus"
      :message="deploymentMessage"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * Color Palette 관리 페이지
 *
 * 기능:
 * - 색상 팔레트 실시간 편집
 * - 색상 미리보기
 * - 색상 저장/배포
 * - iro.js 라이브러리 연동 (자식 컴포넌트에서 처리)
 */

import { ref, computed, onMounted } from "vue";
import { SaveOutlined, ReloadOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { useColorStore } from "@/stores/colorStore";
import type { ColorPalette } from "@/types";
import ColorGroupEditor from "./components/ColorGroupEditor.vue";
import GradientColorEditor from "./components/GradientColorEditor.vue";
import ColorPalettePreview from "./components/ColorPalettePreview.vue";
import DeploymentModal from "./components/DeploymentModal.vue";

const colorStore = useColorStore();

const loading = ref(false);
const isDeploying = ref(false);
const error = ref<string | null>(null);
const deploymentModalVisible = ref(false);
const deploymentStatus = ref<"success" | "error">("success");
const deploymentMessage = ref("");

const colorPalette = computed(() => colorStore.colorPalette);
const hasChanges = computed(() => colorStore.hasChanges);
const office = computed(() => localStorage.getItem("office-code") || "ktds");

/**
 * 색상 업데이트
 *
 * @param key - 색상 키
 * @param value - HEX 색상값
 */
function updateColor(key: keyof ColorPalette, value: string): void {
  try {
    colorStore.updateColor(key, value);
  } catch (err) {
    error.value = err instanceof Error ? err.message : "색상 업데이트 실패";
  }
}

/**
 * 초기화 (기본값으로 복구)
 */
function handleReset(): void {
  colorStore.resetPalette();
  message.info("색상이 초기화되었습니다");
}

/**
 * 색상 저장 및 배포
 */
async function handleDeploy(): Promise<void> {
  if (!colorStore.allColorsValid) {
    message.error("유효하지 않은 색상이 있습니다");
    return;
  }

  isDeploying.value = true;

  try {
    await colorStore.saveColorPalette(office.value);

    deploymentStatus.value = "success";
    deploymentMessage.value = "색상이 정상적으로 저장되었습니다";
    message.success("저장 완료!");
  } catch (err) {
    deploymentStatus.value = "error";
    deploymentMessage.value =
      err instanceof Error ? err.message : "저장 중 오류가 발생했습니다";
    message.error("저장 실패");
  } finally {
    isDeploying.value = false;
    deploymentModalVisible.value = true;
  }
}

function clearError(): void {
  error.value = null;
}

onMounted(async () => {
  loading.value = true;

  try {
    await colorStore.fetchColorPalette(office.value);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "데이터 로드 실패";
    error.value = errorMessage;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped lang="scss">
.color-palette-page {
  width: 100%;
  padding: 0;
}

.page-header {
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  padding: 24px;
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .header-top {
    margin-bottom: 16px;

    .page-title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #262626;
    }

    .page-description {
      margin: 8px 0 0 0;
      font-size: 14px;
      color: #8c8c8c;
    }
  }

  .header-actions {
    display: flex;
    gap: 8px;

    .action-button {
      transition: all 0.3s ease;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
      }
    }
  }
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.error-alert {
  margin-bottom: 24px;
  border-radius: 6px;
}

.color-palette-editor {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.color-preview {
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 24px;

  .preview-title {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: #262626;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 16px;
    margin-bottom: 16px;

    .header-top {
      margin-bottom: 12px;

      .page-title {
        font-size: 20px;
      }
    }

    .header-actions {
      gap: 6px;

      .action-button {
        flex: 1;
        min-width: auto;
      }
    }
  }

  .color-palette-editor {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 24px;
  }

  .color-preview {
    padding: 16px;
  }
}
</style>
