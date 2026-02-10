import {
  profileResponseSchema,
  signupResponseSchema,
  socialLoginResponseSchema,
  withdrawResponseSchema,
} from '../model/schema';
import type { SignupRequest, SocialLoginRequest } from '../model/types';
import { customInstance } from '@/shared/api/instance';

export async function getProfile() {
  const data = await customInstance({
    url: '/api/v1/members/me',
    method: 'GET',
  });
  return profileResponseSchema.parse(data);
}

export async function socialLogin(request: SocialLoginRequest) {
  const data = await customInstance({
    url: '/api/v1/auth/social-login',
    method: 'POST',
    data: request,
  });
  return socialLoginResponseSchema.parse(data);
}

export async function signup(request: SignupRequest) {
  const data = await customInstance({
    url: '/api/v1/auth/signup',
    method: 'POST',
    data: request,
  });
  return signupResponseSchema.parse(data);
}

export async function logout() {
  await customInstance({
    url: '/api/v1/auth/logout',
    method: 'POST',
  });
}

export async function withdraw() {
  const data = await customInstance({
    url: '/api/v1/members/withdraw',
    method: 'POST',
  });
  return withdrawResponseSchema.parse(data);
}
