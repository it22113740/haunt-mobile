import { z } from 'zod';

export const pointsSchema = z.object({
  total: z.number(),
  byVenue: z.array(
    z.object({
      venueId: z.string(),
      venueName: z.string(),
      points: z.number(),
    }),
  ),
});

export type PointsBalance = z.infer<typeof pointsSchema>;
export type VenuePoints = PointsBalance['byVenue'][number];

export const redemptionSchema = z.object({
  id: z.string(),
  promoCode: z.string(),
  pointsSpent: z.number(),
  status: z.enum(['ISSUED', 'USED']),
  createdAt: z.string(),
  perk: z.object({
    id: z.string(),
    title: z.string(),
    venue: z.object({
      id: z.string(),
      name: z.string(),
    }),
  }),
});

export const redemptionListSchema = z.array(redemptionSchema);

export type Redemption = z.infer<typeof redemptionSchema>;
