import { z } from 'zod';

export const RefreshDto = z.object({
  refreshToken: z.string('Refresh token is required'),
});

export type RefreshType = z.infer<typeof RefreshDto>;
