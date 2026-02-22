import type { RetrospectMethod } from './constants';

/**
 * 회고 완료 뷰 관련 타입 정의
 */

// 탭 타입
export type RetrospectiveTabType = 'question' | 'member' | 'analysis';

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

// --- API 요청/응답 타입 (generated에서 복사) ---

export interface CreateRetrospectRequest {
  projectName: string;
  questions: string[];
  referenceUrls?: string[];
  retroRoomId: number;
  retrospectDate: string;
  retrospectMethod: RetrospectMethod;
}

export interface SubmitAnswerItem {
  content: string;
  questionNumber: number;
}

export interface SubmitRetrospectRequest {
  answers: SubmitAnswerItem[];
}

export interface AssistantRequest {
  content?: string | null;
}

export interface DraftItem {
  content?: string | null;
  questionNumber: number;
}

export interface DraftSaveRequest {
  drafts: DraftItem[];
}

export interface CreateCommentRequest {
  content: string;
}

export const ResponseCategory = {
  ALL: 'ALL',
  QUESTION_1: 'QUESTION_1',
  QUESTION_2: 'QUESTION_2',
  QUESTION_3: 'QUESTION_3',
  QUESTION_4: 'QUESTION_4',
  QUESTION_5: 'QUESTION_5',
} as const;

export type ResponseCategory = (typeof ResponseCategory)[keyof typeof ResponseCategory];

export interface ListResponsesParams {
  category: string;
  cursor?: number | null;
  size?: number | null;
}

export interface ListCommentsParams {
  cursor?: number | null;
  size?: number | null;
}

// --- API 응답 타입 (generated에서 복사) ---

export interface BaseApiResponse<T> {
  code: string;
  isSuccess: boolean;
  message: string;
  result: T;
}

export interface GuideItem {
  description: string;
  title: string;
}

export interface AssistantResponse {
  guideType: string;
  guides: GuideItem[];
  questionContent: string;
  questionId: number;
  remainingCount: number;
}

export interface RetrospectQuestionItem {
  content: string;
  index: number;
}

export interface RetrospectMemberItem {
  memberId: number;
  userName: string;
}

export interface RetrospectDetailResponse {
  currentUserStatus: 'NOT_JOINED' | 'DRAFT' | 'SUBMITTED';
  members: RetrospectMemberItem[];
  questions: RetrospectQuestionItem[];
  retroCategory: RetrospectMethod;
  retroRoomId: number;
  startTime: string;
  title: string;
  totalCommentCount: number;
  totalLikeCount: number;
}

export interface ReferenceItem {
  referenceId: number;
  url: string;
  urlName: string;
}

export interface ResponseListItem {
  commentCount: number;
  content: string;
  createdAt?: string;
  isLiked?: boolean;
  likeCount: number;
  responseId: number;
  userName: string;
}

export interface ResponsesListResponse {
  hasNext: boolean;
  nextCursor?: number | null;
  responses: ResponseListItem[];
}

export interface CommentItem {
  commentId: number;
  content: string;
  createdAt: string;
  memberId: number;
  userName: string;
}

export interface ListCommentsResponse {
  comments: CommentItem[];
  hasNext: boolean;
  nextCursor?: number | null;
}

// --- 분석 관련 타입 ---

export interface EmotionRankItem {
  count: number;
  description: string;
  label: string;
  rank: number;
}

export interface MissionItem {
  missionDesc: string;
  missionTitle: string;
}

export interface PersonalMissionItem {
  missions: MissionItem[];
  userId: number;
  userName: string;
}

export interface AnalysisResponse {
  emotionRank: EmotionRankItem[];
  insight: string;
  personalMissions: PersonalMissionItem[];
}
