import {
  inviteCodeResponseSchema,
  joinRetroRoomResponseSchema,
  retroRoomCreateResponseSchema,
  retroRoomListResponseSchema,
  retroRoomMembersResponseSchema,
  updateRetroRoomNameResponseSchema,
} from '../model/schema';
import type {
  JoinRetroRoomRequest,
  RetroRoomCreateRequest,
  UpdateRetroRoomNameRequest,
} from '../model/types';
import { customInstance } from '@/shared/api/instance';

export async function listRetroRooms() {
  const data = await customInstance({
    url: '/api/v1/retro-rooms',
    method: 'GET',
  });
  return retroRoomListResponseSchema.parse(data);
}

export async function listRetroRoomMembers(retroRoomId: number) {
  const data = await customInstance({
    url: `/api/v1/retro-rooms/${retroRoomId}/members`,
    method: 'GET',
  });
  return retroRoomMembersResponseSchema.parse(data);
}

export async function createRetroRoom(request: RetroRoomCreateRequest) {
  const data = await customInstance({
    url: '/api/v1/retro-rooms',
    method: 'POST',
    data: request,
  });
  return retroRoomCreateResponseSchema.parse(data);
}

export async function joinRetroRoom(request: JoinRetroRoomRequest) {
  const data = await customInstance({
    url: '/api/v1/retro-rooms/join',
    method: 'POST',
    data: request,
  });
  return joinRetroRoomResponseSchema.parse(data);
}

export async function updateRetroRoomName(
  retroRoomId: number,
  request: UpdateRetroRoomNameRequest
) {
  const data = await customInstance({
    url: `/api/v1/retro-rooms/${retroRoomId}/name`,
    method: 'PATCH',
    data: request,
  });
  return updateRetroRoomNameResponseSchema.parse(data);
}

export async function deleteRetroRoom(retroRoomId: number) {
  await customInstance({
    url: `/api/v1/retro-rooms/${retroRoomId}`,
    method: 'DELETE',
  });
}

export async function getInviteCode(retroRoomId: number) {
  const data = await customInstance({
    url: `/api/v1/retro-rooms/${retroRoomId}/invite-code`,
    method: 'GET',
  });
  return inviteCodeResponseSchema.parse(data);
}
