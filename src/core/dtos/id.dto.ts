import { Types } from 'mongoose';
import { z } from 'zod';

export const IdSchema = z.object({
  id: z.string().refine(Types.ObjectId.isValid, {
    message: 'invalid ObjectId',
  }),
});

export type IdDto = z.infer<typeof IdSchema>;
