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

export function setupErrorInterceptor(): number {
  return axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
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
