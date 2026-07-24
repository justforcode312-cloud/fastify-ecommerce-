import type { z } from 'zod';

import { PaginationSchema } from './pagination.dto';
import { SearchSchema } from './search.dto';
import { SortSchema } from './sort.dto';

export const ListSchema = PaginationSchema.extend(SearchSchema.shape).extend(SortSchema.shape);

export type ListDto = z.infer<typeof ListSchema>;
