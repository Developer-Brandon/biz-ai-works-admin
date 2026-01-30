/**
 * main.ts - 애플리케이션 진입점
 *
 * Vue3에서:
 * - createApp(): Vue 애플리케이션 인스턴스 생성
 * - app.use(): 플러그인 등록 (라우터, 상태 관리 등)
 * - app.mount(): DOM에 마운트
 *
 * Vue2 vs Vue3:
 * - Vue2: new Vue() + Vue.use(Plugin)
 * - Vue3: createApp() + app.use(plugin)
 *
 * 플러그인 등록 순서:
 * 1. 라이브러리 플러그인 (Ant Design Vue, Icons)
 * 2. 상태 관리 (Pinia)
 * 3. 라우터 (Vue Router)
 * 4. 앱 마운트
 */

import { createApp } from "vue";
import App from "./App.vue";
import pinia from "./stores";
import router from "./router";
import Antd from "ant-design-vue";
import * as Icons from "@ant-design/icons-vue";
import "./styles/global.scss";

/**
 * Vue 애플리케이션 생성
 */
const app = createApp(App);

/**
 * Ant Design Vue 플러그인 등록
 *
 * 기능:
 * - a-button, a-input, a-modal 등의 컴포넌트 자동 등록
 * - 기본 스타일 로드
 */
app.use(Antd);

/**
 * Ant Design Vue 아이콘 등록
 *
 * 사용 방법:
 * - <CheckCircleOutlined /> (직접 import 필요)
 * 또는
 * - <CheckCircleOutlined /> (전역 등록 후 사용 가능)
 *
 * 전역 등록은 메모리 사용량이 많으므로,
 * 필요한 아이콘만 import해서 사용 권장
 */
Object.entries(Icons).forEach(([key, component]) => {
  app.component(key, component);
});

/**
 * Pinia 상태 관리 플러그인 등록
 *
 * 기능:
 * - 전역 상태 관리
 * - localStorage 자동 동기화 (pinia-plugin-persistedstate)
 * - 컴포넌트에서 useStore() 사용 가능
 */
app.use(pinia);

/**
 * Vue Router 플러그인 등록
 *
 * 기능:
 * - 라우트 기반 페이지 네비게이션
 * - 라우터 가드 (beforeEach, afterEach)
 * - <router-view> 자동 렌더링
 *
 * Vue3 라우터 가드:
 * - router.beforeEach((to, from, next) => {})
 * - router.afterEach((to, from) => {})
 */
app.use(router);

/**
 * DOM에 마운트
 *
 * public/index.html의 <div id="app"></div>에 마운트
 */
app.mount("#app");

/**
 * 개발 환경에서 로깅
 */
if (import.meta.env.DEV) {
  console.log("🚀 Biz AI Admin Portal 시작됨");
  console.log("📍 라우터:", router);
  console.log("💾 Pinia:", pinia);
}
