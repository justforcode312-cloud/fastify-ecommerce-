import { z } from 'zod';

export const LoginDto = z.object({
  email: z.email('Invalid email address').trim(),
  password: z.string('Password is required').min(1, 'Password is required'),
});

export type LoginType = z.infer<typeof LoginDto>;
