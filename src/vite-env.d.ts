/// <reference types="vite/client" />

/**
 * Vue 컴포넌트 타입 정의
 */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

/**
 * Vite 환경변수 타입 정의
 *
 * import.meta.env를 사용할 때 TypeScript가 인식하도록 함
 */
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_VERSION: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_WEBSOCKET_URL: string;
  readonly VITE_WEBSOCKET_PORT: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

/**
 * ImportMeta 인터페이스 확장
 */
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
