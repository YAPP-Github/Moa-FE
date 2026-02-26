import { z } from 'zod';
import { baseResponseSchema } from '@/shared/api/schema';

// --- 폼 검증 ---

export const createTeamSchema = z.object({
  teamName: z
    .string()
    .trim()
    .min(1, '팀 이름을 입력해주세요.')
    .max(10, '팀 이름은 10글자 이내로 입력해주세요.')
    .regex(/^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\s]+$/, '팀 이름은 한글, 영문, 숫자만 가능해요.'),
});

export type CreateTeamFormData = z.infer<typeof createTeamSchema>;

export const joinTeamSchema = z.object({
  inviteUrl: z.string().min(1, '초대 코드를 입력해주세요.'),
});

export type JoinTeamFormData = z.infer<typeof joinTeamSchema>;

// --- API 응답 검증 ---

const retroRoomItemSchema = z.object({
  orderIndex: z.number(),
  retroRoomId: z.number(),
  retroRoomName: z.string(),
});

export type RetroRoomListItem = z.infer<typeof retroRoomItemSchema>;

export const retroRoomListResponseSchema = baseResponseSchema(z.array(retroRoomItemSchema));

const retroRoomMemberItemSchema = z.object({
  joinedAt: z.string(),
  memberId: z.number(),
  nickname: z.string(),
  role: z.string(),
});

export const retroRoomMembersResponseSchema = baseResponseSchema(
  z.array(retroRoomMemberItemSchema)
);

const retroRoomCreateResultSchema = z.object({
  retroRoomId: z.number(),
  title: z.string(),
  inviteCode: z.string(),
});

export const retroRoomCreateResponseSchema = baseResponseSchema(retroRoomCreateResultSchema);

const joinRetroRoomResultSchema = z.object({
  retroRoomId: z.number(),
  title: z.string(),
  joinedAt: z.string(),
});

export const joinRetroRoomResponseSchema = baseResponseSchema(joinRetroRoomResultSchema);

const updateRetroRoomNameResultSchema = z.object({
  retroRoomId: z.number(),
  retroRoomName: z.string(),
  updatedAt: z.string(),
});

export const updateRetroRoomNameResponseSchema = baseResponseSchema(
  updateRetroRoomNameResultSchema
);

const inviteCodeResultSchema = z.object({
  expiresAt: z.string(),
  inviteCode: z.string(),
  isExpired: z.boolean(),
  retroRoomId: z.number(),
});

export type InviteCodeResult = z.infer<typeof inviteCodeResultSchema>;

export const inviteCodeResponseSchema = baseResponseSchema(inviteCodeResultSchema);

const leaveRetroRoomResultSchema = z.object({
  leftAt: z.string(),
  retroRoomId: z.number(),
});

export const leaveRetroRoomResponseSchema = baseResponseSchema(leaveRetroRoomResultSchema);
