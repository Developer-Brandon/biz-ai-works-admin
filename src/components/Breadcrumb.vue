<template>
  <!-- Breadcrumb 네비게이션 컴포넌트 -->
  <nav class="breadcrumb">
    <ol class="breadcrumb__list">
      <li
        v-for="(item, index) in breadcrumbItems"
        :key="`breadcrumb-${index}`"
        class="breadcrumb__item"
      >
        <!-- 클릭 가능한 항목 (마지막이 아닐 때) -->
        <router-link
          v-if="!item.active && item.path"
          :to="item.path"
          class="breadcrumb__link"
        >
          <span class="breadcrumb__label">{{ item.label }}</span>
        </router-link>

        <!-- 경로가 없으면 텍스트로만 표시 -->
        <span v-else-if="!item.active && !item.path" class="breadcrumb__text">
          {{ item.label }}
        </span>

        <!-- 활성화된 항목 (마지막) -->
        <span v-if="item.active" class="breadcrumb__current">
          {{ item.label }}
        </span>

        <!-- 구분자 (마지막 항목이 아닐 때) -->
        <span
          v-if="index < breadcrumbItems.length - 1"
          class="breadcrumb__separator"
          aria-hidden="true"
        >
          /
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
/**
 * Breadcrumb 컴포넌트
 *
 * 기능:
 * - 현재 경로에 맞는 Breadcrumb을 자동으로 계산
 * - 클릭 시 해당 경로로 이동
 * - 마지막 항목은 현재 활성 경로로 표시
 *
 * Vue3 특징:
 * - Composition API (computed 사용)
 * - router-link로 SPA 내 네비게이션
 * - 반응형 링크 활성화
 *
 * Vue2와의 차이:
 * - Vue2: watch + computed property
 * - Vue3: 순수 computed만 사용 (자동 반응성)
 */

import { computed } from "vue";
import { useRoute } from "vue-router";
import type { BreadcrumbItem } from "@/types";

const route = useRoute();

/**
 * ✅ Breadcrumb 경로 매핑
 *
 * 각 route path에 대응하는 breadcrumb items를 정의합니다.
 * 나중에 새로운 route를 추가하면 여기에도 추가해야 합니다.
 */
const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
  "/admin": [
    {
      label: "Admin",
      path: "/",
      active: true,
    },
  ],
  "/admin/contents": [
    {
      label: "Admin",
      path: "/admin",
      active: false,
    },
    {
      label: "Service Custom",
      path: "",
      active: false,
    },
    {
      label: "Contents",
      path: "/admin/contents",
      active: true,
    },
  ],
  "/admin/logo": [
    {
      label: "Admin",
      path: "/admin",
      active: false,
    },
    {
      label: "Service Custom",
      path: "",
      active: false,
    },
    {
      label: "Logo",
      path: "/admin/logo",
      active: true,
    },
  ],
  "/admin/color-palette": [
    {
      label: "Admin",
      path: "/admin",
      active: false,
    },
    {
      label: "Service Custom",
      path: "",
      active: false,
    },
    {
      label: "Color Palette",
      path: "/admin/color-palette",
      active: true,
    },
  ],
};

/**
 * ✅ 현재 경로에 맞는 Breadcrumb 항목들 반환
 *
 * Vue2에서:
 * computed: {
 *   breadcrumbItems() {
 *     return breadcrumbMap[this.$route.path] || [...]
 *   }
 * }
 *
 * Vue3에서:
 * const breadcrumbItems = computed(() => {...})
 */
const breadcrumbItems = computed(() => {
  return (
    breadcrumbMap[route.path] || [
      {
        label: "Admin",
        path: "/admin",
        active: true,
      },
    ]
  );
});
</script>

<style scoped lang="scss">
/**
 * Breadcrumb 스타일
 */

.breadcrumb {
  width: 100%;

  /**
   * Breadcrumb 리스트
   * - 수평 레이아웃 (flexbox)
   * - ol 태그로 의미론적 마크업 (semantic HTML)
   * - 순서가 있는 목록
   */
  &__list {
    display: flex;
    align-items: center;
    margin: 0;
    padding: 8px 0;
    list-style: none;
    font-size: 13px;
    color: #595959;
  }

  /**
   * Breadcrumb 항목
   */
  &__item {
    display: flex;
    align-items: center;
    gap: 4px;

    /**
     * 마지막 항목 뒤의 구분자 숨기기
     *
     * CSS 선택자: &:last-child .breadcrumb__separator
     * 의미: 이 item이 마지막 자식이면, 내부의 __separator를 숨김
     */
    &:last-child .breadcrumb__separator {
      display: none;
    }
  }

  /**
   * Breadcrumb 링크 (클릭 가능한 항목)
   */
  &__link {
    display: inline-flex;
    align-items: center;
    color: #1890ff;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 4px 6px;
    margin: -4px -6px;
    border-radius: 4px;

    /**
     * 호버 상태 애니메이션
     *
     * 트렌디한 인터랙션:
     * - 색상 변화: #1890ff → #40a9ff (더 밝아짐)
     * - 배경색 추가: 파란 배경 (#e6f7ff)
     * - 약간의 스케일 효과: translateY(-1px) (위로 올라가는 느낌)
     */
    &:hover {
      color: #40a9ff;
      background-color: #e6f7ff;
      transform: translateY(-1px);
    }

    /**
     * 활성 상태 (클릭 중)
     */
    &:active {
      transform: translateY(0);
    }
  }

  /**
   * 경로가 없는 텍스트 항목
   * (예: "Service Custom"은 클릭할 수 없음)
   */
  &__text {
    display: inline-flex;
    align-items: center;
    color: #8c8c8c;
    padding: 4px 6px;
    font-weight: 400;
  }

  /**
   * Breadcrumb 레이블
   */
  &__label {
    font-weight: 400;
  }

  /**
   * Breadcrumb 구분자 (/)
   */
  &__separator {
    display: inline-block;
    margin: 0 4px;
    color: #bfbfbf;
    font-size: 12px;
    user-select: none;
  }

  /**
   * 현재 활성 항목 (마지막)
   *
   * 트렌디한 스타일:
   * - 어두운 색상 (#262626)
   * - 약간의 배경색 (#fafafa)
   * - 약간의 padding으로 공간감
   * - border-radius로 부드러운 모서리
   */
  &__current {
    color: #262626;
    font-weight: 500;
    padding: 4px 6px;
    border-radius: 4px;
    background-color: #fafafa;
    transition: all 0.3s ease;
  }
}

/**
 * 반응형 디자인
 * 모바일 화면에서 font-size와 spacing을 줄임
 */
@media (max-width: 768px) {
  .breadcrumb {
    &__list {
      font-size: 12px;
    }

    &__item {
      gap: 2px;
    }

    &__link {
      padding: 3px 4px;
      margin: -3px -4px;
    }

    &__text {
      padding: 3px 4px;
    }

    &__separator {
      margin: 0 2px;
    }

    &__current {
      padding: 3px 4px;
    }
  }
}
</style>
