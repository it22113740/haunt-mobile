import { z } from 'zod';

export const ownerVenueSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  lat: z.number(),
  lng: z.number(),
  radiusMeters: z.number(),
  description: z.string().nullish(),
  category: z.string().nullish(),
  imageUrl: z.string().nullish(),
  pointsPerPhoto: z.number(),
  pointsPerVideo: z.number(),
});

export const ownerVenueListSchema = z.array(ownerVenueSchema);

export type OwnerVenue = z.infer<typeof ownerVenueSchema>;

export const venueFormSchema = z.object({
  name: z.string().trim().min(2, 'Use at least 2 characters'),
  address: z.string().trim().min(1, 'Enter the address'),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  radiusMeters: z.number().min(10, 'Use at least 10 meters'),
  pointsPerPhoto: z.number().min(0),
  pointsPerVideo: z.number().min(0),
  imageUrl: z.string(),
  category: z.string().min(1, 'Choose a category'),
  description: z.string(),
});

export type VenueFormValues = z.infer<typeof venueFormSchema>;

export const ownerPerkSchema = z.object({
  id: z.string(),
  venueId: z.string(),
  title: z.string(),
  description: z.string().nullish(),
  pointsRequired: z.number(),
  type: z.enum(['DISCOUNT', 'FREE_MEAL', 'OTHER']),
  discountPercent: z.number().nullish(),
  promoCodePrefix: z.string().nullish(),
  imageUrl: z.string().nullish(),
  venue: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
});

export const ownerPerkListSchema = z.array(ownerPerkSchema);

export type OwnerPerk = z.infer<typeof ownerPerkSchema>;

export const perkFormSchema = z
  .object({
    venueId: z.string().min(1, 'Choose a place'),
    title: z.string().trim().min(2, 'Use at least 2 characters'),
    description: z.string(),
    pointsRequired: z.number().min(1, 'Use at least 1 point'),
    type: z.enum(['DISCOUNT', 'FREE_MEAL', 'OTHER']),
    discountPercent: z.number().min(0).max(100),
    promoCodePrefix: z.string(),
    imageUrl: z.string(),
  })
  .superRefine((value, ctx) => {
    if (value.type === 'DISCOUNT' && value.discountPercent < 1) {
      ctx.addIssue({ code: 'custom', path: ['discountPercent'], message: 'Enter the discount' });
    }
  });

export type PerkFormValues = z.infer<typeof perkFormSchema>;

export const ownerSubmissionSchema = z.object({
  id: z.string(),
  type: z.enum(['PHOTO', 'VIDEO']),
  mediaUrl: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  rejectionReason: z.string().nullish(),
  pointsAwarded: z.number().nullish(),
  createdAt: z.string(),
  venue: z.object({
    id: z.string(),
    name: z.string(),
  }),
  user: z.object({
    id: z.string(),
    username: z.string().nullish(),
    email: z.string(),
  }),
});

export const ownerSubmissionListSchema = z.array(ownerSubmissionSchema);

export type OwnerSubmission = z.infer<typeof ownerSubmissionSchema>;

export const ownerRedemptionSchema = z.object({
  id: z.string(),
  promoCode: z.string(),
  pointsSpent: z.number(),
  status: z.enum(['ISSUED', 'USED']),
  createdAt: z.string(),
  usedAt: z.string().nullish(),
  user: z.object({
    id: z.string(),
    username: z.string().nullish(),
    email: z.string(),
  }),
  perk: z.object({
    id: z.string(),
    title: z.string(),
    venue: z.object({
      id: z.string(),
      name: z.string(),
    }),
  }),
});

export const ownerRedemptionListSchema = z.array(ownerRedemptionSchema);

export type OwnerRedemption = z.infer<typeof ownerRedemptionSchema>;

export const ownerPromotionSchema = z.object({
  id: z.string(),
  venueId: z.string(),
  title: z.string(),
  description: z.string().nullish(),
  imageUrl: z.string().nullish(),
  venue: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
});

export const ownerPromotionListSchema = z.array(ownerPromotionSchema);

export type OwnerPromotion = z.infer<typeof ownerPromotionSchema>;

export const promotionFormSchema = z.object({
  venueId: z.string().min(1, 'Choose a place'),
  title: z.string().trim().min(2, 'Use at least 2 characters'),
  description: z.string(),
  imageUrl: z.string(),
});

export type PromotionFormValues = z.infer<typeof promotionFormSchema>;
