/**
 * Admin 포탈 전체 타입 정의
 *
 * Vue3 TypeScript에서:
 * - interface: 구조 정의 (확장 가능)
 * - type: 특정 값 정의 (Union, Intersection 등)
 * - generic <T>: 재사용 가능한 타입 매개변수
 *
 * Vue2 vs Vue3:
 * - Vue2: PropType<T> 필요, 런타임 유효성 검사
 * - Vue3: <script setup>에서 직접 타입 정의 가능
 */

// ============================================
// API 응답 래퍼
// ============================================

/**
 * 모든 TypeScript 타입 정의를 한곳에서 관리합니다
 */

/**
 * Breadcrumb 항목 타입
 *
 * @property label - 표시할 텍스트
 * @property path - 이동할 경로 (빈 문자열일 수 있음)
 * @property active - 현재 활성화 여부
 *
 * Vue2에서는 이런 타입이 없었지만,
 * Vue3 + TypeScript에서는 타입 안정성을 위해 필수입니다
 *
 * 사용 예시:
 * const breadcrumbItems: BreadcrumbItem[] = [
 *   { label: "Admin", path: "/admin", active: false },
 *   { label: "Contents", path: "/admin/contents", active: true },
 * ];
 */
export interface BreadcrumbItem {
  label: string;
  path: string;
  active: boolean;
}
/**
 * API 응답 기본 구조
 *
 * 모든 API 응답은 이 형식을 따릅니다:
 * {
 *   success: boolean
 *   code: string
 *   message: string
 *   data: T (실제 데이터)
 *   timestamp: string (ISO 형식)
 * }
 */
export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  totalCount?: number;
  timestamp: string;
}

/**
 * 페이지 처리 응답
 */
export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

// ============================================
// 카드 (Contents)
// ============================================

/**
 * 카드 타입
 *
 * - chatCard: 에이전트 소개 카드
 * - qaCard: Q&A 카드
 * - serviceCard: 서비스 카드
 */
export type CardType = "chatCard" | "qaCard" | "serviceCard";

/**
 * 카드 데이터 구조
 */
export interface Card {
  id: string;
  officeCode: string;
  cardType: CardType;
  cardId: string; // 에이전트 또는 서비스 ID
  displayOrder: number;
  cardThumbnailUrl: string | null;
  name: string;
  description: string | null;
  welcomeSnippet: string | null;
  questionList: string[] | null; // Q&A 카드용
  createdAt: string; // ISO 형식
  updatedAt: string;
  isDeleted?: boolean; // UI에서만 사용
}

/**
 * 카드 생성/업데이트 요청
 */
export interface CardRequest {
  office: string;
  cardId?: string;
  cardType: CardType;
  displayOrder: number;
  cardThumbnailUrl?: string;
  name: string;
  description?: string;
  questionList?: string[];
  welcomeSnippet?: string;
}

// ============================================
// 로고 (Logo)
// ============================================

/**
 * 로고 데이터 구조
 */
export interface AppPortalLogo {
  id: string;
  officeCode: string;
  logoUrl: string;
  isSelected: boolean;
  displayOrder: number;
  size?: number; // 파일 크기 (바이트)
  createdAt: string;
  updatedAt: string;
}

/**
 * 로고 업로드 요청
 */
export interface LogoUploadRequest {
  office: string;
  logoUrl: string;
}

// ============================================
// 색상 (Color Palette)
// ============================================

/**
 * 색상 팔레트 데이터 구조
 */
export interface ColorPalette {
  officeCode: string;
  mainColorHexCode: string; // 메인 색상 (#RRGGBB)
  mainHoverColorHexCode: string; // 메인 호버 색상
  subColorHexCode: string; // 서브 색상
  subHoverColorHexCode: string; // 서브 호버 색상
  startGradientColor: string; // 그라데이션 시작
  endGradientColor: string; // 그라데이션 종료
}

/**
 * 색상 팔레트 업데이트 요청
 */
export interface ColorPaletteRequest {
  office: string;
  mainColorHexCode?: string;
  mainHoverColorHexCode?: string;
  subColorHexCode?: string;
  subHoverColorHexCode?: string;
  startGradientColor?: string;
  endGradientColor?: string;
}

// ============================================
// 에이전트 (Agent)
// ============================================

/**
 * 에이전트 상태
 */
export type AgentStatus = "normal" | "disabled";

/**
 * 에이전트 모드
 */
export type AgentMode = "agent" | "chat";

/**
 * 에이전트 데이터 구조
 */
export interface Agent {
  id: string;
  name: string;
  description: string;
  mode: AgentMode;
  status: AgentStatus;
  enableApi: boolean;
  workflowId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 에이전트 목록 조회 요청
 */
export interface AgentListRequest {
  mode?: AgentMode;
  status?: AgentStatus;
  search?: string;
}

/**
 * 에이전트 목록 응답
 */
export interface AgentListResponse {
  agents: Agent[];
  total: number;
}

// ============================================
// 이미지 (Image)
// ============================================

/**
 * 이미지 타입
 */
export type ImageType =
  | "default_profile"
  | "opengraph"
  | "favicon"
  | "logo"
  | "pannel"
  | "expand_banner_pannel"
  | "expand_banner_pannel_background"
  | `card_image_${string}`;

/**
 * 이미지 업로드 응답
 */
export interface ImageUploadResponse {
  url: string;
}

/**
 * 이미지 업로드 요청 (FormData로 전송)
 */
export interface ImageUploadRequest {
  office: string;
  imageType: ImageType;
  file: File;
  cardId?: string;
  cardType?: CardType;
  displayOrder?: number;
  name?: string;
  description?: string;
  questionList?: string;
}

// ============================================
// 앱 설정 (App Info)
// ============================================

/**
 * 앱 기본 설정
 */
export interface AppInfoBasicConfig {
  office: string;
  opengraphDescription?: string;
  mainColorHexCode?: string;
  mainHoverColorHexCode?: string;
  subColorHexCode?: string;
  subHoverColorHexCode?: string;
  startGradientColor?: string;
  endGradientColor?: string;
}

/**
 * 앱 조회 요청
 */
export interface AppInfoRequest {
  office: string;
}

// ============================================
// 배포 (Deployment)
// ============================================

/**
 * 배포 상태
 */
export type DeploymentStatus = "idle" | "deploying" | "success" | "error";

/**
 * 배포 결과
 */
export interface DeploymentResult {
  status: DeploymentStatus;
  message: string;
  timestamp: string;
}

// ============================================
// 스토어 상태 (Pinia Store)
// ============================================

/**
 * 콘텐츠 스토어 상태
 */
export interface ContentStoreState {
  displayCards: Card[];
  agents: Agent[];
  loading: boolean;
  error: string | null;
  isDeploying: boolean;
  deploymentStatus: DeploymentStatus;
  deploymentMessage: string;
}

/**
 * 로고 스토어 상태
 */
export interface LogoStoreState {
  logos: AppPortalLogo[];
  selectedLogo: AppPortalLogo | null;
  loading: boolean;
  error: string | null;
  isDeploying: boolean;
  deploymentStatus: DeploymentStatus;
  deploymentMessage: string;
}

/**
 * 이미지 스토어 상태
 */
export interface ImageStoreState {
  uploadedImages: Map<string, string>; // cardId -> imageUrl
  loading: boolean;
  error: string | null;
}

/**
 * 색상 스토어 상태
 */
export interface ColorStoreState {
  colorPalette: ColorPalette | null;
  originalPalette: ColorPalette | null;
  loading: boolean;
  error: string | null;
  isDeploying: boolean;
  deploymentStatus: DeploymentStatus;
  deploymentMessage: string;
  hasChanges: boolean;
}

// ============================================
// UI 상태
// ============================================

/**
 * 페이지 모드
 */
export type PageMode = "view" | "edit";

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

// ============================================
// 폼 데이터
// ============================================

/**
 * 카드 폼 데이터 (로컬 상태)
 */
export interface CardFormData {
  cardId: string;
  cardType: CardType;
  name: string;
  description?: string;
  cardThumbnailUrl?: string;
  questionList?: string[];
  displayOrder: number;
}

/**
 * 로고 폼 데이터
 */
export interface LogoFormData {
  logoUrl: string;
  isSelected: boolean;
}

// ============================================
// 컴포넌트 Props (선택 사항)
// ============================================

/**
 * CardDisplayGroup Props
 */
export interface CardDisplayGroupProps {
  card: Card;
  cardNumber: number;
  agents: Agent[];
}

/**
 * ColorGroupEditorProps
 */
export interface ColorGroupEditorProps {
  title: string;
  color: string;
  hoverColor: string;
}

/**
 * GradientColorEditorProps
 */
export interface GradientColorEditorProps {
  startColor: string;
  endColor: string;
}

// ============================================
// 유틸 타입
// ============================================

/**
 * 비동기 작업 결과
 */
export interface AsyncResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

/**
 * 페이지네이션 정보
 */
export interface PaginationInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/**
 * 정렬 정보
 */
export interface SortInfo {
  field: string;
  direction: "asc" | "desc";
}

/**
 * 필터 정보
 */
export interface FilterInfo {
  status?: string;
  search?: string;
  dateRange?: [string, string];
}
