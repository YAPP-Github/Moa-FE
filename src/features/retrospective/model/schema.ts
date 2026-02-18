import { z } from 'zod';
import { RetrospectMethod } from '@/shared/api/generated/index';
import { baseResponseSchema } from '@/shared/api/schema';

// 에러 메시지 상수
export const ERROR_MESSAGES = {
  EMPTY_QUESTION: '질문을 입력해주세요.',
  NO_QUESTIONS: '자유 회고는 최소 1개의 질문이 필요해요.',
  INVALID_URL: '올바른 URL 형식을 입력해주세요.',
} as const;

export const createRetrospectSchema = z
  .object({
    projectName: z
      .string()
      .min(1, '프로젝트 이름을 입력해주세요.')
      .max(20, '프로젝트 이름은 20자 이내로 입력해주세요.'),
    retrospectMethod: z.enum([
      RetrospectMethod.KPT,
      RetrospectMethod.FOUR_L,
      RetrospectMethod.FIVE_F,
      RetrospectMethod.PMI,
      RetrospectMethod.FREE,
    ]),
    retrospectDate: z.date(),
    retrospectTime: z
      .string()
      .min(1, '회고 시간을 입력해주세요.')
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, '올바른 시간 형식(HH:mm)을 입력해주세요.'),
    referenceUrls: z
      .array(z.string().url(ERROR_MESSAGES.INVALID_URL).or(z.literal('')))
      .max(10, '참고자료는 최대 10개까지 추가할 수 있어요.')
      .default([]),
    freeQuestions: z
      .array(z.string().min(1, ERROR_MESSAGES.EMPTY_QUESTION).or(z.literal('')))
      .max(5, '질문은 최대 5개까지 추가할 수 있어요.')
      .optional()
      .default([]),
  })
  .refine(
    (data) => {
      if (data.retrospectMethod === RetrospectMethod.FREE) {
        const validQuestions = data.freeQuestions?.filter((q) => q.trim() !== '') || [];
        return validQuestions.length >= 1;
      }
      return true;
    },
    {
      message: ERROR_MESSAGES.NO_QUESTIONS,
      path: ['freeQuestions'],
    }
  );

export type CreateRetrospectFormData = z.infer<typeof createRetrospectSchema>;

// --- API 응답 검증 ---

const retrospectListItemSchema = z.object({
  retrospectId: z.number(),
  projectName: z.string(),
  retrospectMethod: z.string(),
  retrospectDate: z.string(),
  retrospectTime: z.string(),
  participantCount: z.number(),
});

export const retrospectListResponseSchema = baseResponseSchema(z.array(retrospectListItemSchema));

export type RetrospectListItem = z.infer<typeof retrospectListItemSchema>;
