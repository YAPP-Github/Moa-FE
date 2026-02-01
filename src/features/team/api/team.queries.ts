import { useQuery } from '@tanstack/react-query';
import { getApi } from '@/shared/api/generated/index';

export function useRetroRooms() {
  return useQuery({
    queryKey: ['retroRooms'],
    queryFn: () => getApi().listRetroRooms(),
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
}
