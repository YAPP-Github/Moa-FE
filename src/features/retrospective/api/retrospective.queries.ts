import { useQuery } from '@tanstack/react-query';
import { getApi } from '@/shared/api/generated/index';

export function useRetrospects(retroRoomId: number) {
  return useQuery({
    queryKey: ['retrospects', retroRoomId],
    queryFn: () => getApi().listRetrospects(retroRoomId),
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    enabled: !!retroRoomId && retroRoomId > 0,
  });
}
