/**
 * 애플리케이션 전체 타입 정의
 *
 * 모든 인터페이스와 타입을 한곳에서 관리합니다
 * Vue3 + TypeScript 프로젝트
 */

// ========== Authentication ==========

/**
 * 인증 응답 타입
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    email: string;
    isInitialPassword: boolean;
  };
}

// ========== Cards (Contents) ==========

/**
 * 카드 타입 (QA 카드, 서비스 카드 등)
 */
export type CardType = "qaCard" | "serviceCard" | "operationCard";

/**
 * QA 카드 인터페이스
 */
export interface QaCard {
  id: string;
  question: string;
  answer: string;
  category: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 서비스 카드 인터페이스
 */
export interface ServiceCard {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  linkUrl: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 작업 카드 인터페이스
 */
export interface OperationCard {
  id: string;
  title: string;
  description: string;
  steps: string[];
  estimatedTime: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 통합 Card 타입
 */
export interface Card {
  id: string;
  officeCode: string;
  cardType: CardType;
  cardId: string;
  displayOrder: number;
  cardThumbnailUrl: string | null;
  name: string;
  description: string | null;
  agentId: string | null;
  content: string | null;
  metadata: Record<string, any>;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ========== Images ==========

/**
 * 이미지 인터페이스
 */
export interface Image {
  id: string;
  officeCode: string;
  key: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  uploadedBy: string;
  isDeleted?: boolean;
}

/**
 * 이미지 업로드 요청
 */
export interface ImageUploadRequest {
  officeCode: string;
  key: string;
  file: File;
}

/**
 * 이미지 업로드 결과
 */
export interface ImageUploadResult {
  success: boolean;
  message: string;
  data: {
    imageUrl: string;
    imageId: string;
  };
}

// ========== Logos ==========

/**
 * 로고 인터페이스
 */
export interface Logo {
  id: string;
  officeCode: string;
  logoUrl: string;
  logoName: string;
  order: number;
  isSelected: boolean;
  uploadedAt: string;
  uploadedBy: string;
  isDeleted?: boolean;
}

/**
 * 로고 업로드 응답
 */
export interface LogoUploadResponse {
  success: boolean;
  message: string;
  data: Logo;
}

// ========== Color Palette ==========

/**
 * 색상 팔레트 인터페이스
 */
export interface ColorPalette {
  id: string;
  officeCode: string;
  name: string;
  colors: ColorGroup[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 색상 그룹
 */
export interface ColorGroup {
  id: string;
  name: string;
  colors: ColorItem[];
  order: number;
}

/**
 * 색상 항목
 */
export interface ColorItem {
  id: string;
  name: string;
  hexValue: string;
  order: number;
}

// ========== Agents ==========

/**
 * AI 에이전트 인터페이스
 */
export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: "llm" | "custom";
  config: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ========== Operation Results ==========

/**
 * 작업 결과 인터페이스
 */
export interface OperationResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

/**
 * API 응답 (일반적)
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// ========== UI States ==========

/**
 * 로딩 상태
 */
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

/**
 * 에러 상태
 */
export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
}

// ========== App Portal Logo (Ant Design) ==========

/**
 * 앱 포탈 로고 (Ant Design 호환)
 */
export interface AppPortalLogo {
  id: string;
  officeCode: string;
  logoUrl: string;
  logoName: string;
  order: number;
  isSelected: boolean;
}

// ========== Breadcrumb ==========

/**
 * Breadcrumb 항목
 */
export interface BreadcrumbItem {
  label: string;
  path: string;
  active: boolean;
}
