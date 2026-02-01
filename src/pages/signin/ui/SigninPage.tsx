import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSignup, useSocialLogin } from '@/features/auth/api/auth.mutations';
import {
  clearOAuthParams,
  exchangeCodeForToken,
  parseOAuthCallback,
} from '@/features/auth/lib/oauth';
import { type SigninFormData, signinSchema } from '@/features/auth/model/schema';
import { useAuthStore } from '@/features/auth/model/store';
import { InviteLinkStep } from '@/features/auth/ui/InviteLinkStep';
import { LoginStep } from '@/features/auth/ui/LoginStep';
import { NicknameStep } from '@/features/auth/ui/NicknameStep';
import { TeamNameStep } from '@/features/auth/ui/TeamNameStep';
import { TeamStep } from '@/features/auth/ui/TeamStep';
import { useCreateRetroRoom, useJoinRetroRoom } from '@/features/team/api/team.mutations';
import { MultiStepForm } from '@/shared/ui/multi-step-form/MultiStepForm';

export function SigninPage() {
  const navigate = useNavigate();
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);
  const { login, setSignupData, signupToken, signupEmail, clearSignupData } = useAuthStore();
  const socialLoginMutation = useSocialLogin();
  const signupMutation = useSignup();
  const createRetroRoomMutation = useCreateRetroRoom();
  const joinRetroRoomMutation = useJoinRetroRoom();
  const oauthProcessedRef = useRef(false);

  useEffect(() => {
    if (oauthProcessedRef.current) return;

    const oauthData = parseOAuthCallback();

    if (!oauthData) return;

    oauthProcessedRef.current = true;
    setIsProcessingOAuth(true);

    const processOAuth = async () => {
      try {
        // Exchange authorization code for access token (PKCE)
        const accessToken = await exchangeCodeForToken(oauthData.code, oauthData.provider);

        socialLoginMutation.mutate(
          {
            accessToken,
            // Backend expects 'Google' | 'Kakao' (generated SocialType is incorrect)
            provider: oauthData.provider as unknown as 'GOOGLE' | 'KAKAO',
          },
          {
            onSuccess: (response) => {
              clearOAuthParams();

              if (response.result.isNewMember) {
                setSignupData(response.result.signupToken ?? '', response.result.email ?? '');
                setIsProcessingOAuth(false);
              } else {
                login(response.result.accessToken ?? '', response.result.refreshToken ?? '');
                navigate('/');
              }
            },
            onError: () => {
              clearOAuthParams();
              setIsProcessingOAuth(false);
            },
          }
        );
      } catch {
        clearOAuthParams();
        setIsProcessingOAuth(false);
      }
    };

    processOAuth();
  }, [login, navigate, setSignupData, socialLoginMutation]);

  const handleSubmit = async (data: SigninFormData) => {
    if (!signupToken || !signupEmail) return;

    try {
      const signupResponse = await signupMutation.mutateAsync({
        signupToken,
        data: {
          email: signupEmail,
          nickname: data.nickname,
        },
      });

      login(signupResponse.result.accessToken, signupResponse.result.refreshToken);
      clearSignupData();

      if (data.teamOption === 'create' && data.teamName) {
        await createRetroRoomMutation.mutateAsync({
          title: data.teamName,
        });
      } else if (data.teamOption === 'join' && data.inviteLink) {
        await joinRetroRoomMutation.mutateAsync({
          inviteUrl: data.inviteLink,
        });
      }

      navigate('/');
    } catch (error) {
      // 토큰 만료 시 페이지 새로고침
      const axiosError = error as { response?: { data?: { code?: string } } };
      if (axiosError.response?.data?.code === 'AUTH4001') {
        clearSignupData();
        window.location.reload();
        return;
      }
    }
  };

  if (isProcessingOAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">로그인 처리 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* 좌측: 스켈레톤 영역 (데스크톱만 표시) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-[#F9F8F5] overflow-hidden">
        <div className="flex flex-col items-center gap-6">
          <div className="w-80 h-80 bg-[#E5E5E5] rounded-2xl animate-pulse" />
          <div className="flex flex-col items-center gap-3">
            <div className="w-48 h-6 bg-[#E5E5E5] rounded animate-pulse" />
            <div className="w-32 h-4 bg-[#E5E5E5] rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* 우측: 로그인 패널 */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-8 bg-white">
        <MultiStepForm
          resolver={zodResolver(signinSchema)}
          defaultValues={{
            nickname: '',
            teamOption: undefined,
            teamName: '',
            inviteLink: '',
          }}
          onSubmit={handleSubmit}
        >
          <MultiStepForm.Step>
            <LoginStep />
          </MultiStepForm.Step>
          <MultiStepForm.Step fields={['nickname']}>
            <NicknameStep />
          </MultiStepForm.Step>
          <MultiStepForm.Step fields={['teamOption']}>
            <TeamStep />
          </MultiStepForm.Step>
          <MultiStepForm.Step fields={['teamName']}>
            <TeamNameStep />
          </MultiStepForm.Step>
          <MultiStepForm.Step fields={['inviteLink']}>
            <InviteLinkStep />
          </MultiStepForm.Step>
        </MultiStepForm>
      </div>
    </div>
  );
}
