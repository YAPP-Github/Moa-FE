import { useQuery } from '@tanstack/react-query';
import { getProfile } from './auth.api';

export const authQueryKeys = {
  profile: ['profile', 'me'] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: authQueryKeys.profile,
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5,
  });
}
