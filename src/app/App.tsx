import { Route, Routes } from 'react-router';
import { SigninPage } from '@/pages/signin';

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SigninPage />} />
    </Routes>
  );
}

export default App;
