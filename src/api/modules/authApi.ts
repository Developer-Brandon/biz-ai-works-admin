/**
 * ============================================================
 * [API 모듈] 인증 관련 API
 * ============================================================
 *
 * 역할:
 * - 로그인, 토큰 갱신, 비밀번호 변경 등 인증 관련 API
 * - RSA Public Key 조회
 * - 초기 비밀번호 변경
 *
 * 사용 예시:
 * import { authApi } from '@/api/modules/authApi'
 * const result = await authApi.login(encryptedData, encryptedAesKey, iv)
 *
 * Vue2 vs Vue3:
 * - Vue2: 별도의 auth 서비스 클래스 사용
 * - Vue3: 함수형 API 모듈 (더 간단하고 트리샤킹 용이)
 *
 * 환경 자동 감지:
 * - 로컬 개발: Vite proxy 사용 (상대 경로 /api/...)
 * - 배포 환경: Vercel 프록시 사용 (/api/auth/... → api/auth/login-payload.js)
 */

import { http } from "../http";
import { API_BASE_URL, ENV } from "@/utils/constants";

// ========== 타입 정의 ==========

interface PublicKeyResponse {
  success: boolean;
  data: {
    publicKey: string;
    algorithm: string;
    keySize: number;
    format: string;
  };
}

interface LoginPayloadData {
  encryptedData: string;
  encryptedAesKey: string;
  iv: string;
}

interface LoginPayloadResponse {
  success: boolean;
  data: LoginPayloadData;
  message?: string;
}

interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    isInitialPassword: boolean;
  };
  message?: string;
}

interface RefreshResponse {
  success: boolean;
  data: Record<string, any>;
  message?: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordChangeResponse {
  success: boolean;
  data: {
    success: boolean;
    message: string;
  };
  message?: string;
}

interface InitialPasswordChangeData extends PasswordChangeData {
  email: string;
}

interface Credentials {
  email: string;
  password: string;
}

// ========== 내부 함수 ==========

/**
 * 환경에 따라 올바른 엔드포인트 반환
 *
 * 동작 원리:
 * 1. 로컬 개발 (npm run dev):
 *    - isDevelopment = true
 *    - 원본 백엔드 직접 호출 (/api/auth/test/generate-login-payload)
 *
 * 2. 배포 환경 (Vercel):
 *    - isDevelopment = false
 *    - Vercel 프록시 함수 사용 (/api/auth/login-payload → api/auth/login-payload.js)
 *
 * @param localPath - 로컬/원본 백엔드 경로
 * @param proxyPath - Vercel 프록시 경로
 * @returns 환경에 맞는 최종 엔드포인트
 */
function getEndpoint(localPath: string, proxyPath: string): string {
  if (ENV.IS_DEVELOPMENT) {
    return localPath;
  } else {
    return `${API_BASE_URL}${proxyPath}`;
  }
}

// ========== API 함수들 ==========

/**
 * 1️⃣ RSA Public Key 조회
 *
 * 엔드포인트 (로컬): POST /api/auth/public-key
 * 엔드포인트 (배포): POST /api/auth/public-key (Vercel 프록시)
 * 인증: 불필요
 *
 * 역할:
 * - 로그인 시 사용할 RSA Public Key를 조회합니다
 * - 조회한 Public Key로 AES Key를 암호화하여 전송합니다
 *
 * @returns RSA Public Key 정보
 */
async function getPublicKey(): Promise<PublicKeyResponse> {
  const endpoint = getEndpoint("/api/auth/public-key", "/api/auth/public-key");
  console.log(`📤 [RSA Public Key 조회] ${endpoint}`);

  // http.post는 ApiResponse<T> | NetworkError를 반환하므로 처리 필요
  const response = await http.post<PublicKeyResponse>(endpoint, {});

  // 성공 여부 확인
  if (!response.success) {
    throw new Error(response.message || "RSA Public Key 조회 실패");
  }

  // data는 null일 수 있으므로 타입 단언
  return response.data as PublicKeyResponse;
}

/**
 * 2️⃣ 로그인 (하이브리드 암호화)
 *
 * 엔드포인트 (로컬): POST /api/auth/login
 * 엔드포인트 (배포): POST /api/auth/login (Vercel 프록시)
 * 인증: 불필요 (로그인 전이므로)
 *
 * 암호화 방식:
 * 1. 비밀번호를 SHA-256으로 해싱
 * 2. JSON {email, hashedPassword}을 AES로 암호화
 * 3. AES Key를 RSA Public Key로 암호화
 * 4. 암호화된 데이터, AES Key, IV를 전송
 *
 * @param encryptedData - AES로 암호화된 JSON 데이터 (Base64)
 * @param encryptedAesKey - RSA로 암호화된 AES Key (Base64)
 * @param iv - AES IV (12 bytes, Base64)
 * @returns 로그인 응답 (accessToken, refreshToken 등)
 */
async function login(
  encryptedData: string,
  encryptedAesKey: string,
  iv: string,
): Promise<LoginResponse> {
  const endpoint = getEndpoint("/api/auth/login", "/api/auth/login");
  console.log(`📤 [로그인] ${endpoint}`);

  const response = await http.post<LoginResponse>(endpoint, {
    encryptedData,
    encryptedAesKey,
    iv,
  });

  if (!response.success) {
    throw new Error(response.message || "로그인 실패");
  }

  return response.data as LoginResponse;
}

/**
 * 3️⃣ 토큰 갱신
 *
 * 엔드포인트 (로컬): POST /api/auth/refresh
 * 엔드포인트 (배포): POST /api/auth/refresh (Vercel 프록시)
 * 인증: 필요 (Bearer Token)
 *
 * 역할:
 * - Refresh Token을 사용하여 새로운 Access Token 발급
 * - Access Token 만료 시 사용
 *
 * @returns 갱신된 토큰 정보
 */
async function refresh(): Promise<RefreshResponse> {
  const endpoint = getEndpoint("/api/auth/refresh", "/api/auth/refresh");
  console.log(`📤 [토큰 갱신] ${endpoint}`);

  const response = await http.post<RefreshResponse>(endpoint, {});

  if (!response.success) {
    throw new Error(response.message || "토큰 갱신 실패");
  }

  return response.data as RefreshResponse;
}

/**
 * 4️⃣ 비밀번호 변경
 *
 * 엔드포인트 (로컬): POST /api/auth/change-password
 * 엔드포인트 (배포): POST /api/auth/change-password (Vercel 프록시)
 * 인증: 필요 (Bearer Token)
 *
 * 역할:
 * - 로그인한 사용자의 비밀번호 변경
 * - 현재 비밀번호 확인 후 변경
 *
 * @param passwordData - 비밀번호 변경 데이터
 * @returns 비밀번호 변경 결과
 * @throws 필드 검증 실패 시
 */
async function changePassword(
  passwordData: PasswordChangeData,
): Promise<PasswordChangeResponse> {
  // 필수 필드 검증
  if (!passwordData.currentPassword || !passwordData.newPassword) {
    throw new Error("currentPassword와 newPassword는 필수입니다");
  }

  if (passwordData.newPassword.length < 8) {
    throw new Error("새 비밀번호는 최소 8자 이상이어야 합니다");
  }

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    throw new Error("새 비밀번호가 일치하지 않습니다");
  }

  const endpoint = getEndpoint(
    "/api/auth/change-password",
    "/api/auth/change-password",
  );
  console.log(`📤 [비밀번호 변경] ${endpoint}`);

  const response = await http.post<PasswordChangeResponse>(endpoint, {
    currentPassword: passwordData.currentPassword,
    newPassword: passwordData.newPassword,
    confirmPassword: passwordData.confirmPassword,
    passwordMatch: true,
  });

  if (!response.success) {
    throw new Error(response.message || "비밀번호 변경 실패");
  }

  return response.data as PasswordChangeResponse;
}
/**
 * 5️⃣ 초기 비밀번호 변경
 *
 * 엔드포인트 (로컬): POST /api/auth/change-initial-password
 * 엔드포인트 (배포): POST /api/auth/change-initial-password (Vercel 프록시)
 * 인증: 불필요 (초기 로그인 후 비밀번호 변경 시)
 *
 * 역할:
 * - 초기(임시) 비밀번호를 새 비밀번호로 변경
 * - 로그인 후 isInitialPassword가 true일 때 사용
 *
 * @param passwordData - 초기 비밀번호 변경 데이터
 * @returns 초기 비밀번호 변경 결과
 * @throws 필드 검증 실패 시
 */
async function changeInitialPassword(
  passwordData: InitialPasswordChangeData,
): Promise<PasswordChangeResponse> {
  // 필수 필드 검증
  if (
    !passwordData.email ||
    !passwordData.currentPassword ||
    !passwordData.newPassword
  ) {
    throw new Error("email, currentPassword, newPassword는 필수입니다");
  }

  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(passwordData.email)) {
    throw new Error("유효한 이메일 주소를 입력하세요");
  }

  // 비밀번호 길이 검증
  if (passwordData.newPassword.length < 8) {
    throw new Error("새 비밀번호는 최소 8자 이상이어야 합니다");
  }

  // 비밀번호 일치 검증
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    throw new Error("새 비밀번호가 일치하지 않습니다");
  }

  const endpoint = getEndpoint(
    "/api/auth/change-initial-password",
    "/auth/change-initial-password",
  );

  console.log(`📤 [초기 비밀번호 변경] ${endpoint}`);

  // 응답 처리 추가
  const response = await http.post<PasswordChangeResponse>(endpoint, {
    email: passwordData.email,
    currentPassword: passwordData.currentPassword,
    newPassword: passwordData.newPassword,
    confirmPassword: passwordData.confirmPassword,
    passwordMatch: true,
  });

  if (!response.success) {
    throw new Error(response.message || "초기 비밀번호 변경 실패");
  }

  return response as PasswordChangeResponse;
}

/**
 * 6️⃣ 테스트용: 로그인 페이로드 생성
 *
 * 엔드포인트 (로컬): POST /api/auth/test/generate-login-payload
 * 엔드포인트 (배포): POST /api/auth/login-payload (Vercel 프록시)
 * 인증: 불필요
 *
 * 역할:
 * - 개발/테스트용 API
 * - 평문 이메일/비밀번호를 받아 암호화된 페이로드 자동 생성
 * - 실제 개발 시 이 API로 암호화된 데이터를 받아 login() 호출
 *
 * @param credentials - 로그인 정보 (평문)
 * @returns 암호화된 페이로드
 *
 * 사용 예시:
 * ```typescript
 * const payload = await authApi.generateLoginPayload({
 *   email: 'user@example.com',
 *   password: 'plainPassword123'
 * })
 * const loginResult = await authApi.login(
 *   payload.encryptedData,
 *   payload.encryptedAesKey,
 *   payload.iv
 * )
 * ```
 */
async function generateLoginPayload(
  credentials: Credentials,
): Promise<LoginPayloadResponse> {
  const endpoint = getEndpoint(
    "/api/auth/test/generate-login-payload",
    "/api/auth/login-payload",
  );

  console.log(`📤 [로그인 페이로드 생성] ${endpoint}`);
  console.log(`🌐 환경: ${ENV.IS_DEVELOPMENT ? "로컬" : "배포"}`);

  // 응답 처리 추가
  const response = await http.post<LoginPayloadData>(endpoint, {
    email: credentials.email,
    password: credentials.password,
  });

  if (!response.success) {
    throw new Error(response.message || "로그인 페이로드 생성 실패");
  }

  return response as LoginPayloadResponse;
}

// ========== Export ==========

export const authApi = {
  getPublicKey,
  login,
  refresh,
  changePassword,
  changeInitialPassword,
  generateLoginPayload,
};

export default authApi;

// ========== 타입 Export ==========
export type {
  PublicKeyResponse,
  LoginResponse,
  LoginPayloadResponse,
  RefreshResponse,
  PasswordChangeResponse,
  PasswordChangeData,
  InitialPasswordChangeData,
  Credentials,
};
