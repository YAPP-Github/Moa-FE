import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateRetrospectRequest } from '@/shared/api/generated/index';
import { getApi } from '@/shared/api/generated/index';

export function useCreateRetrospect(retroRoomId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateRetrospectRequest) => getApi().createRetrospect(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retrospects', retroRoomId] });
    },
  });
}
