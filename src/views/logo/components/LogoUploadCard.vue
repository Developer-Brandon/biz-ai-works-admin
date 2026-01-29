<template>
  <!-- 로고 업로드 카드 -->
  <div class="logo-upload-card">
    <a-upload
      action="#"
      :before-upload="handleUpload"
      :show-upload-list="false"
      accept="image/*"
      class="logo-uploader"
    >
      <div class="upload-content">
        <CloudUploadOutlined class="upload-icon" />
        <p class="upload-text">Add New Logo</p>
        <p class="upload-hint">Drag and drop an image, or click to select</p>
      </div>
    </a-upload>

    <div v-if="loading" class="upload-loading">
      <a-spin />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * LogoUploadCard 컴포넌트
 *
 * 역할: 새 로고 업로드
 * Props: loading
 * Emits: upload (파일 업로드)
 */

import { CloudUploadOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

interface Props {
  loading: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  upload: [file: File];
}>();

function handleUpload(file: File): boolean {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    message.error("이미지 파일만 업로드 가능합니다");
    return false;
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    message.error("5MB 이하의 파일만 업로드 가능합니다");
    return false;
  }

  emit("upload", file);
  return false;
}
</script>

<style scoped lang="scss">
.logo-upload-card {
  position: relative;
  background: #ffffff;
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  min-height: 300px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #1890ff;
    background: #f0f5ff;
  }
}

.logo-uploader {
  width: 100%;
  height: 100%;

  :deep(.ant-upload.ant-upload-drag) {
    border: none;
    background: transparent;
    padding: 0;

    &:hover {
      background: transparent;
    }
  }
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;

  .upload-icon {
    font-size: 48px;
    color: #1890ff;
    margin-bottom: 12px;
    animation: bounce 1s infinite;
  }

  .upload-text {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: 500;
    color: #262626;
  }

  .upload-hint {
    margin: 0;
    font-size: 12px;
    color: #8c8c8c;
  }
}

.upload-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@media (max-width: 768px) {
  .upload-content {
    padding: 30px 15px;

    .upload-icon {
      font-size: 36px;
      margin-bottom: 8px;
    }

    .upload-text {
      font-size: 14px;
    }

    .upload-hint {
      font-size: 11px;
    }
  }
}
</style>
