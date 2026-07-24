import { z } from 'zod';

export const UpdateProfileDto = z.object({
  firstName: z.string().trim().max(50, 'First name cannot exceed 50 characters.').optional(),
  lastName: z.string().trim().max(50, 'Last name cannot exceed 50 characters.').optional(),
});

export type UpdateProfileType = z.infer<typeof UpdateProfileDto>;
