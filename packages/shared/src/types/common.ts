// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

export type PaginationMeta = {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
  meta?: PaginationMeta;
};

export type ApiError = {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
};

export type PaginationQuery = {
  page?: number;
  perPage?: number;
  search?: string;
};

export type SortOrder = 'asc' | 'desc';
