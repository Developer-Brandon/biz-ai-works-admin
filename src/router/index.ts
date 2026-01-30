/**
 * src/router/index.ts - Vue Router 설정
 *
 * Vue3 라우터 특징:
 * - createRouter(): 라우터 인스턴스 생성
 * - createWebHistory(): HTML5 History API 기반 (권장)
 * - RouteRecordRaw: 라우트 타입 정의
 *
 * Vue2 vs Vue3 라우터:
 * - Vue2: new Router(), Vue.use(Router)
 * - Vue3: createRouter(), app.use(router)
 */

import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Layout from "@/components/layout/Layout.vue";
import Contents from "@/views/contents/Contents.vue";
import Logo from "@/views/logo/Logo.vue";
import ColorPalette from "@/views/color-palette/ColorPalette.vue";

/**
 * 라우트 배열 정의
 *
 * 구조:
 * - path: URL 경로
 * - component: 렌더링할 Vue 컴포넌트
 * - name: 프로그래밍 네비게이션 시 사용 (router.push({ name: 'Contents' }))
 * - meta: 라우트 메타데이터 (제목, 권한, breadcrumb 등)
 * - children: 중첩 라우트 (layout 내부의 페이지들)
 */
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/admin/contents",
  },

  {
    path: "/admin",
    component: Layout,
    meta: {
      title: "Admin",
      requiresAuth: true,
    },
    children: [
      {
        path: "contents",
        component: Contents,
        name: "Contents",
        meta: {
          title: "Service Custom > Contents",
          breadcrumb: [
            { label: "Admin", to: "/admin" },
            { label: "Service Custom", to: "/admin" },
            { label: "Contents", to: "/admin/contents" },
          ],
        },
      },

      {
        path: "logo",
        component: Logo,
        name: "Logo",
        meta: {
          title: "Service Custom > Logo",
          breadcrumb: [
            { label: "Admin", to: "/admin" },
            { label: "Service Custom", to: "/admin" },
            { label: "Logo", to: "/admin/logo" },
          ],
        },
      },

      {
        path: "color-palette",
        component: ColorPalette,
        name: "ColorPalette",
        meta: {
          title: "Service Custom > Color palette",
          breadcrumb: [
            { label: "Admin", to: "/admin" },
            { label: "Service Custom", to: "/admin" },
            { label: "Color palette", to: "/admin/color-palette" },
          ],
        },
      },
    ],
  },

  {
    path: "/:pathMatch(.*)*",
    redirect: "/admin/contents",
  },
];

/**
 * 라우터 인스턴스 생성
 *
 * createRouter() 매개변수:
 * - history: 히스토리 모드 설정
 *   - createWebHistory(): HTML5 History API (권장) - URL이 깔끔함
 *   - createHashHistory(): Hash 기반 (#포함) - 옛날 방식
 * - routes: 라우트 배열
 * - linkActiveClass: 활성 링크 클래스명
 * - linkExactActiveClass: 정확한 활성 링크 클래스명
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

/**
 * 라우터 가드: beforeEach
 *
 * 네비게이션이 발생하기 전에 실행됨
 *
 * 매개변수:
 * - to: 이동할 라우트 정보
 * - from: 현재 라우트 정보
 * - next: 네비게이션 진행 함수 (Vue2 방식, Vue3에서는 선택사항)
 *
 * Vue3에서는 boolean이나 RouteLocationRaw를 반환 가능:
 * - true: 네비게이션 진행
 * - false: 네비게이션 취소
 * - RouteLocationRaw: 다른 경로로 리다이렉트
 */
router.beforeEach((to, from, next) => {
  const title = to.meta.title as string | undefined;
  if (title) {
    document.title = `${title} - Biz AI Admin`;
  }

  next();
});

/**
 * 라우터 가드: afterEach
 *
 * 네비게이션이 완료된 후에 실행됨
 * 로깅, 분석, 스크롤 초기화 등에 사용
 */
router.afterEach((to, from) => {
  window.scrollTo(0, 0);

  if (import.meta.env.DEV) {
    console.log(`[Router] ${from.path} → ${to.path}`);
  }
});

/**
 * 기본 내보내기
 *
 * main.ts에서: import router from '@/router'
 * 이렇게 사용됨
 */
export default router;
