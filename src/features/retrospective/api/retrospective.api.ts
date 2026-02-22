import { retrospectListResponseSchema } from '../model/schema';
import type {
  AnalysisResponse,
  AssistantRequest,
  AssistantResponse,
  BaseApiResponse,
  CreateCommentRequest,
  CreateRetrospectRequest,
  DraftSaveRequest,
  ListCommentsParams,
  ListCommentsResponse,
  ListResponsesParams,
  ReferenceItem,
  ResponsesListResponse,
  RetrospectDetailResponse,
  SubmitRetrospectRequest,
} from '../model/types';
import { customInstance } from '@/shared/api/instance';

export async function listRetrospects(retroRoomId: number) {
  const data = await customInstance({
    url: `/api/v1/retro-rooms/${retroRoomId}/retrospects`,
    method: 'GET',
  });
  return retrospectListResponseSchema.parse(data);
}

export function createRetrospect(request: CreateRetrospectRequest) {
  return customInstance<BaseApiResponse<{ retrospectId: number }>>({
    url: '/api/v1/retrospects',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: request,
  });
}

export function getRetrospectDetail(retrospectId: number) {
  return customInstance<BaseApiResponse<RetrospectDetailResponse>>({
    url: `/api/v1/retrospects/${retrospectId}`,
    method: 'GET',
  });
}

export function deleteRetrospect(retrospectId: number) {
  return customInstance<BaseApiResponse<null>>({
    url: `/api/v1/retrospects/${retrospectId}`,
    method: 'DELETE',
  });
}

export function getAnalysisResult(retrospectId: number) {
  return customInstance<BaseApiResponse<AnalysisResponse>>({
    url: `/api/v1/retrospects/${retrospectId}/analysis`,
    method: 'GET',
  });
}

export function analyzeRetrospective(retrospectId: number) {
  return customInstance<BaseApiResponse<AnalysisResponse>>({
    url: `/api/v1/retrospects/${retrospectId}/analysis`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: null,
  });
}

export function saveDraft(retrospectId: number, request: DraftSaveRequest) {
  return customInstance<BaseApiResponse<null>>({
    url: `/api/v1/retrospects/${retrospectId}/drafts`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: request,
  });
}

export function exportRetrospect(retrospectId: number) {
  return customInstance<void>({
    url: `/api/v1/retrospects/${retrospectId}/export`,
    method: 'GET',
  });
}

export function createParticipant(retrospectId: number) {
  return customInstance<BaseApiResponse<null>>({
    url: `/api/v1/retrospects/${retrospectId}/participants`,
    method: 'POST',
  });
}

export function listReferences(retrospectId: number) {
  return customInstance<BaseApiResponse<ReferenceItem[]>>({
    url: `/api/v1/retrospects/${retrospectId}/references`,
    method: 'GET',
  });
}

export function listResponses(retrospectId: number, params: ListResponsesParams) {
  return customInstance<BaseApiResponse<ResponsesListResponse>>({
    url: `/api/v1/retrospects/${retrospectId}/responses`,
    method: 'GET',
    params,
  });
}

export function submitRetrospect(retrospectId: number, request: SubmitRetrospectRequest) {
  return customInstance<BaseApiResponse<null>>({
    url: `/api/v1/retrospects/${retrospectId}/submit`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: request,
  });
}

export function assistantGuide(
  retrospectId: number,
  questionId: number,
  request: AssistantRequest
) {
  return customInstance<BaseApiResponse<AssistantResponse>>({
    url: `/api/v1/retrospects/${retrospectId}/questions/${questionId}/assistant`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: request,
  });
}

export function createComment(responseId: number, request: CreateCommentRequest) {
  return customInstance<BaseApiResponse<{ commentId: number }>>({
    url: `/api/v1/responses/${responseId}/comments`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: request,
  });
}

export function listComments(responseId: number, params?: ListCommentsParams) {
  return customInstance<BaseApiResponse<ListCommentsResponse>>({
    url: `/api/v1/responses/${responseId}/comments`,
    method: 'GET',
    params,
  });
}

export function toggleLike(responseId: number) {
  return customInstance<BaseApiResponse<{ liked: boolean }>>({
    url: `/api/v1/responses/${responseId}/likes`,
    method: 'POST',
  });
}
