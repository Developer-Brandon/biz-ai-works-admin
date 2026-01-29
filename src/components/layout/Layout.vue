<template>
  <!-- 어드민 페이지 전체 레이아웃 -->
  <div class="admin-layout">
    <!-- 상단 헤더 -->
    <Header
      :breadcrumb-items="currentBreadcrumbs"
      :is-deploying="isDeploying"
      :deploy-progress="deployProgress"
      :user-name="userName"
      :can-deploy="canDeploy"
      @deploy="handleDeploy"
      @logout="handleLogout"
    />

    <!-- 메인 콘텐츠 (사이드바 + 메인) -->
    <div class="layout-body">
      <!-- 좌측 사이드바 -->
      <Sidebar :current-path="currentPath" />

      <!-- 중앙 메인 콘텐츠 -->
      <main class="layout-content">
        <div class="content-wrapper">
          <!-- 라우터로 렌더링될 페이지 -->
          <router-view v-slot="{ Component }">
            <Transition name="fade-slide" mode="out-in">
              <component :is="Component" :key="$route.path" />
            </Transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 어드민 페이지 전체 레이아웃 컴포넌트
 *
 * 구조:
 * ┌─────────────────────────────────┐
 * │          Header                 │
 * ├──────────┬──────────────────────┤
 * │Sidebar   │  Main Content        │
 * │          │  (router-view)       │
 * │          │                      │
 * └──────────┴──────────────────────┘
 *
 * 기능:
 * - 전체 레이아웃 관리
 * - Breadcrumb 동적 생성
 * - 배포 상태 관리
 * - 페이지 전환 애니메이션
 *
 * Vue3 특징:
 * - <Transition> 컴포넌트로 부드러운 페이지 전환
 * - router-view의 v-slot으로 컴포넌트 접근
 */

import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Header from "./Header.vue";
import Sidebar from "./Sidebar.vue";
import type { BreadcrumbItem } from "@/types";

const route = useRoute();
const router = useRouter();

/**
 * 상태 정의
 */
const isDeploying = ref(false);
const deployProgress = ref(0);
const userName = ref("Admin User");

/**
 * 배포 가능 여부
 * (실제로는 스토어에서 가져올 수 있음)
 */
const canDeploy = computed(() => !isDeploying.value);

/**
 * 현재 경로
 */
const currentPath = computed(() => route.path);

/**
 * 페이지별 Breadcrumb 정의
 *
 * route.meta에서 가져올 수도 있음
 */
const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
  "/admin": [{ label: "Admin", path: "/admin", active: true }],
  "/admin/contents": [
    { label: "Admin", path: "/admin", active: false },
    { label: "Service Custom", path: "", active: false },
    { label: "Contents", path: "/admin/contents", active: true },
  ],
  "/admin/logo": [
    { label: "Admin", path: "/admin", active: false },
    { label: "Service Custom", path: "", active: false },
    { label: "Logo", path: "/admin/logo", active: true },
  ],
  "/admin/color-palette": [
    { label: "Admin", path: "/admin", active: false },
    { label: "Service Custom", path: "", active: false },
    { label: "Color Palette", path: "/admin/color-palette", active: true },
  ],
  "/admin/audit": [
    { label: "Admin", path: "/admin", active: false },
    { label: "Audit", path: "", active: false },
    { label: "Audit Management", path: "/admin/audit", active: true },
  ],
};

/**
 * 현재 페이지의 Breadcrumb 항목
 */
const currentBreadcrumbs = computed(() => {
  return (
    breadcrumbMap[route.path] || [
      { label: "Admin", path: "/admin", active: true },
    ]
  );
});

/**
 * 배포 버튼 클릭 핸들러
 *
 * 실제 배포 로직은 서비스 호출로 구현
 */
async function handleDeploy(): Promise<void> {
  isDeploying.value = true;
  deployProgress.value = 0;

  try {
    // 배포 시뮬레이션
    for (let i = 0; i <= 100; i += 10) {
      deployProgress.value = i;
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    // 배포 성공
    console.log("배포 완료!");
  } catch (error) {
    console.error("배포 실패:", error);
  } finally {
    isDeploying.value = false;
    deployProgress.value = 0;
  }
}

/**
 * 로그아웃 핸들러
 */
function handleLogout(): void {
  // 인증 상태 초기화
  localStorage.removeItem("auth-token");
  // 로그인 페이지로 이동
  router.push("/login");
}

/**
 * 사용자 정보 로드 (초기화 시)
 */
function loadUserInfo(): void {
  // 실제로는 API에서 가져오기
  const user = localStorage.getItem("user-name");
  if (user) {
    userName.value = user;
  }
}

/**
 * 컴포넌트 초기화
 */
loadUserInfo();
</script>

<style scoped lang="scss">
/**
 * 어드민 레이아웃 스타일
 * 
 * 2단 레이아웃:
 * - Header (상단)
 * - Sidebar (좌측) + Main Content (우측)
 */

.admin-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
  overflow: hidden;
}

/**
 * 레이아웃 바디 (사이드바 + 메인 콘텐츠)
 */
.layout-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  background-color: #fafafa;

  /**
   * Vue3에서 :deep() 사용 예시
   * 자식 컴포넌트의 스타일을 오버라이드할 때 사용
   */
}

/**
 * 메인 콘텐츠 영역
 */
.layout-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  /**
   * 스크롤바 커스터마이징
   * 
   * -webkit-scrollbar는 Chrome, Safari, Edge에서 작동
   * Firefox는 scrollbar-width, scrollbar-color 사용
   */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d9d9d9;
    border-radius: 4px;
    transition: background-color 0.3s ease;

    &:hover {
      background: #bfbfbf;
    }
  }
}

/**
 * 콘텐츠 래퍼
 */
.content-wrapper {
  padding: 24px;
  min-height: 100%;

  /**
   * 최대 너비 제한 (데스크톱에서 콘텐츠가 너무 넓어지는 것 방지)
   */
  @media (min-width: 1600px) {
    padding: 32px;
  }
}

/**
 * 페이지 전환 애니메이션
 * 
 * Vue3의 <Transition> 컴포넌트 사용
 * 
 * Vue2와의 차이점:
 * - Vue2: <transition> (소문자, 스코프 없음)
 * - Vue3: <Transition> (대문자, 더 명확함)
 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/**
 * 반응형 디자인
 */
@media (max-width: 768px) {
  .layout-body {
    position: relative;
  }

  .layout-content {
    width: 100%;
  }

  .content-wrapper {
    padding: 16px;
  }
}

/**
 * 다크 모드 대응 (향후 추가 가능)
 */
@media (prefers-color-scheme: dark) {
  .admin-layout {
    background-color: #141414;
  }

  .layout-body {
    background-color: #1f1f1f;
  }

  .layout-content {
    &::-webkit-scrollbar-track {
      background: #262626;
    }

    &::-webkit-scrollbar-thumb {
      background: #434343;

      &:hover {
        background: #595959;
      }
    }
  }
}
</style>
