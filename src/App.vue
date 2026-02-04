<template>
  <component :is="currentLayout" />
</template>

<script setup lang="ts">
import { onBeforeMount, computed, onMounted, ref, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTestAuthStore } from "@/stores/useTestAuthStore";
import { autoLogin } from "@/services/autoLoginService";
import MainLayout from "@/layout/MainLayout.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const testAuthStore = useTestAuthStore();
const isLoading = ref(false);

/**
 * Layout 컴포넌트 매핑
 */
const layoutComponents = {
  MainLayout,
};

/**
 * 현재 렌더링할 Layout 컴포넌트
 */
const currentLayout = computed(() => {
  const layoutName = route.meta.layout as string | undefined;
  console.log("📍 현재 route:", route.path);
  console.log("🎨 현재 layout:", layoutName);
  console.log("🔒 로그인 상태:", authStore.isLoggedIn);

  if (!layoutName) {
    console.warn("⚠️ layout이 정의되지 않았습니다!");
    return undefined;
  }

  const layout = layoutComponents[layoutName as keyof typeof layoutComponents];
  if (!layout) {
    console.warn(`⚠️ 존재하지 않는 layout: ${layoutName}`);
    return undefined;
  }

  return layout;
});

onBeforeMount(() => {
  isLoading.value = true;
});

/**
 * App 초기화
 *
 * Vue3 Composition API:
 * - onMounted: 컴포넌트 마운트 후 실행
 * - async/await: 비동기 처리
 */
onMounted(async () => {
  console.log("🚀 ============================================");
  console.log("🚀 App.vue 초기화 시작");
  console.log("🚀 ============================================");

  try {
    // 1. 세션 복구
    console.log("🔐 세션 복구 시도...");
    // authStore.restoreSession();

    // 2. 자동 로그인
    console.log("🔐 자동 로그인 시도...");
    const isLoggedIn = await autoLogin(authStore, testAuthStore);

    // 3. 라우팅 (비동기 완료 대기!)
    console.log("🧭 라우팅 처리 중...");
    await nextTick();

    if (isLoggedIn && route.path === "/login") {
      console.log("✅ 로그인 완료, 메인 페이지로 이동");
      // ✅ router.push 결과를 await!
      await router.push("/");
    } else if (!isLoggedIn && route.path !== "/login") {
      console.log("⚠️ 로그인 필요, 로그인 페이지로 이동");
      await router.push("/login");
    }

    // 라우팅 완료 후 다시 대기
    await nextTick();

    console.log("🎉 ============================================");
    console.log("🎉 앱 초기화 완료!");
    console.log("📍 현재 경로:", router.currentRoute.value.path);
    console.log("🔑 로그인 상태:", authStore.isLoggedIn);
    console.log("👤 사용자:", authStore.user);
    console.log("🎨 현재 layout:", currentLayout.value?.name || "none");
    console.log("🎉 ============================================");
  } catch (error) {
    console.error("❌ 앱 초기화 중 오류:", error);
    router.push("/login");
  } finally {
    isLoading.value = false;
  }
});
</script>
