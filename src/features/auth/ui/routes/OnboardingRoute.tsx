import { Navigate } from 'react-router';
import { useAuthStore } from '@/features/auth/model/store';

interface OnboardingRouteProps {
  children: React.ReactNode;
}

export function OnboardingRoute({ children }: OnboardingRouteProps) {
  const { signupToken, isLoading, isAuthenticated } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  // 이미 로그인된 사용자는 메인으로
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // signupToken이 없으면 로그인 페이지로
  if (!signupToken) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}
