import { Route, Routes } from 'react-router';
import { MainPage } from '@/pages/main/ui/MainPage';
import { SigninPage } from '@/pages/signin/ui/SigninPage';
import { DashboardLayout } from '@/widgets/layout/ui/DashboardLayout';

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SigninPage />} />
      <Route
        path="/"
        element={
          <DashboardLayout>
            <MainPage />
          </DashboardLayout>
        }
      />
    </Routes>
  );
}

export default App;
