/**
 * Auth Store (Pinia)
 *
 * 사용자 인증 정보와 토큰 관리
 * localStorage 자동 저장 (pinia-plugin-persistedstate)
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";

/**
 * 인증 상태 인터페이스
 */
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  email: string | null;
  isInitialPassword: boolean;
  savedEmail: string | null;
}

export const useAuthStore = defineStore(
  "auth",
  () => {
    // ========== State (상태) ==========

    /**
     * Access Token (JWT)
     *
     * API 요청 시 Authorization 헤더에 포함됨
     * 만료 시간: 보통 1시간
     */
    const accessToken = ref<string | null>(null);

    /**
     * Refresh Token
     *
     * Access Token 만료 시 새 토큰 발급용
     * 만료 시간: 보통 7일 또는 30일
     */
    const refreshToken = ref<string | null>(null);

    /**
     * 사용자 이메일
     */
    const email = ref<string | null>(null);

    /**
     * 초기 비밀번호 여부
     *
     * true: 첫 로그인 후 비밀번호 변경 필요
     * false: 일반 사용자
     */
    const isInitialPassword = ref(false);

    /**
     * 저장된 이메일 (아이디 저장 체크 시)
     */
    const savedEmail = ref<string | null>(null);

    // ========== Getters (계산된 속성) ==========

    /**
     * 로그인 여부
     *
     * Access Token이 있으면 로그인 상태
     */
    const isLoggedIn = computed(() => !!accessToken.value);

    /**
     * 현재 사용자 정보
     */
    const user = computed(() => ({
      email: email.value,
      isInitialPassword: isInitialPassword.value,
    }));

    /**
     * Authorization 헤더 값
     */
    const authHeader = computed(() => {
      if (!accessToken.value) return null;
      return `Bearer ${accessToken.value}`;
    });

    // ========== Actions (메서드) ==========

    /**
     * 인증 정보 설정
     *
     * @param authData - 인증 정보
     */
    function setAuthData(authData: Partial<AuthState>): void {
      if (authData.accessToken !== undefined) {
        accessToken.value = authData.accessToken;
      }
      if (authData.refreshToken !== undefined) {
        refreshToken.value = authData.refreshToken;
      }
      if (authData.email !== undefined) {
        email.value = authData.email;
      }
      if (authData.isInitialPassword !== undefined) {
        isInitialPassword.value = authData.isInitialPassword;
      }

      console.log("✅ 인증 정보 설정 완료", {
        email: email.value,
        hasAccessToken: !!accessToken.value,
        hasRefreshToken: !!refreshToken.value,
      });
    }

    /**
     * 저장된 이메일 로드
     *
     * localStorage에서 저장된 이메일을 복원
     */
    function loadSavedEmail(): void {
      const saved = localStorage.getItem("savedEmail");
      if (saved) {
        savedEmail.value = saved;
        console.log("📧 저장된 이메일 로드:", saved);
      }
    }

    /**
     * 이메일 저장 (아이디 저장)
     *
     * @param emailToSave - 저장할 이메일
     */
    function saveEmail(emailToSave: string): void {
      savedEmail.value = emailToSave;
      localStorage.setItem("savedEmail", emailToSave);
      console.log("💾 이메일 저장:", emailToSave);
    }

    /**
     * 저장된 이메일 삭제
     */
    function clearSavedEmail(): void {
      savedEmail.value = null;
      localStorage.removeItem("savedEmail");
      console.log("🗑️ 저장된 이메일 삭제");
    }

    /**
     * 로그아웃
     */
    function logout(): void {
      accessToken.value = null;
      refreshToken.value = null;
      email.value = null;
      isInitialPassword.value = false;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userEmail");

      console.log("👋 로그아웃 완료");
    }

    /**
     * 세션 복구
     *
     * 페이지 새로고침 시 localStorage에서 토큰 복원
     */
    function restoreSession(): void {
      const savedAccessToken = localStorage.getItem("accessToken");
      const savedRefreshToken = localStorage.getItem("refreshToken");
      const savedUserEmail = localStorage.getItem("userEmail");

      if (savedAccessToken && savedRefreshToken) {
        setAuthData({
          accessToken: savedAccessToken,
          refreshToken: savedRefreshToken,
          email: savedUserEmail || undefined,
          isInitialPassword: false,
        });
        console.log("✅ 세션 복구 완료");
      } else {
        console.log("⚠️ 저장된 세션 없음");
      }
    }

    /**
     * Access Token 갱신
     *
     * Refresh Token을 사용하여 새로운 Access Token 발급
     *
     * @param newAccessToken - 새로운 Access Token
     */
    function updateAccessToken(newAccessToken: string): void {
      accessToken.value = newAccessToken;
      localStorage.setItem("accessToken", newAccessToken);
      console.log("🔄 Access Token 갱신 완료");
    }

    return {
      // State
      accessToken,
      refreshToken,
      email,
      isInitialPassword,
      savedEmail,

      // Getters
      isLoggedIn,
      user,
      authHeader,

      // Actions
      setAuthData,
      loadSavedEmail,
      saveEmail,
      clearSavedEmail,
      logout,
      restoreSession,
      updateAccessToken,
    };
  },
  {
    // ✅ persist 옵션을 직접 배열로 설정 (paths 없음)
    persist: [
      {
        key: "auth-store",
        storage: localStorage,
      },
    ],
  },
);

export type AuthStore = ReturnType<typeof useAuthStore>;
