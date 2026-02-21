import { z } from 'zod';
import { MAX_QUESTIONS, MAX_REFERENCE_URLS, RetrospectMethod } from './constants';
import { baseResponseSchema } from '@/shared/api/schema';

// 에러 메시지 상수
export const ERROR_MESSAGES = {
  EMPTY_QUESTION: '질문을 입력해주세요.',
  NO_QUESTIONS: '최소 1개의 질문이 필요해요.',
  QUESTION_TOO_LONG: '질문은 300자 이내로 입력해주세요.',
  EMPTY_URL: '링크를 입력해주세요.',
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
    referenceUrls: z
      .array(z.string().url(ERROR_MESSAGES.INVALID_URL).or(z.literal('')))
      .max(MAX_REFERENCE_URLS, `참고자료는 최대 ${MAX_REFERENCE_URLS}개까지 추가할 수 있어요.`)
      .default([]),
    questions: z
      .array(z.string().max(300, ERROR_MESSAGES.QUESTION_TOO_LONG).or(z.literal('')))
      .max(MAX_QUESTIONS, `질문은 최대 ${MAX_QUESTIONS}개까지 추가할 수 있어요.`)
      .default([]),
  })
  .refine(
    (data) => {
      const validQuestions = data.questions.filter((q) => q.trim() !== '');
      return validQuestions.length >= 1;
    },
    {
      message: ERROR_MESSAGES.NO_QUESTIONS,
      path: ['questions'],
    }
  );

export type CreateRetrospectFormData = z.infer<typeof createRetrospectSchema>;

// --- API 응답 검증 ---

const retrospectListItemSchema = z.object({
  retrospectId: z.number(),
  projectName: z.string(),
  retrospectMethod: z.string(),
  retrospectDate: z.string(),
  participantCount: z.number(),
  status: z.string(),
});

export const retrospectListResponseSchema = baseResponseSchema(z.array(retrospectListItemSchema));

export type RetrospectListItem = z.infer<typeof retrospectListItemSchema>;
