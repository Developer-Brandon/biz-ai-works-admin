/**
 * ============================================================
 * [공통 API 클라이언트] HTTP 요청 관리
 * ============================================================
 *
 * 역할:
 * - 모든 API 요청의 중앙 관리
 * - 요청/응답 인터셉터 적용
 * - 에러 처리 통합
 * - 토큰 자동 추가
 *
 * Vue2 vs Vue3:
 * - Vue2: this.$http로 전역 사용
 * - Vue3: 각 파일에서 import해서 사용 (더 명시적)
 */

import {
  API_BASE_URL,
  TIMEOUTS,
  DEFAULT_HEADERS,
  ENV,
} from "@/utils/constants";
import { requestInterceptor, responseInterceptor } from "./interceptor";

// ========== 타입 정의 ==========

/**
 * 요청 설정 인터페이스
 */
interface RequestConfig extends RequestInit {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  headers?: Record<string, string>;
  body?: string;
  timeout?: number;
}

/**
 * 요청 옵션 인터페이스
 */
interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string | Record<string, any>;
  timeout?: number;
  [key: string]: any;
}

/**
 * API 응답 인터페이스 (제네릭)
 *
 * 사용 예시:
 * ```typescript
 * interface LoginResponse {
 *   accessToken: string
 *   refreshToken: string
 * }
 *
 * const result = await http.post<LoginResponse>('/auth/login', data)
 * // result.data는 LoginResponse 타입
 * ```
 */
interface ApiResponse<T = any> {
  success: boolean;
  status?: number;
  code?: string;
  data: T | null;
  message?: string;
}

/**
 * 네트워크 에러 응답
 */
interface NetworkError {
  success: false;
  status: number;
  code: string;
  data: null;
  message: string;
}

/**
 * URL 파라미터 인터페이스
 */
interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

// ========== HTTP 클라이언트 ==========

/**
 * 통합 fetch 함수
 *
 * 동작:
 * 1. URL 처리 (상대/절대 경로 자동 처리)
 * 2. 요청 인터셉터 실행 (토큰 추가 등)
 * 3. fetch 실행
 * 4. 응답 인터셉터 실행 (에러 처리 등)
 *
 * 🎯 중요:
 * requestInterceptor의 반환값을 반드시 사용해야 함!
 *
 * @param url - API 엔드포인트
 * @param options - 요청 옵션
 * @returns API 응답
 */
async function request<T = any>(
  url: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T> | NetworkError> {
  let fullUrl = url;

  // URL 조합 (상대 경로인 경우만)
  if (!url.startsWith("http")) {
    if (API_BASE_URL) {
      fullUrl = `${API_BASE_URL}${url}`;
    }
  }

  console.log(`📡 [HTTP ${options.method || "GET"}] ${fullUrl}`);

  // ========== 기본 설정 병합 ==========
  const config: RequestConfig = {
    method: "GET" as const,
    headers: { ...DEFAULT_HEADERS },
    ...options,
  };

  console.log("📌 config (인터셉터 적용 전):", config);
  console.log("   config.headers:", config.headers);

  // ========== 요청 인터셉터 실행 ==========
  // 🎯 반환값을 반드시 사용!
  const configAfterInterceptor = requestInterceptor(config);

  console.log("📌 config (인터셉터 적용 후):", configAfterInterceptor);
  console.log("   config.headers:", configAfterInterceptor.headers);
  console.log(
    "   Authorization 헤더:",
    configAfterInterceptor.headers?.["Authorization"] ? "✅ 있음" : "❌ 없음",
  );

  try {
    // 실제 API 호출
    console.log("📤 fetch 호출 직전 config:", configAfterInterceptor);

    const response = await fetch(fullUrl, configAfterInterceptor);

    console.log(`📥 응답 받음 (상태: ${response.status})`);

    // 응답 인터셉터
    const result = await responseInterceptor<T>(response);

    return result;
  } catch (error) {
    console.error("❌ [Network Error]", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      status: 0,
      code: "NETWORK_ERROR",
      data: null,
      message: errorMessage || "Network error",
    };
  }
}

/**
 * GET 요청
 *
 * @param url - API 엔드포인트
 * @param params - 쿼리 파라미터
 * @returns API 응답
 *
 * 사용 예시:
 * ```typescript
 * const users = await http.get<User[]>('/users', { page: 1, limit: 10 })
 * ```
 */
async function get<T = any>(
  url: string,
  params: QueryParams = {},
): Promise<ApiResponse<T> | NetworkError> {
  const queryString = new URLSearchParams(
    Object.entries(params).reduce(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      },
      {} as Record<string, string>,
    ),
  ).toString();

  const fullUrl = queryString ? `${url}?${queryString}` : url;

  console.log("🔍 GET 파라미터:", params);

  return request<T>(fullUrl, {
    method: "GET",
  });
}

/**
 * POST 요청
 *
 * @param url - API 엔드포인트
 * @param data - 요청 바디 데이터
 * @returns API 응답
 *
 * 사용 예시:
 * ```typescript
 * interface CreateUserRequest {
 *   name: string
 *   email: string
 * }
 *
 * const result = await http.post<User>('/users', {
 *   name: 'John',
 *   email: 'john@example.com'
 * })
 * ```
 */
async function post<T = any>(
  url: string,
  data: Record<string, any> = {},
): Promise<ApiResponse<T> | NetworkError> {
  console.log("📝 POST 바디:", data);

  return request<T>(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * PUT 요청
 *
 * @param url - API 엔드포인트
 * @param data - 요청 바디 데이터
 * @returns API 응답
 *
 * 사용 예시:
 * ```typescript
 * const result = await http.put<User>('/users/1', {
 *   name: 'Jane Doe'
 * })
 * ```
 */
async function put<T = any>(
  url: string,
  data: Record<string, any> = {},
): Promise<ApiResponse<T> | NetworkError> {
  console.log("✏️ PUT 바디:", data);

  return request<T>(url, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * DELETE 요청
 *
 * @param url - API 엔드포인트
 * @returns API 응답
 *
 * 사용 예시:
 * ```typescript
 * const result = await http.delete('/users/1')
 * ```
 */
async function deleteRequest<T = any>(
  url: string,
): Promise<ApiResponse<T> | NetworkError> {
  return request<T>(url, {
    method: "DELETE",
  });
}

/**
 * PATCH 요청
 *
 * @param url - API 엔드포인트
 * @param data - 요청 바디 데이터
 * @returns API 응답
 *
 * 사용 예시:
 * ```typescript
 * const result = await http.patch<User>('/users/1', {
 *   status: 'active'
 * })
 * ```
 */
async function patch<T = any>(
  url: string,
  data: Record<string, any> = {},
): Promise<ApiResponse<T> | NetworkError> {
  console.log("🔧 PATCH 바디:", data);

  return request<T>(url, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// ========== Export ==========

/**
 * HTTP 클라이언트 객체
 *
 * 모든 HTTP 요청 메서드를 포함합니다
 *
 * 사용 예시:
 * ```typescript
 * import { http } from '@/api/http'
 *
 * // GET 요청
 * const users = await http.get<User[]>('/users')
 *
 * // POST 요청
 * const newUser = await http.post<User>('/users', { name: 'John' })
 *
 * // 에러 처리
 * const result = await http.get('/users')
 * if (!result.success) {
 *   console.error(result.message)
 * }
 * ```
 */
export const http = {
  get,
  post,
  put,
  patch,
  delete: deleteRequest,
  request,
};

export default http;

// ========== 타입 Export ==========
export type {
  RequestConfig,
  RequestOptions,
  ApiResponse,
  NetworkError,
  QueryParams,
};
