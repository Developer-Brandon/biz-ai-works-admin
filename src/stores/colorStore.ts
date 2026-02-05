/**
 * Color Palette Pinia Store
 *
 * 색상 팔레트 데이터와 상태를 관리합니다
 * localStorage에 자동 저장됩니다
 * iro.js 라이브러리와 함께 사용됩니다
 *
 * 주요 상태:
 * - colorPalette: 현재 색상 팔레트
 * - defaultPalette: 기본 색상 팔레트
 * - loading: 로딩 상태
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ColorPalette } from "@/types";
import { colorService } from "@/services/colorService";

/**
 * Color Store 정의
 *
 * 색상 관리 전용 스토어입니다
 */
export const useColorStore = defineStore(
  "color",
  () => {
    // ========== State ==========

    /**
     * 현재 색상 팔레트
     * 서비스에 반영되는 색상들
     */
    const colorPalette = ref<ColorPalette>({
      mainColorHexCode: "#2563EB",
      mainHoverColorHexCode: "#1E40AF",
      subColorHexCode: "#10B981",
      subHoverColorHexCode: "#059669",
      startGradientColor: "#2563EB",
      endGradientColor: "#10B981",
    });

    /**
     * 기본 색상 팔레트
     * 리셋할 때 사용되는 초기값
     */
    const defaultPalette = ref<ColorPalette>({
      mainColorHexCode: "#2563EB",
      mainHoverColorHexCode: "#1E40AF",
      subColorHexCode: "#10B981",
      subHoverColorHexCode: "#059669",
      startGradientColor: "#2563EB",
      endGradientColor: "#10B981",
    });

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

    /**
     * 편집 중인지 여부
     */
    const isEditing = ref(false);

    /**
     * 이전 팔레트 (취소 시 사용)
     */
    const previousPalette = ref<ColorPalette | null>(null);

    // ========== Getters ==========

    /**
     * 변경 여부 확인
     */
    const hasChanges = computed(() => {
      return (
        JSON.stringify(colorPalette.value) !==
        JSON.stringify(defaultPalette.value)
      );
    });

    /**
     * 편집 가능 여부
     */
    const canEdit = computed(() => !isDeploying.value);

    /**
     * 로딩 또는 배포 중인지 확인
     */
    const isBusy = computed(() => loading.value || isDeploying.value);

    /**
     * 모든 색상이 유효한지 확인
     */
    const allColorsValid = computed(() => {
      const {
        mainColorHexCode,
        mainHoverColorHexCode,
        subColorHexCode,
        subHoverColorHexCode,
        startGradientColor,
        endGradientColor,
      } = colorPalette.value;

      return [
        mainColorHexCode,
        mainHoverColorHexCode,
        subColorHexCode,
        subHoverColorHexCode,
        startGradientColor,
        endGradientColor,
      ].every((color) => colorService.isValidHexColor(color));
    });

    // ========== Actions ==========

    /**
     * 색상 팔레트 조회
     *
     * @param office - 회사 코드
     */
    async function fetchColorPalette(office: string): Promise<void> {
      loading.value = true;
      error.value = null;

      try {
        const config = await colorService.getAppConfig(office);

        // API 응답에서 색상 정보 추출
        if (config && config.data) {
          const data = config.data;
          if (data.mainColorHexCode) {
            colorPalette.value.mainColorHexCode = data.mainColorHexCode;
          }
          if (data.mainHoverColorHexCode) {
            colorPalette.value.mainHoverColorHexCode =
              data.mainHoverColorHexCode;
          }
          if (data.subColorHexCode) {
            colorPalette.value.subColorHexCode = data.subColorHexCode;
          }
          if (data.subHoverColorHexCode) {
            colorPalette.value.subHoverColorHexCode = data.subHoverColorHexCode;
          }
          if (data.startGradientColor) {
            colorPalette.value.startGradientColor = data.startGradientColor;
          }
          if (data.endGradientColor) {
            colorPalette.value.endGradientColor = data.endGradientColor;
          }
        }

        defaultPalette.value = { ...colorPalette.value };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "색상 팔레트 조회 실패";
        error.value = errorMessage;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    /**
     * 기본 색상 팔레트 조회
     */
    async function fetchDefaultPalette(): Promise<void> {
      loading.value = true;
      error.value = null;

      try {
        const config = await colorService.getDefaultColorPalette();

        if (config && config.data) {
          const data = config.data;
          defaultPalette.value = {
            mainColorHexCode:
              data.mainColorHexCode || defaultPalette.value.mainColorHexCode,
            mainHoverColorHexCode:
              data.mainHoverColorHexCode ||
              defaultPalette.value.mainHoverColorHexCode,
            subColorHexCode:
              data.subColorHexCode || defaultPalette.value.subColorHexCode,
            subHoverColorHexCode:
              data.subHoverColorHexCode ||
              defaultPalette.value.subHoverColorHexCode,
            startGradientColor:
              data.startGradientColor ||
              defaultPalette.value.startGradientColor,
            endGradientColor:
              data.endGradientColor || defaultPalette.value.endGradientColor,
          };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "기본 팔레트 조회 실패";
        error.value = errorMessage;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    /**
     * 색상 팔레트 저장
     *
     * @param office - 회사 코드
     */
    async function saveColorPalette(office: string): Promise<void> {
      if (!allColorsValid.value) {
        error.value = "유효하지 않은 색상이 있습니다";
        return;
      }

      isDeploying.value = true;
      deployError.value = null;

      try {
        await colorService.saveColorPalette(office, colorPalette.value);
        defaultPalette.value = { ...colorPalette.value };
        isEditing.value = false;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "색상 팔레트 저장 실패";
        deployError.value = errorMessage;
        throw err;
      } finally {
        isDeploying.value = false;
      }
    }

    /**
     * 색상 업데이트
     *
     * @param key - 색상 키 (예: 'mainColorHexCode')
     * @param value - HEX 색상값
     */
    function updateColor(key: keyof ColorPalette, value: string): void {
      if (colorService.isValidHexColor(value)) {
        colorPalette.value[key] = value;
        isEditing.value = true;
      } else {
        error.value = `유효하지 않은 색상 형식: ${value}`;
      }
    }

    /**
     * 팔레트 초기화 (기본값으로 복구)
     */
    function resetPalette(): void {
      colorPalette.value = { ...defaultPalette.value };
      isEditing.value = false;
    }

    /**
     * 편집 취소
     */
    function cancelEdit(): void {
      if (previousPalette.value) {
        colorPalette.value = { ...previousPalette.value };
      }
      isEditing.value = false;
      previousPalette.value = null;
    }

    /**
     * 편집 시작
     */
    function startEdit(): void {
      previousPalette.value = { ...colorPalette.value };
      isEditing.value = true;
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
      colorPalette,
      defaultPalette,
      loading,
      error,
      isDeploying,
      deployError,
      isEditing,
      previousPalette,

      // Getters
      hasChanges,
      canEdit,
      isBusy,
      allColorsValid,

      // Actions
      fetchColorPalette,
      fetchDefaultPalette,
      saveColorPalette,
      updateColor,
      resetPalette,
      cancelEdit,
      startEdit,
      clearError,
      clearDeployError,
    };
  },
  {
    persist: {
      key: "color-store",
      storage: localStorage,
      pick: ["colorPalette", "defaultPalette"],
    },
  },
);
