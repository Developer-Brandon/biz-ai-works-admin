<template>
  <!-- 색상 팔레트 미리보기 -->
  <div class="color-palette-preview">
    <!-- Main Color 그룹 -->
    <div class="color-group">
      <h4 class="group-label">Main Color</h4>

      <div class="color-swatch-pair">
        <div class="swatch-item">
          <div
            class="swatch-color"
            :style="{ backgroundColor: colors.mainColorHexCode }"
          />
          <span class="swatch-label">Normal</span>
        </div>

        <div class="swatch-item">
          <div
            class="swatch-color"
            :style="{ backgroundColor: colors.mainHoverColorHexCode }"
          />
          <span class="swatch-label">Hover</span>
        </div>
      </div>
    </div>

    <!-- Sub Color 그룹 -->
    <div class="color-group">
      <h4 class="group-label">Sub Color</h4>

      <div class="color-swatch-pair">
        <div class="swatch-item">
          <div
            class="swatch-color"
            :style="{ backgroundColor: colors.subColorHexCode }"
          />
          <span class="swatch-label">Normal</span>
        </div>

        <div class="swatch-item">
          <div
            class="swatch-color"
            :style="{ backgroundColor: colors.subHoverColorHexCode }"
          />
          <span class="swatch-label">Hover</span>
        </div>
      </div>
    </div>

    <!-- Gradient 그룹 -->
    <div class="color-group full-width">
      <h4 class="group-label">Gradient</h4>

      <div
        class="gradient-swatch"
        :style="{
          background: `linear-gradient(135deg, ${colors.startGradientColor} 0%, ${colors.endGradientColor} 100%)`,
        }"
      />
    </div>

    <!-- 컴포넌트 샘플 -->
    <div class="component-samples">
      <h4 class="group-label">Component Samples</h4>

      <div class="sample-buttons">
        <!-- Main Color 버튼 -->
        <a-button
          type="primary"
          size="large"
          :style="{ backgroundColor: colors.mainColorHexCode }"
          class="sample-button"
        >
          Primary Button
        </a-button>

        <!-- Sub Color 버튼 -->
        <a-button
          size="large"
          :style="{
            backgroundColor: colors.subColorHexCode,
            borderColor: colors.subColorHexCode,
            color: '#ffffff',
          }"
          class="sample-button"
        >
          Secondary Button
        </a-button>
      </div>

      <!-- 텍스트 샘플 -->
      <div class="sample-text">
        <p :style="{ color: colors.mainColorHexCode }">
          This is main color text
        </p>
        <p :style="{ color: colors.subColorHexCode }">This is sub color text</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * ColorPalettePreview 컴포넌트
 *
 * 역할: 색상 팔레트 미리보기
 * Props: colors (색상 팔레트)
 */

import type { ColorPalette } from "@/types";

interface Props {
  colors: ColorPalette;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.color-palette-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.color-group {
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &.full-width {
    grid-column: 1 / -1;
  }

  .group-label {
    margin: 0 0 12px 0;
    font-size: 13px;
    font-weight: 600;
    color: #262626;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.color-swatch-pair {
  display: flex;
  gap: 12px;

  .swatch-item {
    flex: 1;
    text-align: center;

    .swatch-color {
      width: 100%;
      height: 80px;
      border-radius: 8px;
      margin-bottom: 8px;
      border: 1px solid #f0f0f0;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.02);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }

    .swatch-label {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: #8c8c8c;
    }
  }
}

.gradient-swatch {
  width: 100%;
  height: 100px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.component-samples {
  grid-column: 1 / -1;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 16px;

  .group-label {
    margin: 0 0 12px 0;
    font-size: 13px;
    font-weight: 600;
    color: #262626;
    text-transform: uppercase;
  }

  .sample-buttons {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;

    .sample-button {
      flex: 1;
      border: none !important;
    }
  }

  .sample-text {
    display: flex;
    flex-direction: column;
    gap: 8px;

    p {
      margin: 0;
      font-size: 14px;
      font-weight: 500;
    }
  }
}

@media (max-width: 768px) {
  .color-palette-preview {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .color-group {
    padding: 12px;

    &.full-width {
      grid-column: 1;
    }
  }

  .component-samples {
    padding: 12px;

    .sample-buttons {
      flex-direction: column;
      margin-bottom: 12px;
    }
  }
}
</style>
