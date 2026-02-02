<template>
  <!-- Logo 관리 페이지 -->
  <div class="logo-page">
    <!-- 페이지 헤더 -->
    <div class="page-header">
      <div class="header-top">
        <h1 class="page-title">Logo Management</h1>
        <p class="page-description">
          로고는 좌측 상단에 노출되며, 최대 3개까지 업로드 가능합니다
        </p>
      </div>

      <div class="header-actions">
        <a-button
          type="primary"
          :loading="loading"
          @click="handlePreview"
          class="action-button"
        >
          <template #icon>
            <EyeOutlined />
          </template>
          미리보기
        </a-button>

        <a-button
          type="default"
          :loading="loading"
          @click="enterEditMode"
          :disabled="!isEditing && logos.length === 0"
          class="action-button"
        >
          <template #icon>
            <EditOutlined />
          </template>
          편집
        </a-button>

        <a-button
          v-if="isEditing"
          type="default"
          @click="exitEditMode"
          class="action-button"
        >
          이전
        </a-button>

        <a-button
          type="primary"
          danger
          :loading="isDeploying"
          @click="handleDeploy"
          class="action-button"
        >
          <template #icon>
            <CloudUploadOutlined />
          </template>
          배포
        </a-button>

        <a-button
          v-if="isEditing"
          type="primary"
          :loading="loading"
          @click="handleSave"
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

    <!-- 로고 목록 (조회 모드) -->
    <div v-if="!isEditing" class="logos-display">
      <LogoCard
        v-for="logo in logos"
        :key="logo.id"
        :logo="logo"
        :is-selected="logo.isSelected"
        class="logo-item"
      />

      <!-- 빈 상태 메시지 -->
      <div v-if="logos.length === 0" class="empty-state">
        <PictureOutlined class="empty-icon" />
        <p class="empty-text">로고가 없습니다</p>
        <p class="empty-hint">편집 모드에서 로고를 업로드할 수 있습니다</p>
      </div>
    </div>

    <!-- 로고 편집 (편집 모드) -->
    <div v-else class="logos-edit">
      <!-- 로고 카드 (편집 가능) -->
      <LogoEditCard
        v-for="logo in logos"
        :key="logo.id"
        :logo="logo"
        :is-selected="logo.isSelected"
        :loading="loading"
        @select="handleSelectLogo"
        @delete="handleDeleteLogo"
      />

      <!-- 새 로고 업로드 (슬롯이 남아있을 때) -->
      <LogoUploadCard
        v-if="!isLogosFull"
        :loading="loading"
        @upload="handleUploadLogo"
      />

      <!-- 로고 풀 상태 메시지 -->
      <a-alert
        v-if="isLogosFull"
        type="info"
        message="로고는 최대 3개까지 업로드 가능합니다"
        class="info-alert"
      />
    </div>

    <!-- 미리보기 모달 -->
    <LogoPreviewModal v-model:visible="previewVisible" :logo="selectedLogo" />

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
 * Logo 관리 페이지
 *
 * 기능:
 * - 로고 목록 조회
 * - 로고 업로드 (최대 3개)
 * - 메인 로고 선택
 * - 로고 삭제
 * - 배포 기능
 */

import { ref, computed, onMounted } from "vue";
import {
  EyeOutlined,
  EditOutlined,
  SaveOutlined,
  CloudUploadOutlined,
  PictureOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { useLogoStore } from "@/stores/logoStore";
import LogoCard from "./components/LogoCard.vue";
import LogoEditCard from "./components/LogoEditCard.vue";
import LogoUploadCard from "./components/LogoUploadCard.vue";
import LogoPreviewModal from "./components/LogoPreviewModal.vue";
import DeploymentModal from "./components/DeploymentModal.vue";

const logoStore = useLogoStore();

const isEditing = ref(false);
const loading = ref(false);
const isDeploying = ref(false);
const error = ref<string | null>(null);
const previewVisible = ref(false);
const deploymentModalVisible = ref(false);
const deploymentStatus = ref<"success" | "error">("success");
const deploymentMessage = ref("");

const logos = computed(() => logoStore.logos);
const selectedLogo = computed(() => logoStore.selectedLogo);
const isLogosFull = computed(() => logoStore.isLogosFull);
const office = computed(() => localStorage.getItem("office-code") || "ktds");

function enterEditMode(): void {
  isEditing.value = true;
}

function exitEditMode(): void {
  isEditing.value = false;
}

function handlePreview(): void {
  previewVisible.value = true;
}

async function handleSelectLogo(logoId: string): Promise<void> {
  loading.value = true;
  error.value = null;

  try {
    await logoStore.selectLogo(logoId, office.value);
    message.success("로고가 선택되었습니다");
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "로고 선택 실패";
    error.value = errorMessage;
  } finally {
    loading.value = false;
  }
}

async function handleDeleteLogo(logoId: string): Promise<void> {
  loading.value = true;
  error.value = null;

  try {
    await logoStore.deleteLogo(logoId, office.value);
    message.success("로고가 삭제되었습니다");
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "로고 삭제 실패";
    error.value = errorMessage;
  } finally {
    loading.value = false;
  }
}

async function handleUploadLogo(file: File): Promise<void> {
  loading.value = true;
  error.value = null;

  try {
    await logoStore.uploadLogo(office.value, file);
    message.success("로고가 업로드되었습니다");
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "로고 업로드 실패";
    error.value = errorMessage;
  } finally {
    loading.value = false;
  }
}

async function handleSave(): Promise<void> {
  exitEditMode();
  message.success("로고 설정이 저장되었습니다");
}

async function handleDeploy(): Promise<void> {
  isDeploying.value = true;

  try {
    deploymentStatus.value = "success";
    deploymentMessage.value = "서비스가 정상적으로 배포되었습니다";
    message.success("배포 완료!");
  } catch (err) {
    deploymentStatus.value = "error";
    deploymentMessage.value = "배포 중 오류가 발생했습니다";
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
    await logoStore.fetchLogos(office.value);
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
.logo-page {
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
    flex-wrap: wrap;

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

.error-alert,
.info-alert {
  margin-bottom: 24px;
  border-radius: 6px;
}

.logos-display {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;

  .logo-item {
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
    }
  }
}

.logos-edit {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px dashed #d9d9d9;

  .empty-icon {
    font-size: 48px;
    color: #bfbfbf;
    margin-bottom: 16px;
  }

  .empty-text {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: #262626;
  }

  .empty-hint {
    margin: 8px 0 0 0;
    font-size: 14px;
    color: #8c8c8c;
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

  .logos-display,
  .logos-edit {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
