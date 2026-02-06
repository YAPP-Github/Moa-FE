/**
 * 회고 완료 뷰 관련 타입 정의
 */

// 탭 타입
export type RetrospectiveTabType = 'content' | 'analysis';

// 완료된 회고 뷰 Props
export interface CompletedRetrospectiveViewProps {
  retrospectId: number;
  projectName: string;
  retrospectMethod: string;
  participantCount: number;
  totalParticipants: number;
  /** 타이틀 숨김 (모달에서 외부 헤더로 표시 시) */
  hideTitle?: boolean;
}
