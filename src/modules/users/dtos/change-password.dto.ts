import { z } from 'zod';

export const ChangePasswordDto = z.object({
  currentPassword: z
    .string('Current Password is required')
    .min(8, 'Password must be at least 8 characters'),
  newPassword: z
    .string('New Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export type ChangePasswordType = z.infer<typeof ChangePasswordDto>;
