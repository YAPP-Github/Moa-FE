import { z } from 'zod';

export const signinSchema = z.object({
  nickname: z.string().min(1, '닉네임을 입력해주세요'),
  teamOption: z.enum(['create', 'join']).optional(),
  teamName: z.string().optional(),
  inviteLink: z.string().optional(),
});

export type SigninFormData = z.infer<typeof signinSchema>;
