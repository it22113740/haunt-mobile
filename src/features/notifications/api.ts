import { api } from '@/api/client';
import { profileSchema, type Profile } from '@/features/profile/schemas';
import { testPushResultSchema, type TestPushResult } from '@/features/notifications/schemas';

export async function savePushToken(pushToken: string): Promise<Profile> {
  const { data } = await api.patch<unknown>('/users/me', { pushToken });
  return profileSchema.parse(data);
}

export async function sendTestPush(): Promise<TestPushResult> {
  const { data } = await api.post<unknown>('/notifications/test-push', {
    title: 'Haunt',
    body: 'If you see this, push delivery works.',
  });
  return testPushResultSchema.parse(data);
}
