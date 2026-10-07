import { queryKeys } from '@/api/keys';
import { queryClient } from '@/api/query-client';
import { fetchMyPoints, fetchMyRedemptions, redeemPerk } from '@/features/wallet/api';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useMyPoints() {
  return useQuery({
    queryKey: queryKeys.myPoints,
    queryFn: fetchMyPoints,
  });
}

export function useMyRedemptions() {
  return useQuery({
    queryKey: queryKeys.myRedemptions,
    queryFn: fetchMyRedemptions,
  });
}

export function useRedeemPerk() {
  return useMutation({
    mutationFn: redeemPerk,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.myPoints }),
        queryClient.invalidateQueries({ queryKey: queryKeys.myRedemptions }),
      ]);
    },
  });
}
