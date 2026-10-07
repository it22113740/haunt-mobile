import { api } from '@/api/client';
import {
  gallerySchema,
  perkListSchema,
  promotionFeedSchema,
  promotionListSchema,
  venueListSchema,
  type GalleryItem,
  type Perk,
  type Promotion,
  type PromotionFeedItem,
  type Venue,
} from '@/features/venues/schemas';

export async function fetchVenues(): Promise<Venue[]> {
  const { data } = await api.get<unknown>('/venues');
  return venueListSchema.parse(data);
}

export async function fetchNearbyVenues(lat: number, lng: number): Promise<Venue[]> {
  const { data } = await api.get<unknown>('/venues/near', { params: { lat, lng } });
  return venueListSchema.parse(data);
}

export async function fetchVenuePerks(venueId: string): Promise<Perk[]> {
  const { data } = await api.get<unknown>(`/perks/venue/${venueId}`);
  return perkListSchema.parse(data);
}

export async function fetchPromotionFeed(): Promise<PromotionFeedItem[]> {
  const { data } = await api.get<unknown>('/promotions');
  return promotionFeedSchema.parse(data);
}

export async function fetchVenuePromotions(venueId: string): Promise<Promotion[]> {
  const { data } = await api.get<unknown>(`/promotions/venue/${venueId}`);
  return promotionListSchema.parse(data);
}

export async function fetchApprovedMedia(venueId: string): Promise<GalleryItem[]> {
  const { data } = await api.get<unknown>(`/submissions/venue/${venueId}/approved-media`);
  return gallerySchema.parse(data);
}
