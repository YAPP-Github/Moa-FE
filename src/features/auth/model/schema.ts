import { z } from 'zod';
import { baseResponseSchema } from '@/shared/api/schema';

// --- 폼 검증 ---

export const signinSchema = z.object({
  nickname: z.string().min(1, '닉네임을 입력해주세요'),
  teamOption: z.enum(['create', 'join']).optional(),
  teamName: z
    .string()
    .trim()
    .min(1, '팀 이름을 입력해주세요')
    .max(10, '팀 이름은 10글자 이내로 입력해주세요')
    .regex(/^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\s]+$/, '팀 이름은 한글, 영문, 숫자만 가능해요.')
    .optional(),
  inviteLink: z.url('올바른 링크를 입력해주세요').optional().or(z.literal('')),
});

export type SigninFormData = z.infer<typeof signinSchema>;

// --- API 응답 검증 ---

const profileResultSchema = z.object({
  memberId: z.number(),
  email: z.string(),
  nickname: z.string().nullable().optional(),
  socialType: z.enum(['Google', 'Kakao']),
  createdAt: z.string(),
  insightCount: z.number(),
});

export const profileResponseSchema = baseResponseSchema(profileResultSchema);
export type ProfileResult = z.infer<typeof profileResultSchema>;

const socialLoginResultSchema = z.object({
  isNewMember: z.boolean(),
});

export const socialLoginResponseSchema = baseResponseSchema(socialLoginResultSchema);
export type SocialLoginResult = z.infer<typeof socialLoginResultSchema>;

const signupResultSchema = z.object({
  memberId: z.number(),
  nickname: z.string(),
});

export const signupResponseSchema = baseResponseSchema(signupResultSchema);
export type SignupResult = z.infer<typeof signupResultSchema>;

export const withdrawResponseSchema = baseResponseSchema(z.unknown().nullable());
export type WithdrawResponse = z.infer<typeof withdrawResponseSchema>;
