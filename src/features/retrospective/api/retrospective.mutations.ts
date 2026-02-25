import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  analyzeRetrospective,
  assistantGuide,
  createComment,
  createParticipant,
  createRetrospect,
  deleteRetrospect,
  exportRetrospect,
  saveDraft,
  submitRetrospect,
  toggleLike,
} from './retrospective.api';
import { retrospectiveQueryKeys } from './retrospective.queries';
import type {
  AssistantRequest,
  CreateCommentRequest,
  CreateRetrospectRequest,
  DraftSaveRequest,
  SubmitRetrospectRequest,
} from '../model/types';
import { ApiError } from '@/shared/api/error';
import { toastStore } from '@/shared/ui/toast/Toast';

export function useCreateRetrospect(retroRoomId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateRetrospectRequest) => createRetrospect(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: retrospectiveQueryKeys.list(retroRoomId) });
    },
  });
}

export function useCreateParticipant(retrospectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createParticipant(retrospectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: retrospectiveQueryKeys.detail(retrospectId) });
    },
  });
}

export function useSubmitRetrospect(retrospectId: number) {
  return useMutation({
    mutationFn: (request: SubmitRetrospectRequest) => submitRetrospect(retrospectId, request),
  });
}

export function useAssistantGuide(retrospectId: number, questionId: number) {
  return useMutation({
    mutationFn: (request: AssistantRequest) => assistantGuide(retrospectId, questionId, request),
  });
}

export function useSaveDraft(retrospectId: number) {
  return useMutation({
    mutationFn: (request: DraftSaveRequest) => saveDraft(retrospectId, request),
  });
}

export function useDeleteRetrospect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (retrospectId: number) => deleteRetrospect(retrospectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retrospects'] });
    },
  });
}

export function useExportRetrospect() {
  return useMutation({
    mutationFn: (retrospectId: number) => exportRetrospect(retrospectId),
  });
}

export function useCreateComment(responseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateCommentRequest) => createComment(responseId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: retrospectiveQueryKeys.comments(responseId) });
      queryClient.invalidateQueries({ queryKey: ['responses'] });
    },
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (responseId: number) => toggleLike(responseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responses'] });
    },
  });
}

export function useAnalyzeRetrospective(retrospectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => analyzeRetrospective(retrospectId),
    onSuccess: (data) => {
      queryClient.setQueryData(retrospectiveQueryKeys.analysis(retrospectId), data);
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 409) {
        queryClient.refetchQueries({ queryKey: retrospectiveQueryKeys.analysis(retrospectId) });
        return;
      }
      const message = error instanceof ApiError ? error.message : '알 수 없는 오류가 발생했습니다';
      toastStore.getState().addToast({ variant: 'warning', message });
    },
    meta: { skipGlobalError: true },
  });
}
