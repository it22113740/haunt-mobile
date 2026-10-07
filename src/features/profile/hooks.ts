import { queryKeys } from '@/api/keys';
import { queryClient } from '@/api/query-client';
import { fetchProfile, setOnboardingStep, updateProfile, uploadAvatar } from '@/features/profile/api';
import type { Profile, ProfileFormValues } from '@/features/profile/schemas';
import { useAuthStore, type AuthUser } from '@/stores/auth';
import { useMutation, useQuery } from '@tanstack/react-query';

function toAuthUser(profile: Profile): AuthUser {
  return {
    id: profile.id,
    email: profile.email,
    username: profile.username,
    imageUrl: profile.imageUrl,
    role: profile.role,
  };
}

function saveProfile(profile: Profile) {
  queryClient.setQueryData(queryKeys.profile, profile);
  useAuthStore.getState().updateUser(toAuthUser(profile));
}

export function useProfile() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: fetchProfile,
    enabled: Boolean(token),
  });
}

export function useUpdateProfile(role: Profile['role']) {
  return useMutation({
    mutationFn: (values: ProfileFormValues) => updateProfile(role, values),
    onSuccess: saveProfile,
  });
}

export function useUploadAvatar() {
  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: saveProfile,
  });
}

export function useSetOnboardingStep() {
  return useMutation({
    mutationFn: setOnboardingStep,
    onSuccess: saveProfile,
  });
}
