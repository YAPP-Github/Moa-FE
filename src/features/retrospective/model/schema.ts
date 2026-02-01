import { z } from 'zod';
import { RetrospectMethod } from '@/shared/api/generated/index';

export const createRetrospectSchema = z.object({
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
    .array(z.string().url('올바른 URL 형식을 입력해주세요.').or(z.literal('')))
    .max(10, '참고자료는 최대 10개까지 추가할 수 있어요.')
    .default([]),
});

export type CreateRetrospectFormData = z.infer<typeof createRetrospectSchema>;

// 회고 방식 라벨 매핑
export const RETROSPECT_METHOD_LABELS: Record<string, string> = {
  [RetrospectMethod.KPT]: 'KPT',
  [RetrospectMethod.FOUR_L]: '4L',
  [RetrospectMethod.FIVE_F]: '5F',
  [RetrospectMethod.PMI]: 'PMI',
  [RetrospectMethod.FREE]: '자유 형식',
};

export const RETROSPECT_METHOD_DESCRIPTIONS: Record<string, string> = {
  [RetrospectMethod.KPT]: 'Keep, Problem, Try로 회고해요',
  [RetrospectMethod.FOUR_L]: 'Liked, Learned, Lacked, Longed for',
  [RetrospectMethod.FIVE_F]: 'Facts, Feelings, Findings, Future, Feedback',
  [RetrospectMethod.PMI]: 'Plus, Minus, Interesting',
  [RetrospectMethod.FREE]: '자유롭게 작성해요',
};
