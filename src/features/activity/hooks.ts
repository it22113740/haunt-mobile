import { queryKeys } from '@/api/keys';
import { fetchMySubmissions } from '@/features/activity/api';
import { useQuery } from '@tanstack/react-query';

export function useMySubmissions() {
  return useQuery({
    queryKey: queryKeys.mySubmissions,
    queryFn: fetchMySubmissions,
  });
}
