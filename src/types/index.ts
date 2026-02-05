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
 * 카드 타입
 *
 * - chatCard: AI 챗봇 (에이전트 연결)
 * - questionCard: 자주 묻는 질문
 * - serviceCard: 서비스 링크
 */
export type CardType = "chatCard" | "questionCard" | "serviceCard";

/**
 * QA 카드 인터페이스
 *
 * 자주 묻는 질문과 답변을 저장합니다
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
 *
 * 외부 서비스나 링크를 연결합니다
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
 *
 * 단계별 작업 가이드
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
 *
 * 모든 카드 타입을 포함하는 인터페이스입니다
 * cardType에 따라 다른 필드가 사용됩니다:
 * - chatCard: agentId 사용
 * - questionCard: questionList 사용
 * - serviceCard: serviceContent 사용
 */
export interface Card {
  // 기본 필드
  id: string;
  office?: string;
  officeCode?: string;
  cardType: CardType;
  displayOrder?: number;

  // 콘텐츠 필드
  name: string;
  description?: string | null;
  cardThumbnailUrl?: string | null;

  // 타입별 필드
  // chatCard: agentId 사용
  agentId?: string | null;

  // questionCard: questionList 사용
  questionList?: string[];

  // serviceCard: serviceContent 사용
  serviceContent?: string | null;

  // 공통 필드
  content?: string | null;
  metadata?: Record<string, any>;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Agent Card 타입
 *
 * AI 챗봇 에이전트와 연결된 카드
 */
export interface AgentCard extends Card {
  cardType: "chatCard";
  agentId: string;
}

/**
 * Q&A Card 타입
 *
 * 자주 묻는 질문 모음
 */
export interface QaCardType extends Card {
  cardType: "questionCard";
  questionList: string[];
}

/**
 * Service Card 타입
 *
 * 서비스 설명 및 링크
 */
export interface ServiceCardType extends Card {
  cardType: "serviceCard";
  serviceContent: string;
}

/**
 * 카드 요청 타입 (API 요청용)
 */
export interface CardRequest extends Partial<Card> {
  cardId?: string;
  office?: string;
  officeCode?: string;
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
export interface ImageUploadResponse {
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
  createdAt: string;
  updatedAt: string;
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
  mainColorHexCode: string;
  mainHoverColorHexCode: string;
  subColorHexCode: string;
  subHoverColorHexCode: string;
  startGradientColor: string;
  endGradientColor: string;
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
 *
 * 챗봇, AI 어시스턴트 등 대화형 에이전트를 나타냅니다
 */
export interface Agent {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  icon?: string;
  type?: "llm" | "custom";
  config?: Record<string, any>;
  status?: "active" | "inactive";
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ========== Operation Responses ==========

/**
 * 작업 결과 인터페이스
 *
 * API 호출 결과를 나타냅니다
 */
export interface OperationResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

/**
 * API 응답 (일반적)
 *
 * 모든 API 응답의 기본 형식입니다
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * API 응답 (Agent List)
 *
 * 에이전트 목록 조회 응답
 */
export interface AgentListResponse extends ApiResponse<Agent[]> {}

/**
 * API 응답 (Card List)
 *
 * 카드 목록 조회 응답
 */
export interface CardListResponse extends ApiResponse<Card[]> {}

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
  createdAt: string;
  updatedAt: string;
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

// ========== Deployment ==========

/**
 * 배포 상태
 */
export type DeploymentStatus = "success" | "error" | "pending";

/**
 * 배포 결과
 */
export interface DeploymentResponse {
  status: DeploymentStatus;
  message: string;
  timestamp: string;
  details?: Record<string, any>;
}
