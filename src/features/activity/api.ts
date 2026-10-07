import { api } from '@/api/client';
import { submissionListSchema, type Submission } from '@/features/activity/schemas';

export async function fetchMySubmissions(): Promise<Submission[]> {
  const { data } = await api.get<unknown>('/submissions/mine');
  return submissionListSchema.parse(data);
}
