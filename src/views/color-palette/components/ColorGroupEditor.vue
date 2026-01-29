<template>
  <!-- 색상 그룹 에디터 -->
  <div class="color-group-editor">
    <!-- 그룹 제목 -->
    <h3 class="group-title">{{ title }}</h3>

    <!-- 메인 색상 -->
    <div class="color-item">
      <label class="color-label">Primary Color</label>

      <div class="color-input-wrapper">
        <!-- 색상 피커 -->
        <div
          class="color-preview"
          :style="{ backgroundColor: color }"
          @click="showColorPicker = !showColorPicker"
        />

        <!-- HEX 입력 -->
        <a-input
          :value="color"
          placeholder="#000000"
          @change="(e) => emit('update-color', e.target.value)"
          class="hex-input"
        />

        <!-- iro.js 색상 피커 (선택) -->
        <div v-if="showColorPicker" class="color-picker-wrapper">
          <div id="colorPicker" class="color-picker" />
        </div>
      </div>

      <!-- 색상 유효성 -->
      <div v-if="!isColorValid(color)" class="error-message">
        유효한 HEX 색상을 입력하세요 (#RRGGBB)
      </div>
    </div>

    <!-- 호버 색상 -->
    <div class="color-item">
      <label class="color-label">Hover Color</label>

      <div class="color-input-wrapper">
        <!-- 색상 프리뷰 -->
        <div
          class="color-preview"
          :style="{ backgroundColor: hoverColor }"
          @click="showHoverPicker = !showHoverPicker"
        />

        <!-- HEX 입력 -->
        <a-input
          :value="hoverColor"
          placeholder="#000000"
          @change="(e) => emit('update-hover-color', e.target.value)"
          class="hex-input"
        />
      </div>

      <!-- 색상 유효성 -->
      <div v-if="!isColorValid(hoverColor)" class="error-message">
        유효한 HEX 색상을 입력하세요
      </div>
    </div>

    <!-- 색상 비교 -->
    <div class="color-comparison">
      <div class="comparison-item">
        <span class="comparison-label">Normal</span>
        <div class="comparison-preview" :style="{ backgroundColor: color }" />
      </div>

      <span class="comparison-arrow">→</span>

      <div class="comparison-item">
        <span class="comparison-label">Hover</span>
        <div
          class="comparison-preview"
          :style="{ backgroundColor: hoverColor }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * ColorGroupEditor 컴포넌트
 *
 * 역할: 색상 쌍 (일반 + 호버) 편집
 * Props: title, color, hoverColor
 * Emits: update-color, update-hover-color
 *
 * iro.js 통합:
 * - 간단한 HEX 입력 방식 사용
 * - 향후 iro.js 추가 가능
 */

import { ref } from "vue";

interface Props {
  title: string;
  color: string;
  hoverColor: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update-color": [value: string];
  "update-hover-color": [value: string];
}>();

const showColorPicker = ref(false);
const showHoverPicker = ref(false);

/**
 * HEX 색상 유효성 검사
 */
function isColorValid(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color);
}
</script>

<style scoped lang="scss">
.color-group-editor {
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #1890ff;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
  }

  .group-title {
    margin: 0 0 20px 0;
    font-size: 16px;
    font-weight: 600;
    color: #262626;
    padding-bottom: 12px;
    border-bottom: 2px solid #1890ff;
  }
}

.color-item {
  margin-bottom: 16px;

  .color-label {
    display: block;
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #262626;
  }

  .color-input-wrapper {
    display: flex;
    gap: 8px;
    align-items: center;
    position: relative;

    .color-preview {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      border: 2px solid #f0f0f0;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.05);
        border-color: #1890ff;
        box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
      }
    }

    .hex-input {
      flex: 1;
      font-family: "Courier New", monospace;
      font-size: 13px;

      :deep(input) {
        text-transform: uppercase;
      }
    }

    .color-picker-wrapper {
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 8px;
      z-index: 100;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 12px;

      .color-picker {
        width: 200px;
        height: 200px;
      }
    }
  }

  .error-message {
    margin-top: 6px;
    font-size: 12px;
    color: #ff4d4f;
  }
}

.color-comparison {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  margin-top: 16px;

  .comparison-item {
    flex: 1;
    text-align: center;

    .comparison-label {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: #8c8c8c;
      margin-bottom: 8px;
    }

    .comparison-preview {
      width: 100%;
      height: 60px;
      border-radius: 6px;
      border: 1px solid #d9d9d9;
    }
  }

  .comparison-arrow {
    color: #8c8c8c;
    font-size: 16px;
    font-weight: 600;
  }
}

@media (max-width: 768px) {
  .color-group-editor {
    padding: 16px;
  }

  .color-item {
    margin-bottom: 12px;

    .color-input-wrapper {
      .color-preview {
        width: 40px;
        height: 40px;
      }
    }
  }
}
</style>
