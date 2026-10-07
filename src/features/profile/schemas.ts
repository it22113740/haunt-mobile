import { z } from 'zod';

export const profileSchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string().nullable(),
  imageUrl: z.string().nullable(),
  role: z.enum(['OWNER', 'USER']),
  pushToken: z.string().nullish(),
  ownerProfile: z
    .object({
      gmail: z.string(),
      address: z.string(),
      onboardingStep: z.number().optional(),
    })
    .nullable()
    .optional(),
});

export type Profile = z.infer<typeof profileSchema>;

export const uploadResultSchema = z.object({
  mediaUrl: z.string().min(1),
  publicId: z.string(),
});

export function profileFormSchema(role: Profile['role']) {
  return z
    .object({
      username: z.string(),
      email: z.string(),
      gmail: z.string(),
      address: z.string(),
    })
    .superRefine((value, ctx) => {
      if (!z.email().safeParse(value.email).success) {
        ctx.addIssue({ code: 'custom', path: ['email'], message: 'Enter a valid email' });
      }

      if (role === 'USER' && value.username.trim().length < 2) {
        ctx.addIssue({
          code: 'custom',
          path: ['username'],
          message: 'Use at least 2 characters',
        });
      }

      if (role === 'OWNER') {
        if (!z.email().safeParse(value.gmail).success) {
          ctx.addIssue({
            code: 'custom',
            path: ['gmail'],
            message: 'Enter a valid email',
          });
        }
        if (value.address.trim().length < 1) {
          ctx.addIssue({
            code: 'custom',
            path: ['address'],
            message: 'Enter the business address',
          });
        }
      }
    });
}

export type ProfileFormValues = z.infer<ReturnType<typeof profileFormSchema>>;
