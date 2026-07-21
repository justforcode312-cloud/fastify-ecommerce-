export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiPaginatedResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T[];
  meta: PaginationMeta;
}
