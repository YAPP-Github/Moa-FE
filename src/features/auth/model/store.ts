import { create } from 'zustand';
import { clearTokens, hasValidTokens, setTokens } from '@/features/auth/lib/token';

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
  setSignupData: (token: string, email: string) => void;
  clearSignupData: () => void;
}

type AuthStore = AuthState & AuthActions;

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
