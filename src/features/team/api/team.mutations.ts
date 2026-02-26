import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRetroRoom, joinRetroRoom, leaveRetroRoom, updateRetroRoomName } from './team.api';
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

export function useLeaveRetroRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (retroRoomId: number) => leaveRetroRoom(retroRoomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamQueryKeys.rooms });
    },
  });
}
