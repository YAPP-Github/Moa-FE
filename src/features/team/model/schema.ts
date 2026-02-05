import { z } from 'zod';

export const createTeamSchema = z.object({
  teamName: z
    .string()
    .min(1, '팀 이름을 입력해주세요.')
    .max(10, '팀 이름은 10글자 이내로 입력해주세요.')
    .regex(/^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]+$/, '팀 이름은 한글, 영문, 숫자만 가능해요.'),
});

export type CreateTeamFormData = z.infer<typeof createTeamSchema>;

export const joinTeamSchema = z.object({
  inviteUrl: z.string().min(1, '초대 링크를 입력해주세요.'),
});

export type JoinTeamFormData = z.infer<typeof joinTeamSchema>;
