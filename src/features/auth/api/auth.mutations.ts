import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout, signup, socialLogin, withdraw } from './auth.api';
import { authQueryKeys } from './auth.queries';

export function useSocialLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: socialLogin,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authQueryKeys.profile });
    },
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: signup,
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
    },
    meta: { skipGlobalError: true },
  });
}

export function useWithdrawMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: withdraw,
    onSettled: () => {
      queryClient.clear();
    },
    meta: { skipGlobalError: true },
  });
}
