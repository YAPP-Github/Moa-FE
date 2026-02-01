import Axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import { getAccessToken } from '@/features/auth/lib/token';

export const axiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Orval mutator function
export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const promise = axiosInstance({ ...config }).then(({ data }) => data);
  return promise;
};

// Error type for Orval
export type ErrorType<Error> = AxiosError<Error>;
