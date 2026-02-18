import { useEffect, useEffectEvent, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useSocialLoginMutation } from '@/features/auth/api/auth.mutations';
import { getRedirectUri, parseOAuthCallback } from '@/features/auth/lib/oauth';

export function CallbackPage() {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);
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
    if (hasProcessed.current) return;
    hasProcessed.current = true;
    onProcessOAuth();
  }, []);

  return null;
}
