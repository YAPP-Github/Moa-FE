import { MutationCache, QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/shared/api/error';
import { toastStore } from '@/shared/ui/toast/Toast';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
  mutationCache: new MutationCache({
    onError: (error, _v, _c, mutation) => {
      if (mutation.meta?.skipGlobalError) return;
      const message = error instanceof ApiError ? error.message : '알 수 없는 오류가 발생했습니다';
      toastStore.getState().addToast({ variant: 'warning', message });
    },
  }),
});
