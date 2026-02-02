/**
 * 자동 로그인 서비스
 *
 * 기능:
 * - 페이지 새로고침 시 자동 로그인
 * - 토큰 유효성 검증
 * - 개발 환경에서만 테스트 계정으로 자동 로그인
 * - 프로덕션에서는 저장된 토큰 복구만 수행
 */

import { authApi } from "@/api/modules/authApi";
import type { AuthStore } from "@/stores/useAuthStore";
import type { TestAuthStore } from "@/stores/useTestAuthStore";

/**
 * 자동 로그인 실행
 *
 * 실행 순서:
 * 1. localStorage에서 저장된 토큰 확인
 * 2. 토큰이 있으면 인증 상태 복구
 * 3. 토큰이 없고 개발 환경이면 테스트 계정으로 자동 로그인
 * 4. 모두 실패하면 로그인 필요 상태로 반환
 *
 * 동작 흐름:
 * ```
 * autoLogin()
 *   ├─ 저장된 토큰 있음?
 *   │  └─ YES: 기존 토큰 복원 (return true)
 *   │  └─ NO: 다음 단계로
 *   │
 *   ├─ 개발 환경?
 *   │  └─ YES: 테스트 계정 로그인 시도
 *   │       ├─ 성공 (return true)
 *   │       └─ 실패 (return false)
 *   │  └─ NO: return false
 *   │
 *   └─ 모두 실패 (return false)
 * ```
 *
 * @param authStore - 인증 스토어
 * @param testAuthStore - 테스트 인증 스토어
 * @returns 로그인 성공 여부
 *
 * 사용 예시:
 * ```typescript
 * // App.vue에서
 * const isLoggedIn = await autoLogin(authStore, testAuthStore)
 * if (isLoggedIn) {
 *   router.push('/admin')
 * } else {
 *   router.push('/login')
 * }
 * ```
 */
export async function autoLogin(
  authStore: AuthStore,
  testAuthStore: TestAuthStore,
): Promise<boolean> {
  try {
    console.log("🔄 ========================================");
    console.log("🔄 자동 로그인 프로세스 시작");
    console.log("🔄 ========================================");

    // ========== 단계 1: localStorage에서 저장된 토큰 확인 ==========
    console.log("📍 단계 1: 저장된 토큰 확인 중...");
    const savedAccessToken = localStorage.getItem("accessToken");
    const savedRefreshToken = localStorage.getItem("refreshToken");

    if (savedAccessToken && savedRefreshToken) {
      console.log("✅ 저장된 토큰 발견!");

      // 기존 토큰 메모리에 복원
      authStore.setAuthData({
        accessToken: savedAccessToken,
        refreshToken: savedRefreshToken,
        email: localStorage.getItem("userEmail") || "",
        isInitialPassword: localStorage.getItem("isInitialPassword") === "true",
      });

      console.log("✅ 자동 로그인 성공 (저장된 토큰 사용)");
      console.log("🔄 ========================================");
      return true;
    }

    console.log("⚠️ 저장된 토큰 없음");

    // ========== 단계 2: 개발 환경에서 테스트 계정 자동 로그인 ==========
    if (import.meta.env.DEV) {
      console.log("🔐 📍 단계 2: 개발 환경 감지");
      console.log("🔐 테스트 계정으로 자동 로그인 시도...");

      const testEmail = testAuthStore.getRandomTestEmail("komsco");
      const testPassword = testAuthStore.testPassword;

      if (!testEmail) {
        console.warn("❌ 테스트 이메일을 찾을 수 없습니다");
        return false;
      }

      console.log(`📧 테스트 이메일: ${testEmail}`);
      console.log(`🔐 테스트 비밀번호: ${testPassword}`);

      try {
        // 2-1. 로그인 페이로드 생성
        console.log("🔐 [2-1] 로그인 페이로드 생성 중...");
        const payloadResponse = await authApi.generateLoginPayload({
          email: testEmail,
          password: testPassword,
        });

        if (!payloadResponse.success) {
          throw new Error(payloadResponse.message || "페이로드 생성 실패");
        }

        const { encryptedData, encryptedAesKey, iv } = payloadResponse.data;
        console.log("✅ 페이로드 생성 완료");

        // 2-2. 로그인 API 호출
        console.log("🔐 [2-2] 로그인 API 호출 중...");
        const loginResponse = await authApi.login(
          encryptedData,
          encryptedAesKey,
          iv,
        );

        if (!loginResponse.success) {
          throw new Error(loginResponse.message || "로그인 실패");
        }

        const { accessToken, refreshToken, isInitialPassword } =
          loginResponse.data;

        console.log("✅ 로그인 API 성공");

        // 2-3. 토큰 저장 및 상태 업데이트
        console.log("🔐 [2-3] 토큰 저장 중...");
        authStore.setAuthData({
          email: testEmail,
          accessToken,
          refreshToken,
          isInitialPassword,
        });

        // localStorage에도 명시적으로 저장
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userEmail", testEmail);
        localStorage.setItem("isInitialPassword", String(isInitialPassword));

        console.log("✅ 토큰 저장 완료");
        console.log("✅ 자동 로그인 성공 (테스트 계정)!");
        console.log("🔄 ========================================");
        return true;
      } catch (error) {
        console.error("❌ 테스트 계정 로그인 실패:", error);
        console.error("❌ 에러 상세:", (error as Error).message);
        return false;
      }
    }

    console.log("⚠️ 저장된 토큰 없음 & 프로덕션 환경");
    console.log("⚠️ 수동 로그인 필요");
    console.log("🔄 ========================================");
    return false;
  } catch (error) {
    console.error("❌ 자동 로그인 시스템 오류:", error);
    console.error("❌ 에러 상세:", (error as Error).message);
    console.log("🔄 ========================================");
    return false;
  }
}

/**
 * 토큰 유효성 검증
 *
 * JWT 토큰의 만료 시간을 확인합니다
 *
 * JWT 구조:
 * ```
 * header.payload.signature
 * - header: 토큰 타입과 알고리즘 정보
 * - payload: 실제 데이터 (exp: 만료 시간)
 * - signature: 서명
 * ```
 *
 * 동작:
 * 1. 토큰이 없으면 false
 * 2. JWT 형식 검증 (3부분 확인)
 * 3. payload 디코드 (Base64)
 * 4. exp 필드 확인 (Unix timestamp in seconds)
 * 5. 현재 시간과 비교
 * 6. 5분 이내 만료 예정이면 false
 *
 * @param token - 검증할 토큰 (JWT)
 * @returns 토큰 유효 여부 (true: 유효, false: 만료되었거나 유효하지 않음)
 *
 * 사용 예시:
 * ```typescript
 * const token = localStorage.getItem('accessToken')
 * if (isTokenValid(token)) {
 *   // 토큰 유효 - API 호출 가능
 * } else {
 *   // 토큰 만료 - 갱신 필요
 * }
 * ```
 */
export function isTokenValid(token: string | null): boolean {
  if (!token) {
    console.warn("⚠️ 토큰이 없습니다");
    return false;
  }

  try {
    // JWT는 3부분으로 구성: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("❌ 유효하지 않은 JWT 형식입니다 (3부분 아님)");
      return false;
    }

    // payload를 Base64로 디코드
    // payload는 JSON 형식으로 인코딩됨
    const payload = JSON.parse(atob(parts[1]));

    // 만료 시간 확인 (exp는 Unix timestamp in seconds)
    if (payload.exp) {
      const expiryTime = payload.exp * 1000; // 초를 밀리초로 변환
      const currentTime = Date.now();
      const remainingTime = expiryTime - currentTime;

      // 토큰이 5분 이내 만료될 예정이면 false 반환
      // (갱신 필요 상태로 판단)
      const warningThreshold = 5 * 60 * 1000; // 5분

      if (currentTime + warningThreshold > expiryTime) {
        const remainingSeconds = Math.round(remainingTime / 1000);
        console.warn(
          `⏰ 토큰이 곧 만료될 예정입니다 (${remainingSeconds}초 후 만료)`,
        );
        return false;
      }

      const remainingSeconds = Math.round(remainingTime / 1000);
      console.log(`✅ 토큰 유효 (${remainingSeconds}초 남음)`);
      return true;
    }

    // exp가 없으면 유효한 것으로 간주
    // (보통 admin 토큰 등에서 발생 가능)
    console.log("✅ 토큰 유효 (만료 시간 정보 없음)");
    return true;
  } catch (error) {
    console.error("❌ 토큰 검증 오류:", error);
    console.error("❌ 에러 상세:", (error as Error).message);
    return false;
  }
}

/**
 * JWT 토큰 디코드 (디버깅용)
 *
 * 개발 시 토큰 내용을 확인할 때 사용
 *
 * @param token - JWT 토큰
 * @returns 디코드된 payload 객체
 *
 * 사용 예시:
 * ```typescript
 * const token = localStorage.getItem('accessToken')
 * const payload = decodeToken(token)
 * console.log('사용자 ID:', payload.sub)
 * console.log('만료 시간:', new Date(payload.exp * 1000))
 * ```
 */
export function decodeToken(token: string | null): Record<string, any> | null {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error("토큰 디코드 실패:", error);
    return null;
  }
}

export default {
  autoLogin,
  isTokenValid,
  decodeToken,
};
