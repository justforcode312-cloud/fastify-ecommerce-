import { z } from 'zod';

export const JtiSchema = z.object({
  jti: z.string().min(1, 'JTI is required'),
});

export type JtiDto = z.infer<typeof JtiSchema>;
