/**
 * Contents (Card) API 서비스
 *
 * AI Agent Card 관리와 관련된 모든 API 통신을 담당합니다
 * Swagger 기반: /api/app/info/card/*
 *
 * API 엔드포인트:
 * - POST /api/app/info/card/list - 카드 목록 조회
 * - POST /api/app/info/card/add - 카드 추가
 * - POST /api/app/info/card/update - 카드 수정
 * - POST /api/app/info/card/delete - 카드 삭제
 * - POST /api/app/info/card/order - 카드 순서 변경
 */

import { request } from "@/utils/request";
import type {
  Card,
  AgentCard,
  QaCard,
  ServiceCard,
  CardRequest,
  Agent,
  AgentListResponse,
  ApiResponse,
} from "@/types";

/**
 * 카드 목록 조회
 *
 * @param office - 회사 코드 (예: "ktds")
 * @returns Promise<카드 배열>
 *
 * 사용 예시:
 * ```typescript
 * const cards = await contentService.getCardList('ktds')
 * ```
 */
export async function getCardList(office: string): Promise<Card[]> {
  try {
    const response = await request.post<ApiResponse<Card[]>>(
      "/api/app/info/card/list",
      { office },
    );
    return response.data || [];
  } catch (error) {
    console.error("카드 목록 조회 실패:", error);
    throw error;
  }
}

/**
 * 카드 추가 (Agent Card 또는 Q&A Card)
 *
 * multipart/form-data 사용 (썸네일 파일 포함 가능)
 *
 * @param cardData - 카드 정보
 * @param thumbnailFile - 썸네일 이미지 파일 (선택)
 * @returns Promise<생성된 카드>
 *
 * 사용 예시:
 * ```typescript
 * const newCard = await contentService.addCard({
 *   office: 'ktds',
 *   cardType: 'chatCard',
 *   name: '사규 AI',
 *   description: '사내규정 안내',
 *   displayOrder: 1
 * })
 *
 * // 썸네일 이미지와 함께
 * const newCardWithImage = await contentService.addCard(
 *   {
 *     office: 'ktds',
 *     cardType: 'chatCard',
 *     name: '사규 AI',
 *     description: '사내규정 안내',
 *     displayOrder: 1
 *   },
 *   thumbnailFile
 * )
 * ```
 */
export async function addCard(
  cardData: Omit<CardRequest, "cardId">,
  thumbnailFile?: File,
): Promise<Card> {
  try {
    const formData = new FormData();

    // 카드 정보 추가
    formData.append("office", cardData.office);
    formData.append("cardType", cardData.cardType);
    if (cardData.name) formData.append("name", cardData.name);
    if (cardData.description)
      formData.append("description", cardData.description);
    if (cardData.displayOrder !== undefined) {
      formData.append("displayOrder", String(cardData.displayOrder));
    }

    // Q&A 카드 경우
    if (cardData.cardType === "questionCard" && cardData.questionList) {
      const questionStr = Array.isArray(cardData.questionList)
        ? JSON.stringify(cardData.questionList)
        : cardData.questionList;
      formData.append("questionList", questionStr);
    }

    // 썸네일 파일 추가
    if (thumbnailFile) {
      formData.append("thumbnailFile", thumbnailFile);
    }

    const response = await request.postFormData<Card>(
      "/api/app/info/card/add",
      formData,
    );
    return response;
  } catch (error) {
    console.error("카드 추가 실패:", error);
    throw error;
  }
}

/**
 * 카드 수정
 *
 * @param cardId - 수정할 카드 ID (UUID)
 * @param office - 회사 코드
 * @param cardData - 수정할 카드 정보
 * @returns Promise<수정된 카드>
 *
 * 사용 예시:
 * ```typescript
 * const updated = await contentService.updateCard(
 *   'card-uuid-123',
 *   'ktds',
 *   {
 *     name: '수정된 이름',
 *     description: '수정된 설명',
 *     displayOrder: 2
 *   }
 * )
 * ```
 */
export async function updateCard(
  cardId: string,
  office: string,
  cardData: Partial<CardRequest>,
): Promise<Card> {
  try {
    const payload = {
      office,
      cardId,
      ...cardData,
    };

    const response = await request.post<Card>(
      "/api/app/info/card/update",
      payload,
    );
    return response;
  } catch (error) {
    console.error("카드 수정 실패:", error);
    throw error;
  }
}

/**
 * 카드 삭제
 *
 * @param cardId - 삭제할 카드 ID (UUID)
 * @param office - 회사 코드
 * @returns Promise<void>
 *
 * 사용 예시:
 * ```typescript
 * await contentService.deleteCard('card-uuid-123', 'ktds')
 * ```
 */
export async function deleteCard(
  cardId: string,
  office: string,
): Promise<void> {
  try {
    await request.post("/api/app/info/card/delete", {
      office,
      cardId,
    });
  } catch (error) {
    console.error("카드 삭제 실패:", error);
    throw error;
  }
}

/**
 * 카드 순서 변경
 *
 * 화면에 표시되는 3개 카드의 순서를 변경합니다
 *
 * @param cardIds - 순서대로 정렬된 카드 ID 배열 (정확히 3개)
 * @param office - 회사 코드
 * @returns Promise<void>
 *
 * 사용 예시:
 * ```typescript
 * await contentService.updateCardOrder(
 *   ['card-uuid-001', 'card-uuid-002', 'card-uuid-003'],
 *   'ktds'
 * )
 * ```
 */
export async function updateCardOrder(
  cardIds: string[],
  office: string,
): Promise<void> {
  try {
    await request.post("/api/app/info/card/order", {
      office,
      cardIds,
    });
  } catch (error) {
    console.error("카드 순서 변경 실패:", error);
    throw error;
  }
}

/**
 * 에이전트 목록 조회
 *
 * 콘텐츠 편집 시 에이전트를 선택하기 위해 목록을 조회합니다
 *
 * @returns Promise<에이전트 배열>
 *
 * 사용 예시:
 * ```typescript
 * const agents = await contentService.getAgentList()
 * ```
 */
export async function getAgentList(): Promise<Agent[]> {
  try {
    const response = await request.post<ApiResponse<Agent[]>>(
      "/api/chat/agents/list",
      {
        mode: "agent",
        status: "normal",
      },
    );
    return response.data || [];
  } catch (error) {
    console.error("에이전트 목록 조회 실패:", error);
    throw error;
  }
}

/**
 * contentService 내보내기
 */
export const contentService = {
  getCardList,
  addCard,
  updateCard,
  deleteCard,
  updateCardOrder,
  getAgentList,
};

export default contentService;
