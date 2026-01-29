<template>
  <!-- 로고 미리보기 모달 -->
  <a-modal
    :visible="visible"
    title="Logo Preview"
    width="500px"
    @cancel="emit('update:visible', false)"
    :footer="null"
    class="logo-preview-modal"
  >
    <div v-if="logo" class="preview-content">
      <!-- 로고 표시 -->
      <div class="logo-container">
        <img :src="logo.logoUrl" :alt="logoName" class="logo-image" />
      </div>

      <!-- 로고 정보 -->
      <div class="logo-details">
        <div class="detail-item">
          <span class="detail-label">File Name:</span>
          <span class="detail-value">{{ logoName }}</span>
        </div>

        <div class="detail-item">
          <span class="detail-label">Size:</span>
          <span class="detail-value">{{ formatFileSize(logo.size || 0) }}</span>
        </div>

        <div class="detail-item">
          <span class="detail-label">Upload Date:</span>
          <span class="detail-value">{{ formatDate(logo.createdAt) }}</span>
        </div>

        <div class="detail-item">
          <span class="detail-label">Status:</span>
          <a-tag
            :color="logo.isSelected ? 'blue' : 'default'"
            class="status-tag"
          >
            {{ logo.isSelected ? "Active" : "Inactive" }}
          </a-tag>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>로고 정보를 불러올 수 없습니다</p>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
/**
 * LogoPreviewModal 컴포넌트
 *
 * 역할: 로고 상세 미리보기 모달
 * Props: visible, logo
 * Emits: update:visible
 */

import { computed } from "vue";
import type { AppPortalLogo } from "@/types";

interface Props {
  visible: boolean;
  logo: AppPortalLogo | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
}>();

const logoName = computed(() => {
  if (!props.logo?.logoUrl) return "logo";
  const url = new URL("http://localhost" + props.logo.logoUrl);
  return decodeURIComponent(url.pathname.split("/").pop() || "logo");
});

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function formatDate(date: string | Date): string {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("ko-KR");
}
</script>

<style scoped lang="scss">
.logo-preview-modal {
  :deep(.ant-modal-content) {
    border-radius: 12px;
  }
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.logo-container {
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  .logo-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 20px;
  }
}

.logo-details {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .detail-item {
    display: flex;
    justify-content: space-between;
    padding: 12px;
    background: #fafafa;
    border-radius: 6px;
    font-size: 14px;

    .detail-label {
      font-weight: 600;
      color: #262626;
    }

    .detail-value {
      color: #595959;
      word-break: break-all;
    }

    .status-tag {
      margin: 0;
    }
  }
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #8c8c8c;
}
</style>
