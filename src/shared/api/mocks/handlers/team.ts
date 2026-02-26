import { http } from 'msw';
import { getNextRoomId, inviteCodes, retroRoomMembers, retroRooms } from '../fixtures/team';
import { successResponse } from '../utils';

export const teamHandlers = [
  // GET /api/v1/retro-rooms — 팀 목록
  http.get('/api/v1/retro-rooms', () => {
    return successResponse(retroRooms);
  }),

  // POST /api/v1/retro-rooms — 팀 생성
  http.post('/api/v1/retro-rooms', async ({ request }) => {
    const body = (await request.json()) as { title: string };
    const newId = getNextRoomId();
    const newRoom = {
      orderIndex: retroRooms.length,
      retroRoomId: newId,
      retroRoomName: body.title,
    };
    retroRooms.push(newRoom);

    return successResponse({
      retroRoomId: newId,
      title: body.title,
      inviteCode: `INVITE-${newId}`,
    });
  }),

  // POST /api/v1/retro-rooms/:retroRoomId/leave — 팀 나가기
  http.post('/api/v1/retro-rooms/:retroRoomId/leave', ({ params }) => {
    const roomId = Number(params.retroRoomId);
    const index = retroRooms.findIndex((r) => r.retroRoomId === roomId);
    if (index !== -1) retroRooms.splice(index, 1);
    return successResponse({
      leftAt: new Date().toISOString(),
      retroRoomId: roomId,
    });
  }),

  // PATCH /api/v1/retro-rooms/:retroRoomId/name — 팀 이름 수정
  http.patch('/api/v1/retro-rooms/:retroRoomId/name', async ({ params, request }) => {
    const roomId = Number(params.retroRoomId);
    const body = (await request.json()) as { name: string };
    const room = retroRooms.find((r) => r.retroRoomId === roomId);
    if (room) room.retroRoomName = body.name;

    return successResponse({
      retroRoomId: roomId,
      retroRoomName: body.name,
      updatedAt: new Date().toISOString(),
    });
  }),

  // POST /api/v1/retro-rooms/join — 팀 참여
  http.post('/api/v1/retro-rooms/join', () => {
    return successResponse({
      retroRoomId: 1,
      title: 'Frontend Team',
      joinedAt: new Date().toISOString(),
    });
  }),

  // GET /api/v1/retro-rooms/:retroRoomId/invite-code — 초대 코드
  http.get('/api/v1/retro-rooms/:retroRoomId/invite-code', ({ params }) => {
    const roomId = Number(params.retroRoomId);
    const code = inviteCodes[roomId] ?? {
      expiresAt: '2026-03-01T00:00:00',
      inviteCode: `INVITE-${roomId}`,
      isExpired: false,
      retroRoomId: roomId,
    };
    return successResponse(code);
  }),

  // GET /api/v1/retro-rooms/:retroRoomId/members — 팀 멤버 목록
  http.get('/api/v1/retro-rooms/:retroRoomId/members', ({ params }) => {
    const roomId = Number(params.retroRoomId);
    const members = retroRoomMembers[roomId] ?? [];
    return successResponse(members);
  }),
];
