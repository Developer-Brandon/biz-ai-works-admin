/**
 * Logo API 서비스
 *
 * 로고 관리와 관련된 모든 API 통신을 담당합니다
 * Swagger 기반: /api/app/info/logo/*
 *
 * API 엔드포인트:
 * - POST /api/app/info/logo/list - 로고 목록 조회
 * - POST /api/app/info/logo/add - 로고 추가
 * - POST /api/app/info/logo/select - 로고 선택
 * - POST /api/app/info/logo/delete - 로고 삭제
 */

import { request } from "@/utils/request";
import type { Logo, ApiResponse } from "@/types";

/**
 * 로고 목록 조회
 *
 * @param office - 회사 코드
 * @returns Promise<로고 배열>
 *
 * 사용 예시:
 * ```typescript
 * const logos = await logoService.getLogoList('ktds')
 * ```
 */
export async function getLogoList(office: string): Promise<Logo[]> {
  try {
    const response = await request.post<ApiResponse<Logo[]>>(
      "/api/app/info/logo/list",
      { office },
    );
    return response.data || [];
  } catch (error) {
    console.error("로고 목록 조회 실패:", error);
    throw error;
  }
}

/**
 * 로고 파일 업로드 (추가)
 *
 * multipart/form-data를 사용하여 파일을 업로드합니다
 * 최대 3개까지 업로드 가능
 *
 * @param office - 회사 코드
 * @param file - 업로드할 로고 파일 (PNG, JPEG, JPG)
 * @returns Promise<생성된 로고>
 *
 * 사용 예시:
 * ```typescript
 * const fileInput = document.getElementById('fileInput') as HTMLInputElement
 * const file = fileInput.files[0]
 *
 * const newLogo = await logoService.addLogo('ktds', file)
 * ```
 */
export async function addLogo(office: string, file: File): Promise<Logo> {
  try {
    const formData = new FormData();
    formData.append("office", office);
    formData.append("logoUrl", file);

    const response = await request.postFormData<Logo>(
      "/api/app/info/logo/add",
      formData,
    );
    return response;
  } catch (error) {
    console.error("로고 추가 실패:", error);
    throw error;
  }
}

/**
 * 로고 선택 (메인 로고로 설정)
 *
 * 1개의 로고만 선택 가능 (토글 버튼)
 * 다른 로고를 선택하면 자동으로 이전 선택이 해제됨
 *
 * @param logoId - 선택할 로고 ID (UUID)
 * @param office - 회사 코드
 * @returns Promise<void>
 *
 * 사용 예시:
 * ```typescript
 * await logoService.selectLogo('logo-uuid-123', 'ktds')
 * ```
 */
export async function selectLogo(
  logoId: string,
  office: string,
): Promise<void> {
  try {
    await request.post("/api/app/info/logo/select", {
      office,
      logoId,
    });
  } catch (error) {
    console.error("로고 선택 실패:", error);
    throw error;
  }
}

/**
 * 로고 삭제
 *
 * 선택된 로고가 삭제되면 config의 logoImageUrl도 null로 설정됨
 *
 * @param logoId - 삭제할 로고 ID (UUID)
 * @param office - 회사 코드
 * @returns Promise<void>
 *
 * 사용 예시:
 * ```typescript
 * await logoService.deleteLogo('logo-uuid-123', 'ktds')
 * ```
 */
export async function deleteLogo(
  logoId: string,
  office: string,
): Promise<void> {
  try {
    await request.post("/api/app/info/logo/delete", {
      office,
      logoId,
    });
  } catch (error) {
    console.error("로고 삭제 실패:", error);
    throw error;
  }
}

/**
 * logoService 내보내기
 */
export const logoService = {
  getLogoList,
  addLogo,
  selectLogo,
  deleteLogo,
};

export default logoService;
