/**
 * src/utils/constants.ts
 *
 * 프로젝트 전체에서 사용되는 상수들을 중앙에서 관리합니다.
 *
 * 장점:
 * 1. 매직 넘버/문자열 제거 (코드 가독성 향상)
 * 2. 추후 서버로 마이그레이션 시 API 주소 한 곳만 수정
 * 3. 설정 관리 용이
 * 4. 타입 안정성 (TypeScript)
 *
 * 사용 예시:
 * import { API_BASE_URL, AGENT_TYPES } from '@/utils/constants'
 * fetch(`${API_BASE_URL}/${AGENT_TYPES.GPT_5}`)
 *
 * Vue2 vs Vue3:
 * - Vue2: main.js에서 Vue.prototype으로 등록
 * - Vue3: 각 파일에서 import해서 사용 (더 명시적)
 *
 * TypeScript 특징:
 * - as const를 사용하여 리터럴 타입 정의
 * - 인터페이스로 객체 구조 정의
 */

// ========== 타입 정의 ==========

/**
 * API 엔드포인트 인터페이스
 */
interface AuthEndpoints {
  PUBLIC_KEY: string;
  LOGIN: string;
  REFRESH: string;
  CHANGE_PASSWORD: string;
  CHANGE_INITIAL_PASSWORD: string;
  LOGIN_PAYLOAD: string;
}

interface ApiEndpoints {
  PREFIX: string;
  CHAT_SEND: string;
  CHAT_HISTORY: string;
  AGENTS: string;
  AGENT_DETAIL: string;
  USER_PROFILE: string;
  IMAGES: string;
  CONTENT: string;
  AUTH: AuthEndpoints;
}

/**
 * 에이전트 타입 인터페이스
 */
interface AgentTypes {
  GPT_5: string;
  GPT_4_1: string;
  GPT_4: string;
  SONNET_4_5: string;
}

/**
 * 메시지 타입 인터페이스
 */
interface MessageTypes {
  USER: string;
  ASSISTANT: string;
  SYSTEM: string;
}

/**
 * 메시지 텍스트 인터페이스
 */
interface Messages {
  LOADING: string;
  ERROR_NETWORK: string;
  ERROR_SERVER: string;
  ERROR_EMPTY_MESSAGE: string;
  SUCCESS_MESSAGE_SENT: string;
  ERROR_MESSAGE_SEND: string;
}

/**
 * 저장소 키 인터페이스
 */
interface StorageKeys {
  SAVED_EMAIL: string;
  USER_SESSION: string;
  ACCESS_TOKEN: string;
  REFRESH_TOKEN: string;
  CHAT_MESSAGES: string;
  USER_PREFERENCES: string;
}

/**
 * 검증 규칙 인터페이스
 */
interface ValidationRules {
  MESSAGE: {
    MIN_LENGTH: number;
    MAX_LENGTH: number;
  };
  EMAIL: {
    PATTERN: RegExp;
    MAX_LENGTH: number;
  };
  PASSWORD: {
    MIN_LENGTH: number;
    MAX_LENGTH: number;
    PATTERN: RegExp;
  };
}

/**
 * 타임아웃 설정 인터페이스
 */
interface Timeouts {
  API_REQUEST: number;
  MESSAGE_DEBOUNCE: number;
  TOAST_NOTIFICATION: number;
  DEFAULT: number;
  CHAT: number;
  FILE_UPLOAD: number;
}

/**
 * 메뉴 아이템 인터페이스
 */
interface MenuItem {
  id: number;
  label: string;
  icon: string;
  path: string;
}

/**
 * 파일 업로드 설정 인터페이스
 */
interface FileUploadConfig {
  ALLOWED_TYPES: string[];
  ALLOWED_MIME: string[];
  MAX_FILE_SIZE: number;
}

/**
 * 환경 변수 인터페이스
 */
interface EnvironmentConfig {
  BASE_API_URL: string | undefined;
  BASE_APP_NAME: string | undefined;
  NODE_ENV: string;
  IS_PRODUCTION: boolean;
  IS_DEVELOPMENT: boolean;
  LOGIN_PAGE_TITLE: string;
  MAIN_PAGE_TITLE: string;
}

// ========== API 설정 ==========

/**
 * API 기본 주소
 *
 * 🔀 환경에 따라 자동으로 결정됨:
 *
 * 로컬 개발 (npm run dev):
 * - import.meta.env.DEV = true
 * - API_BASE_URL = "http://172.190.116.61:18080"
 * - Vite proxy가 /api로 시작하는 요청을 자동으로 18080으로 라우팅
 *
 * 배포 (Vercel):
 * - import.meta.env.DEV = false
 * - API_BASE_URL = ""
 * - /api/... 상대 경로로 요청 (Vercel 프록시 api/ 폴더로 라우팅)
 *
 * 환경 변수 우선순위:
 * 1. .env.development (로컬) → VITE_API_URL="http://172.190.116.61:18080"
 * 2. .env.production (배포) → VITE_API_URL="" (선택사항)
 * 3. 기본값: import.meta.env.DEV에 따라 자동 결정
 *
 * Vue2 vs Vue3:
 * - Vue2: process.env 사용
 * - Vue3: import.meta.env 사용 (더 효율적)
 */
function getApiBaseUrl(): string {
  const envApiUrl = import.meta.env.VITE_API_URL;
  const isDev = import.meta.env.DEV;

  // 상세 로깅
  const debugInfo = {
    isDev,
    envApiUrl: envApiUrl || "(설정 안 함)",
    mode: import.meta.env.MODE,
  };

  console.log("🔍 [constants] API 설정:", debugInfo);

  // 우선순위 1: 환경 변수 명시적으로 설정된 경우
  if (envApiUrl !== undefined && envApiUrl !== "") {
    console.log(`✅ [constants] 환경 변수 사용: ${envApiUrl}`);
    return envApiUrl;
  }

  // 우선순위 2: 개발/배포 자동 감지
  if (isDev) {
    // 로컬 개발: 원본 백엔드 직접 호출
    const localApiUrl = "http://172.190.116.61:18080";
    console.log(`✅ [constants] 로컬 개발: ${localApiUrl}`);
    return localApiUrl;
  } else {
    // 배포: 상대 경로 (Vercel 프록시)
    console.log("✅ [constants] 배포 환경: 상대 경로 사용");
    return "";
  }
}

export const API_BASE_URL: string = getApiBaseUrl();

/**
 * HTTP 요청 기본 옵션
 * 모든 요청에 공통으로 적용될 설정
 */
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
} as const;

/**
 * API 엔드포인트
 *
 * 서버 API 구조:
 * - /api/chat/send - 메시지 전송
 * - /api/agents - AI Agent 목록
 * - /api/agents/{id} - 특정 Agent 정보
 *
 * 추후 서버 구축 후, 이 엔드포인트들을 서버에서 동적으로 받을 예정
 */
const PREFIX = "/api" as const;

export const API_ENDPOINTS: ApiEndpoints = {
  PREFIX,
  // 채팅
  CHAT_SEND: `${PREFIX}/chat/send`,
  CHAT_HISTORY: `${PREFIX}/chat/history`,
  // AI 에이전트
  AGENTS: `${PREFIX}/agents`,
  AGENT_DETAIL: `${PREFIX}/agents/:id`,
  // 사용자
  USER_PROFILE: `${PREFIX}/user/profile`,
  // 이미지 / 콘텐츠
  IMAGES: `${PREFIX}/images`,
  CONTENT: `${PREFIX}/content`,
  // 인증 (authApi.ts에서 사용)
  AUTH: {
    PUBLIC_KEY: `${PREFIX}/auth/public-key`,
    LOGIN: `${PREFIX}/auth/login`,
    REFRESH: `${PREFIX}/auth/refresh`,
    CHANGE_PASSWORD: `${PREFIX}/auth/change-password`,
    CHANGE_INITIAL_PASSWORD: `${PREFIX}/auth/change-initial-password`,
    LOGIN_PAYLOAD: `${PREFIX}/auth/login-payload`,
  },
};

// ========== AI Agent 설정 ==========

/**
 * 지원하는 AI Agent 모델들
 */
export const AGENT_TYPES: AgentTypes = {
  GPT_5: "GTP-5",
  GPT_4_1: "GTP-4.1",
  GPT_4: "GTP-4",
  SONNET_4_5: "Sonnet-4.5",
} as const;

/**
 * Agent별 설명
 */
export const AGENT_DESCRIPTIONS: Record<string, string> = {
  "GPT-5": "복잡한 분석, 고난이도 작업에 유리한 모델",
  "Sonnet 4.5": "높은 언어 이해로 일상적인 작업에 좋은 모델",
  "GPT-4.1": "빠른 속도와 안정적인 품질을 제공하는 모델",
  "GPT-4": "표준 업무, 반복 작업, 신뢰성 높은 모델",
} as const;

// ========== 메시지 설정 ==========

/**
 * 채팅 메시지 타입
 */
export const MESSAGE_TYPES: MessageTypes = {
  USER: "user",
  ASSISTANT: "assistant",
  SYSTEM: "system",
} as const;

/**
 * 사용자에게 보여줄 메시지들
 */
export const MESSAGES: Messages = {
  LOADING: "로딩 중입니다...",
  ERROR_NETWORK: "네트워크 연결을 확인해주세요.",
  ERROR_SERVER: "서버 오류가 발생했습니다.",
  ERROR_EMPTY_MESSAGE: "메시지를 입력해주세요.",
  SUCCESS_MESSAGE_SENT: "메시지가 전송되었습니다.",
  ERROR_MESSAGE_SEND: "메시지 전송에 실패했습니다.",
} as const;

// ========== 브라우저 저장소 ==========

/**
 * LocalStorage에서 사용되는 키들
 */
export const STORAGE_KEYS: StorageKeys = {
  // 인증 관련 (로그인 페이지)
  SAVED_EMAIL: "packaging_ai_saved_email",
  USER_SESSION: "packaging_ai_user_session",
  ACCESS_TOKEN: "packaging_ai_access_token",
  REFRESH_TOKEN: "packaging_ai_refresh_token",
  // 채팅 관련
  CHAT_MESSAGES: "packaging_ai_chat_messages",
  // 사용자 설정
  USER_PREFERENCES: "packaging_ai_user_preferences",
} as const;

// ========== 유효성 검사 ==========

/**
 * 입력값 검증 규칙
 */
export const VALIDATION_RULES: ValidationRules = {
  MESSAGE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 6000,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MAX_LENGTH: 255,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 100,
    // 숫자, 대문자, 소문자 포함 필수
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  },
} as const;

// ========== 타임아웃 설정 ==========

/**
 * 다양한 작업의 타임아웃 시간 (밀리초)
 */
export const TIMEOUTS: Timeouts = {
  API_REQUEST: 30000, // 30초
  MESSAGE_DEBOUNCE: 300, // 300ms
  TOAST_NOTIFICATION: 3000, // 3초
  DEFAULT: 30000, // 30초
  CHAT: 300000, // 5분 (채팅은 오래 걸릴 수 있음)
  FILE_UPLOAD: 600000, // 10분 (파일 업로드)
} as const;

// ========== 페이지 구성 ==========

/**
 * 메뉴 네비게이션 구조
 *
 * 추후 동적 메뉴 구성 시 이 데이터를 서버에서 받을 예정
 * 현재는 하드코딩 상태
 */
export const MENU_ITEMS: readonly MenuItem[] = [
  { id: 1, label: "AI Chat", icon: "chat", path: "/chat" },
] as const;

// ========== 파일 업로드 설정 ==========

/**
 * 문서 업로드 설정
 */
export const DOCUMENT_UPLOAD: FileUploadConfig = {
  ALLOWED_TYPES: ["txt", "pdf", "doc", "docx", "csv", "excel", "md", "html"],
  ALLOWED_MIME: [
    "text/plain",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/csv",
    "text/markdown",
    "text/html",
  ],
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

/**
 * 이미지 업로드 설정
 */
export const IMAGE_UPLOAD: FileUploadConfig = {
  ALLOWED_TYPES: ["png", "jpeg", "jpg", "gif", "webp"],
  ALLOWED_MIME: ["image/png", "image/jpeg", "image/gif", "image/webp"],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

// ========== VITE 환경 변수 ==========

/**
 * Vite 환경 변수
 *
 * .env 파일에서 VITE_ 접두사로 시작하는 변수만 접근 가능
 *
 * 예시 (.env.development):
 * VITE_API_URL=http://172.190.116.61:18080
 * VITE_APP_NAME=AI Web Service
 *
 * 예시 (.env.production):
 * VITE_API_URL=
 * VITE_APP_NAME=AI Web Service
 *
 * Vue2 vs Vue3:
 * - Vue2: process.env 사용
 * - Vue3: import.meta.env 사용 (더 효율적, 트리샤킹 가능)
 */
export const ENV: EnvironmentConfig = {
  BASE_API_URL: import.meta.env.VITE_API_URL,
  BASE_APP_NAME: import.meta.env.VITE_APP_NAME,
  NODE_ENV: import.meta.env.MODE,
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
  LOGIN_PAGE_TITLE: "Biz.AI - 로그인",
  MAIN_PAGE_TITLE: "Biz.AI - 메인",
} as const;

// ========== 타입 Export ==========
export type {
  AgentTypes,
  MessageTypes,
  Messages,
  StorageKeys,
  ValidationRules,
  Timeouts,
  MenuItem,
  FileUploadConfig,
  EnvironmentConfig,
  ApiEndpoints,
  AuthEndpoints,
};
