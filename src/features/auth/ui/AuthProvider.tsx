import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/features/auth/model/store';
import { axiosInstance, setupAuthInterceptor } from '@/shared/api/instance';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const initialize = useAuthStore((state) => state.initialize);
  const logout = useAuthStore((state) => state.logout);

  const handleSessionExpired = useCallback(() => {
    logout();
    navigate('/signin', { replace: true });
  }, [logout, navigate]);

  useEffect(() => {
    initialize();
  }, [initialize]);

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
