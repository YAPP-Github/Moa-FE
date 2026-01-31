import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { RetroRoomCreateRequest } from '@/shared/api/generated/index';
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
