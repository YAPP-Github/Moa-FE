import { useQuery } from '@tanstack/react-query';
import { getApi } from '@/shared/api/generated';

/**
 * 현재 로그인된 사용자 프로필 조회
 * 세션 유지 확인에 사용
 */
export function useProfile() {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => getApi().getProfile(),
    retry: false, // 401 에러 시 재시도하지 않음
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
}
