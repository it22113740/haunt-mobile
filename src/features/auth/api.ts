import { api } from '@/api/client';
import {
  authSessionSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  messageSchema,
  resetPasswordSchema,
  type ChangePasswordValues,
  type ForgotPasswordValues,
  type LoginValues,
  type RegisterValues,
  type ResetPasswordValues,
} from '@/features/auth/schemas';

export async function login(values: LoginValues) {
  const body = loginSchema.parse(values);
  const { data } = await api.post<unknown>('/auth/login', body);
  return authSessionSchema.parse(data);
}

export async function registerAccount(values: RegisterValues) {
  if (values.role === 'OWNER') {
    const { data } = await api.post<unknown>('/auth/register/owner', {
      gmail: values.gmail.trim(),
      address: values.address.trim(),
      password: values.password,
    });
    return authSessionSchema.parse(data);
  }

  const { data } = await api.post<unknown>('/auth/register/user', {
    username: values.username.trim(),
    email: values.email.trim(),
    password: values.password,
  });
  return authSessionSchema.parse(data);
}

export async function requestPasswordReset(values: ForgotPasswordValues) {
  const body = forgotPasswordSchema.parse(values);
  const { data } = await api.post<unknown>('/auth/forgot-password', body);
  return messageSchema.parse(data);
}

export async function resetPassword(values: ResetPasswordValues) {
  const body = resetPasswordSchema.parse(values);
  const { data } = await api.post<unknown>('/auth/reset-password', body);
  return messageSchema.parse(data);
}

export async function changePassword(values: ChangePasswordValues) {
  const body = changePasswordSchema.parse(values);
  const { data } = await api.patch<unknown>('/auth/change-password', body);
  return messageSchema.parse(data);
}
