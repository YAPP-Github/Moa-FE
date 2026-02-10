import type { Provider } from '../lib/oauth';

export type TeamOption = 'create' | 'join';

// --- Generated에서 복사 (이름 유지) ---

export interface SocialLoginRequest {
  code: string;
  provider: Provider;
  redirectUri: string;
}

export interface SignupRequest {
  nickname: string;
}
