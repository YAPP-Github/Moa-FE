import { Navigate, Route, Routes } from 'react-router';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ArchivePage } from './pages/ArchivePage';
import { RetrospectiveDetailPage } from './pages/RetrospectiveDetailPage';
import { RetrospectivePage } from './pages/RetrospectivePage';
import { RetrospectiveResultPage } from './pages/RetrospectiveResultPage';
import { RetrospectiveSubmitPage } from './pages/RetrospectiveSubmitPage';
import { SigninPage } from './pages/SigninPage';

function App() {
  return (
    <Routes>
      {/* Signin route (without layout) */}
      <Route path="/signin" element={<SigninPage />} />

      {/* Dashboard routes (with layout) */}
      <Route element={<DashboardLayout />}>
        <Route index element={<Navigate to="/retrospective" replace />} />
        <Route path="retrospective" element={<RetrospectivePage />} />
        <Route path="retrospective/:id" element={<RetrospectiveDetailPage />} />
        <Route path="retrospective/:id/submit" element={<RetrospectiveSubmitPage />} />
        <Route path="retrospective/:id/result" element={<RetrospectiveResultPage />} />
        <Route path="archive" element={<ArchivePage />} />
      </Route>
    </Routes>
  );
}

export default App;
