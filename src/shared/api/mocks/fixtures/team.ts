export const retroRooms = [
  { orderIndex: 0, retroRoomId: 1, retroRoomName: 'Frontend Team' },
  { orderIndex: 1, retroRoomId: 2, retroRoomName: 'Backend Team' },
  { orderIndex: 2, retroRoomId: 3, retroRoomName: 'Design Team' },
];

export const retroRoomMembers: Record<
  number,
  { joinedAt: string; memberId: number; nickname: string; role: string }[]
> = {
  1: [
    { joinedAt: '2026-01-10T09:00:00', memberId: 1, nickname: '홍길동', role: 'OWNER' },
    { joinedAt: '2026-01-11T10:00:00', memberId: 2, nickname: '김철수', role: 'MEMBER' },
    { joinedAt: '2026-01-12T11:00:00', memberId: 3, nickname: '이영희', role: 'MEMBER' },
  ],
  2: [
    { joinedAt: '2026-01-15T09:00:00', memberId: 1, nickname: '홍길동', role: 'OWNER' },
    { joinedAt: '2026-01-16T10:00:00', memberId: 4, nickname: '박지민', role: 'MEMBER' },
  ],
  3: [
    { joinedAt: '2026-02-01T09:00:00', memberId: 5, nickname: '정수연', role: 'OWNER' },
    { joinedAt: '2026-02-02T10:00:00', memberId: 6, nickname: '최민호', role: 'MEMBER' },
    { joinedAt: '2026-02-03T11:00:00', memberId: 1, nickname: '홍길동', role: 'MEMBER' },
    { joinedAt: '2026-02-04T12:00:00', memberId: 2, nickname: '김철수', role: 'MEMBER' },
  ],
};

export const inviteCodes: Record<
  number,
  { expiresAt: string; inviteCode: string; isExpired: boolean; retroRoomId: number }
> = {
  1: {
    expiresAt: '2026-03-01T00:00:00',
    inviteCode: 'FRONT-INVITE-001',
    isExpired: false,
    retroRoomId: 1,
  },
  2: {
    expiresAt: '2026-03-01T00:00:00',
    inviteCode: 'BACK-INVITE-002',
    isExpired: false,
    retroRoomId: 2,
  },
  3: {
    expiresAt: '2026-03-01T00:00:00',
    inviteCode: 'DESIGN-INVITE-003',
    isExpired: false,
    retroRoomId: 3,
  },
};

let nextRoomId = 4;

export function getNextRoomId() {
  return nextRoomId++;
}
