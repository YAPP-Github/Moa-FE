import { useMutation } from '@tanstack/react-query';
import type { Provider } from '@/features/auth/lib/oauth';
import type { SignupRequest, SuccessSignupResponse } from '@/shared/api/generated';
import { axiosInstance } from '@/shared/api/instance';

// 소셜 로그인 요청 (인가 코드 방식)
interface SocialLoginWithCodeRequest {
  provider: Provider;
  code: string;
}

// 소셜 로그인 응답 (쿠키 기반 - 토큰은 쿠키로 전달됨)
interface SocialLoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    isNewMember: boolean;
    email?: string;
  };
}

// TODO: 테스트용 이메일 로그인 - 추후 삭제 필요
interface EmailLoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    isNewMember: boolean;
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

// 소셜 로그인 (인가 코드를 백엔드로 전송, 토큰 교환은 백엔드에서 처리)
export function useSocialLogin() {
  return useMutation({
    mutationFn: async ({
      provider,
      code,
    }: SocialLoginWithCodeRequest): Promise<SocialLoginResponse> => {
      const response = await axiosInstance.post<SocialLoginResponse>('/api/v1/auth/social-login', {
        provider,
        code,
      });
      return response.data;
    },
  });
}

// 회원가입 (signupToken은 쿠키로 자동 전송됨)
export function useSignup() {
  return useMutation({
    mutationFn: async (data: SignupRequest): Promise<SuccessSignupResponse> => {
      const response = await axiosInstance.post<SuccessSignupResponse>('/api/v1/auth/signup', data);
      return response.data;
    },
  });
}
