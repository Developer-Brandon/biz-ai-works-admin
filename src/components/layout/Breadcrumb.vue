<template>
  <!-- 네비게이션 경로 표시 (Breadcrumb) -->
  <nav class="breadcrumb-nav">
    <div class="breadcrumb-content">
      <!-- 경로 아이템들 -->
      <div
        v-for="(item, index) in items"
        :key="item.path || index"
        class="breadcrumb-item"
      >
        <!-- 구분자 (첫 번째 아이템 제외) -->
        <span v-if="index > 0" class="breadcrumb-separator">
          <RightOutlined />
        </span>

        <!-- 경로 링크 또는 텍스트 -->
        <router-link
          v-if="item.path && !item.active"
          :to="item.path"
          class="breadcrumb-link"
        >
          {{ item.label }}
        </router-link>

        <!-- 현재 페이지 (링크 아님) -->
        <span v-else class="breadcrumb-text" :class="{ active: item.active }">
          {{ item.label }}
        </span>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
/**
 * Breadcrumb 컴포넌트
 *
 * 현재 페이지의 경로를 계층적으로 표시합니다
 *
 * Props:
 * - items: 경로 아이템 배열
 *
 * 사용 예시:
 * ```vue
 * <Breadcrumb :items="[
 *   { label: 'Admin', path: '/admin' },
 *   { label: 'Contents', path: '/admin/contents', active: true }
 * ]" />
 * ```
 *
 * 렌더링 결과:
 * Admin > Contents
 */

import { RightOutlined } from "@ant-design/icons-vue";
import type { BreadcrumbItem } from "@/types";

/**
 * Props 정의
 */
interface Props {
  items?: BreadcrumbItem[];
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [
    { label: "Admin", path: "/admin", active: false },
    { label: "Dashboard", path: "", active: true },
  ],
});
</script>

<style scoped lang="scss">
/**
 * Breadcrumb 스타일
 * 
 * 특징:
 * - 경로 계층 구조 명확하게 표시
 * - 현재 페이지는 활성 상태로 강조
 * - 이전 경로는 클릭 가능한 링크로 표시
 * - 부드러운 호버 애니메이션
 */

.breadcrumb-nav {
  display: flex;
  align-items: center;
  height: 40px;
}

.breadcrumb-content {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  padding: 0 12px;
}

/**
 * Breadcrumb 아이템
 */
.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

/**
 * 구분자 (> 기호)
 */
.breadcrumb-separator {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #bfbfbf;
  margin: 0 4px;
  transition: color 0.3s ease;

  :deep(svg) {
    display: block;
  }
}

/**
 * Breadcrumb 링크 (클릭 가능)
 */
.breadcrumb-link {
  font-size: 13px;
  color: #2563eb;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  /**
   * Vue3 hover 애니메이션
   * 
   * Vue2: 스타일은 동일하지만,
   * Vue3에서는 transition/animation이 더 부드럽게 처리됨
   */
  &:hover {
    background-color: rgba(37, 99, 235, 0.08);
    color: #1e40af;
    padding: 4px 8px;
  }

  &:active {
    transform: scale(0.98);
  }
}

/**
 * Breadcrumb 텍스트 (현재 페이지)
 */
.breadcrumb-text {
  font-size: 13px;
  color: #595959;
  padding: 4px 8px;
  white-space: nowrap;
  transition: all 0.3s ease;

  /**
   * 활성 상태 (현재 페이지)
   */
  &.active {
    color: #262626;
    font-weight: 600;
  }
}

/**
 * 반응형 디자인
 */
@media (max-width: 1024px) {
  .breadcrumb-content {
    font-size: 12px;
  }

  .breadcrumb-link,
  .breadcrumb-text {
    font-size: 12px;
  }

  .breadcrumb-separator {
    font-size: 11px;
  }
}

@media (max-width: 768px) {
  .breadcrumb-nav {
    display: none; // 모바일에서는 숨김
  }
}
</style>
