/**
 * Test Auth Store (Pinia)
 *
 * 개발/테스트용 테스트 계정 관리
 * 프로덕션에서는 사용되지 않음 (import.meta.env.DEV 조건)
 *
 * Vue2 vs Vue3:
 * - Vue2: 상태 관리 옵션 API
 * - Vue3: Composition API 기반 함수형 스토어 (더 간단하고 타입 안전)
 */

import { defineStore } from "pinia";
import { ref } from "vue";

interface TestEmailList {
  [key: string]: string[];
}

export const useTestAuthStore = defineStore("testAuth", () => {
  // ========== State ==========

  /**
   * 테스트 이메일 목록
   *
   * 구조:
   * {
   *   회사코드: [이메일1, 이메일2, ...]
   * }
   */
  let testEmailList = ref<string[]>([]);

  /**
   * 테스트 비밀번호 (모든 테스트 계정 공통)
   *
   * 실제 개발 시:
   * - 환경 변수에서 로드
   * - 절대 코드에 하드코딩하지 않기
   */
  const testPassword = ref<string>("demo1234!!");

  // ========== Actions ==========

  /**
   * 특정 회사의 랜덤 테스트 계정 이메일 반환
   *
   * 동작:
   * 1. office 코드에 따라 테스트 이메일 목록 설정
   * 2. 배열을 Fisher-Yates 셔플 알고리즘으로 무작위 순서로 변경
   * 3. 첫 번째 항목 반환 (무작위)
   *
   * @param office - 회사 코드 ("oci", "komsco", "krc")
   * @returns 무작위로 선택된 테스트 이메일
   *
   * 사용 예시:
   * ```typescript
   * const email = getRandomTestEmail('komsco')
   * // "komsco@demo.co.kr" 또는 다른 계정 (무작위)
   * ```
   */
  function getRandomTestEmail(office: string): string {
    // 회사 코드에 따라 테스트 이메일 목록 설정
    const emailsByOffice: TestEmailList = {
      oci: ["oci@demo.co.kr"],
      komsco: [
        "komsco@demo.co.kr",
        "komsco_dev@demo.co.kr",
        "komsco_admin@demo.co.kr",
      ],
      krc: ["krc_bmt@demo.co.kr"],
    };

    // 요청한 회사의 이메일 목록 가져오기
    testEmailList.value = emailsByOffice[office] || [];

    if (testEmailList.value.length === 0) {
      console.warn(`⚠️ '${office}' 회사의 테스트 계정이 없습니다`);
      return "";
    }

    // Fisher-Yates 셔플 알고리즘으로 배열을 무작위로 섞음
    const shuffled = [...testEmailList.value];

    for (let i = shuffled.length - 1; i > 0; i--) {
      // 0부터 i까지의 무작위 인덱스 생성
      const j = Math.floor(Math.random() * (i + 1));

      // 요소 교환 (destructuring 이용)
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const randomEmail = shuffled[0];
    console.log(`🎲 무작위 테스트 이메일 선택: ${randomEmail}`);

    return randomEmail;
  }

  /**
   * 특정 회사의 모든 테스트 이메일 목록 조회
   *
   * @param office - 회사 코드
   * @returns 테스트 이메일 배열
   */
  function getTestEmailsByOffice(office: string): string[] {
    const emailsByOffice: TestEmailList = {
      oci: ["oci@demo.co.kr"],
      komsco: [
        "komsco@demo.co.kr",
        "komsco_dev@demo.co.kr",
        "komsco_admin@demo.co.kr",
      ],
      krc: ["krc_bmt@demo.co.kr"],
    };

    return emailsByOffice[office] || [];
  }

  /**
   * 첫 번째 테스트 이메일 반환 (항상 동일한 계정)
   *
   * @param office - 회사 코드
   * @returns 첫 번째 테스트 이메일
   */
  function getFirstTestEmail(office: string): string {
    const emails = getTestEmailsByOffice(office);

    if (emails.length === 0) {
      console.warn(`⚠️ '${office}' 회사의 테스트 계정이 없습니다`);
      return "";
    }

    const firstEmail = emails[0];
    console.log(`📧 첫 번째 테스트 이메일: ${firstEmail}`);

    return firstEmail;
  }

  return {
    // ========== State ==========
    testPassword,

    // ========== Actions ==========
    getRandomTestEmail,
    getTestEmailsByOffice,
    getFirstTestEmail,
  };
});

export type TestAuthStore = ReturnType<typeof useTestAuthStore>;
