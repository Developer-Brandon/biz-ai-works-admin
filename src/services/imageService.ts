/**
 * Image API 서비스
 *
 * 이미지 업로드/삭제 관리와 관련된 API 통신을 담당합니다
 * Swagger 기반: /api/app/info/image/*
 *
 * API 엔드포인트:
 * - POST /api/app/info/image - 이미지 조회
 * - POST /api/app/info/image/upload - 이미지 업로드
 * - POST /api/app/info/image/upload/batch - 여러 이미지 일괄 업로드
 * - POST /api/app/info/image/delete - 이미지 삭제
 *
 * 지원 이미지 타입:
 * - default_profile: 기본 프로필 이미지
 * - opengraph: Open Graph 이미지
 * - favicon: 파비콘 이미지
 * - logo: 로고 이미지
 * - pannel: 패널 이미지
 * - expand_banner_pannel: 확장 배너 패널 이미지
 * - expand_banner_pannel_background: 확장 배너 패널 배경 이미지
 * - card_image: 카드 썸네일 이미지
 */

import { request } from "@/utils/request";
import type { Image, ImageUploadResponse, ApiResponse } from "@/types";

/**
 * 이미지 조회
 *
 * 저장된 이미지를 조회합니다. 저장된 이미지가 없으면 기본 이미지를 반환합니다
 * 인증 없이 접근 가능
 *
 * @param office - 회사 코드
 * @param imageType - 이미지 타입
 * @returns Promise<이미지 데이터 (바이너리)>
 *
 * 사용 예시:
 * ```typescript
 * const imageBlob = await imageService.getImage('ktds', 'logo')
 * const imageUrl = URL.createObjectURL(imageBlob)
 * ```
 */
export async function getImage(
  office: string,
  imageType: string,
): Promise<Blob> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/app/info/image`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          office,
          imageType,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`이미지 조회 실패: ${response.statusText}`);
    }

    return await response.blob();
  } catch (error) {
    console.error("이미지 조회 실패:", error);
    throw error;
  }
}

/**
 * 이미지 업로드
 *
 * 단일 이미지를 업로드하고 서버에서 자동으로 경로를 생성하여 저장합니다
 *
 * @param office - 회사 코드
 * @param imageType - 이미지 타입
 * @param file - 업로드할 이미지 파일
 * @param options - 추가 옵션 (카드 이미지인 경우)
 * @returns Promise<업로드된 이미지 URL>
 *
 * 사용 예시:
 * ```typescript
 * // 로고 업로드
 * const url = await imageService.uploadImage(
 *   'ktds',
 *   'logo',
 *   logoFile
 * )
 *
 * // 카드 이미지 업로드
 * const cardImageUrl = await imageService.uploadImage(
 *   'ktds',
 *   'card_image',
 *   cardFile,
 *   {
 *     cardId: 'card-uuid-123',
 *     cardType: 'chatCard',
 *     name: '카드 이름'
 *   }
 * )
 * ```
 */
export async function uploadImage(
  office: string,
  imageType: string,
  file: File,
  options?: {
    cardId?: string;
    cardType?: string;
    displayOrder?: number;
    name?: string;
    description?: string;
    questionList?: string;
  },
): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("office", office);
    formData.append("imageType", imageType);
    formData.append("file", file);

    // 카드 이미지인 경우 추가 옵션 포함
    if (options) {
      if (options.cardId) formData.append("cardId", options.cardId);
      if (options.cardType) formData.append("cardType", options.cardType);
      if (options.displayOrder !== undefined) {
        formData.append("displayOrder", String(options.displayOrder));
      }
      if (options.name) formData.append("name", options.name);
      if (options.description)
        formData.append("description", options.description);
      if (options.questionList)
        formData.append("questionList", options.questionList);
    }

    const response = await request.postFormData<ImageUploadResponse>(
      "/api/app/info/image/upload",
      formData,
    );

    return response.message;
  } catch (error) {
    console.error("이미지 업로드 실패:", error);
    throw error;
  }
}

/**
 * 이미지 삭제
 *
 * @param office - 회사 코드
 * @param imageType - 삭제할 이미지 타입
 * @returns Promise<void>
 *
 * 사용 예시:
 * ```typescript
 * await imageService.deleteImage('ktds', 'logo')
 * ```
 */
export async function deleteImage(
  office: string,
  imageType: string,
): Promise<void> {
  try {
    await request.post("/api/app/info/image/delete", {
      office,
      imageType,
    });
  } catch (error) {
    console.error("이미지 삭제 실패:", error);
    throw error;
  }
}

/**
 * imageService 내보내기
 */
export const imageService = {
  getImage,
  uploadImage,
  deleteImage,
};

export default imageService;
