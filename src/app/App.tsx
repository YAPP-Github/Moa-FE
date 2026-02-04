import { Route, Routes } from 'react-router';
import { OnboardingRoute } from '@/features/auth/ui/routes/OnboardingRoute';
import { PrivateRoute } from '@/features/auth/ui/routes/PrivateRoute';
import { PublicRoute } from '@/features/auth/ui/routes/PublicRoute';
import { CallbackPage } from '@/pages/callback/ui/CallbackPage';
import { MainPage } from '@/pages/main/ui/MainPage';
import { OnboardingPage } from '@/pages/onboarding/ui/OnboardingPage';
import { SigninPage } from '@/pages/signin/ui/SigninPage';
import { TeamDashboardPage } from '@/pages/team-dashboard/ui/TeamDashboardPage';
import { ToastContainer } from '@/shared/ui/toast/Toast';
import { AuthLayout } from '@/widgets/layout/ui/AuthLayout';
import { DashboardLayout } from '@/widgets/layout/ui/DashboardLayout';
import { PlainLayout } from '@/widgets/layout/ui/PlainLayout';

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Auth 라우트 (공통 레이아웃) */}
        <Route element={<AuthLayout />}>
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <SigninPage />
              </PublicRoute>
            }
          />
          <Route
            path="/onboarding"
            element={
              <OnboardingRoute>
                <OnboardingPage />
              </OnboardingRoute>
            }
          />
        </Route>

        {/* OAuth 콜백 */}
        <Route path="/callback" element={<CallbackPage />} />

        {/* Protected 라우트 */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <PlainLayout>
                <MainPage />
              </PlainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/teams/:teamId"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <TeamDashboardPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
