/**
 * Tipos comunes compartidos en toda la aplicación
 */

/**
 * Resultado estándar para todas las Server Actions
 */
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: string;
}

/**
 * Alias para mantener compatibilidad con código existente
 */
export type DbActionResult<T = unknown> = ActionResult<T>;

/**
 * Resultado con paginación para queries que requieren paginación server-side
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Resultado de acción con paginación
 */
export interface PaginatedActionResult<T = unknown> {
  success: boolean;
  data?: PaginatedResult<T>;
  message?: string;
  error?: string;
  details?: string;
}

