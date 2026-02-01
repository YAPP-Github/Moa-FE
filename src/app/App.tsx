import { Route, Routes } from 'react-router';
import { MainPage } from '@/pages/main/ui/MainPage';
import { SigninPage } from '@/pages/signin/ui/SigninPage';
import { TeamDashboardPage } from '@/pages/team-dashboard/ui/TeamDashboardPage';
import { DashboardLayout } from '@/widgets/layout/ui/DashboardLayout';
import { PlainLayout } from '@/widgets/layout/ui/PlainLayout';

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SigninPage />} />
      <Route
        path="/"
        element={
          <PlainLayout>
            <MainPage />
          </PlainLayout>
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
    </Routes>
  );
}

export default App;
