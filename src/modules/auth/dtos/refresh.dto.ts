import { z } from 'zod';

export const RefreshDto = z.object({
  refreshToken: z.string().optional(),
});

export type RefreshType = z.infer<typeof RefreshDto>;
