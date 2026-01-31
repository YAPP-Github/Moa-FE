import { z } from 'zod';

export const signinSchema = z.object({
  nickname: z.string().min(1, '닉네임을 입력해주세요'),
  teamOption: z.enum(['create', 'join']).optional(),
  teamName: z.string().max(10, '팀 이름은 10글자 이내로 입력해주세요').optional(),
  inviteLink: z.string().optional(),
});

export type SigninFormData = z.infer<typeof signinSchema>;
