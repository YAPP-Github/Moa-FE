import { Navigate, Outlet } from 'react-router';
import { useProfile } from '../../api/auth.queries';

export function PublicRoute() {
  const { data } = useProfile();

  if (data?.isSuccess) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
