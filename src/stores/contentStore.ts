/**
 * Contents (Card) Pinia Store
 *
 * 카드 데이터와 상태를 중앙집중식으로 관리합니다
 * localStorage에 자동 저장됩니다 (pinia-plugin-persistedstate)
 *
 * 주요 상태:
 * - cards: 카드 목록
 * - agents: 에이전트 목록
 * - loading: 로딩 상태
 * - error: 에러 메시지
 * - currentEditingCard: 현재 편집 중인 카드
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  Card,
  AgentCard,
  QaCard,
  ServiceCard,
  Agent,
  OperationResult,
} from "@/types";
import { contentService } from "@/services/contentService";

/**
 * Content Store 정의
 *
 * persist 옵션으로 자동 localStorage 저장 설정
 * 저장할 상태: cards, agents, currentEditingCard
 */
export const useContentStore = defineStore(
  "content",
  () => {
    // ========== State (상태) ==========

    /**
     * 카드 목록
     * 서비스에서 조회한 모든 카드를 저장합니다
     */
    const cards = ref<Card[]>([]);

    /**
     * 에이전트 목록
     * 카드 편집 시 에이전트를 선택하기 위해 필요합니다
     */
    const agents = ref<Agent[]>([]);

    /**
     * 현재 편집 중인 카드
     * 카드 편집 페이지에서 사용됩니다
     */
    const currentEditingCard = ref<Card | null>(null);

    /**
     * 로딩 상태
     * API 요청 중일 때 true
     */
    const loading = ref(false);

    /**
     * 에러 메시지
     * API 오류 발생 시 설정됩니다
     */
    const error = ref<string | null>(null);

    /**
     * 배포 중 상태
     * 카드를 서비스에 배포할 때 사용
     */
    const isDeploying = ref(false);

    /**
     * 배포 에러 메시지
     */
    const deployError = ref<string | null>(null);

    // ========== Getters (계산된 속성) ==========

    /**
     * 표시할 카드 목록 (최대 3개)
     *
     * displayOrder 순서대로 정렬된 상위 3개 카드만 반환
     */
    const displayCards = computed(() => {
      return cards.value
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        .slice(0, 3);
    });

    /**
     * Agent Card 목록만 필터링
     */
    const agentCards = computed(() => {
      return cards.value.filter((card) => card.cardType === "chatCard");
    });

    /**
     * Q&A Card 목록만 필터링
     */
    const qaCards = computed(() => {
      return cards.value.filter((card) => card.cardType === "questionCard");
    });

    /**
     * Service Card 목록만 필터링
     */
    const serviceCards = computed(() => {
      return cards.value.filter((card) => card.cardType === "serviceCard");
    });

    /**
     * 특정 카드를 ID로 조회
     */
    const getCardById = computed(() => {
      return (cardId: string) => cards.value.find((card) => card.id === cardId);
    });

    /**
     * 특정 에이전트를 ID로 조회
     */
    const getAgentById = computed(() => {
      return (agentId: string) =>
        agents.value.find((agent) => agent.id === agentId);
    });

    /**
     * 로딩 또는 배포 중인지 확인
     */
    const isBusy = computed(() => loading.value || isDeploying.value);

    // ========== Actions (비동기 작업) ==========

    /**
     * 카드 목록 조회
     *
     * @param office - 회사 코드
     * @throws Error - API 요청 실패 시
     *
     * 사용 예시:
     * ```typescript
     * const contentStore = useContentStore()
     * await contentStore.fetchCards('ktds')
     * ```
     */
    async function fetchCards(office: string): Promise<void> {
      loading.value = true;
      error.value = null;

      try {
        cards.value = await contentService.getCardList(office);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "카드 목록 조회 실패";
        error.value = errorMessage;
        console.error("카드 목록 조회 실패:", err);
        throw err;
      } finally {
        loading.value = false;
      }
    }

    /**
     * 에이전트 목록 조회
     *
     * @throws Error - API 요청 실패 시
     */
    async function fetchAgents(): Promise<void> {
      loading.value = true;
      error.value = null;

      try {
        agents.value = await contentService.getAgentList();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "에이전트 목록 조회 실패";
        error.value = errorMessage;
        console.error("에이전트 목록 조회 실패:", err);
        throw err;
      } finally {
        loading.value = false;
      }
    }

    /**
     * 카드 추가
     *
     * @param cardData - 추가할 카드 정보
     * @param thumbnailFile - 썸네일 이미지 파일 (선택)
     * @returns 생성된 카드
     */
    async function addCard(cardData: any, thumbnailFile?: File): Promise<Card> {
      loading.value = true;
      error.value = null;

      try {
        const newCard = await contentService.addCard(cardData, thumbnailFile);
        cards.value.push(newCard);
        return newCard;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "카드 추가 실패";
        error.value = errorMessage;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    /**
     * 카드 수정
     *
     * @param cardId - 수정할 카드 ID
     * @param office - 회사 코드
     * @param cardData - 수정할 정보
     * @returns 수정된 카드
     */
    async function updateCard(
      cardId: string,
      office: string,
      cardData: any,
    ): Promise<Card> {
      loading.value = true;
      error.value = null;

      try {
        const updated = await contentService.updateCard(
          cardId,
          office,
          cardData,
        );

        // 상태의 카드 업데이트
        const index = cards.value.findIndex((c) => c.id === cardId);
        if (index !== -1) {
          cards.value[index] = updated;
        }

        return updated;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "카드 수정 실패";
        error.value = errorMessage;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    /**
     * 카드 삭제
     *
     * @param cardId - 삭제할 카드 ID
     * @param office - 회사 코드
     */
    async function deleteCard(cardId: string, office: string): Promise<void> {
      loading.value = true;
      error.value = null;

      try {
        await contentService.deleteCard(cardId, office);

        // 상태에서 카드 제거
        cards.value = cards.value.filter((c) => c.id !== cardId);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "카드 삭제 실패";
        error.value = errorMessage;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    /**
     * 카드 순서 변경
     *
     * @param cardIds - 순서대로 정렬된 카드 ID 배열
     * @param office - 회사 코드
     */
    async function updateCardOrder(
      cardIds: string[],
      office: string,
    ): Promise<void> {
      loading.value = true;
      error.value = null;

      try {
        await contentService.updateCardOrder(cardIds, office);

        // 로컬 상태 업데이트
        cardIds.forEach((id, index) => {
          const card = cards.value.find((c) => c.id === id);
          if (card) {
            card.displayOrder = index;
          }
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "카드 순서 변경 실패";
        error.value = errorMessage;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    /**
     * 편집할 카드 설정
     *
     * @param card - 편집할 카드
     */
    function setEditingCard(card: Card | null): void {
      currentEditingCard.value = card;
    }

    /**
     * 에러 메시지 초기화
     */
    function clearError(): void {
      error.value = null;
    }

    /**
     * 배포 에러 초기화
     */
    function clearDeployError(): void {
      deployError.value = null;
    }

    return {
      // State
      cards,
      agents,
      currentEditingCard,
      loading,
      error,
      isDeploying,
      deployError,

      // Getters
      displayCards,
      agentCards,
      qaCards,
      serviceCards,
      getCardById,
      getAgentById,
      isBusy,

      // Actions
      fetchCards,
      fetchAgents,
      addCard,
      updateCard,
      deleteCard,
      updateCardOrder,
      setEditingCard,
      clearError,
      clearDeployError,
    };
  },
  {
    persist: {
      key: "content-store",
      storage: localStorage,
      paths: ["cards", "agents", "currentEditingCard"],
    },
  },
);
