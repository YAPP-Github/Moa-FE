import { Route, Routes } from 'react-router';
import { OnboardingRoute } from '@/features/auth/ui/routes/OnboardingRoute';
import { PrivateRoute } from '@/features/auth/ui/routes/PrivateRoute';
import { PublicRoute } from '@/features/auth/ui/routes/PublicRoute';
import { RouteGuard } from '@/features/auth/ui/routes/RouteGuard';
import { CallbackPage } from '@/pages/callback/ui/CallbackPage';
import { MainPage } from '@/pages/main/ui/MainPage';
import { OnboardingPage } from '@/pages/onboarding/ui/OnboardingPage';
import { SigninPage } from '@/pages/signin/ui/SigninPage';
import { TeamDashboardPage } from '@/pages/team-dashboard/ui/TeamDashboardPage';
import { ToastContainer } from '@/shared/ui/toast/Toast';
import { DashboardLayout } from '@/widgets/layout/ui/DashboardLayout';

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* OAuth 콜백 - 가드 바깥 */}
        <Route path="/callback" element={<CallbackPage />} />

        {/* 인증 확인 게이트 */}
        <Route element={<RouteGuard />}>
          {/* Public: 비로그인 유저만 */}
          <Route element={<PublicRoute />}>
            <Route path="/signin" element={<SigninPage />} />
            <Route element={<OnboardingRoute />}>
              <Route path="/onboarding" element={<OnboardingPage />} />
            </Route>
          </Route>

          {/* Private: 로그인 유저만 */}
          <Route element={<PrivateRoute />}>
            <Route
              path="/"
              element={
                <DashboardLayout>
                  <MainPage />
                </DashboardLayout>
              }
            />
            <Route
              path="/teams/:teamId"
              element={
                <DashboardLayout>
                  <TeamDashboardPage />
                </DashboardLayout>
              }
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
