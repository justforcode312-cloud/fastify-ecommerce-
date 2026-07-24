import { z } from 'zod';

export const SearchSchema = z.object({
  search: z.string().trim().optional(),
});

export type SearchDto = z.infer<typeof SearchSchema>;
