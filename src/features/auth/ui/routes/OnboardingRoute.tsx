import { Navigate, Outlet, useLocation } from 'react-router';

export function OnboardingRoute() {
  const location = useLocation();
  const fromOAuth = (location.state as { fromOAuth?: boolean } | null)?.fromOAuth === true;

  if (!fromOAuth) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}
