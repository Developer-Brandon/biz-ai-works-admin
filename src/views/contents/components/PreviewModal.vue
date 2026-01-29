<template>
  <!-- 서비스 미리보기 모달 -->
  <a-modal
    :visible="visible"
    title="Preview"
    width="90%"
    :body-style="{ padding: '24px', maxHeight: '80vh', overflow: 'auto' }"
    @cancel="emit('update:visible', false)"
    :footer="null"
    class="preview-modal"
  >
    <!-- 미리보기 컨테이너 -->
    <div class="preview-container">
      <!-- 서비스 페이지 시뮬레이션 -->
      <div class="service-page-preview">
        <!-- 헤더 -->
        <div class="preview-header">
          <div class="logo-area">
            <div class="logo-placeholder">Logo</div>
          </div>
          <h1 class="preview-title">Biz AI Works</h1>
        </div>

        <!-- 카드 섹션 -->
        <div class="cards-section">
          <div
            v-for="(card, index) in cards"
            :key="card.id"
            class="card-wrapper"
          >
            <!-- Agent Card 미리보기 -->
            <template v-if="card.cardType === 'chatCard'">
              <div class="agent-card-preview">
                <div class="card-image">
                  <img
                    v-if="card.cardThumbnailUrl"
                    :src="card.cardThumbnailUrl"
                    :alt="card.name"
                    class="image"
                  />
                  <div v-else class="image-placeholder">
                    <span>Image</span>
                  </div>
                </div>

                <div class="card-content">
                  <h3 class="card-title">{{ card.name || "Agent" }}</h3>
                  <p class="card-description">
                    {{ card.description || "No description" }}
                  </p>

                  <a-button type="primary" size="small" class="action-button">
                    시작하기
                  </a-button>
                </div>
              </div>
            </template>

            <!-- Q&A Card 미리보기 -->
            <template v-else-if="card.cardType === 'qaCard'">
              <div class="qa-card-preview">
                <h3 class="card-title">Q&A</h3>

                <div class="questions-container">
                  <div
                    v-for="(question, qIdx) in card.questionList?.slice(0, 3) ||
                    []"
                    :key="`${card.id}-${qIdx}`"
                    class="question-item"
                  >
                    <span class="question-text">{{ question }}</span>
                  </div>
                </div>

                <a-button type="default" size="small" class="more-button">
                  더보기
                </a-button>
              </div>
            </template>

            <!-- Service Card 미리보기 -->
            <template v-else-if="card.cardType === 'serviceCard'">
              <div class="service-card-preview">
                <h3 class="card-title">{{ card.name }}</h3>
                <p class="card-description">{{ card.description }}</p>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
/**
 * PreviewModal 컴포넌트
 *
 * 역할: 서비스 페이지 미리보기를 모달로 표시
 * Props: visible (모달 표시 여부), cards (카드 목록), agents (에이전트 목록)
 * Emits: update:visible (모달 닫기)
 */

import type { Card, Agent } from "@/types";

interface Props {
  visible: boolean;
  cards: Card[];
  agents: Agent[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
}>();
</script>

<style scoped lang="scss">
/**
 * PreviewModal 스타일
 */

.preview-modal {
  :deep(.ant-modal-content) {
    border-radius: 12px;
  }
}

.preview-container {
  width: 100%;
  background: #ffffff;
}

.service-page-preview {
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  overflow: hidden;
}

/**
 * 헤더
 */
.preview-header {
  background: #ffffff;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 16px;

  .logo-area {
    width: 60px;
    height: 60px;
    background: #f0f0f0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    .logo-placeholder {
      font-size: 12px;
      color: #8c8c8c;
      font-weight: 500;
    }
  }

  .preview-title {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #262626;
  }
}

/**
 * 카드 섹션
 */
.cards-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 24px;

  .card-wrapper {
    animation: cardAppear 0.6s ease-out;
  }
}

/**
 * Agent Card 미리보기
 */
.agent-card-preview {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  .card-image {
    width: 100%;
    height: 160px;
    background: #f0f0f0;
    overflow: hidden;

    .image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      font-weight: 500;
    }
  }

  .card-content {
    padding: 16px;

    .card-title {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      color: #262626;
    }

    .card-description {
      margin: 0 0 12px 0;
      font-size: 13px;
      color: #595959;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .action-button {
      width: 100%;
      height: 32px;
      border-radius: 6px;
    }
  }
}

/**
 * Q&A Card 미리보기
 */
.qa-card-preview {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  .card-title {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 600;
    color: #262626;
    padding-bottom: 8px;
    border-bottom: 2px solid #1890ff;
  }

  .questions-container {
    margin-bottom: 12px;

    .question-item {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
      font-size: 13px;
      color: #595959;

      &:last-child {
        border-bottom: none;
      }
    }
  }

  .more-button {
    width: 100%;
    height: 32px;
  }
}

/**
 * Service Card 미리보기
 */
.service-card-preview {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  .card-title {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    color: #262626;
  }

  .card-description {
    margin: 0;
    font-size: 13px;
    color: #595959;
    line-height: 1.5;
  }
}

/**
 * 애니메이션
 */
@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/**
 * 반응형
 */
@media (max-width: 768px) {
  .preview-header {
    padding: 16px;

    .logo-area {
      width: 48px;
      height: 48px;
    }

    .preview-title {
      font-size: 20px;
    }
  }

  .cards-section {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 16px;
  }
}
</style>
