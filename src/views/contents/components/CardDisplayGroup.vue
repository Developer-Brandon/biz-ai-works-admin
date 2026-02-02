<template>
  <!-- 카드 조회 모드 표시 컴포넌트 -->
  <div class="card-display-group">
    <!-- 카드 번호 -->
    <div class="card-number-badge">
      <span class="badge-text">Card {{ cardNumber }}</span>
    </div>

    <!-- 카드 타입 배지 -->
    <div class="card-type-badge">
      <a-tag :color="cardTypeColor" class="type-tag">
        {{ cardTypeLabel }}
      </a-tag>
    </div>

    <!-- 카드 컨테이너 -->
    <a-card
      class="card-container"
      :bordered="false"
      :body-style="{ padding: '24px' }"
    >
      <!-- Agent Card 표시 -->
      <template v-if="card.cardType === 'chatCard'">
        <!-- 썸네일 이미지 -->
        <div class="card-thumbnail">
          <img
            v-if="card.cardThumbnailUrl"
            :src="card.cardThumbnailUrl"
            :alt="card.name || 'Agent Card'"
            class="thumbnail-image"
          />
          <div v-else class="placeholder-image">
            <AppstoreOutlined class="placeholder-icon" />
          </div>
        </div>

        <!-- 에이전트 정보 -->
        <div class="agent-info">
          <h3 class="agent-name">
            {{ card.name || "Unnamed Agent" }}
          </h3>
          <p class="agent-description">
            {{ card.description || "No description" }}
          </p>

          <!-- 에이전트 ID 표시 -->
          <div class="agent-id">
            <span class="label">Agent ID:</span>
            <code class="id-value">{{ card.cardId }}</code>
          </div>
        </div>
      </template>

      <!-- Q&A Card 표시 -->
      <template v-else-if="card.cardType === 'qaCard'">
        <!-- 에이전트 선택 정보 -->
        <div class="qa-header">
          <h3 class="qa-title">Q&A Card</h3>
          <div class="selected-agents">
            <a-tag
              v-for="agentId in selectedAgentIds"
              :key="agentId"
              color="blue"
              class="agent-tag"
            >
              @ {{ getAgentName(agentId) }}
            </a-tag>
          </div>
        </div>

        <!-- 질문 목록 -->
        <div class="questions-list">
          <div
            v-for="(question, index) in displayedQuestions"
            :key="`${card.id}-${index}`"
            class="question-item"
          >
            <span class="question-number">Q{{ index + 1 }}</span>
            <span class="question-text">{{ question }}</span>
          </div>

          <!-- 질문 개수 표시 -->
          <div v-if="questionCount > 4" class="question-count">
            +{{ questionCount - 4 }} more questions
          </div>
        </div>
      </template>

      <!-- Service Card 표시 -->
      <template v-else-if="card.cardType === 'serviceCard'">
        <div class="service-card-content">
          <h3 class="service-name">{{ card.name }}</h3>
          <p class="service-description">{{ card.description }}</p>
        </div>
      </template>
    </a-card>

    <!-- 카드 메타 정보 -->
    <div class="card-meta">
      <span class="meta-item">
        <CalendarOutlined />
        {{ formatDate(card.createdAt) }}
      </span>
      <span class="meta-item">
        <EditOutlined />
        {{ formatDate(card.updatedAt) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * CardDisplayGroup 컴포넌트
 *
 * 역할: 카드를 조회 모드로 표시
 * Props: card (Card 객체), cardNumber (카드 번호), agents (에이전트 목록)
 *
 * Vue3 특징:
 * - computed로 반응형 계산값 정의
 * - 카드 타입별로 다른 UI 렌더링
 * - 이미지 있음/없음 처리 (placeholder)
 *
 * Ant Design 활용:
 * - Card: 카드 컨테이너
 * - Tag: 타입/에이전트 배지
 * - 아이콘: 빈 상태 표시
 */

import { computed } from "vue";
import {
  AppstoreOutlined,
  CalendarOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
import type { Card, Agent } from "@/types";

interface Props {
  card: Card;
  cardNumber: number;
  agents: Agent[];
}

const props = defineProps<Props>();

/**
 * 카드 타입에 따른 색상
 */
const cardTypeColor = computed(() => {
  const typeColors: Record<string, string> = {
    chatCard: "blue",
    qaCard: "green",
    serviceCard: "orange",
  };
  return typeColors[props.card.cardType] || "default";
});

/**
 * 카드 타입 라벨
 */
const cardTypeLabel = computed(() => {
  const typeLabels: Record<string, string> = {
    chatCard: "Agent Card",
    qaCard: "Q&A Card",
    serviceCard: "Service Card",
  };
  return typeLabels[props.card.cardType] || "Unknown";
});

/**
 * 선택된 에이전트 ID 목록 (Q&A 카드용)
 */
const selectedAgentIds = computed(() => {
  if (props.card.cardType !== "qaCard") return [];
  // questionList에서 에이전트 ID 추출 로직
  return [];
});

/**
 * 표시할 질문 목록 (처음 4개만)
 */
const displayedQuestions = computed(() => {
  if (props.card.cardType !== "qaCard" || !props.card.questionList) {
    return [];
  }
  const questions = Array.isArray(props.card.questionList)
    ? props.card.questionList
    : [];
  return questions.slice(0, 4);
});

/**
 * 질문 총 개수
 */
const questionCount = computed(() => {
  if (!props.card.questionList) return 0;
  return Array.isArray(props.card.questionList)
    ? props.card.questionList.length
    : 0;
});

/**
 * 에이전트 이름 조회
 *
 * @param agentId - 에이전트 ID
 * @returns 에이전트 이름 또는 'Unknown'
 */
function getAgentName(agentId: string): string {
  const agent = props.agents.find((a) => a.id === agentId);
  return agent?.name || "Unknown";
}

/**
 * 날짜 포맷팅
 *
 * @param date - ISO 형식 날짜
 * @returns 포맷된 날짜 (YYYY-MM-DD HH:MM)
 */
function formatDate(date: string | Date): string {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<style scoped lang="scss">
/**
 * CardDisplayGroup 스타일
 */

.card-display-group {
  position: relative;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /**
   * 호버 애니메이션
   * Vue2: transition 속성으로 처리 필요
   * Vue3: <Transition> wrapper 가능하지만, scoped 스타일이므로 직접 처리
   */
  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
  }
}

/**
 * 카드 번호 배지
 */
.card-number-badge {
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(135deg, #1890ff, #0050b3);
  padding: 8px 16px;
  border-radius: 0 0 12px 0;
  z-index: 10;

  .badge-text {
    color: #ffffff;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
}

/**
 * 카드 타입 배지
 */
.card-type-badge {
  position: absolute;
  top: 12px;
  right: 16px;
  z-index: 9;

  .type-tag {
    font-size: 12px;
    font-weight: 500;
  }
}

/**
 * 카드 컨테이너
 */
.card-container {
  margin-top: 0;
  border-radius: 0;

  /* Ant Design Card 기본 스타일 override */
  :deep(.ant-card) {
    border: none;
  }

  :deep(.ant-card-body) {
    padding: 24px;
  }
}

/**
 * 썸네일 이미지 (Agent Card용)
 */
.card-thumbnail {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  background: #fafafa;

  .thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: imageLoad 0.6s ease;
  }

  .placeholder-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f5f5f5, #e8e8e8);

    .placeholder-icon {
      font-size: 48px;
      color: #bfbfbf;
    }
  }
}

/**
 * 에이전트 정보
 */
.agent-info {
  .agent-name {
    margin: 0 0 12px 0;
    font-size: 18px;
    font-weight: 600;
    color: #262626;
  }

  .agent-description {
    margin: 0 0 16px 0;
    font-size: 14px;
    color: #595959;
    line-height: 1.6;
  }

  .agent-id {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: #fafafa;
    border-radius: 6px;
    font-size: 12px;

    .label {
      font-weight: 500;
      color: #8c8c8c;
    }

    .id-value {
      font-family: "Courier New", monospace;
      color: #262626;
      background: #ffffff;
      padding: 4px 8px;
      border-radius: 4px;
      word-break: break-all;
    }
  }
}

/**
 * Q&A 카드 헤더
 */
.qa-header {
  margin-bottom: 20px;

  .qa-title {
    margin: 0 0 12px 0;
    font-size: 18px;
    font-weight: 600;
    color: #262626;
  }

  .selected-agents {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .agent-tag {
      font-size: 12px;
    }
  }
}

/**
 * 질문 목록
 */
.questions-list {
  border-left: 3px solid #1890ff;
  padding-left: 16px;

  .question-item {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
    font-size: 14px;
    transition: all 0.3s ease;

    &:last-of-type {
      border-bottom: none;
    }

    &:hover {
      background: #fafafa;
      padding-left: 8px;
      margin-left: -8px;
    }

    .question-number {
      font-weight: 600;
      color: #1890ff;
      min-width: 32px;
    }

    .question-text {
      color: #262626;
      flex: 1;
    }
  }

  .question-count {
    padding-top: 8px;
    color: #8c8c8c;
    font-size: 12px;
    font-style: italic;
  }
}

/**
 * Service Card 컨텐츠
 */
.service-card-content {
  .service-name {
    margin: 0 0 12px 0;
    font-size: 18px;
    font-weight: 600;
    color: #262626;
  }

  .service-description {
    margin: 0;
    font-size: 14px;
    color: #595959;
    line-height: 1.6;
  }
}

/**
 * 카드 메타 정보
 */
.card-meta {
  display: flex;
  gap: 24px;
  padding: 12px 24px;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
  font-size: 12px;
  color: #8c8c8c;

  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;

    :deep(svg) {
      font-size: 12px;
    }
  }
}

/**
 * 애니메이션
 */
@keyframes imageLoad {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/**
 * 반응형 디자인
 */
@media (max-width: 768px) {
  .card-display-group {
    &:hover {
      transform: translateY(-2px);
    }
  }

  .card-number-badge {
    padding: 6px 12px;

    .badge-text {
      font-size: 11px;
    }
  }

  .card-type-badge {
    top: 8px;
    right: 12px;
  }

  .card-container {
    :deep(.ant-card-body) {
      padding: 16px;
    }
  }

  .card-thumbnail {
    height: 150px;
    margin-bottom: 16px;
  }

  .agent-info {
    .agent-name {
      font-size: 16px;
      margin-bottom: 8px;
    }

    .agent-description {
      font-size: 13px;
      margin-bottom: 12px;
    }
  }

  .card-meta {
    flex-direction: column;
    gap: 8px;
    padding: 12px 16px;
  }
}
</style>
