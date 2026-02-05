import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  AssistantRequest,
  CreateRetrospectRequest,
  DraftSaveRequest,
  SubmitRetrospectRequest,
} from '@/shared/api/generated/index';
import { getApi } from '@/shared/api/generated/index';

export function useCreateRetrospect(retroRoomId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateRetrospectRequest) => getApi().createRetrospect(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retrospects', retroRoomId] });
    },
  });
}

/**
 * 회고 참석자 등록 (회고 시작)
 * API-014: POST /api/v1/retrospects/{retrospectId}/participants
 */
export function useCreateParticipant(retrospectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => getApi().createParticipant(retrospectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retrospect', retrospectId] });
    },
  });
}

/**
 * 회고 최종 제출 (회고 완료)
 * API-017: POST /api/v1/retrospects/{retrospectId}/submit
 */
export function useSubmitRetrospect(retrospectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SubmitRetrospectRequest) =>
      getApi().submitRetrospect(retrospectId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retrospect', retrospectId] });
      queryClient.invalidateQueries({ queryKey: ['retrospects'] });
    },
  });
}

/**
 * AI 어시스턴트 가이드
 * API-029: POST /api/v1/retrospects/{retrospectId}/questions/{questionId}/assistant
 */
export function useAssistantGuide(retrospectId: number, questionId: number) {
  return useMutation({
    mutationFn: (request: AssistantRequest) =>
      getApi().assistantGuide(retrospectId, questionId, request),
  });
}

/**
 * 회고 답변 임시 저장
 * API-016: PUT /api/v1/retrospects/{retrospectId}/drafts
 */
export function useSaveDraft(retrospectId: number) {
  return useMutation({
    mutationFn: (request: DraftSaveRequest) => getApi().saveDraft(retrospectId, request),
  });
}

/**
 * 회고 삭제
 * API-009: DELETE /api/v1/retrospects/{retrospectId}
 */
export function useDeleteRetrospect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (retrospectId: number) => getApi().deleteRetrospect(retrospectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retrospects'] });
    },
  });
}

/**
 * 회고 내보내기
 * API-010: GET /api/v1/retrospects/{retrospectId}/export
 */
export function useExportRetrospect() {
  return useMutation({
    mutationFn: (retrospectId: number) => getApi().exportRetrospect(retrospectId),
  });
}
