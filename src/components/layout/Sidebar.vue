<template>
  <!-- 좌측 사이드바 네비게이션 -->
  <aside class="admin-sidebar">
    <nav class="sidebar-menu">
      <!-- 메뉴 아이템 -->
      <div v-for="item in menuItems" :key="item.id" class="menu-group">
        <!-- 그룹 타이틀 -->
        <div class="menu-group-title">
          {{ item.label }}
        </div>

        <!-- 그룹 내 메뉴 아이템 -->
        <router-link
          v-for="subItem in item.children"
          :key="subItem.id"
          :to="subItem.path"
          class="menu-item"
          :class="{ active: isActive(subItem.path) }"
          @click="handleMenuClick(subItem.path)"
        >
          <span v-if="subItem.icon" class="menu-icon">
            <component :is="subItem.icon" />
          </span>
          <span class="menu-label">{{ subItem.label }}</span>
        </router-link>
      </div>
    </nav>

    <!-- 사이드바 하단 (선택사항) -->
    <div class="sidebar-footer">
      <div class="version-info">
        <span class="version-label">Admin v</span>
        <span class="version-number">0.2</span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
/**
 * 어드민 페이지 좌측 사이드바 컴포넌트
 *
 * 기능:
 * - 네비게이션 메뉴 표시
 * - 현재 활성 페이지 강조
 * - 메뉴 아이콘 표시
 * - 부드러운 호버 애니메이션
 *
 * Props:
 * - currentPath: 현재 활성 경로
 *
 * Emits:
 * - navigate: 메뉴 클릭 시
 */

import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import {
  FileTextOutlined,
  PictureOutlined,
  BgColorsOutlined,
  AuditOutlined,
} from "@ant-design/icons-vue";
import type { SidebarMenu } from "@/types";

/**
 * Props 정의
 */
interface Props {
  currentPath?: string;
}

const props = withDefaults(defineProps<Props>(), {
  currentPath: "",
});

const route = useRoute();

/**
 * 메뉴 아이템 구조
 *
 * 기획서 참고:
 * - Service Custom
 *   ├── Contents
 *   ├── Logo
 *   └── Color palette
 */
const menuItems = ref<Array<SidebarMenu & { children: SidebarMenu[] }>>([
  {
    id: "service-custom",
    label: "Service Custom",
    icon: undefined,
    path: "",
    children: [
      {
        id: "contents",
        label: "Contents",
        icon: FileTextOutlined,
        path: "/admin/contents",
      },
      {
        id: "logo",
        label: "Logo",
        icon: PictureOutlined,
        path: "/admin/logo",
      },
      {
        id: "color-palette",
        label: "Color palette",
        icon: BgColorsOutlined,
        path: "/admin/color-palette",
      },
    ],
  },
  {
    id: "audit",
    label: "Audit (국정감사)",
    icon: undefined,
    path: "",
    children: [
      {
        id: "audit-management",
        label: "Audit Management",
        icon: AuditOutlined,
        path: "/admin/audit",
      },
    ],
  },
]);

/**
 * 경로 활성 여부 확인
 *
 * @param path - 확인할 경로
 * @returns 현재 경로와 일치하는지 여부
 */
function isActive(path: string): boolean {
  return route.path === path || props.currentPath === path;
}

/**
 * 메뉴 클릭 핸들러
 *
 * @param path - 이동할 경로
 */
function handleMenuClick(path: string): void {
  // 라우터가 자동으로 처리하므로 추가 로직 불필요
  // 필요하면 emit으로 부모 컴포넌트에 알림
}
</script>

<style scoped lang="scss">
/**
 * 사이드바 스타일
 * 
 * 애니메이션:
 * - 메뉴 아이템 hover 시 좌측 테두리 색상 변경
 * - 활성 메뉴 배경색 부드러운 전환
 * - 아이콘 회전 애니메이션
 */

.admin-sidebar {
  width: 256px;
  height: 100vh;
  background-color: #fafafa;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  transition: background-color 0.3s ease;

  // 스크롤바 스타일
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

.sidebar-menu {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
}

/**
 * 메뉴 그룹
 */
.menu-group {
  margin-bottom: 20px;

  &:first-child {
    margin-top: 8px;
  }

  .menu-group-title {
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 600;
    color: #8c8c8c;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: color 0.3s ease;

    // Vue3에서는 ::v-deep 또는 :deep() 사용 가능
    // Vue2에서는 /deep/ 또는 >>> 사용
  }
}

/**
 * 메뉴 아이템
 */
.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  margin: 4px 8px;
  border-radius: 6px;
  color: #595959;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 3px solid transparent;
  position: relative;

  /**
   * Vue Router <router-link>의 활성 상태
   * 
   * .active 클래스는 명시적으로 추가하거나,
   * router-link-active / router-link-exact-active를 사용할 수 있음
   */
  &:hover {
    background-color: #f5f5f5;
    color: #2563eb;
    border-left-color: #2563eb;
    padding-left: 20px;

    .menu-icon {
      transform: translateX(4px);
    }
  }

  &.active {
    background: linear-gradient(135deg, #e6f4ff 0%, #f0f8ff 100%);
    color: #2563eb;
    border-left-color: #2563eb;
    font-weight: 500;
    box-shadow: inset 0 2px 8px rgba(37, 99, 235, 0.08);

    .menu-icon {
      color: #2563eb;
    }

    // 활성 메뉴 우측 인디케이터
    &::after {
      content: "";
      position: absolute;
      right: 8px;
      width: 4px;
      height: 4px;
      background-color: #2563eb;
      border-radius: 50%;
      animation: activePulse 1.5s ease-in-out infinite;
    }
  }

  .menu-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: all 0.3s ease;
    flex-shrink: 0;
  }

  .menu-label {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/**
 * 활성 메뉴 인디케이터 애니메이션
 */
@keyframes activePulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.3);
  }
}

/**
 * 사이드바 하단 (버전 정보)
 */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  margin-top: auto;

  .version-info {
    display: flex;
    align-items: center;
    gap: 4px;
    justify-content: center;

    .version-label {
      font-size: 12px;
      color: #8c8c8c;
    }

    .version-number {
      font-size: 12px;
      font-weight: 600;
      color: #2563eb;
    }
  }
}

/**
 * 반응형 디자인 (나중에 모바일 대응)
 */
@media (max-width: 1024px) {
  .admin-sidebar {
    width: 200px;
  }

  .menu-item {
    padding: 8px 12px;

    &:hover {
      padding-left: 16px;
    }

    .menu-label {
      font-size: 13px;
    }
  }
}

@media (max-width: 768px) {
  .admin-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 998;
    width: 200px;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s ease;

    // 모바일에서 열린 상태 (별도 JS 로직으로 제어)
    &.open {
      transform: translateX(0);
    }
  }
}
</style>
