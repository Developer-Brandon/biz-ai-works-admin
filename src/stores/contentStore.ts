/**
 * Contents (Card) Pinia Store
 *
 * 카드 데이터와 상태를 중앙집중식으로 관리합니다
 * localhost에서는 mock 데이터 사용, 배포 시 API 사용
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
import { MOCK_CARDS, MOCK_AGENTS } from "./mockData";

/**
 * Mock 모드 여부 판단
 *
 * 개발 환경에서는 true, 배포 시 false로 변경
 */
const USE_MOCK_DATA = true; // 👈 false로 변경하면 실제 API 사용

export const useContentStore = defineStore(
  "content",
  () => {
    // ========== State (상태) ==========

    const cards = ref<Card[]>([]);
    const agents = ref<Agent[]>([]);
    const currentEditingCard = ref<Card | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const isDeploying = ref(false);
    const deployError = ref<string | null>(null);

    // ========== Getters (계산된 속성) ==========

    const displayCards = computed(() => {
      return cards.value
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        .slice(0, 3);
    });

    const agentCards = computed(() => {
      return cards.value.filter((card) => card.cardType === "chatCard");
    });

    const qaCards = computed(() => {
      return cards.value.filter((card) => card.cardType === "questionCard");
    });

    const serviceCards = computed(() => {
      return cards.value.filter((card) => card.cardType === "serviceCard");
    });

    const getCardById = computed(() => {
      return (cardId: string) => cards.value.find((card) => card.id === cardId);
    });

    const getAgentById = computed(() => {
      return (agentId: string) =>
        agents.value.find((agent) => agent.id === agentId);
    });

    const isBusy = computed(() => loading.value || isDeploying.value);

    // ========== Actions (비동기 작업) ==========

    /**
     * 카드 목록 조회
     *
     * Mock 데이터 또는 실제 API에서 조회합니다
     *
     * @param office - 회사 코드
     */
    async function fetchCards(office: string): Promise<void> {
      loading.value = true;
      error.value = null;

      try {
        // Mock 데이터 사용
        if (USE_MOCK_DATA) {
          console.log("📦 Mock 카드 데이터 로드됨");
          cards.value = MOCK_CARDS;
          // 약간의 지연을 줘서 실제 API처럼 보이게 함
          await new Promise((resolve) => setTimeout(resolve, 500));
        } else {
          // 실제 API 호출
          cards.value = await contentService.getCardList(office);
        }
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
     * Mock 데이터 또는 실제 API에서 조회합니다
     */
    async function fetchAgents(): Promise<void> {
      loading.value = true;
      error.value = null;

      try {
        // Mock 데이터 사용
        if (USE_MOCK_DATA) {
          console.log("📦 Mock 에이전트 데이터 로드됨");
          agents.value = MOCK_AGENTS;
          // 약간의 지연을 줘서 실제 API처럼 보이게 함
          await new Promise((resolve) => setTimeout(resolve, 300));
        } else {
          // 실제 API 호출
          agents.value = await contentService.getAgentList();
        }
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
     * Mock 모드에서는 메모리에만 추가되고,
     * API 모드에서는 서버에 저장됩니다
     */
    async function addCard(cardData: any, thumbnailFile?: File): Promise<Card> {
      loading.value = true;
      error.value = null;

      try {
        if (USE_MOCK_DATA) {
          // Mock: 새 카드 생성
          const newCard: Card = {
            id: `card-${Date.now()}`,
            office: cardData.office,
            name: cardData.name,
            description: cardData.description,
            cardType: cardData.cardType,
            agentId: cardData.agentId,
            questionList: cardData.questionList,
            serviceContent: cardData.serviceContent,
            cardThumbnailUrl: cardData.cardThumbnailUrl,
            displayOrder: cardData.displayOrder || cards.value.length + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          cards.value.push(newCard);
          console.log("✅ Mock 카드 추가됨:", newCard);
          return newCard;
        } else {
          const newCard = await contentService.addCard(cardData, thumbnailFile);
          cards.value.push(newCard);
          return newCard;
        }
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
     */
    async function updateCard(
      cardId: string,
      office: string,
      cardData: any,
    ): Promise<Card> {
      loading.value = true;
      error.value = null;

      try {
        if (USE_MOCK_DATA) {
          // Mock: 카드 업데이트
          const index = cards.value.findIndex((c) => c.id === cardId);
          if (index !== -1) {
            cards.value[index] = {
              ...cards.value[index],
              ...cardData,
              updatedAt: new Date().toISOString(),
            };
            console.log("✅ Mock 카드 수정됨:", cards.value[index]);
            return cards.value[index];
          }
          throw new Error("카드를 찾을 수 없습니다");
        } else {
          const updated = await contentService.updateCard(
            cardId,
            office,
            cardData,
          );
          const index = cards.value.findIndex((c) => c.id === cardId);
          if (index !== -1) {
            cards.value[index] = updated;
          }
          return updated;
        }
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
     */
    async function deleteCard(cardId: string, office: string): Promise<void> {
      loading.value = true;
      error.value = null;

      try {
        if (USE_MOCK_DATA) {
          // Mock: 카드 삭제
          cards.value = cards.value.filter((c) => c.id !== cardId);
          console.log("✅ Mock 카드 삭제됨:", cardId);
        } else {
          await contentService.deleteCard(cardId, office);
          cards.value = cards.value.filter((c) => c.id !== cardId);
        }
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
     */
    async function updateCardOrder(
      cardIds: string[],
      office: string,
    ): Promise<void> {
      loading.value = true;
      error.value = null;

      try {
        if (USE_MOCK_DATA) {
          // Mock: 카드 순서 업데이트
          cardIds.forEach((id, index) => {
            const card = cards.value.find((c) => c.id === id);
            if (card) {
              card.displayOrder = index;
            }
          });
          console.log("✅ Mock 카드 순서 변경됨");
        } else {
          await contentService.updateCardOrder(cardIds, office);
          cardIds.forEach((id, index) => {
            const card = cards.value.find((c) => c.id === id);
            if (card) {
              card.displayOrder = index;
            }
          });
        }
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
    },
  },
);
