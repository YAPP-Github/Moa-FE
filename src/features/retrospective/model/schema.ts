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
