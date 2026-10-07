import { changePassword, login, registerAccount, requestPasswordReset, resetPassword } from '@/features/auth/api';
import { useMutation } from '@tanstack/react-query';

export function useLogin() {
  return useMutation({ mutationFn: login });
}

export function useRegister() {
  return useMutation({ mutationFn: registerAccount });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: requestPasswordReset });
}

export function useResetPassword() {
  return useMutation({ mutationFn: resetPassword });
}

export function useChangePassword() {
  return useMutation({ mutationFn: changePassword });
}
