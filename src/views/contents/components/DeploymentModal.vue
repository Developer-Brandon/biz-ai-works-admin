<template>
  <!-- 배포 결과 모달 -->
  <a-modal
    :visible="visible"
    :title="modalTitle"
    width="420px"
    @cancel="handleClose"
    @ok="handleClose"
    ok-text="Confirm"
    :cancel-button-props="{ style: { display: 'none' } }"
    class="deployment-modal"
    :class="statusClass"
  >
    <!-- 배포 결과 아이콘 -->
    <div class="status-icon">
      <CheckCircleOutlined v-if="status === 'success'" class="success-icon" />
      <CloseCircleOutlined v-else class="error-icon" />
    </div>

    <!-- 메시지 -->
    <div class="status-message">
      <p class="message-text">{{ message }}</p>
    </div>

    <!-- 상태별 추가 정보 -->
    <template v-if="status === 'error'">
      <div class="error-details">
        <p class="error-hint">
          새로고침 후 다시 시도해 주세요. 계속 문제가 발생하면 관리자에게
          문의해주세요.
        </p>
      </div>
    </template>

    <template v-else>
      <div class="success-details">
        <p class="success-hint">변경 사항이 서비스에 반영되었습니다.</p>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
/**
 * DeploymentModal 컴포넌트
 *
 * 역할: 배포 결과를 사용자에게 알림
 * Props: visible, status ('success' | 'error'), message
 * Emits: update:visible
 */

import { computed } from "vue";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons-vue";

interface Props {
  visible: boolean;
  status: "success" | "error";
  message: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
}>();

const modalTitle = computed(() =>
  props.status === "success" ? "Deployment Successful" : "Deployment Failed",
);

const statusClass = computed(() => ({
  "is-success": props.status === "success",
  "is-error": props.status === "error",
}));

function handleClose(): void {
  emit("update:visible", false);
}
</script>

<style scoped lang="scss">
.deployment-modal {
  :deep(.ant-modal-content) {
    border-radius: 12px;
  }

  :deep(.ant-modal-header) {
    border-bottom: 1px solid #f0f0f0;
    padding: 20px;

    .ant-modal-title {
      font-size: 16px;
      font-weight: 600;
    }
  }

  :deep(.ant-modal-body) {
    padding: 24px 32px;
  }

  &.is-success {
    :deep(.ant-modal-header .ant-modal-title) {
      color: #52c41a;
    }
  }

  &.is-error {
    :deep(.ant-modal-header .ant-modal-title) {
      color: #ff4d4f;
    }
  }
}

.status-icon {
  text-align: center;
  margin-bottom: 16px;

  .success-icon {
    font-size: 64px;
    color: #52c41a;
    animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .error-icon {
    font-size: 64px;
    color: #ff4d4f;
    animation: shake 0.6s ease;
  }
}

.status-message {
  text-align: center;
  margin-bottom: 24px;

  .message-text {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: #262626;
    line-height: 1.6;
  }
}

.error-details {
  background: #fff2f0;
  border-left: 4px solid #ff4d4f;
  padding: 12px 16px;
  border-radius: 6px;

  .error-hint {
    margin: 0;
    font-size: 13px;
    color: #cf1322;
    line-height: 1.6;
  }
}

.success-details {
  background: #f6ffed;
  border-left: 4px solid #52c41a;
  padding: 12px 16px;
  border-radius: 6px;

  .success-hint {
    margin: 0;
    font-size: 13px;
    color: #274e2b;
    line-height: 1.6;
  }
}

/**
 * 애니메이션
 */
@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

@media (max-width: 768px) {
  .deployment-modal {
    :deep(.ant-modal-header) {
      padding: 16px;
    }

    :deep(.ant-modal-body) {
      padding: 20px;
    }
  }

  .status-icon {
    .success-icon,
    .error-icon {
      font-size: 48px;
    }
  }

  .status-message .message-text {
    font-size: 14px;
  }
}
</style>
