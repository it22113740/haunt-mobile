import { z } from 'zod';

export const testPushResultSchema = z.object({
  sent: z.boolean(),
  reason: z.string().nullable(),
  title: z.string(),
  body: z.string(),
});

export type TestPushResult = z.infer<typeof testPushResultSchema>;
