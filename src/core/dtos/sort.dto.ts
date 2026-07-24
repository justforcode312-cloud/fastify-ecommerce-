import { z } from 'zod';

export const SortOrder = z.enum(['asc', 'desc']);

export const SortSchema = z.object({
  sortBy: z.string().trim().default('createdAt'),
  sortOrder: SortOrder.default('desc'),
});

export type SortDto = z.infer<typeof SortSchema>;
