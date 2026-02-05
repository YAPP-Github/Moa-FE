/**
 * 회고 완료 뷰 관련 타입 정의
 */

// 탭 타입
export type RetrospectiveTabType = 'content' | 'analysis';

// 답변 데이터
export interface RetrospectiveAnswer {
  answerId: number;
  questionIndex: number;
  content: string;
  author: {
    id: number;
    name: string;
    profileImage?: string;
  };
  createdAt: string;
  likeCount: number;
  commentCount: number;
}

// AI 분석 결과 - 감정 키워드
export interface KeywordRanking {
  rank: number;
  emotion: string;
  keyword: string;
  description: string;
  relatedCount: number;
}

// AI 분석 결과 - 미션
export interface Mission {
  missionNumber: number;
  title: string;
  description: string;
}

// AI 분석 결과
export interface RetrospectiveAnalysis {
  isAnalyzed: boolean;
  insight?: {
    teamName: string;
    summary: string[];
  };
  keywords?: KeywordRanking[];
  missions?: Mission[];
}

// 완료된 회고 뷰 Props
export interface CompletedRetrospectiveViewProps {
  retrospectId: number;
  projectName: string;
  retrospectMethod: string;
  participantCount: number;
  totalParticipants: number;
}
