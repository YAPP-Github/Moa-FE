import { Navigate, Outlet } from 'react-router';
import { useProfile } from '../../api/auth.queries';

export function PublicRoute() {
  const { data } = useProfile();

  // 닉네임이 설정된 기존 회원만 홈으로 리다이렉트
  // 신규 회원(nickname null)은 온보딩을 통과할 수 있도록 허용
  if (data?.isSuccess && data.result.nickname) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
