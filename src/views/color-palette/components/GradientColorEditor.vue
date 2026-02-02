<template>
  <!-- 그라데이션 색상 에디터 -->
  <div class="gradient-color-editor">
    <!-- 제목 -->
    <h3 class="editor-title">Gradient Colors</h3>

    <!-- 그라데이션 미리보기 -->
    <div
      class="gradient-preview"
      :style="{
        background: `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`,
      }"
    />

    <!-- 시작 색상 -->
    <div class="color-group">
      <label class="color-label">Start Color</label>

      <div class="color-input-wrapper">
        <div class="color-preview" :style="{ backgroundColor: startColor }" />

        <a-input
          :value="startColor"
          placeholder="#000000"
          @change="
            (e: Event) =>
              emit('update-start', (e.target as HTMLInputElement).value)
          "
          class="hex-input"
        />
      </div>

      <div v-if="!isColorValid(startColor)" class="error-message">
        유효한 HEX 색상을 입력하세요
      </div>
    </div>

    <!-- 종료 색상 -->
    <div class="color-group">
      <label class="color-label">End Color</label>

      <div class="color-input-wrapper">
        <div class="color-preview" :style="{ backgroundColor: endColor }" />

        <a-input
          :value="endColor"
          placeholder="#ffffff"
          @change="
            (e: Event) =>
              emit('update-end', (e.target as HTMLInputElement).value)
          "
          class="hex-input"
        />
      </div>

      <div v-if="!isColorValid(endColor)" class="error-message">
        유효한 HEX 색상을 입력하세요
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * GradientColorEditor 컴포넌트
 *
 * 역할: 그라데이션 색상 쌍 편집
 * Props: startColor, endColor
 * Emits: update-start, update-end
 */

interface Props {
  startColor: string;
  endColor: string;
}

defineProps<Props>();

const emit = defineEmits<{
  "update-start": [value: string];
  "update-end": [value: string];
}>();

function isColorValid(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color);
}
</script>

<style scoped lang="scss">
.gradient-color-editor {
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #1890ff;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
  }

  .editor-title {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: #262626;
    padding-bottom: 12px;
    border-bottom: 2px solid #1890ff;
  }
}

.gradient-preview {
  width: 100%;
  height: 100px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.color-group {
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
  }

  .error-message {
    margin-top: 6px;
    font-size: 12px;
    color: #ff4d4f;
  }
}

@media (max-width: 768px) {
  .gradient-color-editor {
    padding: 16px;
  }

  .gradient-preview {
    height: 80px;
    margin-bottom: 16px;
  }
}
</style>
