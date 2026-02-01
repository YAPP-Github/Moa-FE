import { useMutation } from '@tanstack/react-query';
import { getApi, type SignupRequest, type SuccessSignupResponse } from '@/shared/api/generated';
import { axiosInstance } from '@/shared/api/instance';

const api = getApi();

// TODO: 테스트용 이메일 로그인 - 추후 삭제 필요
interface EmailLoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    isNewMember: boolean;
    accessToken: string;
    refreshToken: string;
  } | null;
}

export function useEmailLogin() {
  return useMutation({
    mutationFn: async (email: string): Promise<EmailLoginResponse> => {
      const response = await axiosInstance.post<EmailLoginResponse>('/api/auth/login/email', {
        email,
      });
      return response.data;
    },
  });
}

export function useSocialLogin() {
  return useMutation({
    mutationFn: api.socialLogin,
  });
}

interface SignupWithTokenParams {
  signupToken: string;
  data: SignupRequest;
}

export function useSignup() {
  return useMutation({
    mutationFn: async ({
      signupToken,
      data,
    }: SignupWithTokenParams): Promise<SuccessSignupResponse> => {
      const response = await axiosInstance.post<SuccessSignupResponse>(
        '/api/v1/auth/signup',
        data,
        {
          headers: {
            Authorization: `Bearer ${signupToken}`,
          },
        }
      );
      return response.data;
    },
  });
}
