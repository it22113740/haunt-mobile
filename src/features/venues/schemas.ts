import { z } from 'zod';

export const venueSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  description: z.string().nullish(),
  category: z.string().nullish(),
  imageUrl: z.string().nullish(),
  pointsPerPhoto: z.number(),
  pointsPerVideo: z.number(),
  lat: z.number(),
  lng: z.number(),
  distance: z.number().optional(),
});

export const venueListSchema = z.array(venueSchema);

export type Venue = z.infer<typeof venueSchema>;

export const perkSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullish(),
  pointsRequired: z.number(),
  type: z.enum(['DISCOUNT', 'FREE_MEAL', 'OTHER']),
  discountPercent: z.number().nullish(),
  imageUrl: z.string().nullish(),
});

export const perkListSchema = z.array(perkSchema);

export type Perk = z.infer<typeof perkSchema>;

export const promotionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullish(),
  imageUrl: z.string().nullish(),
});

export const promotionListSchema = z.array(promotionSchema);

export type Promotion = z.infer<typeof promotionSchema>;

export const promotionFeedItemSchema = promotionSchema.extend({
  venue: z.object({
    id: z.string(),
    name: z.string(),
    category: z.string().nullish(),
  }),
});

export const promotionFeedSchema = z.array(promotionFeedItemSchema);

export type PromotionFeedItem = z.infer<typeof promotionFeedItemSchema>;

export const galleryItemSchema = z.object({
  id: z.string(),
  mediaUrl: z.string(),
  type: z.enum(['PHOTO', 'VIDEO']),
  createdAt: z.string(),
});

export const gallerySchema = z.array(galleryItemSchema);

export type GalleryItem = z.infer<typeof galleryItemSchema>;

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}
