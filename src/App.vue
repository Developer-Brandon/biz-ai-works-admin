<template>
  <!-- 
    App.vue - 최상위 컴포넌트
    
    구조:
    <router-view>는 현재 라우트에 해당하는 컴포넌트를 렌더링합니다.
    
    /admin/contents → Contents.vue 렌더링
    /admin/logo → Logo.vue 렌더링
    /admin/color-palette → ColorPalette.vue 렌더링
    
    Layout.vue는 /admin 경로의 children에 포함되므로,
    Layout.vue 내부의 <router-view>에 위 컴포넌트들이 렌더링됩니다.
  -->
  <router-view />
</template>

<script setup lang="ts">
/**
 * App.vue
 *
 * Vue3 특징:
 * - <script setup lang="ts">: 최신 문법
 * - 자동으로 최상위 스코프로 export
 * - 수동 return 객체 작성 불필요
 *
 * Vue2 vs Vue3:
 * - Vue2: export default { name: 'App', ... }
 * - Vue3: <script setup>은 name, props 등을 명시적으로 선언
 */
import { useRouter } from "vue-router";

// 라우터 인스턴스 (라우트 정보 접근용)
const router = useRouter();

// 개발 환경에서만 라우트 정보 로깅
if (import.meta.env.DEV) {
  console.log("📍 현재 라우트:", router.currentRoute.value);
}
</script>

<style scoped lang="scss">
/**
 * App.vue 스타일
 * 
 * <router-view>는 페이지 컴포넌트를 렌더링하므로,
 * 일반적으로 App.vue에는 전역 스타일만 정의합니다.
 * 
 * 각 페이지의 스타일은 개별 컴포넌트 파일에서 정의합니다.
 */

:global(body) {
  margin: 0;
  padding: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  background: #f5f7fa;
}

:global(#app) {
  width: 100%;
  min-height: 100vh;
}
</style>
