<template>
  <header class="header">
    <!-- 헤더 컨테이너 -->
    <div class="header__container">
      <!-- 좌측: 로고 -->
      <div class="header__logo">
        <img
          src="@/assets/vue.svg"
          alt="Biz AI Works"
          class="header__logo-image"
        />
        <span class="header__logo-text">Biz AI Works</span>
      </div>

      <!-- 우측: 사용자 메뉴 -->
      <div class="header__actions">
        <!-- 사용자 정보 -->
        <div class="header__user">
          <span class="header__user-name">관리자</span>
          <a-dropdown>
            <template #overlay>
              <a-menu @click="handleMenuClick">
                <a-menu-item key="profile">
                  <UserOutlined />
                  프로필
                </a-menu-item>
                <a-menu-item key="settings">
                  <SettingOutlined />
                  설정
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout">
                  <LogoutOutlined />
                  로그아웃
                </a-menu-item>
              </a-menu>
            </template>
            <button class="header__user-button">
              <UserOutlined class="header__user-icon" />
            </button>
          </a-dropdown>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * Header.vue - 어드민 헤더 컴포넌트
 *
 * 기능:
 * - 로고 표시
 * - 사용자 메뉴 (프로필, 로그아웃 등)
 *
 * Props: 없음
 * Emits: 없음
 *
 * 사용 위치:
 * - Layout.vue의 최상단에서 사용
 *
 * Vue3 vs Vue2:
 * - Vue2: export default { methods: { ... } }
 * - Vue3: <script setup>에서 함수 직접 정의
 */

import { useRouter } from "vue-router";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons-vue";

// 라우터 인스턴스
const router = useRouter();

/**
 * 사용자 메뉴 클릭 핸들러
 *
 * @param e - Ant Design의 Menu 이벤트 객체
 */
const handleMenuClick = (e: any) => {
  const key = e.key;

  switch (key) {
    case "profile":
      console.log("프로필 클릭");
      break;
    case "settings":
      console.log("설정 클릭");
      break;
    case "logout":
      console.log("로그아웃");
      localStorage.removeItem("token");
      router.push("/login");
      break;
    default:
      break;
  }
};
</script>

<style scoped lang="scss">
/**
 * Header 스타일
 * 
 * SCSS 변수 및 믹스인은 vite.config.ts의 additionalData로 자동 주입됨
 * 따라서 @import 없이 바로 사용 가능
 */

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 좌측: 로고 */
.header__logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
}

.header__logo-image {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.header__logo-text {
  font-size: 14px;
  font-weight: 600;
}

/* 우측: 액션 버튼들 */
.header__actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

/* 사용자 메뉴 */
.header__user {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header__user-name {
  font-size: 12px;
  color: #8c8c8c;
  margin-right: 8px;
}

.header__user-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fafafa;
  color: #262626;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #1890ff;
    color: white;
    border-color: #1890ff;
  }

  &:active {
    transform: scale(0.95);
  }
}

.header__user-icon {
  width: 18px;
  height: 18px;
}

/* 반응형 */
@media (max-width: 768px) {
  .header__container {
    padding: 8px 16px;
  }

  .header__logo-text {
    display: none;
  }

  .header__user-name {
    display: none;
  }
}
</style>
