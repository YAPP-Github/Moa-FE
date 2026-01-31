import { Route, Routes } from 'react-router';
import { MainPage } from '@/pages/main/ui/MainPage';
import { SigninPage } from '@/pages/signin/ui/SigninPage';
import { PlainLayout } from '@/widgets/layout/ui/PlainLayout';

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SigninPage />} />
      {/* TODO: 팀 유무에 따라 DashboardLayout/PlainLayout 분기 필요 */}
      <Route
        path="/"
        element={
          <PlainLayout>
            <MainPage />
          </PlainLayout>
        }
      />
    </Routes>
  );
}

export default App;
