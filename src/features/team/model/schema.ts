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
  inviteUrl: z.url('올바른 링크를 입력해주세요.'),
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
  memberId: z.number(),
  nickname: z.string(),
  profileImageUrl: z.string().nullable(),
  joinedAt: z.string(),
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

export const updateRetroRoomNameResponseSchema = baseResponseSchema(z.null());

export const deleteRetroRoomResponseSchema = baseResponseSchema(z.null());
