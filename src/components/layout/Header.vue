<template>
  <!-- 상단 헤더 컴포넌트 -->
  <header class="admin-header">
    <div class="header-container">
      <!-- 좌측: 로고 + 제목 -->
      <div class="header-left">
        <div class="logo-section">
          <img src="@/assets/vue.svg" alt="Logo" class="logo-image" />
          <span class="logo-text">Biz AI Works Admin</span>
        </div>
        <nav class="breadcrumb-section">
          <Breadcrumb :items="breadcrumbItems" />
        </nav>
      </div>

      <!-- 우측: 배포 버튼 + 사용자 정보 -->
      <div class="header-right">
        <a-button
          type="primary"
          :loading="isDeploying"
          :disabled="!canDeploy"
          @click="handleDeploy"
          class="deploy-button"
        >
          <template #icon>
            <CloudUploadOutlined />
          </template>
          배포
        </a-button>

        <a-dropdown :menu="{ items: userMenuItems }">
          <template #default="{ getPopupContainer }">
            <div class="user-info" :get-popup-container="getPopupContainer">
              <a-avatar :size="40" icon="UserOutlined" class="user-avatar" />
              <span class="user-name">{{ userName }}</span>
              <DownOutlined class="dropdown-icon" />
            </div>
          </template>
        </a-dropdown>
      </div>
    </div>

    <!-- 배포 진행 바 (배포 중일 때만 표시) -->
    <a-progress
      v-if="isDeploying"
      :percent="deployProgress"
      :status="deployStatus"
      class="deploy-progress"
    />
  </header>
</template>

<script setup lang="ts">
/**
 * 어드민 페이지 상단 헤더 컴포넌트
 *
 * 기능:
 * - 로고 및 페이지 제목 표시
 * - 현재 경로 표시 (Breadcrumb)
 * - 배포 버튼 및 배포 상태 관리
 * - 사용자 메뉴 (프로필, 로그아웃 등)
 *
 * Props:
 * - breadcrumbItems: 네비게이션 경로
 * - isDeploying: 배포 중 여부
 * - deployProgress: 배포 진행률 (0-100)
 *
 * Emits:
 * - deploy: 배포 버튼 클릭 시
 * - logout: 로그아웃 클릭 시
 */

import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
  CloudUploadOutlined,
  LogoutOutlined,
  SettingOutlined,
  DownOutlined,
} from "@ant-design/icons-vue";
import Breadcrumb from "./Breadcrumb.vue";
import type { BreadcrumbItem } from "@/types";

/**
 * Props 정의
 */
interface Props {
  breadcrumbItems?: BreadcrumbItem[];
  isDeploying?: boolean;
  deployProgress?: number;
  deployStatus?: "active" | "exception" | "normal" | "success";
  userName?: string;
  canDeploy?: boolean;
}

/**
 * Emits 정의
 */
interface Emits {
  deploy: [];
  logout: [];
}

const props = withDefaults(defineProps<Props>(), {
  breadcrumbItems: () => [{ label: "Admin", path: "/admin", active: true }],
  isDeploying: false,
  deployProgress: 0,
  deployStatus: "active",
  userName: "관리자",
  canDeploy: true,
});

const emit = defineEmits<Emits>();
const router = useRouter();

/**
 * 사용자 메뉴 아이템
 */
const userMenuItems = ref([
  {
    key: "profile",
    label: "프로필",
    icon: SettingOutlined,
  },
  {
    type: "divider",
  },
  {
    key: "logout",
    label: "로그아웃",
    icon: LogoutOutlined,
    danger: true,
  },
]);

/**
 * 배포 버튼 클릭 핸들러
 */
async function handleDeploy(): Promise<void> {
  emit("deploy");
}

/**
 * 사용자 메뉴 클릭 핸들러
 */
function handleUserMenuClick(key: string): void {
  switch (key) {
    case "profile":
      // 프로필 페이지로 이동
      router.push("/admin/profile");
      break;
    case "logout":
      // 로그아웃
      emit("logout");
      break;
  }
}
</script>

<style scoped lang="scss">
/**
 * 헤더 스타일
 * 
 * 애니메이션:
 * - 배포 버튼 hover 시 부드러운 확대 효과
 * - 배포 진행 바 애니메이션
 */

.admin-header {
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 999;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  max-width: 100%;
}

/**
 * 헤더 좌측 (로고 + 제목)
 */
.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
  min-width: 0; // Flexbox 오버플로우 방지

  .logo-section {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-right: 20px;
    border-right: 1px solid #f0f0f0;

    .logo-image {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      object-fit: contain;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }

    .logo-text {
      font-size: 16px;
      font-weight: 600;
      color: #262626;
      white-space: nowrap;

      // Vue3 참고: Vue2에서는 ::v-deep이지만,
      // Vue3에서는 :deep() 또는 <style scoped> 내에서 ::deep 사용
    }
  }

  .breadcrumb-section {
    flex: 1;
    min-width: 0;
  }
}

/**
 * 헤더 우측 (배포 버튼 + 사용자 정보)
 */
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 24px;

  .deploy-button {
    min-width: 100px;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: #fafafa;
    }

    .user-avatar {
      flex-shrink: 0;
      background-color: #2563eb;
    }

    .user-name {
      font-size: 14px;
      color: #262626;
      font-weight: 500;
      white-space: nowrap;
    }

    .dropdown-icon {
      font-size: 12px;
      color: #8c8c8c;
      margin-left: 4px;
    }
  }
}

/**
 * 배포 진행 바
 */
.deploy-progress {
  height: 4px;
  border-radius: 0;

  // Ant Design Progress 커스터마이징
  :deep(.ant-progress-bg) {
    background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
    animation: progressPulse 2s ease-in-out infinite;
  }
}

/**
 * 배포 진행 바 애니메이션
 */
@keyframes progressPulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/**
 * 반응형 디자인
 */
@media (max-width: 1024px) {
  .header-container {
    padding: 12px 16px;
  }

  .header-left {
    gap: 16px;

    .logo-section {
      padding-right: 12px;

      .logo-text {
        display: none; // 태블릿에서는 텍스트 숨김
      }
    }
  }

  .header-right {
    gap: 12px;
    margin-left: 12px;

    .user-name {
      display: none; // 태블릿에서는 사용자 이름 숨김
    }
  }
}

@media (max-width: 768px) {
  .header-container {
    flex-wrap: wrap;
    gap: 8px;
  }

  .header-left {
    width: 100%;
    order: 1;

    .breadcrumb-section {
      display: none; // 모바일에서는 breadcrumb 숨김
    }
  }

  .header-right {
    order: 2;
    margin-left: 0;
  }

  .deploy-button {
    min-width: auto;
    padding: 0 12px;
  }
}
</style>
