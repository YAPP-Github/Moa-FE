import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { customInstance } from '@/shared/api/instance';
import { baseResponseSchema } from '@/shared/api/schema';

// --- Zod 스키마 ---

const ogMetadataSchema = z.object({
  url: z.string(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  image: z.string().nullable(),
});

const ogResponseSchema = baseResponseSchema(ogMetadataSchema);

// --- 타입 ---

export type OgMetadata = z.infer<typeof ogMetadataSchema>;

// --- API 함수 ---

export async function fetchOgMetadata(url: string) {
  const data = await customInstance({
    url: '/api/v1/og',
    method: 'GET',
    params: { url },
  });
  return ogResponseSchema.parse(data);
}

// --- Query Hook ---

export const ogQueryKeys = {
  metadata: (url: string) => ['og', url] as const,
};

export function useOgMetadata(url: string) {
  return useQuery({
    queryKey: ogQueryKeys.metadata(url),
    queryFn: () => fetchOgMetadata(url),
    staleTime: 1000 * 60 * 30,
    enabled: !!url,
  });
}
