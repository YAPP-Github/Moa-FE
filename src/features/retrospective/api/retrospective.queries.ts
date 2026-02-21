import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import {
  getRetrospectDetail,
  listComments,
  listReferences,
  listResponses,
  listRetrospects,
} from './retrospective.api';
import type { ResponseCategory } from '../model/types';

export const retrospectiveQueryKeys = {
  list: (retroRoomId: number) => ['retrospects', retroRoomId] as const,
  detail: (retrospectId: number) => ['retrospect', retrospectId] as const,
  references: (retrospectId: number) => ['references', retrospectId] as const,
  responses: (retrospectId: number, category: string) =>
    ['responses', retrospectId, category] as const,
  comments: (responseId: number) => ['comments', responseId] as const,
};

export function useRetrospects(retroRoomId: number) {
  return useSuspenseQuery({
    queryKey: retrospectiveQueryKeys.list(retroRoomId),
    queryFn: () => listRetrospects(retroRoomId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useRetrospectDetail(retrospectId: number) {
  return useQuery({
    queryKey: retrospectiveQueryKeys.detail(retrospectId),
    queryFn: () => getRetrospectDetail(retrospectId),
    staleTime: 1000 * 60 * 5,
    enabled: !!retrospectId && retrospectId > 0,
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
  return useQuery({
    queryKey: retrospectiveQueryKeys.responses(retrospectId, category),
    queryFn: () => listResponses(retrospectId, { category, size: 100 }),
    staleTime: 1000 * 60 * 2,
    enabled: !!retrospectId && retrospectId > 0,
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
