<template>
  <!-- 카드 편집 폼 컴포넌트 -->
  <div class="card-edit-form">
    <!-- 카드 번호 배지 -->
    <div class="card-badge">
      <a-tag color="orange">카드 {{ cardNumber }} - 편집</a-tag>
    </div>

    <!-- 편집 폼 -->
    <a-card class="form-container" :bordered="false">
      <!-- 카드 헤더 -->
      <template #title>
        <div class="form-header">
          <h3>카드 정보</h3>
          <a-tag color="orange">편집 모드</a-tag>
        </div>
      </template>

      <!-- 폼 -->
      <a-form
        :model="formData"
        :rules="rules"
        layout="vertical"
        @finish="handleSubmit"
      >
        <!-- 카드 이름 -->
        <a-form-item label="카드 이름" name="name" required>
          <a-input
            v-model:value="formData.name"
            placeholder="카드 이름을 입력하세요"
            allow-clear
            @blur="handleFieldChange('name')"
          />
        </a-form-item>

        <!-- 카드 설명 -->
        <a-form-item label="카드 설명" name="description">
          <a-textarea
            v-model:value="formData.description"
            placeholder="카드 설명을 입력하세요"
            :rows="3"
            allow-clear
            show-count
            :maxlength="200"
          />
        </a-form-item>

        <!-- 카드 타입 -->
        <a-form-item label="카드 타입" name="cardType" required>
          <a-select
            v-model:value="formData.cardType"
            placeholder="카드 타입을 선택하세요"
            @change="handleCardTypeChange"
          >
            <a-select-option value="chatCard">AI 챗봇</a-select-option>
            <a-select-option value="questionCard"
              >자주 묻는 질문</a-select-option
            >
            <a-select-option value="serviceCard">서비스</a-select-option>
          </a-select>
        </a-form-item>

        <!-- 에이전트 선택 (Agent Card 타입일 때만) -->
        <a-form-item
          v-if="isChatCard"
          label="연결할 에이전트"
          name="agentId"
          required
        >
          <a-select
            v-model:value="formData.agentId"
            placeholder="에이전트를 선택하세요"
            allow-clear
            show-search
          >
            <a-select-option
              v-for="agent in agents"
              :key="agent.id"
              :value="agent.id"
            >
              {{ agent.name }} ({{ agent.id }})
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Q&A 질문 리스트 (Question Card 타입일 때만) -->
        <div v-if="isQuestionCard" class="qa-section">
          <a-form-item label="자주 묻는 질문">
            <div class="question-input-group">
              <a-input
                v-model:value="newQuestion"
                placeholder="질문을 입력하고 추가 버튼을 클릭하세요"
                allow-clear
                @press-enter="addQuestion"
              />
              <a-button
                type="primary"
                @click="addQuestion"
                :disabled="!newQuestion.trim()"
              >
                <template #icon>
                  <PlusOutlined />
                </template>
                추가
              </a-button>
            </div>
          </a-form-item>

          <!-- 질문 목록 -->
          <div
            v-if="formData.questionList && formData.questionList.length > 0"
            class="question-list"
          >
            <div
              v-for="(question, index) in formData.questionList"
              :key="index"
              class="question-item"
            >
              <span class="question-text">{{ question }}</span>
              <a-button
                type="text"
                danger
                size="small"
                @click="removeQuestion(index)"
              >
                <template #icon>
                  <DeleteOutlined />
                </template>
              </a-button>
            </div>
          </div>
        </div>

        <!-- 서비스 설명 (Service Card 타입일 때만) -->
        <a-form-item
          v-if="isServiceCard"
          label="서비스 설명"
          name="serviceContent"
        >
          <a-textarea
            v-model:value="formData.serviceContent"
            placeholder="서비스 설명을 입력하세요"
            :rows="4"
            allow-clear
            show-count
            :maxlength="500"
          />
        </a-form-item>

        <!-- 카드 썸네일 -->
        <a-form-item label="카드 썸네일">
          <div class="thumbnail-section">
            <!-- 현재 썸네일 미리보기 -->
            <div v-if="formData.cardThumbnailUrl" class="thumbnail-preview">
              <img
                :src="formData.cardThumbnailUrl"
                :alt="formData.name"
                class="preview-image"
              />
              <a-button
                type="text"
                danger
                size="small"
                @click="removeImage"
                class="remove-image-btn"
              >
                <template #icon>
                  <DeleteOutlined />
                </template>
                제거
              </a-button>
            </div>

            <!-- 이미지 업로드 -->
            <a-upload
              v-if="!formData.cardThumbnailUrl"
              :before-upload="handleBeforeUpload"
              :show-upload-list="false"
              accept="image/*"
              class="image-upload"
            >
              <div class="upload-placeholder">
                <CameraOutlined />
                <p>이미지를 클릭하여 업로드</p>
                <p class="upload-tip">(최대 5MB, JPG/PNG)</p>
              </div>
            </a-upload>
          </div>
        </a-form-item>

        <!-- 표시 순서 -->
        <a-form-item label="표시 순서" name="displayOrder">
          <a-input-number
            v-model:value="formData.displayOrder"
            :min="1"
            :max="3"
            placeholder="1~3 중 선택"
          />
        </a-form-item>

        <!-- 버튼 그룹 -->
        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" :loading="loading">
              저장
            </a-button>
            <a-button @click="resetForm">초기화</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
/**
 * CardEditForm 컴포넌트
 *
 * 카드를 편집하는 폼입니다
 * 카드 타입별로 다른 필드를 표시합니다
 *
 * Vue3 <script setup> 문법 사용
 * - defineProps: Props 정의
 * - defineEmits: 이벤트 정의
 * - ref, reactive, computed: 상태 관리
 *
 * Props:
 * - card: 편집할 카드
 * - cardNumber: 카드 번호
 * - agents: 에이전트 목록
 * - loading: 로딩 상태
 *
 * Emits:
 * - update: 카드 업데이트
 * - thumbnail-upload: 이미지 업로드
 *
 * Vue2 vs Vue3:
 * - Vue2: props: {}, methods: {}
 * - Vue3: defineProps<Props>(), function 함수
 * - Vue2: $emit('update', ...)
 * - Vue3: emit('update', ...)
 */

import { ref, reactive, computed, watch } from "vue";
import {
  PlusOutlined,
  DeleteOutlined,
  CameraOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { Card, Agent } from "@/types";

/**
 * Props 인터페이스 정의
 */
interface Props {
  card: Card;
  cardNumber: number;
  agents: Agent[];
  loading: boolean;
}

/**
 * Props 정의 - 명시적으로 타입 지정
 *
 * Vue3에서는 defineProps로 Props를 정의합니다
 * withDefaults를 사용하여 기본값을 설정할 수 있습니다
 */
const props = withDefaults(defineProps<Props>(), {
  cardNumber: 1,
  agents: () => [],
  loading: false,
});

/**
 * Emit 정의
 *
 * Vue3에서는 defineEmits로 이벤트를 정의합니다
 * 타입 안정성을 위해 제네릭으로 이벤트 타입을 지정합니다
 */
const emit = defineEmits<{
  update: [cardId: string, cardData: Partial<Card>];
  "thumbnail-upload": [cardId: string, file: File];
}>();

/**
 * 폼 데이터
 *
 * props.card를 기반으로 초기화됩니다
 * Vue3의 reactive로 객체 상태 관리
 */
const formData = reactive<{
  name: string;
  description?: string;
  cardType: string;
  agentId?: string;
  questionList: string[];
  serviceContent?: string;
  cardThumbnailUrl?: string;
  displayOrder?: number;
}>({
  name: props.card.name || "",
  description: props.card.description || "",
  cardType: props.card.cardType || "chatCard",
  agentId: props.card.agentId || undefined,
  questionList: Array.isArray(props.card.questionList)
    ? [...props.card.questionList]
    : [],
  serviceContent: props.card.serviceContent || "",
  cardThumbnailUrl: props.card.cardThumbnailUrl || "",
  displayOrder: props.card.displayOrder || props.cardNumber,
});

/**
 * 새로운 질문 입력값
 */
const newQuestion = ref<string>("");

/**
 * 카드 타입별 상태 계산
 *
 * v-if에서 사용할 boolean 값으로 변환
 * computed를 사용하여 반응형으로 관리
 */
const isChatCard = computed(() => formData.cardType === "chatCard");
const isQuestionCard = computed(() => formData.cardType === "questionCard");
const isServiceCard = computed(() => formData.cardType === "serviceCard");

/**
 * 폼 검증 규칙
 */
const rules = {
  name: [
    { required: true, message: "카드 이름을 입력하세요", trigger: "change" },
    { min: 2, message: "최소 2글자 이상 입력하세요", trigger: "change" },
  ],
  cardType: [
    { required: true, message: "카드 타입을 선택하세요", trigger: "change" },
  ],
  agentId: [
    { required: true, message: "에이전트를 선택하세요", trigger: "change" },
  ],
};

/**
 * 카드 타입 변경 핸들러
 *
 * 타입이 변경되면 해당 타입의 필드만 초기화합니다
 * 다른 타입의 데이터는 유지합니다
 */
function handleCardTypeChange(): void {
  // 기존 필드 초기화
  formData.agentId = undefined;
  formData.questionList = [];
  formData.serviceContent = "";
  message.info(`카드 타입이 변경되었습니다: ${formData.cardType}`);
}

/**
 * 질문 추가
 *
 * 새로운 질문을 questionList에 추가합니다
 * 중복 체크나 유효성 검사는 선택사항입니다
 */
function addQuestion(): void {
  if (!newQuestion.value.trim()) {
    message.warning("질문을 입력하세요");
    return;
  }

  if (!formData.questionList) {
    formData.questionList = [];
  }

  formData.questionList.push(newQuestion.value.trim());
  newQuestion.value = "";
  message.success("질문이 추가되었습니다");
}

/**
 * 질문 제거
 *
 * @param index - 제거할 질문의 인덱스
 */
function removeQuestion(index: number): void {
  if (formData.questionList && formData.questionList.length > index) {
    formData.questionList.splice(index, 1);
    message.success("질문이 제거되었습니다");
  }
}

/**
 * 이미지 업로드 전 검증
 *
 * 파일 크기, 타입을 검증하고 미리보기를 생성합니다
 *
 * @param file - 업로드할 파일
 * @returns false를 반환하면 기본 업로드 동작 중단
 */
function handleBeforeUpload(file: File): boolean {
  // 파일 크기 확인 (5MB 이하)
  const isLessThan5M = file.size / 1024 / 1024 < 5;
  if (!isLessThan5M) {
    message.error("파일 크기는 5MB 이하여야 합니다");
    return false;
  }

  // 이미지 타입 확인
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    message.error("이미지 파일만 업로드 가능합니다");
    return false;
  }

  // 미리보기 생성
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result) {
      formData.cardThumbnailUrl = e.target.result as string;
    }
  };
  reader.readAsDataURL(file);

  // 부모 컴포넌트에 업로드 요청
  emit("thumbnail-upload", props.card.id, file);

  return false; // 기본 업로드 동작 방지
}

/**
 * 이미지 제거
 */
function removeImage(): void {
  formData.cardThumbnailUrl = "";
  message.success("이미지가 제거되었습니다");
}

/**
 * 폼 제출
 *
 * 현재 폼 데이터를 부모 컴포넌트로 전송합니다
 * 부모에서 API 호출을 처리합니다
 */
function handleSubmit(): void {
  // 폼 데이터를 부모 컴포넌트로 전송
  emit("update", props.card.id, {
    name: formData.name,
    description: formData.description,
    cardType: formData.cardType as any,
    agentId: formData.agentId,
    questionList: formData.questionList,
    serviceContent: formData.serviceContent,
    cardThumbnailUrl: formData.cardThumbnailUrl,
    displayOrder: formData.displayOrder,
  });
}

/**
 * 폼 초기화
 *
 * 폼 데이터를 원래 props의 값으로 되돌립니다
 */
function resetForm(): void {
  formData.name = props.card.name || "";
  formData.description = props.card.description || "";
  formData.cardType = props.card.cardType || "chatCard";
  formData.agentId = props.card.agentId || undefined;
  formData.questionList = Array.isArray(props.card.questionList)
    ? [...props.card.questionList]
    : [];
  formData.serviceContent = props.card.serviceContent || "";
  formData.cardThumbnailUrl = props.card.cardThumbnailUrl || "";
  formData.displayOrder = props.card.displayOrder || props.cardNumber;
  newQuestion.value = "";
  message.info("폼이 초기화되었습니다");
}

/**
 * 필드 변경 핸들러
 *
 * 필요한 추가 로직이 있으면 여기에 구현합니다
 * 예: 자동 저장, 유효성 검사 등
 */
function handleFieldChange(fieldName: string): void {
  console.log(`필드 변경: ${fieldName}`);
}

/**
 * Props 변경 감시
 *
 * 외부에서 card props가 변경되면 폼 데이터를 업데이트합니다
 *
 * Vue3에서는 watch를 import해서 사용합니다
 * Vue2에서는 watch: { card: { deep: true } } 형태로 사용했습니다
 */
watch(
  () => props.card,
  (newCard) => {
    if (newCard) {
      formData.name = newCard.name || "";
      formData.description = newCard.description || "";
      formData.cardType = newCard.cardType || "chatCard";
      formData.agentId = newCard.agentId || undefined;
      formData.questionList = Array.isArray(newCard.questionList)
        ? [...newCard.questionList]
        : [];
      formData.serviceContent = newCard.serviceContent || "";
      formData.cardThumbnailUrl = newCard.cardThumbnailUrl || "";
      formData.displayOrder = newCard.displayOrder || props.cardNumber;
    }
  },
  { deep: true },
);
</script>

<style scoped lang="scss">
/**
 * CardEditForm 스타일
 *
 * Ant Design Vue 컴포넌트 커스터마이징
 * 부드러운 트렌디한 애니메이션 적용
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

.card-edit-form {
  position: relative;
  animation: slideInUp 0.5s ease-out;

  .card-badge {
    margin-bottom: 12px;

    :deep(.ant-tag) {
      border-radius: 4px;
      font-weight: 600;
    }
  }

  /**
   * 폼 컨테이너
   */
  .form-container {
    border-radius: 12px;
    border: 2px solid #ffc069;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 12px rgba(255, 192, 105, 0.15);
    }

    /**
     * 폼 헤더
     */
    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
    }

    /**
     * Ant Design Form 커스터마이징
     */
    :deep(.ant-form) {
      .ant-form-item {
        margin-bottom: 16px;

        .ant-form-item-label {
          label {
            font-weight: 600;
            color: #262626;
          }
        }
      }
    }

    /**
     * 입력 필드 스타일
     */
    :deep(.ant-input),
    :deep(.ant-input-number),
    :deep(.ant-select-selector),
    :deep(.ant-textarea) {
      border-radius: 6px;
      transition: all 0.3s ease;

      &:hover {
        border-color: #1890ff;
      }

      &:focus,
      &:focus-within {
        border-color: #1890ff;
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
      }
    }

    /**
     * Q&A 섹션
     */
    .qa-section {
      background: #fafafa;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #f0f0f0;

      .question-input-group {
        display: flex;
        gap: 8px;

        :deep(.ant-input) {
          flex: 1;
        }

        :deep(.ant-button) {
          white-space: nowrap;
        }
      }

      /**
       * 질문 목록
       */
      .question-list {
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;

        .question-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #ffffff;
          border-radius: 6px;
          transition: all 0.3s ease;

          &:hover {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            transform: translateX(4px);
          }

          .question-text {
            flex: 1;
            color: #262626;
            font-size: 14px;
          }

          :deep(.ant-button) {
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          &:hover :deep(.ant-button) {
            opacity: 1;
          }
        }
      }
    }

    /**
     * 썸네일 섹션
     */
    .thumbnail-section {
      display: flex;
      flex-direction: column;
      gap: 16px;

      /**
       * 썸네일 미리보기
       */
      .thumbnail-preview {
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #f0f0f0;
        aspect-ratio: 16 / 9;
        background: #fafafa;

        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;

          &:hover {
            transform: scale(1.05);
          }
        }

        .remove-image-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.45);
          color: #ffffff;
          border: none;
          border-radius: 4px;

          &:hover {
            background: rgba(0, 0, 0, 0.65);
          }
        }
      }

      /**
       * 이미지 업로드
       */
      .image-upload {
        :deep(.ant-upload) {
          width: 100%;

          .upload-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 48px 24px;
            background: #fafafa;
            border: 2px dashed #d9d9d9;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
              border-color: #1890ff;
              background: #f5f7ff;

              :deep(.anticon) {
                color: #1890ff;
              }
            }

            :deep(.anticon) {
              font-size: 32px;
              color: #8c8c8c;
              margin-bottom: 8px;
              transition: color 0.3s ease;
            }

            p {
              margin: 4px 0;
              font-size: 14px;
              color: #262626;

              &.upload-tip {
                font-size: 12px;
                color: #8c8c8c;
              }
            }
          }
        }
      }
    }

    /**
     * 버튼 그룹
     */
    :deep(.ant-space) {
      gap: 8px;

      :deep(.ant-button) {
        border-radius: 6px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
}

/**
 * 반응형 디자인
 */
@media (max-width: 768px) {
  .card-edit-form {
    .form-container {
      :deep(.ant-form) {
        .ant-form-item {
          margin-bottom: 12px;
        }
      }

      .qa-section {
        padding: 12px;

        .question-input-group {
          flex-direction: column;

          :deep(.ant-input),
          :deep(.ant-button) {
            width: 100%;
          }
        }

        .question-list {
          .question-item {
            padding: 10px;
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;

            .question-text {
              width: 100%;
            }

            :deep(.ant-button) {
              width: 100%;
            }
          }
        }
      }

      .thumbnail-section {
        .thumbnail-preview {
          aspect-ratio: 4 / 3;
        }

        .image-upload {
          :deep(.upload-placeholder) {
            padding: 32px 16px;
          }
        }
      }
    }
  }
}
</style>
