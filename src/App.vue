<template>
  <!-- 
    App.vue - 최상위 컴포넌트
    
    구조:
    - <a-config-provider>: Ant Design Vue 전역 설정
      - getPopupContainer: 모달, 드롭다운, 팝오버 등의 팝업 렌더링 위치 설정
    - <router-view>: 현재 라우트에 해당하는 컴포넌트 렌더링
    
    라우팅 흐름:
    /admin/contents → Contents.vue
    /admin/logo → Logo.vue
    /admin/color-palette → ColorPalette.vue
    
    Layout.vue는 /admin 경로의 children에 포함되므로,
    Layout.vue 내부의 <router-view>에 위 컴포넌트들이 렌더링됩니다.
    
    Vue3 vs Vue2:
    - Vue2: <v-app> 또는 루트 요소로 감싸기
    - Vue3: <a-config-provider>로 감싸기 (Ant Design Vue 권장)
  -->
  <a-config-provider :get-popup-container="getPopupContainer">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
/**
 * App.vue - 최상위 애플리케이션 컴포넌트
 *
 * Ant Design Vue ConfigProvider 설정:
 * - getPopupContainer: 팝업 컨테이너 위치 지정
 *
 * Vue3 특징:
 * - <script setup lang="ts">: 최신 문법
 * - 자동으로 최상위 스코프로 export
 *
 * Vue2 vs Vue3:
 * - Vue2: export default { name: 'App', ... }
 * - Vue3: <script setup>은 name, props 등을 명시적으로 선언
 */

import { useRouter } from "vue-router";

/**
 * 라우터 인스턴스 (라우트 정보 접근용)
 */
const router = useRouter();

/**
 * Ant Design Vue 팝업 컨테이너 설정
 *
 * 기능:
 * - Modal, Dropdown, Tooltip 등의 팝업을 어느 요소 내에서 렌더링할지 지정
 * - 일반적으로 #app 요소로 설정
 * - 스크롤 및 위치 계산이 올바르게 동작하도록 함
 *
 * Vue3에서 ConfigProvider 사용 방법:
 * <a-config-provider :get-popup-container="getPopupContainer">
 *   <component-with-modals />
 * </a-config-provider>
 */
const getPopupContainer = (): HTMLElement => {
  // document.body에 팝업 렌더링 (모든 모달/드롭다운이 body 직하위에 렌더됨)
  return document.body;
};

/**
 * 개발 환경에서만 라우트 정보 로깅
 */
if (import.meta.env.DEV) {
  console.log("🚀 Biz AI Admin Portal 앱 초기화");
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
