import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSocialLogin } from '@/features/auth/api/auth.mutations';
import { parseOAuthCallback } from '@/features/auth/lib/oauth';
import { useAuthStore } from '@/features/auth/model/store';

// 모듈 레벨에서 처리 상태 관리 (StrictMode 리마운트에도 유지)
let isProcessed = false;

export function CallbackPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login, setOnboarding } = useAuthStore();
  const { mutateAsync: socialLogin, isPending } = useSocialLogin();

  useEffect(() => {
    // 이미 로그인된 상태면 메인으로 리다이렉트
    if (isAuthenticated) {
      navigate('/', { replace: true });
      return;
    }

    // 이미 처리 중이거나 처리 완료된 경우 스킵
    if (isProcessed || isPending) return;
    isProcessed = true;

    const processOAuth = async () => {
      const oauthData = parseOAuthCallback();

      if (!oauthData) {
        navigate('/signin', { replace: true });
        return;
      }

      try {
        // 인가 코드를 백엔드로 전송 (토큰 교환은 백엔드에서 처리)
        const response = await socialLogin({
          provider: oauthData.provider,
          code: oauthData.code,
        });

        if (response.result.isNewMember) {
          // signupToken은 쿠키로 전달됨, 온보딩 상태만 설정
          setOnboarding(response.result.email ?? '');
          navigate('/onboarding', { replace: true });
          return;
        }

        // 기존 회원: 쿠키에 토큰이 설정됨
        login();
        navigate('/', { replace: true });
      } catch (error) {
        // @todo: 에러 처리
        console.error(
          `Failed to process OAuth: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
        navigate('/signin', { replace: true });
      }
    };

    processOAuth();
  }, [isAuthenticated, login, navigate, setOnboarding, socialLogin, isPending]);

  // 다른 페이지로 이동 시 플래그 리셋 (다음 로그인 시도를 위해)
  useEffect(() => {
    return () => {
      // 컴포넌트가 완전히 언마운트될 때만 리셋 (약간의 딜레이)
      setTimeout(() => {
        isProcessed = false;
      }, 100);
    };
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}
