import { Outlet } from 'react-router';
import { useProfile } from '../../api/auth.queries';

export function RouteGuard() {
  const { isFetched } = useProfile();

  if (!isFetched) {
    return null;
  }

  return <Outlet />;
}
