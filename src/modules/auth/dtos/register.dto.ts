import { z } from 'zod';

export const RegisterDto = z.object({
  firstName: z
    .string('First name is required')
    .trim()
    .min(1, 'First name cannot be empty')
    .max(50, 'First name cannot exceed 50 characters'),
  lastName: z
    .string('Last name is required')
    .trim()
    .min(1, 'Last name cannot be empty')
    .max(50, 'Last name cannot exceed 50 characters'),
  email: z.email('Invalid email address').trim(),
  password: z.string('Password is required').min(8, 'Password must be at least 8 characters'),
});

export type RegisterType = z.infer<typeof RegisterDto>;
