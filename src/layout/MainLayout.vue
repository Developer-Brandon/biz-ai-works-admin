<template>
  <div class="admin-layout">
    <!-- Header에서 Breadcrumb은 제거 -->
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
          <!-- ✅ 이렇게 수정! -->
          <div class="header__breadcrumb-wrapper">
            <Breadcrumb :items="breadcrumbItems" />
          </div>

          <router-view v-slot="{ Component }">
            <Transition name="fade-slide" mode="out-in">
              <template v-if="Component">
                <div style="width: 100%; background: white">
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
import Breadcrumb from "@/components/Breadcrumb.vue";
import type { BreadcrumbItem } from "@/types";

const route = useRoute();
const router = useRouter();
const isDeploying = ref(false);
const deployProgress = ref(0);
const userName = ref("Admin User");

const canDeploy = computed(() => !isDeploying.value);
const currentPath = computed(() => route.path);

/**
 * ✅ 실제 데이터인 breadcrumbItems
 * BreadcrumbItem은 타입이고, breadcrumbItems는 데이터입니다!
 */
const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
  "/admin": [{ label: "Admin", path: "/", active: true }],
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
};

/**
 * ✅ 현재 경로에 맞는 breadcrumbItems 반환
 */
const breadcrumbItems = computed(() => {
  return (
    breadcrumbMap[route.path] || [
      { label: "Admin", path: "/admin", active: true },
    ]
  );
});

async function handleDeploy(): Promise<void> {
  isDeploying.value = true;
  deployProgress.value = 0;

  try {
    for (let i = 0; i <= 100; i += 10) {
      deployProgress.value = i;
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    console.log("배포 완료!");
  } catch (error) {
    console.error("배포 실패:", error);
  } finally {
    isDeploying.value = false;
    deployProgress.value = 0;
  }
}

function handleLogout(): void {
  localStorage.removeItem("auth-token");
  router.push("/login");
}
</script>

<style scoped lang="scss">
/* 기존 스타일 동일 */
.admin-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
  overflow: hidden;
}

.layout-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  background: linear-gradient(to bottom, #f5f5f5, #eaeaea);
}

.layout-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  margin-left: 220px;
  width: calc(100% - 220px);
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

.content-wrapper {
  padding: 24px;
  min-height: 100%;

  @media (min-width: 1600px) {
    padding: 32px;
  }
}

/**
 * ✅ Breadcrumb 래퍼 스타일 추가
 */
.header__breadcrumb-wrapper {
  padding: 0 0 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

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
    margin-left: 0;
  }

  .content-wrapper {
    padding: 16px;
  }
}
</style>
