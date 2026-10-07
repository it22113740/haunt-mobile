import { api } from '@/api/client';
import { appendUploadPart, postMultipart } from '@/api/multipart';
import {
  profileSchema,
  uploadResultSchema,
  type Profile,
  type ProfileFormValues,
} from '@/features/profile/schemas';

export async function fetchProfile(): Promise<Profile> {
  const { data } = await api.get<unknown>('/users/me');
  return profileSchema.parse(data);
}

export async function updateProfile(role: Profile['role'], values: ProfileFormValues): Promise<Profile> {
  const body =
    role === 'OWNER'
      ? {
          email: values.email.trim(),
          gmail: values.gmail.trim(),
          address: values.address.trim(),
        }
      : {
          email: values.email.trim(),
          username: values.username.trim(),
        };

  const { data } = await api.patch<unknown>('/users/me', body);
  return profileSchema.parse(data);
}

export async function setOnboardingStep(step: number): Promise<Profile> {
  const { data } = await api.patch<unknown>('/users/me', { onboardingStep: step });
  return profileSchema.parse(data);
}

export async function uploadAvatar(file: {
  uri: string;
  name: string;
  type: string;
}): Promise<Profile> {
  const body = new FormData();
  body.append('resourceType', 'image');
  await appendUploadPart(body, 'file', file);

  const uploaded = await postMultipart<unknown>('/upload', body);
  const { mediaUrl } = uploadResultSchema.parse(uploaded);
  const { data } = await api.patch<unknown>('/users/me', { imageUrl: mediaUrl });
  return profileSchema.parse(data);
}
