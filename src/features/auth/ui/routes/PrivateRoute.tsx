import { Navigate, Outlet, useLocation } from 'react-router';
import { useProfile } from '../../api/auth.queries';

export function PrivateRoute() {
  const { data } = useProfile();
  const location = useLocation();

  if (!data?.isSuccess) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
