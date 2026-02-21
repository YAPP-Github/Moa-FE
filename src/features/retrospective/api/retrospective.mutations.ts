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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SubmitRetrospectRequest) => submitRetrospect(retrospectId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: retrospectiveQueryKeys.detail(retrospectId) });
      queryClient.invalidateQueries({ queryKey: ['retrospects'] });
    },
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
  return useMutation({
    mutationFn: () => analyzeRetrospective(retrospectId),
  });
}
