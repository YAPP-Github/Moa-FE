import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { RetroRoomCreateRequest } from '@/shared/api/generated/index';
import { getApi } from '@/shared/api/generated/index';

const api = getApi();

export function useCreateRetroRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: RetroRoomCreateRequest) => api.createRetroRoom(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retroRooms'] });
    },
  });
}
