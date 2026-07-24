import { z } from 'zod';

import { USER_ROLE } from '@/core/enums/user.enums';

export const ChangeRoleDto = z.object({
  role: z.enum(USER_ROLE),
});

export type ChangeRoleType = z.infer<typeof ChangeRoleDto>;
