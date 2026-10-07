import { queryKeys } from '@/api/keys';
import { queryClient } from '@/api/query-client';
import {
  createPerk,
  createVenue,
  deletePerk,
  deleteVenue,
  createPromotion,
  deletePromotion,
  fetchMyPerks,
  fetchMyPromotions,
  fetchMyVenues,
  fetchOwnerRedemptions,
  fetchOwnerSubmissions,
  markRedemptionUsed,
  reviewSubmission,
  updatePerk,
  updatePromotion,
  updateVenue,
} from '@/features/owner/api';
import type { PerkFormValues, PromotionFormValues, VenueFormValues } from '@/features/owner/schemas';
import { useMutation, useQuery } from '@tanstack/react-query';

async function refreshVenues() {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.myVenues }),
    queryClient.invalidateQueries({ queryKey: queryKeys.venues }),
  ]);
}

async function refreshPerks() {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.myPerks }),
    queryClient.invalidateQueries({ queryKey: ['perks', 'venue'] }),
  ]);
}

export function useMyVenues() {
  return useQuery({ queryKey: queryKeys.myVenues, queryFn: fetchMyVenues });
}

export function useMyPerks() {
  return useQuery({ queryKey: queryKeys.myPerks, queryFn: fetchMyPerks });
}

export function useOwnerSubmissions() {
  return useQuery({ queryKey: queryKeys.ownerSubmissions, queryFn: fetchOwnerSubmissions });
}

export function useOwnerRedemptions() {
  return useQuery({ queryKey: queryKeys.ownerRedemptions, queryFn: fetchOwnerRedemptions });
}

export function useSaveVenue(venueId?: string) {
  return useMutation({
    mutationFn: (values: VenueFormValues) => (venueId ? updateVenue(venueId, values) : createVenue(values)),
    onSuccess: refreshVenues,
  });
}

export function useDeleteVenue() {
  return useMutation({
    mutationFn: deleteVenue,
    onSuccess: refreshVenues,
  });
}

export function useSavePerk(perkId?: string) {
  return useMutation({
    mutationFn: (values: PerkFormValues) => (perkId ? updatePerk(perkId, values) : createPerk(values)),
    onSuccess: refreshPerks,
  });
}

export function useDeletePerk() {
  return useMutation({
    mutationFn: deletePerk,
    onSuccess: refreshPerks,
  });
}

async function refreshPromotions() {
  await queryClient.invalidateQueries({ queryKey: queryKeys.myPromotions });
  await queryClient.invalidateQueries({ queryKey: queryKeys.promotionFeed });
  await queryClient.invalidateQueries({ queryKey: ['promotions', 'venue'] });
}

export function useMyPromotions() {
  return useQuery({ queryKey: queryKeys.myPromotions, queryFn: fetchMyPromotions });
}

export function useSavePromotion(promotionId?: string) {
  return useMutation({
    mutationFn: (values: PromotionFormValues) =>
      promotionId ? updatePromotion(promotionId, values) : createPromotion(values),
    onSuccess: refreshPromotions,
  });
}

export function useDeletePromotion() {
  return useMutation({
    mutationFn: deletePromotion,
    onSuccess: refreshPromotions,
  });
}

export function useReviewSubmission() {
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: string;
      status: 'APPROVED' | 'REJECTED';
      rejectionReason?: string;
    }) => reviewSubmission(id, body),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.ownerSubmissions }),
        queryClient.invalidateQueries({ queryKey: ['submissions', 'venue'] }),
      ]);
    },
  });
}

export function useMarkRedemptionUsed() {
  return useMutation({
    mutationFn: markRedemptionUsed,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.ownerRedemptions });
    },
  });
}
