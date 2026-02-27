import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { axiosInstance, setupErrorInterceptor } from '@/shared/api/instance';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const interceptorId = setupErrorInterceptor(() => {
      navigate('/signin', { replace: true });
    });

    return () => {
      axiosInstance.interceptors.response.eject(interceptorId);
    };
  }, [navigate]);

  return <>{children}</>;
}
