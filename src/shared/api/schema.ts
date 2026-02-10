import { z } from 'zod';

export const baseResponseSchema = <T extends z.ZodTypeAny>(resultSchema: T) =>
  z.object({
    isSuccess: z.boolean(),
    code: z.string(),
    message: z.string(),
    result: resultSchema,
  });
