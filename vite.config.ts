import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Vite 설정 파일
 * Vue3 + TypeScript 프로젝트
 */

// __dirname 정의
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      // ✅ __dirname 사용처
      "@": path.resolve(__dirname, "./src"),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/styles/variables" as *;
          @use "@/styles/mixins" as *;
        `,
      },
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "ant-design": ["ant-design-vue"],
          "vue-core": ["vue", "vue-router"],
          pinia: ["pinia"],
        },

        // ✅ assetInfo.name이 undefined일 수 있으므로 체크
        assetFileNames: (assetInfo) => {
          // assetInfo.name이 undefined일 수 있으므로 기본값 설정
          const name = assetInfo.name ?? "asset";

          // 파일 타입별로 다른 폴더로 분류
          if (/\.(png|jpe?g|gif|svg|webp)$/.test(name)) {
            return "images/[name]-[hash][extname]";
          } else if (/\.(ttf|otf|eot|woff2?)$/.test(name)) {
            return "fonts/[name]-[hash][extname]";
          } else if (/\.css$/.test(name)) {
            return "css/[name]-[hash][extname]";
          }
          return "[name]-[hash][extname]";
        },
      },
    },

    chunkSizeWarningLimit: 600,
    sourcemap: false,
    minify: "terser",
    cssCodeSplit: true,
  },

  server: {
    port: 5173,
    strictPort: false,
    open: true,
  },
});
