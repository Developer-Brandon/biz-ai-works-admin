/**
 * Fetch API 기반 HTTP 요청 유틸리티
 */

import type { ApiResponse } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000;

async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number } = {},
): Promise<Response> {
  const { timeout = API_TIMEOUT, ...fetchOptions } = options;

  // JWT 토큰 추가
  const token = localStorage.getItem("accessToken");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...fetchOptions.headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function get<T = any>(
  url: string,
  options?: RequestInit & { timeout?: number },
): Promise<T> {
  const response = await fetchWithTimeout(url, {
    ...options,
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("요청 실패");
  }

  const data = (await response.json()) as ApiResponse<T>;
  return data.data;
}

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
    throw new Error("요청 실패");
  }

  const data = (await response.json()) as ApiResponse<T>;
  return data.data;
}

export async function postFormData<T = any>(
  url: string,
  formData: FormData,
  options?: RequestInit & { timeout?: number },
): Promise<T> {
  const token = localStorage.getItem("accessToken");
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  const controller = new AbortController();
  const timeout = options?.timeout || API_TIMEOUT;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      method: "POST",
      headers,
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("요청 실패");
    }

    const data = (await response.json()) as ApiResponse<T>;
    return data.data;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export const request = {
  get,
  post,
  postFormData,
};

export default request;
