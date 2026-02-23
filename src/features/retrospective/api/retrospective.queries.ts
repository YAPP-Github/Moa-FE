import { useQuery, useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';
import {
  getAnalysisResult,
  getRetrospectDetail,
  listComments,
  listReferences,
  listResponses,
  listRetrospects,
} from './retrospective.api';
import type { ResponseCategory } from '../model/types';
import { ApiError } from '@/shared/api/error';

export const retrospectiveQueryKeys = {
  list: (retroRoomId: number) => ['retrospects', retroRoomId] as const,
  detail: (retrospectId: number) => ['retrospect', retrospectId] as const,
  references: (retrospectId: number) => ['references', retrospectId] as const,
  responses: (retrospectId: number, category: string) =>
    ['responses', retrospectId, category] as const,
  comments: (responseId: number) => ['comments', responseId] as const,
  analysis: (retrospectId: number) => ['analysis', retrospectId] as const,
};

export function useRetrospects(retroRoomId: number) {
  return useSuspenseQuery({
    queryKey: retrospectiveQueryKeys.list(retroRoomId),
    queryFn: () => listRetrospects(retroRoomId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useRetrospectDetail(retrospectId: number) {
  return useSuspenseQuery({
    queryKey: retrospectiveQueryKeys.detail(retrospectId),
    queryFn: () => getRetrospectDetail(retrospectId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useReferences(retrospectId: number) {
  return useQuery({
    queryKey: retrospectiveQueryKeys.references(retrospectId),
    queryFn: () => listReferences(retrospectId),
    staleTime: 1000 * 60 * 5,
    enabled: !!retrospectId && retrospectId > 0,
  });
}

export function useResponses(retrospectId: number, category: ResponseCategory) {
  return useSuspenseQuery({
    queryKey: retrospectiveQueryKeys.responses(retrospectId, category),
    queryFn: () => listResponses(retrospectId, { category, size: 100 }),
    staleTime: 1000 * 60 * 2,
  });
}

export function useComments(responseId: number) {
  return useQuery({
    queryKey: retrospectiveQueryKeys.comments(responseId),
    queryFn: () => listComments(responseId, { size: 100 }),
    staleTime: 1000 * 60 * 2,
    enabled: !!responseId && responseId > 0,
  });
}

export function useAnalysisResult(retrospectId: number) {
  return useQuery({
    queryKey: retrospectiveQueryKeys.analysis(retrospectId),
    queryFn: () => getAnalysisResult(retrospectId),
    staleTime: 1000 * 60 * 5,
    retry: (_, error) => {
      if (error instanceof ApiError && error.status === 404) return false;
      return false;
    },
  });
}

export function useQuestionResponses(retrospectId: number, questionCategories: ResponseCategory[]) {
  return useSuspenseQueries({
    queries: questionCategories.map((category) => ({
      queryKey: retrospectiveQueryKeys.responses(retrospectId, category),
      queryFn: () => listResponses(retrospectId, { category, size: 100 }),
      staleTime: 1000 * 60 * 2,
    })),
  });
}
