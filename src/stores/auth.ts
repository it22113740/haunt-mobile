import {
  api,
  clearAccessToken,
  readAccessToken,
  setAccessToken,
  setUnauthorizedHandler,
  writeAccessToken,
} from '@/api/client';
import { isAxiosError } from 'axios';
import { create } from 'zustand';
import { z } from 'zod';

const authUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string().nullish(),
  imageUrl: z.string().nullish(),
  role: z.enum(['OWNER', 'USER']),
});

export type AuthUser = z.infer<typeof authUserSchema>;
export type UserRole = AuthUser['role'];

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  role: UserRole | null;
  isHydrated: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  establishSession: (accessToken: string) => Promise<AuthUser>;
  updateUser: (user: AuthUser) => void;
  setSession: (token: string, user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  role: null,
  isHydrated: false,
  error: null,

  hydrate: async () => {
    try {
      const token = await readAccessToken();
      if (!token) {
        set({
          token: null,
          user: null,
          role: null,
          isHydrated: true,
          error: null,
        });
        return;
      }

      setAccessToken(token);
      set({ token, error: null });

      const { data } = await api.get<unknown>('/auth/me');
      const user = authUserSchema.parse(data);
      set({
        token,
        user,
        role: user.role,
        isHydrated: true,
        error: null,
      });
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        await get().logout();
        set({ isHydrated: true, error: null });
        return;
      }

      set({
        isHydrated: true,
        error: 'Could not restore your session.',
      });
    }
  },

  establishSession: async (accessToken) => {
    await writeAccessToken(accessToken);
    set({ token: accessToken, error: null });
    try {
      const { data } = await api.get<unknown>('/auth/me');
      const user = authUserSchema.parse(data);
      set({ user, role: user.role, isHydrated: true, error: null });
      return user;
    } catch (error) {
      await get().logout();
      set({ isHydrated: true });
      throw error;
    }
  },

  updateUser: (user) => {
    set({ user, role: user.role });
  },

  setSession: async (token, user) => {
    await writeAccessToken(token);
    set({ token, user, role: user.role, error: null });
  },

  logout: async () => {
    setAccessToken(null);
    set({ token: null, user: null, role: null });
    await clearAccessToken();
    const { queryClient } = await import('@/api/query-client');
    queryClient.clear();
    try {
      const { stopGeofenceUpdates } = await import('@/features/location/tracking');
      await stopGeofenceUpdates();
    } catch {
      // Location updates may already be stopped.
    }
  },
}));

setUnauthorizedHandler(() => useAuthStore.getState().logout());
