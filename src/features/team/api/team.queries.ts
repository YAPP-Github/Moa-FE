import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getApi } from '@/shared/api/generated/index';

export function useRetroRooms() {
  return useQuery({
    queryKey: ['retroRooms'],
    queryFn: () => getApi().listRetroRooms(),
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
}

export function useUpdateRetroRoomName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ retroRoomId, name }: { retroRoomId: number; name: string }) =>
      getApi().updateRetroRoomName(retroRoomId, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retroRooms'] });
    },
  });
}

export function useDeleteRetroRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (retroRoomId: number) => getApi().deleteRetroRoom(retroRoomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retroRooms'] });
    },
  });
}
