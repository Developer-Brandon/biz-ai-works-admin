<template>
  <!-- 카드 표시 컴포넌트 (조회 모드) -->
  <div class="card-display-group">
    <!-- 카드 번호 배지 -->
    <div class="card-badge">
      <a-tag color="blue">카드 {{ cardNumber }}</a-tag>
    </div>

    <!-- 메인 카드 -->
    <a-card class="card-container" :bordered="false" :hoverable="true">
      <!-- Agent Card 타입 -->
      <div v-if="card.cardType === 'chatCard'" class="card-content-horizontal">
        <!-- 왼쪽: 정보 -->
        <div class="content-left">
          <div class="card-type-badge">
            <a-tag color="green">Agent Card</a-tag>
          </div>

          <div class="agent-info-section">
            <div class="info-group">
              <h4 class="info-label">Agent 이름</h4>
              <p class="info-value">
                {{ getAgentName(card.agentId) || "미설정" }}
              </p>
            </div>

            <div class="info-group">
              <h4 class="info-label">Agent 설명</h4>
              <p class="info-value">{{ card.description }}</p>
            </div>
          </div>
        </div>

        <!-- 오른쪽: 이미지 -->
        <div class="content-right">
          <div v-if="card.cardThumbnailUrl" class="thumbnail-wrapper">
            <img
              :src="card.cardThumbnailUrl"
              :alt="card.name"
              class="thumbnail-image"
            />
          </div>
          <div v-else class="thumbnail-placeholder">
            <a-empty description="이미지 없음" />
          </div>
        </div>
      </div>

      <!-- Q&A Card 타입 -->
      <div
        v-if="card.cardType === 'questionCard'"
        class="card-content-horizontal"
      >
        <!-- 상단: 에이전트명 -->
        <div class="qa-header">
          <a-tag color="blue">Q&A Card</a-tag>
          <span class="qa-agent-name"
            >@{{ getAgentName(card.agentId) || "에이전트" }}</span
          >
        </div>

        <!-- 왼쪽: 질문 리스트 -->
        <div class="qa-content">
          <div class="qa-questions">
            <div
              v-for="(question, index) in card.questionList"
              :key="index"
              class="question-row"
            >
              <div class="question-item">
                <span class="question-number">Q{{ index + 1 }}</span>
                <span class="question-text">{{ question }}</span>
              </div>
              <div class="question-answer-btn">
                <a-button type="default" class="answer-btn">
                  @{{ getAgentName(card.agentId) || "에이전트" }}
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Service Card 타입 -->
      <div
        v-if="card.cardType === 'serviceCard'"
        class="card-content-horizontal"
      >
        <!-- 왼쪽: 제목 및 설명 -->
        <div class="content-left">
          <div class="card-type-badge">
            <a-tag color="orange">Service Card</a-tag>
          </div>

          <div class="service-info-section">
            <h3 class="service-title">{{ card.name }}</h3>
            <p class="service-description">{{ card.serviceContent }}</p>
          </div>
        </div>

        <!-- 오른쪽: 이미지 -->
        <div class="content-right">
          <div v-if="card.cardThumbnailUrl" class="thumbnail-wrapper">
            <img
              :src="card.cardThumbnailUrl"
              :alt="card.name"
              class="thumbnail-image"
            />
          </div>
          <div v-else class="thumbnail-placeholder">
            <a-empty description="이미지 없음" />
          </div>
        </div>
      </div>
    </a-card>

    <!-- 카드 푸터 -->
    <div class="card-footer">
      <span class="footer-text"> 생성: {{ formatDate(card.createdAt) }} </span>
      <a-divider type="vertical" />
      <span class="footer-text"> 수정: {{ formatDate(card.updatedAt) }} </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Card, Agent } from "@/types";

interface Props {
  card: Card;
  cardNumber: number;
  agents: Agent[];
}

const props = defineProps<Props>();

/**
 * 에이전트명 조회
 *
 * null을 반환할 수 없도록 기본값 처리
 */
function getAgentName(agentId?: string | null): string {
  if (!agentId) return "미설정";
  const agent = props.agents.find((a) => a.id === agentId);
  return agent?.name || "미설정";
}

/**
 * 날짜 포매팅
 */
function formatDate(dateString?: string | null): string {
  if (!dateString) return "미설정";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}
</script>

<style scoped lang="scss">
/**
 * CardDisplayGroup 스타일 - 수정 버전
 *
 * 가로(horizontal) 레이아웃 적용
 * 부드러운 트렌디한 애니메이션
 */

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
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
 * 카드 표시 그룹 컨테이너
 */
.card-display-group {
  position: relative;
  animation: slideInUp 0.5s ease-out;
  max-width: 95%;
  margin: 0 auto;
  .card-badge {
    margin-bottom: 12px;

    :deep(.ant-tag) {
      border-radius: 4px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
  }

  /**
   * 메인 카드
   */
  .card-container {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #f0f0f0;
    padding: 24px;

    &:hover {
      border-color: #1890ff;
      box-shadow: 0 8px 24px rgba(24, 144, 255, 0.15);
      transform: translateY(-4px);
    }

    :deep(.ant-card-head) {
      display: none;
    }

    :deep(.ant-card-body) {
      padding: 0;
    }

    /**
     * 가로 레이아웃 (Agent Card, Service Card)
     */
    .card-content-horizontal {
      display: flex;
      gap: 24px;
      align-items: stretch;

      /**
       * 왼쪽 콘텐츠
       */
      .content-left {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 16px;

        .card-type-badge {
          width: fit-content;

          :deep(.ant-tag) {
            border-radius: 4px;
            font-weight: 600;
            font-size: 14px;
          }
        }

        /**
         * Agent 정보 섹션
         */
        .agent-info-section {
          display: flex;
          flex-direction: column;
          gap: 16px;

          .info-group {
            display: flex;
            flex-direction: column;
            gap: 6px;

            .info-label {
              margin: 0;
              font-size: 14px;
              font-weight: 600;
              color: #262626;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }

            .info-value {
              margin: 0;
              font-size: 16px;
              color: #262626;
              line-height: 1.6;
              padding: 12px;
              background: #fafafa;
              border-radius: 6px;
              transition: all 0.3s ease;

              &:hover {
                background: #f0f7ff;
                transform: translateX(4px);
              }
            }
          }
        }

        /**
         * Service 정보 섹션
         */
        .service-info-section {
          display: flex;
          flex-direction: column;
          gap: 12px;

          .service-title {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #262626;
          }

          .service-description {
            margin: 0;
            font-size: 14px;
            color: #595959;
            line-height: 1.8;
            padding: 12px;
            background: #fafafa;
            border-radius: 6px;
          }
        }
      }

      /**
       * 오른쪽 콘텐츠 (이미지)
       */
      .content-right {
        flex: 0 0 300px;
        display: flex;
        align-items: center;
        justify-content: center;

        .thumbnail-wrapper {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          background: #fafafa;
          border: 1px solid #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;

          &:hover {
            border-color: #1890ff;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }

          .thumbnail-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
        }

        .thumbnail-placeholder {
          width: 100%;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fafafa;
          border-radius: 8px;
          border: 1px dashed #d9d9d9;
        }
      }
    }

    /**
     * Q&A 카드 레이아웃
     */
    .qa-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;

      :deep(.ant-tag) {
        border-radius: 4px;
        font-weight: 600;
      }

      .qa-agent-name {
        font-size: 14px;
        font-weight: 600;
        color: #595959;
        background: #fafafa;
        padding: 6px 12px;
        border-radius: 4px;
      }
    }

    .qa-content {
      width: 100%;

      .qa-questions {
        display: flex;
        flex-direction: column;
        gap: 12px;

        /**
         * 질문 행 (질문 + 답변 버튼)
         */
        .question-row {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 12px;
          background: #fafafa;
          border-radius: 6px;
          border: 1px solid #f0f0f0;
          transition: all 0.3s ease;

          &:hover {
            background: #f0f7ff;
            border-color: #1890ff;
            transform: translateX(4px);
          }

          /**
           * 질문 부분
           */
          .question-item {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 12px;

            .question-number {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              min-width: 40px;
              height: 32px;
              background: #1890ff;
              color: white;
              font-weight: 600;
              border-radius: 4px;
              font-size: 12px;
            }

            .question-text {
              font-size: 14px;
              color: #262626;
              flex: 1;
            }
          }

          /**
           * 답변 버튼
           */
          .question-answer-btn {
            flex: 0 0 auto;

            .answer-btn {
              min-width: 120px;
              border-radius: 4px;
              transition: all 0.3s ease;

              &:hover {
                color: #1890ff;
                border-color: #1890ff;
                background: #f0f7ff;
              }
            }
          }
        }
      }
    }
  }

  /**
   * 카드 푸터
   */
  .card-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 0;
    font-size: 12px;
    color: #8c8c8c;

    .footer-text {
      white-space: nowrap;
    }
  }
}

/**
 * 반응형 디자인
 */
@media (max-width: 1024px) {
  .card-display-group {
    .card-container {
      .card-content-horizontal {
        flex-direction: column;
        gap: 16px;

        .content-right {
          flex: 0 0 auto;
          width: 100%;
          max-width: 300px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .card-display-group {
    .card-container {
      padding: 16px;

      .card-content-horizontal {
        flex-direction: column;
        gap: 12px;

        .content-left {
          gap: 12px;

          .agent-info-section,
          .service-info-section {
            gap: 12px;

            .info-label,
            .service-title {
              font-size: 14px;
            }

            .info-value,
            .service-description {
              font-size: 13px;
              padding: 10px;
            }
          }
        }

        .content-right {
          flex: 1;
          max-width: 100%;

          .thumbnail-wrapper {
            aspect-ratio: 16 / 9;
          }
        }
      }

      .qa-content {
        .qa-questions {
          .question-row {
            flex-direction: column;
            align-items: flex-start;
            padding: 10px;

            .question-item {
              width: 100%;

              .question-number {
                min-width: 36px;
                height: 28px;
                font-size: 11px;
              }

              .question-text {
                font-size: 13px;
              }
            }

            .question-answer-btn {
              width: 100%;

              .answer-btn {
                width: 100%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
