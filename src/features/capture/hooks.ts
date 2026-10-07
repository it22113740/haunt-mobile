import { queryKeys } from '@/api/keys';
import { queryClient } from '@/api/query-client';
import { submitVisit, type VisitFile } from '@/features/capture/api';
import { useMutation } from '@tanstack/react-query';

type SubmitInput = {
  venueId: string;
  files: VisitFile[];
  onProgress: (ratio: number) => void;
};

export function useSubmitVisit() {
  return useMutation({
    mutationFn: ({ venueId, files, onProgress }: SubmitInput) => submitVisit(venueId, files, onProgress),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.mySubmissions });
    },
  });
}
