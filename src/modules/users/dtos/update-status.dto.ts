import { z } from 'zod';

import { USER_STATUS } from '@/core/enums/user.enums';

export const UpdateStatusDto = z.object({
  status: z.enum(USER_STATUS),
});

export type UpdateStatusType = z.infer<typeof UpdateStatusDto>;
