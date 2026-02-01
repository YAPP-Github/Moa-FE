// Backend expects 'Google' | 'Kakao' (PascalCase)
export type Provider = 'Google' | 'Kakao';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const KAKAO_AUTH_URL = 'https://kauth.kakao.com/oauth/authorize';
const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';

function getRedirectUri(): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/signin`;
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
  const clientId = import.meta.env.VITE_KAKAO_REST_API_KEY;

  if (!clientId) {
    throw new Error('VITE_KAKAO_REST_API_KEY is not defined');
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

// Exchange authorization code for access token
export async function exchangeCodeForToken(code: string, provider: Provider): Promise<string> {
  const redirectUri = getRedirectUri();

  if (provider === 'Google') {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;

    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google token exchange failed: ${error}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  if (provider === 'Kakao') {
    const clientId = import.meta.env.VITE_KAKAO_REST_API_KEY;

    const response = await fetch(KAKAO_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Kakao token exchange failed: ${error}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  throw new Error(`Unknown provider: ${provider}`);
}

export function clearOAuthParams(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete('code');
  url.searchParams.delete('state');
  window.history.replaceState({}, '', url.pathname);
}
