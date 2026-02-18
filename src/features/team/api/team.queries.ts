import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getInviteCode, listRetroRoomMembers, listRetroRooms } from './team.api';

export const teamQueryKeys = {
  rooms: ['retroRooms'] as const,
  members: (retroRoomId: number) => ['retroRoomMembers', retroRoomId] as const,
  inviteCode: (retroRoomId: number) => ['inviteCode', retroRoomId] as const,
};

export function useRetroRooms() {
  return useSuspenseQuery({
    queryKey: teamQueryKeys.rooms,
    queryFn: listRetroRooms,
    staleTime: 1000 * 60 * 5,
  });
}

export function useRetroRoomMembers(retroRoomId: number) {
  return useQuery({
    queryKey: teamQueryKeys.members(retroRoomId),
    queryFn: () => listRetroRoomMembers(retroRoomId),
    staleTime: 1000 * 60 * 5,
    enabled: retroRoomId > 0,
  });
}

export function useInviteCode(retroRoomId: number, enabled = true) {
  return useQuery({
    queryKey: teamQueryKeys.inviteCode(retroRoomId),
    queryFn: () => getInviteCode(retroRoomId),
    staleTime: 1000 * 60 * 5,
    enabled: enabled && retroRoomId > 0,
  });
}
