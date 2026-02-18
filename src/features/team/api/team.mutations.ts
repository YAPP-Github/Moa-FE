import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRetroRoom, deleteRetroRoom, joinRetroRoom, updateRetroRoomName } from './team.api';
import { teamQueryKeys } from './team.queries';
import type { JoinRetroRoomRequest, RetroRoomCreateRequest } from '../model/types';

export function useCreateRetroRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: RetroRoomCreateRequest) => createRetroRoom(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamQueryKeys.rooms });
    },
  });
}

export function useJoinRetroRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: JoinRetroRoomRequest) => joinRetroRoom(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamQueryKeys.rooms });
    },
  });
}

export function useUpdateRetroRoomName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ retroRoomId, name }: { retroRoomId: number; name: string }) =>
      updateRetroRoomName(retroRoomId, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamQueryKeys.rooms });
    },
  });
}

export function useDeleteRetroRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (retroRoomId: number) => deleteRetroRoom(retroRoomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamQueryKeys.rooms });
    },
  });
}
