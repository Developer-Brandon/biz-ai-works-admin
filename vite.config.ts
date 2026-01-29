/**
 * vite.config.ts - Vite 빌드 도구 설정
 *
 * Vite 특징:
 * - ES 모듈 기반 번들러 (Webpack보다 빠름)
 * - HMR (Hot Module Replacement) 지원
 * - 개발 서버 자동 시작
 *
 * Vue3 + TypeScript 환경:
 * - @vitejs/plugin-vue: Vue3 SFC 지원
 * - 경로 별칭: @ → src/
 * - API 프록시: 개발 시 CORS 우회
 */

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";

/**
 * 파일 경로 분석
 *
 * import.meta.url: 현재 파일의 절대 경로 (ES 모듈)
 * fileURLToPath(): file:// URL을 일반 경로로 변환
 */
const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [vue()],

  /**
   * 별칭 (Alias) 설정
   *
   * 사용 방법:
   * import { Card } from '@/types'  // src/types/index.ts
   * import Layout from '@/components/layout/Layout.vue'  // src/components/layout/Layout.vue
   *
   * 장점:
   * - 상대 경로보다 명확함
   * - 폴더 구조 변경 시 영향 없음
   * - IDE 자동완성 지원
   */
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  /**
   * 개발 서버 설정
   *
   * npm run dev 실행 시 적용됨
   */
  server: {
    /**
     * 포트 설정
     *
     * 기본값: 5173
     * 우리는 3000으로 설정
     */
    port: 3000,

    /**
     * 호스트 설정
     *
     * 'localhost': 로컬에서만 접근 가능
     * '0.0.0.0': 모든 인터페이스에서 접근 가능
     */
    host: "localhost",

    /**
     * CORS 자동 로드
     */
    cors: true,

    /**
     * API 프록시 설정
     *
     * 개발 중 백엔드 API로 요청할 때 사용됨:
     * - /api/chat/rooms/list → http://172.190.116.61:18080/api/chat/rooms/list
     * - CORS 에러 우회 가능
     *
     * Swagger API 기본 URL:
     * - http://172.190.116.61:18080
     */
    proxy: {
      "/api": {
        target: "http://172.190.116.61:18080",
        changeOrigin: true,
        rewrite: (path) => path,
        /**
         * 개발 로깅
         */
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.error("❌ 프록시 에러:", err);
          });
        },
      },
    },

    /**
     * HMR (Hot Module Replacement) 설정
     *
     * 파일 변경 시 자동으로 페이지 갱신
     * 브라우저 개발자도구에서 상태 유지됨
     */
    hmr: {
      host: "localhost",
      port: 3000,
    },

    /**
     * 감시 파일 설정
     *
     * 이 파일들이 변경되면 자동 리로드
     */
    watch: {
      usePolling: false,
    },
  },

  /**
   * 빌드 설정
   *
   * npm run build 실행 시 적용됨
   */
  build: {
    /**
     * 출력 디렉토리
     *
     * 기본값: dist/
     */
    outDir: "dist",

    /**
     * 소스맵 생성
     *
     * true: 프로덕션에서도 디버깅 가능 (파일 크기 증가)
     * false: 프로덕션 최적화 (보안 향상)
     */
    sourcemap: false,

    /**
     * 청크 크기 경고 임계값
     *
     * 기본값: 500 KB
     * 초과 시 경고 출력
     */
    chunkSizeWarningLimit: 1000,

    /**
     * 롤업 옵션
     *
     * 번들 최적화 설정
     */
    rollupOptions: {
      output: {
        /**
         * 진입점 청크 이름
         */
        entryFileNames: "js/[name].[hash].js",

        /**
         * 라이브러리 청크 이름
         */
        chunkFileNames: "js/[name].[hash].js",

        /**
         * 자산 파일 이름
         */
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/png|jpe?g|gif|svg/i.test(ext)) {
            return `assets/images/[name].[hash][extname]`;
          }
          if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name].[hash][extname]`;
          }
          return `assets/[name].[hash][extname]`;
        },
      },
    },

    /**
     * 축소화 설정
     *
     * 'terser': JavaScript 압축 (기본값)
     * 'esbuild': 더 빠른 압축 (약간의 크기 증가)
     */
    minify: "terser",
  },

  /**
   * CSS 설정
   */
  css: {
    /**
     * CSS 전처리기 옵션
     */
    preprocessorOptions: {
      scss: {
        /**
         * 전역 변수/mixin 자동 로드
         *
         * 모든 SCSS 파일의 맨 처음에 자동으로 추가됨
         * @use 규칙과는 다르게 @import는 함께 사용 가능
         *
         * 장점:
         * - 각 컴포넌트에서 별도 import 불필요
         * - 변수/mixin을 즉시 사용 가능
         * - global.scss의 @import와 충돌 없음
         */
        additionalData: `@import "@/styles/variables.scss"; @import "@/styles/mixins.scss";`,
      },
    },
  },

  /**
   * 최적화 설정
   */
  optimizeDeps: {
    /**
     * 사전 번들링 모듈
     *
     * 개발 서버 시작 시 미리 번들링해서 로드 속도 향상
     */
    include: [
      "ant-design-vue",
      "@ant-design/icons-vue",
      "vue",
      "vue-router",
      "pinia",
      "pinia-plugin-persistedstate",
      "axios",
      "iro",
    ],
  },
});
