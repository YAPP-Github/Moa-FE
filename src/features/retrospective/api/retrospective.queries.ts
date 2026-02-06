import { useQuery } from '@tanstack/react-query';
import type { ResponseCategory } from '@/shared/api/generated/index';
import { getApi } from '@/shared/api/generated/index';

export function useRetrospects(retroRoomId: number) {
  return useQuery({
    queryKey: ['retrospects', retroRoomId],
    queryFn: () => getApi().listRetrospects(retroRoomId),
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    enabled: !!retroRoomId && retroRoomId > 0,
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
