import Axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface AuthInterceptorCallbacks {
  onSessionExpired: () => void;
}

interface RefreshTokenResponse {
  isSuccess: boolean;
  result: Record<string, never>;
}

export const axiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function refreshAccessToken(): Promise<void> {
  const { data } = await Axios.post<RefreshTokenResponse>(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/token/refresh`,
    {},
    { withCredentials: true }
  );

  if (!data.isSuccess) throw new Error('Refresh failed');
}

export function setupAuthInterceptor(callbacks: AuthInterceptorCallbacks): number {
  return axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequestConfig | undefined;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      const isUnauthorized = error.response?.status === 401;
      const isAuthRequest = originalRequest.url?.includes('/auth/');
      const hasRetried = originalRequest._retry;

      if (isUnauthorized && !isAuthRequest && !hasRetried) {
        originalRequest._retry = true;

        try {
          await refreshAccessToken();
          return axiosInstance(originalRequest);
        } catch {
          callbacks.onSessionExpired();
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );
}

// Orval mutator function
export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const promise = axiosInstance({ ...config }).then(({ data }) => data);
  return promise;
};

// Error type for Orval
export type ErrorType<Error> = AxiosError<Error>;
