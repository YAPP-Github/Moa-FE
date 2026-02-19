import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Navigate } from 'react-router';
import { ApiError } from '@/shared/api/error';

interface ApiErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  notFoundRedirect?: string;
  resetKeys?: unknown[];
}

interface ApiErrorBoundaryState {
  error: Error | null;
}

export class ApiErrorBoundary extends Component<ApiErrorBoundaryProps, ApiErrorBoundaryState> {
  state: ApiErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ApiErrorBoundaryState {
    return { error };
  }

  componentDidUpdate(prevProps: ApiErrorBoundaryProps) {
    if (this.state.error === null) return;

    const { resetKeys } = this.props;
    const { resetKeys: prevResetKeys } = prevProps;

    if (resetKeys && prevResetKeys && resetKeys.some((key, i) => key !== prevResetKeys[i])) {
      this.setState({ error: null });
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ApiErrorBoundary]', error, errorInfo);
  }

  render() {
    const { error } = this.state;
    const { children, fallback = null, notFoundRedirect = '/' } = this.props;

    if (error) {
      if (error instanceof ApiError && error.status === 404) {
        return <Navigate to={notFoundRedirect} replace />;
      }
      return fallback;
    }

    return children;
  }
}
