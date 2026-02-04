// Backend expects 'Google' | 'Kakao' (PascalCase)
export type Provider = 'Google' | 'Kakao';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const KAKAO_AUTH_URL = 'https://kauth.kakao.com/oauth/authorize';

function getRedirectUri(): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/callback`;
}

export function getGoogleOAuthUrl(): string {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error('VITE_GOOGLE_CLIENT_ID is not defined');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getRedirectUri(),
    response_type: 'code',
    scope: 'email profile',
    state: 'Google',
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export function getKakaoOAuthUrl(): string {
  const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID;

  if (!clientId) {
    throw new Error('VITE_KAKAO_CLIENT_ID is not defined');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getRedirectUri(),
    response_type: 'code',
    state: 'Kakao',
  });

  return `${KAKAO_AUTH_URL}?${params.toString()}`;
}

export function parseOAuthCallback(): {
  code: string;
  provider: Provider;
} | null {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');

  if (!code || !state) {
    return null;
  }

  if (state !== 'Google' && state !== 'Kakao') {
    return null;
  }

  return { code, provider: state };
}
