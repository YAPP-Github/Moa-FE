import { create } from 'zustand';
import { axiosInstance } from '@/shared/api/instance';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isOnboarding: boolean;
  signupEmail: string | null;
}

interface AuthActions {
  setLoading: (isLoading: boolean) => void;
  login: () => void;
  logout: () => void;
  logoutWithServer: () => Promise<void>;
  setOnboarding: (email: string) => void;
  clearOnboarding: () => void;
}

type AuthStore = AuthState & AuthActions;

async function callLogoutApi(): Promise<void> {
  try {
    await axiosInstance.post('/api/v1/auth/logout');
  } catch {
    // 서버 로그아웃 실패해도 클라이언트는 로그아웃 진행
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  isLoading: true, // 초기값을 true로 설정하여 초기화 완료 전까지 로딩 상태 유지
  isOnboarding: false,
  signupEmail: null,

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  login: () => {
    set({
      isAuthenticated: true,
      isLoading: false,
      isOnboarding: false,
      signupEmail: null,
    });
  },

  logout: () => {
    set({
      isAuthenticated: false,
      isLoading: false,
      isOnboarding: false,
      signupEmail: null,
    });
  },

  logoutWithServer: async () => {
    await callLogoutApi();
    set({
      isAuthenticated: false,
      isLoading: false,
      isOnboarding: false,
      signupEmail: null,
    });
  },

  setOnboarding: (email: string) => {
    set({ isOnboarding: true, signupEmail: email });
  },

  clearOnboarding: () => {
    set({ isOnboarding: false, signupEmail: null });
  },
}));

export function useIsAuthenticated(): boolean {
  return useAuthStore((state) => state.isAuthenticated);
}

export function useSignupEmail(): string | null {
  return useAuthStore((state) => state.signupEmail);
}
