import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { JoinRetroRoomRequest, RetroRoomCreateRequest } from '@/shared/api/generated/index';
import { getApi } from '@/shared/api/generated/index';

export function useCreateRetroRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: RetroRoomCreateRequest) => getApi().createRetroRoom(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retroRooms'] });
    },
  });
}

export function useJoinRetroRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: JoinRetroRoomRequest) => getApi().joinRetroRoom(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retroRooms'] });
    },
  });
}
