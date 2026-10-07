import { api } from '@/api/client';
import { appendUploadPart, postMultipart } from '@/api/multipart';
import {
  ownerPerkListSchema,
  ownerPerkSchema,
  ownerPromotionListSchema,
  ownerPromotionSchema,
  ownerRedemptionListSchema,
  ownerSubmissionListSchema,
  ownerVenueListSchema,
  ownerVenueSchema,
  type OwnerPerk,
  type OwnerPromotion,
  type OwnerRedemption,
  type OwnerSubmission,
  type OwnerVenue,
  type PerkFormValues,
  type PromotionFormValues,
  type VenueFormValues,
} from '@/features/owner/schemas';
import { uploadResultSchema } from '@/features/profile/schemas';

function venueBody(values: VenueFormValues) {
  return {
    name: values.name.trim(),
    address: values.address.trim(),
    lat: values.lat,
    lng: values.lng,
    radiusMeters: Math.round(values.radiusMeters),
    pointsPerPhoto: Math.round(values.pointsPerPhoto),
    pointsPerVideo: Math.round(values.pointsPerVideo),
    category: values.category,
    description: values.description.trim(),
    ...(values.imageUrl ? { imageUrl: values.imageUrl } : {}),
  };
}

function perkBody(values: PerkFormValues) {
  return {
    title: values.title.trim(),
    pointsRequired: Math.round(values.pointsRequired),
    type: values.type,
    ...(values.description.trim() ? { description: values.description.trim() } : {}),
    ...(values.type === 'DISCOUNT' ? { discountPercent: Math.round(values.discountPercent) } : {}),
    ...(values.promoCodePrefix.trim() ? { promoCodePrefix: values.promoCodePrefix.trim() } : {}),
    ...(values.imageUrl ? { imageUrl: values.imageUrl } : {}),
  };
}

export async function uploadImage(file: { uri: string; name: string; type: string }) {
  const body = new FormData();
  body.append('resourceType', 'image');
  await appendUploadPart(body, 'file', file);
  const data = await postMultipart<unknown>('/upload', body);
  return uploadResultSchema.parse(data).mediaUrl;
}

export async function fetchMyVenues(): Promise<OwnerVenue[]> {
  const { data } = await api.get<unknown>('/venues/mine');
  return ownerVenueListSchema.parse(data);
}

export async function createVenue(values: VenueFormValues): Promise<OwnerVenue> {
  const { data } = await api.post<unknown>('/venues', venueBody(values));
  return ownerVenueSchema.parse(data);
}

export async function updateVenue(id: string, values: VenueFormValues): Promise<OwnerVenue> {
  const { data } = await api.patch<unknown>(`/venues/${id}`, venueBody(values));
  return ownerVenueSchema.parse(data);
}

export async function deleteVenue(id: string) {
  await api.delete(`/venues/${id}`);
}

export async function fetchMyPerks(): Promise<OwnerPerk[]> {
  const { data } = await api.get<unknown>('/perks/mine');
  return ownerPerkListSchema.parse(data);
}

export async function createPerk(values: PerkFormValues): Promise<OwnerPerk> {
  const { data } = await api.post<unknown>('/perks', { venueId: values.venueId, ...perkBody(values) });
  return ownerPerkSchema.parse(data);
}

export async function updatePerk(id: string, values: PerkFormValues): Promise<OwnerPerk> {
  const { data } = await api.patch<unknown>(`/perks/${id}`, perkBody(values));
  return ownerPerkSchema.parse(data);
}

export async function deletePerk(id: string) {
  await api.delete(`/perks/${id}`);
}

export async function fetchOwnerSubmissions(): Promise<OwnerSubmission[]> {
  const { data } = await api.get<unknown>('/submissions/owner');
  return ownerSubmissionListSchema.parse(data);
}

export async function reviewSubmission(
  id: string,
  body: { status: 'APPROVED' | 'REJECTED'; rejectionReason?: string },
) {
  await api.patch(`/submissions/${id}/review`, body);
}

export async function fetchOwnerRedemptions(): Promise<OwnerRedemption[]> {
  const { data } = await api.get<unknown>('/redemptions/owner');
  return ownerRedemptionListSchema.parse(data);
}

export async function markRedemptionUsed(id: string) {
  await api.patch(`/redemptions/${id}/used`);
}

function promotionBody(values: PromotionFormValues) {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    imageUrl: values.imageUrl,
  };
}

export async function fetchMyPromotions(): Promise<OwnerPromotion[]> {
  const { data } = await api.get<unknown>('/promotions/mine');
  return ownerPromotionListSchema.parse(data);
}

export async function createPromotion(values: PromotionFormValues): Promise<OwnerPromotion> {
  const { data } = await api.post<unknown>('/promotions', { venueId: values.venueId, ...promotionBody(values) });
  return ownerPromotionSchema.parse(data);
}

export async function updatePromotion(id: string, values: PromotionFormValues): Promise<OwnerPromotion> {
  const { data } = await api.patch<unknown>(`/promotions/${id}`, promotionBody(values));
  return ownerPromotionSchema.parse(data);
}

export async function deletePromotion(id: string) {
  await api.delete(`/promotions/${id}`);
}
