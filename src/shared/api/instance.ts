import Axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import { ApiError } from '@/shared/api/error';

export const axiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface RetryableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

function toApiError(error: AxiosError): ApiError {
  if (!error.response) {
    return new ApiError(0, 'NETWORK_ERROR', '네트워크 연결을 확인해주세요');
  }

  const { status, data } = error.response;

  if (data && typeof data === 'object' && 'message' in data) {
    const errorData = data as { code?: string; message: string };
    return new ApiError(status, errorData.code ?? `HTTP_${status}`, errorData.message);
  }

  return new ApiError(status, `HTTP_${status}`, '서버에 문제가 생겼습니다');
}

let isRefreshing = false;
let pendingQueue: Array<{ resolve: () => void; reject: (error: unknown) => void }> = [];

function flushQueue(error: unknown) {
  for (const item of pendingQueue) {
    if (error) item.reject(error);
    else item.resolve();
  }
  pendingQueue = [];
}

export function setupErrorInterceptor(onSessionExpired: () => void): number {
  return axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequestConfig | undefined;
      const isRefreshRequest = originalRequest?.url?.includes('/auth/token/refresh');

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !isRefreshRequest
      ) {
        if (isRefreshing) {
          return new Promise<void>((resolve, reject) => {
            pendingQueue.push({ resolve, reject });
          })
            .then(() => axiosInstance(originalRequest))
            .catch(() => Promise.reject(toApiError(error)));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await axiosInstance.post('/api/v1/auth/token/refresh');
          flushQueue(null);
          return axiosInstance(originalRequest);
        } catch {
          flushQueue(new Error('refresh failed'));
          onSessionExpired();
          return Promise.reject(new ApiError(401, 'SESSION_EXPIRED', '로그인이 만료되었습니다'));
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(toApiError(error));
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
