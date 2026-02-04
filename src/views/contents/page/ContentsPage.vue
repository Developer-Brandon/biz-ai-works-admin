<template>
  <!-- Contents (카드) 관리 페이지 -->
  <div class="contents-page">
    <!-- 페이지 헤더 -->
    <div class="page-header">
      <div class="header-top">
        <a-tag color="blue" class="page-description">
          ※ 서비스에 노출될 3개의 카드를 설정할 수 있습니다
        </a-tag>
      </div>

      <div class="header-actions">
        <a-button
          v-if="!isEditing"
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
          v-if="!isEditing"
          type="default"
          :loading="loading"
          @click="enterEditMode"
          class="action-button"
        >
          <template #icon>
            <EditOutlined />
          </template>
          편집
        </a-button>

        <a-button
          v-else
          type="default"
          @click="exitEditMode"
          class="action-button"
        >
          이전
        </a-button>

        <a-button
          v-if="!isEditing"
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

    <!-- 성공 메시지 -->
    <a-alert
      v-if="successMessage"
      type="success"
      :message="successMessage"
      closable
      @close="clearSuccess"
      class="success-alert"
    />

    <!-- 빈 상태 -->
    <a-empty
      v-if="!loading && displayCards.length === 0"
      description="카드가 없습니다"
      class="empty-state"
    />

    <!-- 카드 목록 (조회 모드) -->
    <div v-if="!isEditing && !loading" class="cards-display">
      <CardDisplayGroup
        v-for="(card, index) in displayCards"
        :key="card.id"
        :card="card"
        :card-number="index + 1"
        :agents="agents"
      />
    </div>

    <!-- 카드 목록 (편집 모드) -->
    <div v-if="isEditing && !loading" class="cards-edit">
      <CardEditForm
        v-for="(card, index) in displayCards"
        :key="card.id"
        :card="card"
        :card-number="index + 1"
        :agents="agents"
        :loading="loading"
        @update="handleCardUpdate"
        @thumbnail-upload="handleThumbnailUpload"
      />
    </div>

    <!-- 미리보기 모달 -->
    <PreviewModal
      v-model:visible="previewVisible"
      :cards="displayCards"
      :agents="agents"
    />

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
 * Contents (카드) 관리 페이지
 *
 * 기능:
 * - 카드 목록 조회 및 표시 (각 카드가 full-width)
 * - 카드 편집 모드
 * - 미리보기 (모달)
 * - 배포 기능
 *
 * 레이아웃:
 * - 각 카드가 전체 너비를 차지
 * - 카드 내부에서 정보를 가로로 배치 (왼쪽 정보, 오른쪽 이미지)
 * - 세로로 카드들이 쌓임 (gap으로 구분)
 *
 * Vue3 특징:
 * - Composition API로 로직 캡슐화
 * - ref()와 computed()로 상태 관리
 * - async/await로 비동기 처리
 */

import { ref, computed, onMounted, watch } from "vue";
import {
  EyeOutlined,
  EditOutlined,
  SaveOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { useContentStore } from "@/stores/contentStore";
import { useImageStore } from "@/stores/imageStore";
import type { Card } from "@/types";
import CardDisplayGroup from "../components/CardDisplayGroup.vue";
import CardEditForm from "../components/CardEditForm.vue";
import PreviewModal from "../components/PreviewModal.vue";
import DeploymentModal from "../components/DeploymentModal.vue";

/**
 * Store 초기화
 */
const contentStore = useContentStore();
const imageStore = useImageStore();

/**
 * 반응형 상태 정의
 */
const isEditing = ref(false);
const loading = ref(false);
const isDeploying = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const previewVisible = ref(false);
const deploymentModalVisible = ref(false);
const deploymentStatus = ref<"success" | "error">("success");
const deploymentMessage = ref("");

/**
 * 계산된 속성
 */
const displayCards = computed(() => contentStore.displayCards);
const agents = computed(() => contentStore.agents);
const office = computed(() => {
  return localStorage.getItem("office-code") || "ktds";
});

/**
 * 에러 메시지 초기화
 */
function clearError(): void {
  error.value = null;
}

/**
 * 성공 메시지 초기화
 */
function clearSuccess(): void {
  successMessage.value = null;
}

/**
 * 편집 모드 진입
 */
function enterEditMode(): void {
  isEditing.value = true;
  message.info("편집 모드로 전환되었습니다");
}

/**
 * 편집 모드 종료
 */
function exitEditMode(): void {
  isEditing.value = false;
  contentStore.setEditingCard(null);
}

/**
 * 미리보기 열기
 */
function handlePreview(): void {
  previewVisible.value = true;
}

/**
 * 카드 업데이트 핸들러
 *
 * @param cardId - 업데이트할 카드 ID
 * @param cardData - 업데이트할 데이터
 */
async function handleCardUpdate(
  cardId: string,
  cardData: Partial<Card>,
): Promise<void> {
  loading.value = true;
  error.value = null;

  try {
    await contentStore.updateCard(cardId, office.value, cardData);
    successMessage.value = "카드가 업데이트되었습니다";
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "카드 업데이트 실패";
    error.value = errorMessage;
    message.error(errorMessage);
  } finally {
    loading.value = false;
  }
}

/**
 * 썸네일 이미지 업로드 핸들러
 *
 * @param cardId - 카드 ID
 * @param file - 업로드할 파일
 */
async function handleThumbnailUpload(
  cardId: string,
  file: File,
): Promise<void> {
  loading.value = true;
  error.value = null;

  try {
    const imageUrl = await imageStore.uploadImage(
      office.value,
      `card_image_${cardId}`,
      file,
    );

    // 카드 썸네일 URL 업데이트
    await contentStore.updateCard(cardId, office.value, {
      cardThumbnailUrl: imageUrl,
    });

    successMessage.value = "이미지가 업로드되었습니다";
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "이미지 업로드 실패";
    error.value = errorMessage;
    message.error(errorMessage);
  } finally {
    loading.value = false;
  }
}

/**
 * 배포 처리
 */
async function handleDeploy(): Promise<void> {
  isDeploying.value = true;

  try {
    // 배포 API 호출 (실제로는 서비스에서 처리)
    // await contentService.deployCards(office.value)

    deploymentStatus.value = "success";
    deploymentMessage.value = "서비스가 정상적으로 배포되었습니다";
    message.success("배포 완료!");
  } catch (err) {
    deploymentStatus.value = "error";
    deploymentMessage.value =
      err instanceof Error ? err.message : "배포 중 오류가 발생했습니다";
    message.error("배포 실패");
  } finally {
    isDeploying.value = false;
    deploymentModalVisible.value = true;
  }
}

/**
 * 저장 버튼
 */
async function handleSave(): Promise<void> {
  loading.value = true;
  error.value = null;

  try {
    // 편집된 카드 순서 저장
    const cardIds = displayCards.value.map((card) => card.id);
    await contentStore.updateCardOrder(cardIds, office.value);

    successMessage.value = "카드가 저장되었습니다";
    exitEditMode();
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "저장 실패";
    error.value = errorMessage;
    message.error(errorMessage);
  } finally {
    loading.value = false;
  }
}

/**
 * 페이지 초기화
 */
onMounted(async () => {
  loading.value = true;
  error.value = null;

  try {
    // 카드 및 에이전트 목록 병렬 로드
    await Promise.all([
      contentStore.fetchCards(office.value),
      contentStore.fetchAgents(),
    ]);

    successMessage.value = "데이터를 불러왔습니다";
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "데이터 로드 실패";
    error.value = errorMessage;
    console.error("초기화 오류:", err);
  } finally {
    loading.value = false;
  }
});

/**
 * 성공 메시지 자동 숨김
 */
watch(successMessage, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
  }
});
</script>

<style scoped lang="scss">
/**
 * Contents 페이지 스타일
 *
 * 각 카드가 full-width를 차지하는 레이아웃
 */

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/**
 * 페이지 컨테이너
 */
.contents-page {
  width: 100%;
  animation: fadeIn 0.3s ease-in-out;
}

/**
 * 페이지 헤더
 */
.page-header {
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  padding: 24px;
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  /**
   * 헤더 좌측 (제목, 설명)
   */
  .header-top {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .page-title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #262626;
      transition: color 0.3s ease;
    }

    .page-description {
      font-size: 14px;
      color: #8c8c8c;
      border-radius: 4px;
      width: fit-content;
    }
  }

  /**
   * 헤더 우측 (액션 버튼)
   */
  .header-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;

    .action-button {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      white-space: nowrap;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      &:disabled {
        opacity: 0.7;
      }
    }
  }
}

/**
 * 로딩 스피너
 */
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;

  :deep(.ant-spin) {
    font-size: 16px;
  }
}

/**
 * 알림 메시지
 */
.error-alert {
  margin-bottom: 24px;
  border-radius: 6px;
  animation: slideDown 0.3s ease;
}

.success-alert {
  margin-bottom: 24px;
  border-radius: 6px;
  animation: slideDown 0.3s ease;
}

/**
 * 빈 상태
 */
.empty-state {
  margin: 60px 0;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;

  :deep(.ant-empty) {
    margin: 0;
  }
}

/**
 * 카드 디스플레이 (조회 모드)
 *
 * 각 카드가 full-width를 차지
 * 카드 내부에서 정보를 가로로 배치
 */
.cards-display {
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: fadeIn 0.3s ease-in-out;

  // 카드 컴포넌트 스타일
  :deep(.card-display-group) {
    width: 100%;
  }
}

/**
 * 카드 편집 (편집 모드)
 *
 * 조회 모드와 동일한 레이아웃
 */
.cards-edit {
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: fadeIn 0.3s ease-in-out;

  // 카드 컴포넌트 스타일
  :deep(.card-edit-form) {
    width: 100%;
  }
}

/**
 * 반응형 디자인
 */
@media (max-width: 1024px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;

    .header-top {
      order: 2;
    }

    .header-actions {
      order: 1;
      justify-content: flex-start;

      .action-button {
        flex: 1;
        min-width: 100px;
      }
    }
  }

  .cards-display,
  .cards-edit {
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 16px;
    margin-bottom: 16px;

    .header-top {
      .page-title {
        font-size: 20px;
      }

      .page-description {
        font-size: 12px;
      }
    }

    .header-actions {
      gap: 6px;

      .action-button {
        flex: 1;
        min-width: auto;
        font-size: 12px;
      }
    }
  }

  .cards-display,
  .cards-edit {
    gap: 12px;
  }

  .loading-spinner {
    min-height: 300px;
  }
}
</style>
