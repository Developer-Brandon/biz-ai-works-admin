/**
 * Color Palette API 서비스
 *
 * 색상 팔레트 관리와 관련된 API 통신을 담당합니다
 * iro.js 라이브러리와 함께 사용됩니다
 * Swagger 기반: /api/app/info/save/basic
 *
 * API 엔드포인트:
 * - POST /api/app/info/save/basic - 기본 설정 저장 (색상 포함)
 * - POST /api/app/info - 앱 설정 정보 조회
 * - POST /api/app/info/bypass - 기본 설정 조회 (인증 없음)
 */

import { request } from "@/utils/request";
import type { ColorPalette, ApiResponse } from "@/types";

/**
 * 색상 팔레트 저장
 *
 * iro.js에서 선택한 색상들을 백엔드에 저장합니다
 * 이 API는 색상 외에도 다른 UI 설정들을 저장할 수 있습니다
 *
 * @param office - 회사 코드
 * @param colors - 색상 정보
 * @returns Promise<저장된 설정 정보>
 *
 * 사용 예시:
 * ```typescript
 * await colorService.saveColorPalette('ktds', {
 *   mainColorHexCode: '#2563EB',
 *   mainHoverColorHexCode: '#1E40AF',
 *   subColorHexCode: '#10B981',
 *   subHoverColorHexCode: '#059669',
 *   startGradientColor: '#2563EB',
 *   endGradientColor: '#10B981'
 * })
 * ```
 */
export async function saveColorPalette(
  office: string,
  colors: ColorPalette,
): Promise<Record<string, any>> {
  try {
    const payload = {
      office,
      ...colors,
    };

    const response = await request.post<ApiResponse<Record<string, any>>>(
      "/api/app/info/save/basic",
      payload,
    );

    return response.data || {};
  } catch (error) {
    console.error("색상 팔레트 저장 실패:", error);
    throw error;
  }
}

/**
 * 현재 앱 설정 조회 (색상 포함)
 *
 * @param office - 회사 코드
 * @returns Promise<앱 설정 정보>
 */
export async function getAppConfig(
  office: string,
): Promise<Record<string, any>> {
  try {
    const response = await request.post<ApiResponse<Record<string, any>>>(
      "/api/app/info",
      { office },
    );

    return response.data || {};
  } catch (error) {
    console.error("앱 설정 조회 실패:", error);
    throw error;
  }
}

/**
 * 기본 색상 팔레트 조회 (인증 불필요)
 *
 * 로그인하지 않아도 접근 가능한 기본 설정을 조회합니다
 *
 * @returns Promise<기본 설정 정보>
 */
export async function getDefaultColorPalette(): Promise<Record<string, any>> {
  try {
    const response = await request.post<ApiResponse<Record<string, any>>>(
      "/api/app/info/bypass",
      {},
    );

    return response.data || {};
  } catch (error) {
    console.error("기본 색상 팔레트 조회 실패:", error);
    throw error;
  }
}

/**
 * HEX 색상값 검증
 *
 * @param color - 검증할 색상값 (예: "#FF0000")
 * @returns boolean - 유효한 HEX 색상인지 여부
 *
 * 사용 예시:
 * ```typescript
 * if (colorService.isValidHexColor('#2563EB')) {
 *   // 유효한 색상
 * }
 * ```
 */
export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

/**
 * RGB를 HEX로 변환
 *
 * @param r - Red (0-255)
 * @param g - Green (0-255)
 * @param b - Blue (0-255)
 * @returns string - HEX 색상값 (예: "#FF0000")
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * HEX를 RGB로 변환
 *
 * @param hex - HEX 색상값 (예: "#FF0000")
 * @returns { r, g, b } | null
 */
export function hexToRgb(
  hex: string,
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * colorService 내보내기
 */
export const colorService = {
  saveColorPalette,
  getAppConfig,
  getDefaultColorPalette,
  isValidHexColor,
  rgbToHex,
  hexToRgb,
};

export default colorService;
