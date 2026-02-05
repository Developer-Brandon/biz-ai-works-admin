<template>
  <!-- 로고 카드 (편집 모드) -->
  <div class="logo-edit-card">
    <!-- 선택 토글 -->
    <div class="select-toggle">
      <a-switch
        :checked="isSelected"
        @change="emit('select', logo.id)"
        class="toggle-switch"
      />
      <span class="toggle-label">
        {{ isSelected ? "Active" : "Inactive" }}
      </span>
    </div>

    <!-- 로고 이미지 -->
    <div class="logo-image-wrapper">
      <img :src="logo.logoUrl" :alt="fileName" class="logo-image" />
    </div>

    <!-- 로고 정보 -->
    <div class="logo-info">
      <h4 class="logo-name">{{ fileName }}</h4>
      <p class="logo-date">{{ formatDate(logo.updatedAt) }}</p>
    </div>

    <!-- 액션 버튼 -->
    <div class="logo-actions">
      <a-button
        type="primary"
        danger
        size="small"
        block
        :loading="loading"
        @click="emit('delete', logo.id)"
      >
        <template #icon>
          <DeleteOutlined />
        </template>
        Delete
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * LogoEditCard 컴포넌트
 *
 * 역할: 로고를 편집 모드로 표시
 * Props: logo, isSelected, loading
 * Emits: select (로고 선택), delete (로고 삭제)
 */

import { computed } from "vue";
import { DeleteOutlined } from "@ant-design/icons-vue";
import type { AppPortalLogo } from "@/types";

interface Props {
  logo: AppPortalLogo;
  isSelected: boolean;
  loading: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  select: [logoId: string];
  delete: [logoId: string];
}>();

const fileName = computed(() => {
  const url = new URL("http://localhost" + (props.logo.logoUrl || ""));
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
.logo-edit-card {
  background: #ffffff;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: #1890ff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
}

.select-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;

  .toggle-label {
    font-size: 14px;
    font-weight: 500;
    color: #262626;
  }
}

.logo-image-wrapper {
  width: 100%;
  height: 140px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;

  .logo-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 12px;
  }
}

.logo-info {
  padding: 12px 16px;

  .logo-name {
    margin: 0 0 6px 0;
    font-size: 13px;
    font-weight: 600;
    color: #262626;
    word-break: break-all;
  }

  .logo-size {
    margin: 0 0 3px 0;
    font-size: 11px;
    color: #8c8c8c;
  }

  .logo-date {
    margin: 0;
    font-size: 11px;
    color: #8c8c8c;
  }
}

.logo-actions {
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
}
</style>
