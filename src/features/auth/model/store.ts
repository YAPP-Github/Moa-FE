import Axios from 'axios';
import { create } from 'zustand';
import { clearTokens, getRefreshToken, hasValidTokens, setTokens } from '@/features/auth/lib/token';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  signupToken: string | null;
  signupEmail: string | null;
}

interface AuthActions {
  initialize: () => void;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  logoutWithServer: () => Promise<void>;
  setSignupData: (token: string, email: string) => void;
  clearSignupData: () => void;
}

type AuthStore = AuthState & AuthActions;

// @todo: api 폴더로 이동
async function callLogoutApi(refreshToken: string): Promise<void> {
  try {
    await Axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/logout`,
      { refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch {
    // 서버 로그아웃 실패해도 클라이언트는 로그아웃 진행
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  signupToken: null,
  signupEmail: null,

  initialize: () => {
    const isAuthenticated = hasValidTokens();
    set({ isAuthenticated, isLoading: false });
  },

  login: (accessToken: string, refreshToken: string) => {
    setTokens(accessToken, refreshToken);
    set({ isAuthenticated: true, signupToken: null, signupEmail: null });
  },

  logout: () => {
    clearTokens();
    set({ isAuthenticated: false, signupToken: null, signupEmail: null });
  },

  logoutWithServer: async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await callLogoutApi(refreshToken);
    }
    clearTokens();
    set({ isAuthenticated: false, signupToken: null, signupEmail: null });
  },

  setSignupData: (token: string, email: string) => {
    set({ signupToken: token, signupEmail: email });
  },

  clearSignupData: () => {
    set({ signupToken: null, signupEmail: null });
  },
}));

export function useIsAuthenticated(): boolean {
  return useAuthStore((state) => state.isAuthenticated);
}

export function useSignupData(): {
  token: string | null;
  email: string | null;
} {
  return useAuthStore((state) => ({
    token: state.signupToken,
    email: state.signupEmail,
  }));
}
