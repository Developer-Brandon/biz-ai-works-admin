<template>
  <!-- 로고 카드 (조회 모드) -->
  <div class="logo-card">
    <!-- 선택 배지 -->
    <div v-if="isSelected" class="selected-badge">
      <CheckCircleOutlined class="badge-icon" />
      <span class="badge-text">Selected</span>
    </div>

    <!-- 로고 이미지 -->
    <div class="logo-image-wrapper">
      <img :src="logo.logoUrl" :alt="logo.logoUrl" class="logo-image" />
    </div>

    <!-- 로고 정보 -->
    <div class="logo-info">
      <h4 class="logo-name">{{ fileName }}</h4>
      <p class="logo-size">{{ formatFileSize(logo.size || 0) }}</p>
      <p class="logo-date">
        {{ formatDate(logo.updatedAt) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * LogoCard 컴포넌트
 *
 * 역할: 로고를 카드 형태로 표시 (조회 모드)
 * Props: logo (로고 데이터), isSelected (선택 여부)
 */

import { computed } from "vue";
import { CheckCircleOutlined } from "@ant-design/icons-vue";
import type { AppPortalLogo } from "@/types";

interface Props {
  logo: AppPortalLogo;
  isSelected: boolean;
}

defineProps<Props>();

/**
 * 파일명 추출
 */
const fileName = computed(() => {
  const url = new URL("http://localhost" + (props.logo.logoUrl || ""));
  return decodeURIComponent(url.pathname.split("/").pop() || "logo");
});

/**
 * 파일 크기 포맷
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * 날짜 포맷
 */
function formatDate(date: string | Date): string {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("ko-KR");
}
</script>

<style scoped lang="scss">
.logo-card {
  position: relative;
  background: #ffffff;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: #1890ff;
    box-shadow: 0 8px 24px rgba(24, 144, 255, 0.15);
    transform: translateY(-4px);
  }
}

/**
 * 선택 배지
 */
.selected-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: #1890ff;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  z-index: 10;

  .badge-icon {
    font-size: 14px;
  }
}

/**
 * 로고 이미지
 */
.logo-image-wrapper {
  width: 100%;
  height: 180px;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  .logo-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 12px;
  }
}

/**
 * 로고 정보
 */
.logo-info {
  padding: 16px;

  .logo-name {
    margin: 0 0 8px 0;
    font-size: 14px;
    font-weight: 600;
    color: #262626;
    word-break: break-all;
  }

  .logo-size {
    margin: 0 0 4px 0;
    font-size: 12px;
    color: #8c8c8c;
  }

  .logo-date {
    margin: 0;
    font-size: 12px;
    color: #8c8c8c;
  }
}

@media (max-width: 768px) {
  .logo-image-wrapper {
    height: 140px;
  }

  .logo-info {
    padding: 12px;
  }
}
</style>
