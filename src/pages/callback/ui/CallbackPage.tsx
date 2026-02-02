import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSocialLogin } from '@/features/auth/api/auth.mutations';
import { exchangeCodeForToken, parseOAuthCallback } from '@/features/auth/lib/oauth';
import { useAuthStore } from '@/features/auth/model/store';

export function CallbackPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login, setSignupData } = useAuthStore();
  const { mutateAsync: socialLogin } = useSocialLogin();

  useEffect(() => {
    // 이미 로그인된 상태면 메인으로 리다이렉트
    if (isAuthenticated) {
      navigate('/', { replace: true });
      return;
    }

    const processOAuth = async () => {
      const oauthData = parseOAuthCallback();

      if (!oauthData) {
        navigate('/signin', { replace: true });
        return;
      }

      try {
        const accessToken = await exchangeCodeForToken(oauthData.code, oauthData.provider);

        const response = await socialLogin({
          accessToken,
          provider: oauthData.provider as unknown as 'GOOGLE' | 'KAKAO',
        });

        if (response.result.isNewMember) {
          setSignupData(response.result.signupToken ?? '', response.result.email ?? '');
          navigate('/onboarding', { replace: true });
          return;
        }

        if (response.result.accessToken && response.result.refreshToken) {
          login(response.result.accessToken ?? '', response.result.refreshToken ?? '');
          navigate('/', { replace: true });
          return;
        }
      } catch (error) {
        // @todo: 에러 처리
        console.error(
          `Failed to process OAuth: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    };

    processOAuth();
  }, [isAuthenticated, login, navigate, setSignupData, socialLogin]);

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}
