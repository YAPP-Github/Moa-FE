import { Route, Routes } from 'react-router';
import { MainPage } from '@/pages/main';
import { SigninPage } from '@/pages/signin';
import { DashboardLayout } from '@/widgets/layout';

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
