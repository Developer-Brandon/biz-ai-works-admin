/**
 * Pinia 스토어 초기화
 *
 * pinia-plugin-persistedstate:
 * - 스토어의 상태를 localStorage에 자동 저장
 * - 페이지 새로고침 후에도 상태 복구
 */

import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();

// Persistence 플러그인 추가
pinia.use(piniaPluginPersistedstate);

export default pinia;
