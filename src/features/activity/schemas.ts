import { z } from 'zod';

export const submissionSchema = z.object({
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
});

export const submissionListSchema = z.array(submissionSchema);

export type Submission = z.infer<typeof submissionSchema>;
