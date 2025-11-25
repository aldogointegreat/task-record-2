/**
 * Modelo: REP_ACTIVIDAD
 * Tabla de Repetición de Actividades (Actividades de Repetición)
 */

export interface REPActividad {
  IDRA: number;
  IDRN: number;
  ORDEN: number;
  DESCRIPCION: string;
  REFERENCIA: string;
  DURACION: number;
}

export interface CreateREPActividadDTO {
  IDRN: number;
  ORDEN: number;
  DESCRIPCION: string;
  REFERENCIA: string;
  DURACION: number;
}

export interface UpdateREPActividadDTO {
  IDRN?: number;
  ORDEN?: number;
  DESCRIPCION?: string;
  REFERENCIA?: string;
  DURACION?: number;
}

export interface REPActividadFilters {
  IDRN?: number;
  ORDEN?: number;
}

