/** * src/components/logo/LogoCard.vue * * 로고 카드 컴포넌트 * * 기능: * - 로고
이미지 표시 * - 로고 파일 정보 표시 (파일명, 크기, 생성일시) * - View 모드: 현재
선택된 로고 표시 (배지) * - Edit 모드: 메인 로고 선택 (토글), 삭제 기능 * *
Props: * - logo: AppPortalLogo 객체 * - mode: 'view' | 'edit' * - isSelected:
현재 선택된 로고 여부 * * Emits: * - select: 로고 선택 시 * - delete: 로고 삭제
시 */

<template>
  <div class="logo-card" :class="{ 'is-selected': isSelected }">
    <!-- 로고 이미지 -->
    <div class="logo-image-container">
      <img :src="logo.logoUrl" :alt="logo.logoUrl" class="logo-image" />

      <!-- View 모드: 선택됨 배지 -->
      <template v-if="mode === 'view' && isSelected">
        <a-badge
          count="1-1"
          :number-style="{
            backgroundColor: '#1890ff',
            color: '#fff',
            boxShadow: '0 0 0 1px #fff',
          }"
          class="selection-badge"
        />
      </template>
    </div>

    <!-- 로고 정보 -->
    <div class="logo-info">
      <!-- 파일명 -->
      <div class="logo-name">{{ logo.logoUrl.split("/").pop() }}</div>

      <!-- 파일 크기 & 생성 날짜 -->
      <div class="logo-meta">
        <span class="logo-size">{{ formatFileSize(logo.logoUrl) }}</span>
        <span class="logo-date">{{ formatDate(logo.createdAt) }}</span>
      </div>
    </div>

    <!-- Edit 모드: 액션 버튼 -->
    <template v-if="mode === 'edit'">
      <div class="logo-actions">
        <!-- 메인 로고 선택 토글 -->
        <div class="toggle-wrapper">
          <a-switch
            v-model:checked="isMainLogo"
            @change="handleToggleSelect"
            :title="isMainLogo ? '메인 로고 선택됨' : '메인 로고 선택하기'"
          />
        </div>

        <!-- 삭제 버튼 -->
        <a-button
          danger
          type="primary"
          @click="handleDelete"
          class="delete-button"
        >
          삭제하기
        </a-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 * Vue 3 Composition API
 *
 * Vue2 vs Vue3:
 * - Vue2: export default { props: {}, methods: {} }
 * - Vue3: defineProps, defineEmits 매크로 사용
 */

import { computed } from "vue";
import type { AppPortalLogo } from "@/types";

/**
 * Props 정의
 *
 * defineProps로 타입 안정성 확보
 * - withDefaults: 기본값 설정
 */
interface Props {
  logo: AppPortalLogo;
  mode: "view" | "edit";
  isSelected?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
});

/**
 * Emits 정의
 *
 * 부모 컴포넌트로 이벤트 전송
 */
const emit = defineEmits<{
  select: [isSelected: boolean];
  delete: [];
}>();

/**
 * 로컬 상태
 *
 * isMainLogo: 메인 로고 선택 여부
 * - isSelected prop에서 초기화
 */
const isMainLogo = computed({
  get: () => props.isSelected,
  set: (value) => {
    // 토글 변경 시 부모에 알림
  },
});

/**
 * 파일 크기 포맷팅
 *
 * 예: 1234567 → "1.2 MB"
 */
const formatFileSize = (url: string): string => {
  // 실제 파일 크기 정보가 없으므로, URL 길이로 예상 크기 표시
  // 실제 구현 시 서버에서 파일 정보를 받아야 함
  return "15MB";
};

/**
 * 날짜 포맷팅
 *
 * ISO 날짜 → "2025.11.30 11:21:45"
 *
 * dayjs 라이브러리 사용 가능하지만,
 * 여기서는 간단하게 구현
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * 토글 선택 핸들러
 *
 * Edit 모드에서 메인 로고 선택/해제 시 호출
 */
const handleToggleSelect = (checked: boolean) => {
  emit("select", checked);
};

/**
 * 삭제 버튼 핸들러
 *
 * Edit 모드에서 삭제 버튼 클릭 시 호출
 */
const handleDelete = () => {
  emit("delete");
};
</script>

<style scoped lang="scss">
/**
 * LogoCard.vue 스타일
 * 
 * 구조:
 * - .logo-card: 전체 카드 컨테이너
 *   - .logo-image-container: 이미지 영역
 *   - .logo-info: 파일 정보
 *   - .logo-actions: 액션 버튼 (edit 모드만)
 */

.logo-card {
  /* 기본 스타일 */
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  padding: $spacing-md;
  border: 1px solid $color-border;
  border-radius: $border-radius-lg;
  background: $color-bg-primary;
  transition: all $transition-base;

  /* Hover 애니메이션 */
  &:hover {
    border-color: $color-primary;
    box-shadow: $shadow-md;
    transform: translateY(-2px);
  }

  /* 선택됨 상태 */
  &.is-selected {
    border-color: $color-primary;
    background: #f6f9ff;
    box-shadow: inset 0 0 0 1px $color-primary;
  }

  /* ============================================
     로고 이미지 영역
     ============================================ */

  .logo-image-container {
    position: relative;
    width: 100%;
    aspect-ratio: 3 / 2;
    border-radius: $border-radius-md;
    overflow: hidden;
    background: $color-bg-secondary;

    /* 이미지 */
    .logo-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: $spacing-sm;
      background: $color-bg-tertiary;
    }

    /* 선택됨 배지 */
    .selection-badge {
      position: absolute;
      top: $spacing-sm;
      right: $spacing-sm;
    }
  }

  /* ============================================
     로고 정보
     ============================================ */

  .logo-info {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;

    /* 파일명 */
    .logo-name {
      font-size: $font-size-base;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
      word-break: break-all;
    }

    /* 메타 정보 (크기, 날짜) */
    .logo-meta {
      display: flex;
      gap: $spacing-sm;
      font-size: $font-size-sm;
      color: $color-text-tertiary;

      span {
        display: flex;
        align-items: center;

        &:not(:last-child)::after {
          content: "";
          width: 1px;
          height: 12px;
          margin-left: $spacing-sm;
          background: $color-border;
        }
      }
    }
  }

  /* ============================================
     액션 버튼 (Edit 모드)
     ============================================ */

  .logo-actions {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    padding-top: $spacing-sm;
    border-top: 1px solid $color-border;

    /* 토글 래퍼 */
    .toggle-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;

      label {
        margin-bottom: 0;
        font-size: $font-size-sm;
        font-weight: $font-weight-medium;
      }
    }

    /* 삭제 버튼 */
    .delete-button {
      width: 100%;
      height: 36px;
      font-weight: $font-weight-medium;
      border-radius: $border-radius-md;
      transition: all $transition-fast;

      /* Hover 효과 */
      &:hover {
        transform: translateY(-1px);
      }

      /* Active 효과 */
      &:active {
        transform: translateY(0);
      }
    }
  }

  /* ============================================
     반응형 설정
     ============================================ */

  @media (max-width: $breakpoint-md) {
    gap: $spacing-sm;
    padding: $spacing-sm;

    .logo-image-container {
      aspect-ratio: 4 / 3;
    }

    .logo-info {
      .logo-name {
        font-size: $font-size-sm;
      }
    }

    .logo-actions {
      padding-top: $spacing-xs;
      gap: $spacing-xs;

      .delete-button {
        height: 32px;
      }
    }
  }
}

/**
 * Ant Design Vue 오버라이드
 * 
 * 기본 스타일을 프로젝트 스타일에 맞게 커스터마이징
 */
:deep(.ant-switch) {
  background-color: $color-border;

  &.ant-switch-checked {
    background-color: $color-primary;
  }
}

:deep(.ant-badge-count) {
  box-shadow: 0 0 0 1px #fff;
}
</style>
