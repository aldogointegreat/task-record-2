/**
 * Modelo: ACTIVIDAD_NIVEL
 * Actividades asociadas a un nivel
 */

export interface ActividadNivel {
  IDA: number;
  IDN: number;
  IDT: number | null;
  ORDEN: number;
  DESCRIPCION: string;
}

export interface CreateActividadNivelDTO {
  IDN: number;
  IDT?: number | null;
  ORDEN: number;
  DESCRIPCION: string;
}

export interface UpdateActividadNivelDTO {
  IDN?: number;
  IDT?: number | null;
  ORDEN?: number;
  DESCRIPCION?: string;
}

export interface ActividadNivelFilters {
  IDN?: number;
  IDT?: number;
  DESCRIPCION?: string;
}


