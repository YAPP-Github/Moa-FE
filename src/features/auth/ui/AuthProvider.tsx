import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useProfile } from '@/features/auth/api/auth.queries';
import { useAuthStore } from '@/features/auth/model/store';
import { axiosInstance, setupAuthInterceptor } from '@/shared/api/instance';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const setLoading = useAuthStore((state) => state.setLoading);

  // React Query로 프로필 조회 (세션 유지 확인)
  const { data, isLoading } = useProfile();

  const handleSessionExpired = useCallback(() => {
    logout();
    navigate('/signin', { replace: true });
  }, [logout, navigate]);

  // 프로필 조회 결과에 따라 인증 상태 업데이트
  useEffect(() => {
    if (isLoading) {
      setLoading(true);
      return;
    }

    if (data?.isSuccess) {
      login();
    } else {
      // 프로필 조회 실패 (401 또는 에러): 비로그인 상태
      logout();
    }
  }, [data, isLoading, login, logout, setLoading]);

  // 인터셉터 설정
  useEffect(() => {
    const interceptorId = setupAuthInterceptor({
      onSessionExpired: handleSessionExpired,
    });

    return () => {
      axiosInstance.interceptors.response.eject(interceptorId);
    };
  }, [handleSessionExpired]);

  return <>{children}</>;
}
