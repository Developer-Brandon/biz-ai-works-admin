/**
 * Mock 데이터
 *
 * 개발 단계에서 백엔드 API가 준비되지 않았을 때 사용합니다
 * 실제 API 연동 시 삭제해도 됩니다
 */

import type { Card, Agent } from "@/types";

/**
 * Mock Agent 데이터
 *
 * 실제 에이전트 목록
 */
export const MOCK_AGENTS: Agent[] = [
  {
    id: "agent-001",
    name: "사규 AI",
    description: "사내규정 및 정책 안내",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=agent001",
    status: "active",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-02-04T14:30:00Z",
  },
  {
    id: "agent-002",
    name: "온보딩AI",
    description: "-",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=agent003",
    status: "active",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-04T11:00:00Z",
  },
  {
    id: "agent-003",
    name: "자주묻는 질문",
    description: "-",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=agent002",
    status: "active",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-02-03T09:15:00Z",
  },
];

/**
 * Mock Card 데이터
 *
 * 서비스에 표시될 3개의 카드
 * 다양한 타입의 카드를 포함합니다
 */
export const MOCK_CARDS: Card[] = [
  {
    id: "card-001",
    office: "ktds",
    name: "사규 AI",
    description: "사내 규정 및 정책에 대한 모든 질문을 해주세요",
    cardType: "chatCard",
    agentId: "agent-001",
    cardThumbnailUrl: "",
    displayOrder: 1,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-02-04T14:30:00Z",
  },
  {
    id: "card-002",
    office: "ktds",
    name: "IT 기술 지원",
    description: "-",
    cardType: "chatCard",
    agentId: "agent-002",
    cardThumbnailUrl: "",
    displayOrder: 2,
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-04T11:00:00Z",
  },
  {
    id: "card-003",
    office: "ktds",
    name: "자주 묻는 질문",
    description: "많이 질문받는 내용을 모았습니다",
    cardType: "questionCard",
    questionList: [
      "휴가 신청은 어떻게 하나요?",
      "보험료는 언제 공제되나요?",
      "퇴직금은 어떻게 계산되나요?",
      "해외 출장 신청 절차는?",
      "경조사 휴가는 며칠인가요?",
    ],
    cardThumbnailUrl: "",
    displayOrder: 3,
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-02-02T13:20:00Z",
  },
];

/**
 * Mock 데이터 초기화 함수
 *
 * 필요할 때만 호출하면 됩니다
 */
export function getInitialMockData() {
  return {
    cards: MOCK_CARDS,
    agents: MOCK_AGENTS,
  };
}
