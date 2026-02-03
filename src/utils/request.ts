/**
 * Fetch API 기반 HTTP 요청 유틸리티
 *
 * 특징:
 * - localStorage 직접 접근 제거 (Pinia store 사용!)
 * - 요청 타임아웃 처리
 * - JWT 토큰 자동 추가
 * - 401 처리 (로그아웃)
 * - 개발 환경에서 proxy 사용
 *
 * Vue 2 vs Vue 3:
 * - Vue 2: Vuex store를 import하여 commit
 * - Vue 3: Pinia store를 import하여 action 호출
 * Vue 3가 더 간단합니다
 */

import { useAuthStore } from "@/stores/useAuthStore";
import type { ApiResponse } from "@/types";

// 개발/프로덕션 환경에 따라 API_BASE_URL 설정
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment
  ? "" // 개발: 상대 경로 (proxy 사용)
  : import.meta.env.VITE_API_BASE_URL; // 프로덕션: 절대 경로

const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000;

/**
 * JWT 토큰으로 Authorization 헤더 생성
 *
 * localStorage가 아닌 Pinia store에서 토큰을 가져옵니다!
 *
 * @returns Authorization 헤더 값 (예: "Bearer eyJhbGc...")
 */
function getAuthHeader(): string | null {
  const authStore = useAuthStore();

  // localStorage.getItem() 제거!
  // Pinia store의 getter 사용
  return authStore.authHeader;
}

/**
 * Fetch API with Timeout
 *
 * @param url - 요청 URL
 * @param options - RequestInit 옵션
 * @returns Response 객체
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number } = {},
): Promise<Response> {
  const { timeout = API_TIMEOUT, ...fetchOptions } = options;

  // Pinia store에서 Authorization 헤더 가져오기
  const authHeader = getAuthHeader();

  const headers = {
    "Content-Type": "application/json",
    ...(authHeader && { Authorization: authHeader }),
    ...fetchOptions.headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const fullUrl = isDevelopment ? url : `${API_BASE_URL}${url}`;

    console.log(`[API] ${fetchOptions.method || "GET"} ${fullUrl}`);

    const response = await fetch(fullUrl, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // 401 Unauthorized: 토큰 만료 or 유효하지 않음
    if (response.status === 401) {
      console.error("❌ [API] 401 Unauthorized - 로그아웃 처리");

      const authStore = useAuthStore();
      // localStorage 직접 접근 제거!
      // Pinia store의 action 사용
      authStore.forceLogout();

      window.location.href = "/login";
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * GET 요청
 *
 * @param url - 요청 URL
 * @param options - 요청 옵션
 * @returns 응답 데이터
 *
 * 사용 예시:
 * ```typescript
 * const data = await request.get<User>('/api/users/me')
 * ```
 */
export async function get<T = any>(
  url: string,
  options?: RequestInit & { timeout?: number },
): Promise<T> {
  const response = await fetchWithTimeout(url, {
    ...options,
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: 요청 실패`);
  }

  const data = (await response.json()) as ApiResponse<T>;
  return data.data;
}

/**
 * POST 요청 (JSON)
 *
 * @param url - 요청 URL
 * @param body - 요청 본문
 * @param options - 요청 옵션
 * @returns 응답 데이터
 *
 * 사용 예시:
 * ```typescript
 * const result = await request.post<LoginResponse>('/api/login', {
 *   email: 'user@example.com',
 *   password: 'password123'
 * })
 * ```
 */
export async function post<T = any>(
  url: string,
  body?: any,
  options?: RequestInit & { timeout?: number },
): Promise<T> {
  const response = await fetchWithTimeout(url, {
    ...options,
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: 요청 실패`);
  }

  const data = (await response.json()) as ApiResponse<T>;
  return data.data;
}

/**
 * POST 요청 (FormData - 파일 업로드)
 *
 * Content-Type을 자동으로 설정하지 않습니다 (multipart/form-data 자동 설정)
 *
 * @param url - 요청 URL
 * @param formData - FormData 객체
 * @param options - 요청 옵션
 * @returns 응답 데이터
 *
 * 사용 예시:
 * ```typescript
 * const formData = new FormData()
 * formData.append('file', fileInput.files[0])
 * formData.append('name', 'my-card')
 *
 * const result = await request.postFormData<Card>('/api/cards', formData)
 * ```
 */
export async function postFormData<T = any>(
  url: string,
  formData: FormData,
  options?: RequestInit & { timeout?: number },
): Promise<T> {
  // Pinia store에서 토큰 가져오기
  const authHeader = getAuthHeader();

  const headers = {
    ...(authHeader && { Authorization: authHeader }),
    ...options?.headers,
  };

  const controller = new AbortController();
  const timeout = options?.timeout || API_TIMEOUT;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const fullUrl = isDevelopment ? url : `${API_BASE_URL}${url}`;

    const response = await fetch(fullUrl, {
      ...options,
      method: "POST",
      headers,
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      console.error("❌ [API] 401 Unauthorized - 로그아웃 처리");
      const authStore = useAuthStore();
      authStore.forceLogout();
      window.location.href = "/login";
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: 요청 실패`);
    }

    const data = (await response.json()) as ApiResponse<T>;
    return data.data;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * PUT 요청
 *
 * @param url - 요청 URL
 * @param body - 요청 본문
 * @param options - 요청 옵션
 * @returns 응답 데이터
 */
export async function put<T = any>(
  url: string,
  body?: any,
  options?: RequestInit & { timeout?: number },
): Promise<T> {
  const response = await fetchWithTimeout(url, {
    ...options,
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: 요청 실패`);
  }

  const data = (await response.json()) as ApiResponse<T>;
  return data.data;
}

/**
 * DELETE 요청
 *
 * @param url - 요청 URL
 * @param options - 요청 옵션
 * @returns 응답 데이터
 */
export async function del<T = any>(
  url: string,
  options?: RequestInit & { timeout?: number },
): Promise<T> {
  const response = await fetchWithTimeout(url, {
    ...options,
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: 요청 실패`);
  }

  const data = (await response.json()) as ApiResponse<T>;
  return data.data;
}

export const request = {
  get,
  post,
  postFormData,
  put,
  del,
};

export default request;
