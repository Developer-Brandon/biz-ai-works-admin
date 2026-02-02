<template>
  <div class="admin-layout">
    <Header
      :is-deploying="isDeploying"
      :deploy-progress="deployProgress"
      :user-name="userName"
      :can-deploy="canDeploy"
      @deploy="handleDeploy"
      @logout="handleLogout"
    />

    <div class="layout-body">
      <Sidebar :current-path="currentPath" />
      <main class="layout-content">
        <div class="content-wrapper">
          <router-view v-slot="{ Component }">
            <Transition name="fade-slide" mode="out-in">
              <!-- Component 렌더링 확인 -->
              <template v-if="Component">
                <div style="width: 100%; background: white">
                  <!-- 디버깅: 배경색을 흰색으로 설정하면 렌더링 확인 가능 -->
                  <component :is="Component" :key="$route.path" />
                </div>
              </template>
              <template v-else>
                <div style="padding: 20px; color: red; background: yellow">
                  ⚠️ Component를 찾을 수 없습니다: {{ $route.path }}
                </div>
              </template>
            </Transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Header from "./Header.vue";
import Sidebar from "./Sidebar.vue";

const route = useRoute();
const router = useRouter();
const isDeploying = ref(false);
const deployProgress = ref(0);
const userName = ref("Admin User");

/**
 * 배포 가능 여부 (실제로는 스토어에서 가져올 수 있음)
 */
const canDeploy = computed(() => !isDeploying.value);

/**
 * 현재 경로
 */
const currentPath = computed(() => route.path);

/**
 * 배포 버튼 클릭 핸들러
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
  localStorage.removeItem("auth-token");
  router.push("/login");
}
</script>

<style scoped lang="scss">
/**
 * 어드민 레이아웃 스타일
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
  background: linear-gradient(to bottom, #f5f5f5, #eaeaea);
}

/**
 * 메인 콘텐츠 영역
 * 
 * ✅ Sidebar가 position: fixed이므로
 * content에 margin-left를 주어야 함!
 */
.layout-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  margin-left: 220px; /* Sidebar 너비 */
  width: calc(100% - 220px); /* 유효한 너비 */
  position: relative;
  z-index: 1;
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

  @media (min-width: 1600px) {
    padding: 32px;
  }
}

/**
 * 페이지 전환 애니메이션
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
@media (max-width: 1024px) {
  .layout-content {
    margin-left: 200px;
    width: calc(100% - 200px);
  }
}

@media (max-width: 768px) {
  .layout-body {
    position: relative;
  }

  .layout-content {
    width: 100%;
    margin-left: 0; /* 모바일에서는 여백 제거 */
  }

  .content-wrapper {
    padding: 16px;
  }
}
</style>
