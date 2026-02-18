import { useQuery } from '@tanstack/react-query';
import { listRetrospects } from './retrospective.api';
import type { ResponseCategory } from '@/shared/api/generated/index';
import { getApi } from '@/shared/api/generated/index';

export const retrospectiveQueryKeys = {
  list: (retroRoomId: number) => ['retrospects', retroRoomId] as const,
  detail: (retrospectId: number) => ['retrospect', retrospectId] as const,
  references: (retrospectId: number) => ['references', retrospectId] as const,
  responses: (retrospectId: number, category: string) =>
    ['responses', retrospectId, category] as const,
  comments: (responseId: number) => ['comments', responseId] as const,
};

export function useRetrospects(retroRoomId: number) {
  return useQuery({
    queryKey: retrospectiveQueryKeys.list(retroRoomId),
    queryFn: () => listRetrospects(retroRoomId),
    staleTime: 1000 * 60 * 5,
    enabled: retroRoomId > 0,
  });
}

export function useRetrospectDetail(retrospectId: number) {
  return useQuery({
    queryKey: ['retrospect', retrospectId],
    queryFn: () => getApi().getRetrospectDetail(retrospectId),
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    enabled: !!retrospectId && retrospectId > 0,
  });
}

export function useReferences(retrospectId: number) {
  return useQuery({
    queryKey: ['references', retrospectId],
    queryFn: () => getApi().listReferences(retrospectId),
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    enabled: !!retrospectId && retrospectId > 0,
  });
}

export function useResponses(retrospectId: number, category: ResponseCategory) {
  return useQuery({
    queryKey: ['responses', retrospectId, category],
    queryFn: () => getApi().listResponses(retrospectId, { category, size: 100 }),
    staleTime: 1000 * 60 * 2,
    enabled: !!retrospectId && retrospectId > 0,
  });
}

export function useComments(responseId: number) {
  return useQuery({
    queryKey: ['comments', responseId],
    queryFn: () => getApi().listComments(responseId, { size: 100 }),
    staleTime: 1000 * 60 * 2,
    enabled: !!responseId && responseId > 0,
  });
}
