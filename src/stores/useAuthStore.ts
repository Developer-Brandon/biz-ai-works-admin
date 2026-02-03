/**
 * Auth Store (Pinia)
 *
 * 사용자 인증 정보와 토큰 관리
 * localStorage 자동 저장 (pinia-plugin-persistedstate)
 *
 * Vue 2 vs Vue 3 비교:
 * - Vue 2: mutations + state (명령형)
 * - Vue 3: composition API + action (함수형)
 * Vue 3 Composition API는 더 간단하고 직관적입니다
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";

/**
 * 인증 상태 인터페이스
 *
 * 이 인터페이스의 모든 필드는 Pinia persistence를 통해 자동 저장됩니다
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
     * 
     * Pinia persistence가 자동으로 localStorage에 저장합니다
     */
    const accessToken = ref<string | null>(null);

    /**
     * Refresh Token
     *
     * Access Token 만료 시 새 토큰 발급용
     * 만료 시간: 보통 7일 또는 30일
     * 
     * Pinia persistence가 자동으로 localStorage에 저장합니다
     */
    const refreshToken = ref<string | null>(null);

    /**
     * 사용자 이메일
     * 
     * Pinia persistence가 자동으로 localStorage에 저장합니다
     */
    const email = ref<string | null>(null);

    /**
     * 초기 비밀번호 여부
     *
     * true: 첫 로그인 후 비밀번호 변경 필요
     * false: 일반 사용자
     * 
     * Pinia persistence가 자동으로 localStorage에 저장합니다
     */
    const isInitialPassword = ref(false);

    /**
     * 저장된 이메일 (아이디 저장 체크 시)
     * 
     * Pinia persistence가 자동으로 localStorage에 저장합니다
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
     *
     * API 요청 시 사용됨
     * 예: "Bearer eyJhbGciOiJIUzI1NiIs..."
     */
    const authHeader = computed(() => {
      if (!accessToken.value) return null;
      return `Bearer ${accessToken.value}`;
    });

    /**
     * Refresh Token 존재 여부
     *
     * 토큰 갱신 가능 여부 판단용
     */
    const hasRefreshToken = computed(() => !!refreshToken.value);

    // ========== Actions (메서드) ==========

    /**
     * 인증 정보 일괄 설정
     *
     * 로그인 성공 후 호출됩니다
     * Pinia persistence가 자동으로 이 값들을 localStorage에 저장합니다
     *
     * @param authData - 인증 정보
     *
     * 사용 예시:
     * ```typescript
     * const authStore = useAuthStore()
     * authStore.setAuthData({
     *   accessToken: 'eyJhbGc...',
     *   refreshToken: 'eyJhbGc...',
     *   email: 'user@example.com',
     *   isInitialPassword: false
     * })
     * ```
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
      if (authData.savedEmail !== undefined) {
        savedEmail.value = authData.savedEmail;
      }

      console.log("✅ 인증 정보 설정 완료 (Pinia persistence가 자동 저장)", {
        email: email.value,
        hasAccessToken: !!accessToken.value,
        hasRefreshToken: !!refreshToken.value,
        savedEmail: savedEmail.value,
      });
    }

    /**
     * 아이디 저장
     *
     * localStorage가 아닌 Pinia state를 통해서만 관리합니다
     * Pinia persistence가 자동으로 저장합니다
     *
     * @param emailToSave - 저장할 이메일
     */
    function saveEmail(emailToSave: string): void {
      savedEmail.value = emailToSave;
      console.log("💾 이메일 저장됨 (Pinia persistence로 자동 저장):", emailToSave);
    }

    /**
     * 저장된 이메일 삭제
     *
     * localStorage 직접 접근 제거
     * Pinia persistence가 자동으로 처리합니다
     */
    function clearSavedEmail(): void {
      savedEmail.value = null;
      console.log("🗑️ 저장된 이메일 삭제됨");
    }

    /**
     * Access Token만 갱신
     *
     * 토큰 갱신 시 사용됩니다
     * Pinia persistence가 자동으로 저장합니다
     *
     * @param newAccessToken - 새로운 Access Token
     */
    function updateAccessToken(newAccessToken: string): void {
      accessToken.value = newAccessToken;
      console.log("🔄 Access Token 갱신됨 (Pinia persistence로 자동 저장)");
    }

    /**
     * 로그아웃
     *
     * 모든 인증 정보를 초기화합니다
     * Pinia persistence가 자동으로 localStorage를 업데이트합니다
     *
     * 주의: localStorage.removeItem() 직접 호출 금지!
     * Pinia state를 null로 설정하면 persistence가 자동 처리합니다
     */
    function logout(): void {
      accessToken.value = null;
      refreshToken.value = null;
      email.value = null;
      isInitialPassword.value = false;
      // savedEmail은 유지 (아이디 저장 기능)

      console.log("👋 로그아웃 완료 (Pinia persistence로 자동 저장)");
    }

    /**
     * 강제 로그아웃 (세션 만료 등)
     *
     * savedEmail도 함께 초기화합니다
     */
    function forceLogout(): void {
      accessToken.value = null;
      refreshToken.value = null;
      email.value = null;
      isInitialPassword.value = false;
      savedEmail.value = null;

      console.log("🚨 강제 로그아웃 (세션 만료)");
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
      hasRefreshToken,

      // Actions
      setAuthData,
      saveEmail,
      clearSavedEmail,
      updateAccessToken,
      logout,
      forceLogout,
    };
  },
  {
    /**
     * Pinia persistence 설정
     *
     * 이 설정으로 인해 아래의 모든 state가 자동으로 localStorage에 저장됩니다
     * 설정을 따로 하지 않으면 전체 state가 저장됩니다
     */
    persist: {
      key: "auth-store",
      storage: localStorage,
      // paths를 명시하면 특정 필드만 저장 가능
      // 예: paths: ['accessToken', 'refreshToken', 'email', 'savedEmail']
    },
  },
);

export type AuthStore = ReturnType<typeof useAuthStore>;