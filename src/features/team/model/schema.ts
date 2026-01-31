import { z } from 'zod';

export const createTeamSchema = z.object({
  teamName: z
    .string()
    .min(1, '팀 이름을 입력해주세요')
    .max(10, '팀 이름은 10글자 이내로 입력해주세요'),
});

export type CreateTeamFormData = z.infer<typeof createTeamSchema>;
