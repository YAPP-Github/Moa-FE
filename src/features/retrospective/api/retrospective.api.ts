import { retrospectListResponseSchema } from '../model/schema';
import { customInstance } from '@/shared/api/instance';

export async function listRetrospects(retroRoomId: number) {
  const data = await customInstance({
    url: `/api/v1/retro-rooms/${retroRoomId}/retrospects`,
    method: 'GET',
  });
  return retrospectListResponseSchema.parse(data);
}
