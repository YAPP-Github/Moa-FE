import { useEffect, useEffectEvent } from 'react';
import { useNavigate } from 'react-router';
import { useSocialLoginMutation } from '@/features/auth/api/auth.mutations';
import { getRedirectUri, parseOAuthCallback } from '@/features/auth/lib/oauth';
import { GlobalLoading } from '@/shared/ui/global-loading/GlobalLoading';

export function CallbackPage() {
  const navigate = useNavigate();
  const { mutateAsync: socialLogin } = useSocialLoginMutation();

  const onProcessOAuth = useEffectEvent(async () => {
    const oauthData = parseOAuthCallback();

    if (!oauthData) {
      navigate('/signin', { replace: true });
      return;
    }

    try {
      const response = await socialLogin({
        provider: oauthData.provider,
        code: oauthData.code,
        redirectUri: getRedirectUri(),
      });

      if (response.result.isNewMember) {
        navigate('/onboarding', { replace: true, state: { fromOAuth: true } });
        return;
      }

      navigate('/', { replace: true });
    } catch {
      navigate('/signin', { replace: true });
    }
  });

  useEffect(() => {
    onProcessOAuth();
  }, []);

  return <GlobalLoading />;
}
