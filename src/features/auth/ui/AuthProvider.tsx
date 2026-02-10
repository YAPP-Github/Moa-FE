import { useEffect } from 'react';
import { axiosInstance, setupErrorInterceptor } from '@/shared/api/instance';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    const interceptorId = setupErrorInterceptor();

    return () => {
      axiosInstance.interceptors.response.eject(interceptorId);
    };
  }, []);

  return <>{children}</>;
}
