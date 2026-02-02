<template>
  <aside class="sidebar">
    <!-- 사이드바 헤더 -->
    <!-- <div class="sidebar__header">
      <h2 class="sidebar__title">Admin</h2>
    </div> -->

    <!-- 메뉴 -->
    <nav class="sidebar__nav">
      <div class="sidebar__section">
        <div class="sidebar__section-title">
          <CodeSandboxOutlined />
          Service Custom
        </div>

        <!-- 메뉴 아이템 -->
        <router-link
          to="/admin/contents"
          class="sidebar__menu-item"
          :class="{ 'sidebar__menu-item--active': isActive('/admin/contents') }"
        >
          <FileTextOutlined class="sidebar__menu-icon" />
          <span class="sidebar__menu-label">Contents</span>
        </router-link>

        <router-link
          to="/admin/logo"
          class="sidebar__menu-item"
          :class="{ 'sidebar__menu-item--active': isActive('/admin/logo') }"
        >
          <FileImageOutlined class="sidebar__menu-icon" />
          <span class="sidebar__menu-label">Logo</span>
        </router-link>

        <router-link
          to="/admin/color-palette"
          class="sidebar__menu-item"
          :class="{
            'sidebar__menu-item--active': isActive('/admin/color-palette'),
          }"
        >
          <BgColorsOutlined class="sidebar__menu-icon" />
          <span class="sidebar__menu-label">Color palette</span>
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
/**
 * Sidebar.vue - 어드민 사이드바 네비게이션
 *
 * 기능:
 * - Contents, Logo, Color Palette 메뉴
 * - 현재 활성 메뉴 표시
 * - 반응형 (모바일에서 숨김)
 *
 * Props: 없음
 * Emits: 없음
 *
 * 사용 위치:
 * - Layout.vue의 좌측에서 사용
 *
 * Vue3 Composition API:
 * - useRoute() 훅으로 현재 라우트 정보 접근
 */

import { useRoute } from "vue-router";
import {
  CodeSandboxOutlined,
  FileTextOutlined,
  FileImageOutlined,
  BgColorsOutlined,
} from "@ant-design/icons-vue";

// 현재 라우트
const route = useRoute();

/**
 * 메뉴 아이템이 활성 상태인지 확인
 *
 * Vue3에서:
 * - route.path: 현재 경로 문자열 (예: '/admin/contents')
 * - startsWith(): 경로 확인
 *
 * Vue2 vs Vue3:
 * - Vue2: this.$route.path (this 필수)
 * - Vue3: route.path (변수 직접 접근)
 */
const isActive = (path: string): boolean => {
  return route.path.startsWith(path);
};
</script>

<style scoped lang="scss">
/**
 * Sidebar 스타일
 */

.sidebar {
  position: fixed;
  left: 0;
  top: 64px;
  width: 220px;
  height: calc(100vh - 64px);
  padding: 16px 0;
  background: #fafafa;
  border-right: 1px solid #f0f0f0;
  overflow-y: auto;
  z-index: 40;
  transition: all 0.3s ease-in-out;

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d9d9d9;
    border-radius: 3px;

    &:hover {
      background: #bfbfbf;
    }
  }
}

/* 사이드바 헤더 */
.sidebar__header {
  padding: 12px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

/* 네비게이션 */
.sidebar__nav {
  padding: 16px 0;
}

/* 메뉴 섹션 */
.sidebar__section {
  margin-bottom: 16px;
}

.sidebar__section-title {
  padding: 0 24px;
  margin-bottom: 8px;
  font-size: 15px;
  font-weight: 600;
  color: $color-text-primary;
  letter-spacing: 0.5px;
}

/* 메뉴 아이템 */
.sidebar__menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 24px;
  margin: 0 12px;
  color: #8c8c8c;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  /* Hover 상태 */
  &:hover {
    background: #ffffff;
    color: #1890ff;
  }

  /* 활성 상태 */
  &.sidebar__menu-item--active {
    background: #1890ff;
    color: white;
    font-weight: 600;

    .sidebar__menu-icon {
      color: white;
    }
  }
}

/* 메뉴 아이콘 */
.sidebar__menu-icon {
  width: 18px;
  height: 18px;
  color: inherit;
  transition: color 0.2s ease-in-out;
}

/* 메뉴 라벨 */
.sidebar__menu-label {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

/* 반응형 설정 */
@media (max-width: 1024px) {
  .sidebar {
    width: 200px;
  }

  .sidebar__menu-item {
    padding: 8px 16px;
    margin: 0 8px;
  }

  .sidebar__section-title {
    padding: 0 16px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
</style>
