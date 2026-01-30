<template>
  <div class="layout">
    <!-- 헤더 -->
    <Header />

    <!-- 메인 컨테이너 -->
    <div class="layout__main">
      <!-- 사이드바 -->
      <Sidebar />

      <!-- 컨텐츠 영역 -->
      <main class="layout__content">
        <!-- 페이지 컴포넌트 렌더링 (라우터 뷰) -->
        <router-view v-slot="{ Component }">
          <!-- 페이지 전환 애니메이션 -->
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="$route.path" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Layout.vue - 어드민 레이아웃 컴포넌트
 *
 * 구조:
 * ┌─────────────────────────────┐
 * │      Header                 │ (고정)
 * ├──────────┬──────────────────┤
 * │          │                  │
 * │ Sidebar  │ <router-view>    │
 * │ (고정)   │ (페이지 컨텐츠)   │
 * │          │ (스크롤 가능)     │
 * │          │                  │
 * └──────────┴──────────────────┘
 *
 * Props: 없음
 * Emits: 없음
 *
 * 라우터 구조:
 * /admin (이 Layout 사용)
 *  ├── /admin/contents
 *  ├── /admin/logo
 *  └── /admin/color-palette
 *
 * Vue3 Composition API:
 * - Header, Sidebar 컴포넌트를 import해서 사용
 * - <component :is="Component"> 로 동적 컴포넌트 렌더링
 *
 * Vue2 vs Vue3:
 * - Vue2: components: { Header, Sidebar } 객체 정의
 * - Vue3: import로 자동 등록됨
 */

import Header from "./Header.vue";
import Sidebar from "./Sidebar.vue";
</script>

<style scoped lang="scss">
/**
 * Layout 스타일
 */

/**
 * 레이아웃 전체 구조
 * 
 * Flexbox 레이아웃:
 * - flex-direction: column (세로 배열)
 * - min-height: 100vh (최소 높이 전체 화면)
 */
.layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;
}

/**
 * 메인 컨테이너 (Header 아래)
 * 
 * flex: 1 → Header를 제외한 나머지 공간을 차지
 * overflow: hidden → 내부 스크롤 활성화 (하단 스크롤바 제거)
 */
.layout__main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/**
 * 컨텐츠 영역 (Sidebar 옆)
 * 
 * margin-left: 220px → Sidebar 너비만큼 여백
 * (Sidebar는 fixed 위치이므로 margin으로 공간 확보)
 * 
 * overflow-y: auto → 세로 스크롤 활성화
 * overflow-x: hidden → 가로 스크롤 비활성화
 */
.layout__content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-left: 220px;

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f0f0f0;
  }

  &::-webkit-scrollbar-thumb {
    background: #d9d9d9;
    border-radius: 4px;

    &:hover {
      background: #bfbfbf;
    }
  }
}

/**
 * 페이지 전환 애니메이션
 * 
 * Vue3 <transition> 컴포넌트:
 * - name="fade" → fade-enter-active, fade-leave-active 클래스 자동 생성
 * - mode="out-in" → 이전 페이지 사라진 후 새 페이지 나타남
 * 
 * 애니메이션 상태:
 * - enter: 페이지 나타날 때
 * - leave: 페이지 사라질 때
 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/**
 * 반응형 설정
 */
@media (max-width: 1024px) {
  .layout__content {
    margin-left: 200px;
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .layout__content {
    /* 모바일에서는 Sidebar 없으므로 margin 제거 */
    margin-left: 0;
    padding: 12px;
  }
}
</style>
