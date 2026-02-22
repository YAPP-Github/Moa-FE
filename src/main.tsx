import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './app/App';
import { QueryProvider } from './app/providers/QueryProvider';
import { AuthProvider } from './features/auth/ui/AuthProvider';
import './index.css';

async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MSW !== 'true') {
    return;
  }

  const { worker } = await import('./shared/api/mocks/browser');

  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

enableMocking().then(() => {
  createRoot(root).render(
    <StrictMode>
      <QueryProvider>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </QueryProvider>
    </StrictMode>
  );
});
