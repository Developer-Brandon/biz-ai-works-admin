<template>
  <!-- 카드 편집 폼 컴포넌트 -->
  <div class="card-edit-form">
    <!-- 카드 번호 -->
    <div class="form-header">
      <h3 class="form-title">Card {{ cardNumber }}</h3>
    </div>

    <!-- 카드 타입 선택 -->
    <div class="form-group">
      <label class="form-label">Card Type</label>
      <a-radio-group
        :value="card.cardType"
        @change="(e) => updateCard('cardType', e.target.value)"
        class="radio-group"
      >
        <a-radio value="chatCard">Agent Card</a-radio>
        <a-radio value="qaCard">Q&A Card</a-radio>
        <a-radio value="serviceCard">Service Card</a-radio>
      </a-radio-group>
    </div>

    <!-- Agent Card 편집 폼 -->
    <template v-if="card.cardType === 'chatCard'">
      <!-- 에이전트 선택 -->
      <div class="form-group">
        <label class="form-label required">Agent Selection</label>
        <a-select
          :value="card.cardId"
          placeholder="Select an agent"
          @change="(value) => updateCard('cardId', value)"
          :loading="loading"
          class="form-control"
        >
          <a-select-option
            v-for="agent in agents"
            :key="agent.id"
            :value="agent.id"
          >
            {{ agent.name }}
          </a-select-option>
        </a-select>
      </div>

      <!-- 에이전트 이름 -->
      <div class="form-group">
        <label class="form-label required">Agent Name</label>
        <a-input
          :value="card.name"
          placeholder="Enter agent name"
          @change="(e) => updateCard('name', e.target.value)"
          :maxlength="50"
          class="form-control"
        />
        <span class="char-count"> {{ (card.name || "").length }}/50 </span>
      </div>

      <!-- 에이전트 설명 -->
      <div class="form-group">
        <label class="form-label">Agent Description</label>
        <a-textarea
          :value="card.description"
          placeholder="Enter agent description (0/50)"
          :rows="4"
          :maxlength="50"
          @change="(e) => updateCard('description', e.target.value)"
          class="form-control"
        />
        <span class="char-count">
          {{ (card.description || "").length }}/50
        </span>
      </div>

      <!-- 썸네일 이미지 업로드 -->
      <div class="form-group">
        <label class="form-label required">Thumbnail Image</label>
        <div class="image-upload-container">
          <div v-if="card.cardThumbnailUrl" class="image-preview">
            <img
              :src="card.cardThumbnailUrl"
              :alt="card.name"
              class="preview-image"
            />
            <button type="button" class="remove-image-btn" @click="removeImage">
              ✕
            </button>
          </div>

          <a-upload
            v-else
            action="#"
            :before-upload="handleImageUpload"
            :show-upload-list="false"
            accept="image/*"
            class="image-uploader"
          >
            <div class="upload-placeholder">
              <CloudUploadOutlined class="upload-icon" />
              <p class="upload-text">
                Drag and drop an image, or click to select
              </p>
              <p class="upload-hint">Supported: PNG, JPEG, JPG</p>
            </div>
          </a-upload>
        </div>
      </div>
    </template>

    <!-- Q&A Card 편집 폼 -->
    <template v-else-if="card.cardType === 'qaCard'">
      <!-- 에이전트 선택 (복수) -->
      <div class="form-group">
        <label class="form-label required">Select Agents</label>
        <a-select
          mode="multiple"
          placeholder="Select one or more agents"
          :loading="loading"
          class="form-control"
        >
          <a-select-option
            v-for="agent in agents"
            :key="agent.id"
            :value="agent.id"
          >
            {{ agent.name }}
          </a-select-option>
        </a-select>
      </div>

      <!-- 질문 목록 -->
      <div class="form-group">
        <label class="form-label">Question List</label>
        <div class="questions-checklist">
          <div
            v-for="(question, index) in availableQuestions"
            :key="index"
            class="question-checkbox"
          >
            <a-checkbox
              :checked="isQuestionSelected(question)"
              @change="(e) => toggleQuestion(question, e.target.checked)"
            />
            <span class="question-label">{{ question }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Service Card 편집 폼 -->
    <template v-else-if="card.cardType === 'serviceCard'">
      <!-- 서비스 이름 -->
      <div class="form-group">
        <label class="form-label required">Service Name</label>
        <a-input
          :value="card.name"
          placeholder="Enter service name"
          @change="(e) => updateCard('name', e.target.value)"
          class="form-control"
        />
      </div>

      <!-- 서비스 설명 -->
      <div class="form-group">
        <label class="form-label">Service Description</label>
        <a-textarea
          :value="card.description"
          placeholder="Enter service description"
          :rows="4"
          @change="(e) => updateCard('description', e.target.value)"
          class="form-control"
        />
      </div>
    </template>

    <!-- 폼 액션 -->
    <div class="form-actions">
      <a-button
        type="text"
        danger
        @click="handleDelete"
        :loading="loading"
        class="delete-btn"
      >
        <template #icon>
          <DeleteOutlined />
        </template>
        Delete Card
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * CardEditForm 컴포넌트
 *
 * 역할: 카드 데이터 편집
 * Props: card, cardNumber, agents, loading
 * Emits: update (카드 업데이트), thumbnail-upload (이미지 업로드)
 */

import { ref, computed } from "vue";
import { CloudUploadOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { Card, Agent } from "@/types";
import type { UploadChangeParam } from "ant-design-vue";

interface Props {
  card: Card;
  cardNumber: number;
  agents: Agent[];
  loading: boolean;
}

interface Emits {
  update: [cardId: string, cardData: Partial<Card>];
  "thumbnail-upload": [cardId: string, file: File];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const selectedQuestions = ref<string[]>([]);

/**
 * 사용 가능한 질문 목록 (Mock 데이터)
 */
const availableQuestions = computed(() => [
  "여비신청 기준이 어떻게 되나요?",
  "야근 및 주말 근무 시 승인 절차",
  "외근 택시비 신청방법",
  "휴직 및 병가 프로세스",
  "인장 신청 프로세스",
  "교육·세미나 참여 방법",
  "사내행사 종류 문의",
]);

/**
 * 카드 데이터 업데이트
 */
function updateCard(key: keyof Card, value: any): void {
  emit("update", props.card.id, {
    [key]: value,
  });
}

/**
 * 이미지 업로드 처리
 */
function handleImageUpload(file: File): boolean {
  // 파일 검증
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    message.error("이미지 파일만 업로드 가능합니다");
    return false;
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    message.error("5MB 이하의 파일만 업로드 가능합니다");
    return false;
  }

  // 부모로 이벤트 발생
  emit("thumbnail-upload", props.card.id, file);
  return false;
}

/**
 * 이미지 제거
 */
function removeImage(): void {
  updateCard("cardThumbnailUrl", null);
}

/**
 * 질문 선택 여부 확인
 */
function isQuestionSelected(question: string): boolean {
  return selectedQuestions.value.includes(question);
}

/**
 * 질문 선택/해제
 */
function toggleQuestion(question: string, checked: boolean): void {
  if (checked) {
    selectedQuestions.value.push(question);
  } else {
    selectedQuestions.value = selectedQuestions.value.filter(
      (q) => q !== question,
    );
  }
}

/**
 * 카드 삭제
 */
function handleDelete(): void {
  // 부모에서 처리하도록 이벤트 발생
  updateCard("isDeleted", true);
}
</script>

<style scoped lang="scss">
.card-edit-form {
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
}

.form-header {
  margin-bottom: 20px;

  .form-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #262626;
    padding-bottom: 12px;
    border-bottom: 2px solid #1890ff;
  }
}

.form-group {
  margin-bottom: 20px;

  .form-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #262626;

    &.required::after {
      content: " *";
      color: #ff4d4f;
    }
  }

  .form-control {
    width: 100%;
    transition: all 0.3s ease;

    &:hover {
      border-color: #40a9ff;
    }

    &:focus {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
    }
  }

  .char-count {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    color: #8c8c8c;
  }

  .radio-group {
    :deep(.ant-radio-wrapper) {
      margin-right: 24px;

      &:hover {
        color: #1890ff;
      }
    }
  }
}

.image-upload-container {
  .image-preview {
    position: relative;
    width: 100%;
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 12px;

    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .remove-image-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.6);
      color: #ffffff;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(0, 0, 0, 0.8);
        transform: scale(1.1);
      }
    }
  }

  .image-uploader {
    :deep(.ant-upload.ant-upload-drag) {
      border: 2px dashed #d9d9d9;
      border-radius: 8px;
      background: #fafafa;
      transition: all 0.3s ease;

      &:hover {
        border-color: #1890ff;
        background: #f0f5ff;
      }
    }
  }
}

.upload-placeholder {
  padding: 40px 20px;
  text-align: center;

  .upload-icon {
    font-size: 48px;
    color: #1890ff;
    margin-bottom: 12px;
    display: block;
    animation: bounce 1s infinite;
  }

  .upload-text {
    margin: 0 0 4px 0;
    font-size: 14px;
    font-weight: 500;
    color: #262626;
  }

  .upload-hint {
    margin: 0;
    font-size: 12px;
    color: #8c8c8c;
  }
}

.questions-checklist {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;

  .question-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: 6px;
    transition: all 0.3s ease;

    &:hover {
      background: #ffffff;
    }

    .question-label {
      font-size: 14px;
      color: #262626;
      cursor: pointer;
      flex: 1;
    }
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;

  .delete-btn {
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
    }
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@media (max-width: 768px) {
  .card-edit-form {
    padding: 16px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .image-upload-container {
    .image-preview {
      height: 150px;
    }
  }

  .upload-placeholder {
    padding: 30px 15px;

    .upload-icon {
      font-size: 36px;
      margin-bottom: 8px;
    }

    .upload-text {
      font-size: 13px;
    }

    .upload-hint {
      font-size: 11px;
    }
  }
}
</style>
