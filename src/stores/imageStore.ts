/**
 * Image Pinia Store
 *
 * 이미지 업로드/관리 관련 상태를 관리합니다
 * localStorage에 자동 저장됩니다
 *
 * 주요 상태:
 * - uploadedImages: 업로드된 이미지 목록
 * - loading: 로딩 상태
 * - uploadProgress: 업로드 진행률
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Image, ImageUploadResult } from "@/types";
import { imageService } from "@/services/imageService";

/**
 * Image Store 정의
 */
export const useImageStore = defineStore(
  "image",
  () => {
    // ========== State ==========

    /**
     * 업로드된 이미지 목록
     * key: imageType, value: 이미지 URL
     */
    const uploadedImages = ref<Record<string, string>>({});

    /**
     * 로딩 상태
     */
    const loading = ref(false);

    /**
     * 에러 메시지
     */
    const error = ref<string | null>(null);

    /**
     * 업로드 진행률 (0-100)
     */
    const uploadProgress = ref(0);

    /**
     * 현재 업로드 중인 파일 이름
     */
    const uploadingFileName = ref<string | null>(null);

    // ========== Getters ==========

    /**
     * 특정 이미지 타입의 URL 조회
     */
    const getImageUrl = computed(() => {
      return (imageType: string) => uploadedImages.value[imageType] || null;
    });

    /**
     * 업로드된 이미지 개수
     */
    const uploadedImageCount = computed(() => {
      return Object.keys(uploadedImages.value).length;
    });

    /**
     * 로딩 중인지 확인
     */
    const isLoading = computed(() => loading.value);

    // ========== Actions ==========

    /**
     * 이미지 업로드
     *
     * @param office - 회사 코드
     * @param imageType - 이미지 타입
     * @param file - 업로드할 파일
     * @param options - 추가 옵션
     */
    async function uploadImage(
      office: string,
      imageType: string,
      file: File,
      options?: any,
    ): Promise<string> {
      loading.value = true;
      uploadingFileName.value = file.name;
      uploadProgress.value = 0;
      error.value = null;

      try {
        const url = await imageService.uploadImage(
          office,
          imageType,
          file,
          options,
        );

        uploadedImages.value[imageType] = url;
        uploadProgress.value = 100;

        return url;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "이미지 업로드 실패";
        error.value = errorMessage;
        throw err;
      } finally {
        loading.value = false;
        uploadingFileName.value = null;
      }
    }

    /**
     * 여러 이미지 일괄 업로드
     *
     * @param office - 회사 코드
     * @param imageTypes - 이미지 타입 배열
     * @param files - 파일 배열
     */
    async function uploadImagesBatch(
      office: string,
      imageTypes: string[],
      files: File[],
    ): Promise<ImageUploadResult[]> {
      loading.value = true;
      error.value = null;

      try {
        const results = await imageService.uploadImagesBatch(
          office,
          imageTypes,
          files,
        );

        // 성공한 이미지만 저장
        results.forEach((result) => {
          if (result.success) {
            uploadedImages.value[result.imageType] = result.imageUrl;
          }
        });

        return results;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "배치 이미지 업로드 실패";
        error.value = errorMessage;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    /**
     * 이미지 삭제
     *
     * @param office - 회사 코드
     * @param imageType - 삭제할 이미지 타입
     */
    async function deleteImage(
      office: string,
      imageType: string,
    ): Promise<void> {
      loading.value = true;
      error.value = null;

      try {
        await imageService.deleteImage(office, imageType);

        // 로컬 상태에서 제거
        delete uploadedImages.value[imageType];
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "이미지 삭제 실패";
        error.value = errorMessage;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    /**
     * 이미지 URL 직접 설정 (미리 로드된 이미지)
     *
     * @param imageType - 이미지 타입
     * @param url - 이미지 URL
     */
    function setImageUrl(imageType: string, url: string): void {
      uploadedImages.value[imageType] = url;
    }

    /**
     * 이미지 URL 제거
     *
     * @param imageType - 이미지 타입
     */
    function removeImageUrl(imageType: string): void {
      delete uploadedImages.value[imageType];
    }

    /**
     * 모든 이미지 초기화
     */
    function clearAllImages(): void {
      uploadedImages.value = {};
    }

    /**
     * 에러 메시지 초기화
     */
    function clearError(): void {
      error.value = null;
    }

    return {
      // State
      uploadedImages,
      loading,
      error,
      uploadProgress,
      uploadingFileName,

      // Getters
      getImageUrl,
      uploadedImageCount,
      isLoading,

      // Actions
      uploadImage,
      uploadImagesBatch,
      deleteImage,
      setImageUrl,
      removeImageUrl,
      clearAllImages,
      clearError,
    };
  },
  {
    persist: {
      key: "image-store",
      storage: localStorage,
      paths: ["uploadedImages"],
    },
  },
);
