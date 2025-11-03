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

