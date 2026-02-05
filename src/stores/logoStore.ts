/**
 * Logo Pinia Store
 *
 * 로고 데이터와 상태를 중앙집중식으로 관리합니다
 * localStorage에 자동 저장됩니다
 *
 * 주요 상태:
 * - logos: 로고 목록
 * - selectedLogoId: 현재 선택된 로고 ID
 * - loading: 로딩 상태
 * - error: 에러 메시지
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Logo } from "@/types";
import { logoService } from "@/services/logoService";

/**
 * Logo Store 정의
 */
export const useLogoStore = defineStore(
  "logo",
  () => {
    // ========== State ==========

    /**
     * 로고 목록
     */
    const logos = ref<Logo[]>([]);

    /**
     * 현재 선택된 로고 ID
     * 서비스에 반영되는 로고
     */
    const selectedLogoId = ref<string | null>(null);

    /**
     * 로딩 상태
     */
    const loading = ref(false);

    /**
     * 에러 메시지
     */
    const error = ref<string | null>(null);

    /**
     * 배포 중 상태
     */
    const isDeploying = ref(false);

    /**
     * 배포 에러 메시지
     */
    const deployError = ref<string | null>(null);

    // ========== Getters ==========

    /**
     * 현재 선택된 로고 객체
     * ❗ undefined → null 로 명확히 통일
     */
    const selectedLogo = computed<Logo | null>(() => {
      if (!selectedLogoId.value) return null;
      return (
        logos.value.find((logo: Logo) => logo.id === selectedLogoId.value) ??
        null
      );
    });

    /**
     * 선택되지 않은 로고 목록
     */
    const unselectedLogos = computed(() => {
      return logos.value.filter((logo: Logo) => !logo.isSelected);
    });

    /**
     * 로고가 최대 개수(3개)에 도달했는지 확인
     */
    const isLogosFull = computed(() => {
      return logos.value.length >= 3;
    });

    /**
     * 선택 가능한 로고가 있는지 확인
     */
    const hasSelectableLogos = computed(() => {
      return logos.value.length > 0;
    });

    /**
     * 로딩 또는 배포 중인지 확인
     */
    const isBusy = computed(() => loading.value || isDeploying.value);

    // ========== Actions ==========

    /**
     * 로고 목록 조회
     *
     * @param office - 회사 코드
     */
    async function fetchLogos(office: string): Promise<void> {
      loading.value = true;
      error.value = null;

      try {
        logos.value = await logoService.getLogoList(office);

        // 선택된 로고 ID 업데이트
        const selected = logos.value.find((logo: Logo) => logo.isSelected);
        selectedLogoId.value = selected ? selected.id : null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "로고 목록 조회 실패";
        error.value = errorMessage;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    /**
     * 로고 파일 업로드
     *
     * @param office - 회사 코드
     * @param file - 업로드할 로고 파일
     */
    async function uploadLogo(office: string, file: File): Promise<Logo> {
      loading.value = true;
      error.value = null;

      try {
        const newLogo = await logoService.addLogo(office, file);
        logos.value.push(newLogo);
        return newLogo;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "로고 업로드 실패";
        error.value = errorMessage;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    /**
     * 로고 선택 (메인 로고로 설정)
     *
     * @param logoId - 선택할 로고 ID
     * @param office - 회사 코드
     */
    async function selectLogo(logoId: string, office: string): Promise<void> {
      loading.value = true;
      error.value = null;

      try {
        await logoService.selectLogo(logoId, office);

        // 로컬 상태 업데이트
        logos.value.forEach((logo: Logo) => {
          logo.isSelected = logo.id === logoId;
        });
        selectedLogoId.value = logoId;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "로고 선택 실패";
        error.value = errorMessage;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    /**
     * 로고 삭제
     *
     * @param logoId - 삭제할 로고 ID
     * @param office - 회사 코드
     */
    async function deleteLogo(logoId: string, office: string): Promise<void> {
      loading.value = true;
      error.value = null;

      try {
        await logoService.deleteLogo(logoId, office);

        // 로컬 상태 업데이트
        logos.value = logos.value.filter((logo: Logo) => logo.id !== logoId);

        // 삭제된 로고가 선택된 로고면 선택 해제
        if (selectedLogoId.value === logoId) {
          selectedLogoId.value = null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "로고 삭제 실패";
        error.value = errorMessage;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    /**
     * 에러 메시지 초기화
     */
    function clearError(): void {
      error.value = null;
    }

    /**
     * 배포 에러 초기화
     */
    function clearDeployError(): void {
      deployError.value = null;
    }

    return {
      // State
      logos,
      selectedLogoId,
      loading,
      error,
      isDeploying,
      deployError,

      // Getters
      selectedLogo,
      unselectedLogos,
      isLogosFull,
      hasSelectableLogos,
      isBusy,

      // Actions
      fetchLogos,
      uploadLogo,
      selectLogo,
      deleteLogo,
      clearError,
      clearDeployError,
    };
  },
  {
    persist: {
      key: "logo-store",
      storage: localStorage,
      pick: ["logos", "selectedLogoId"],
    },
  },
);
