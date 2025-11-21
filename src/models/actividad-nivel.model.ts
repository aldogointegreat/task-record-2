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
  FUNCIONALIDAD: string | null;
  MODO_FALLA: string | null;
  EFECTO_FALLA: string | null;
  TIEMPO_PROMEDIO_FALLA: number | null;
  UNIDAD_TIEMPO_FALLA: string | null;
  ID_CONSECUENCIA_FALLA: number | null;
  ID_CLASE_MANTENCION: number | null;
  TAREA_MANTENCION: string | null;
  FRECUENCIA_TAREA: number | null;
  UNIDAD_FRECUENCIA: string | null;
  DURACION_TAREA: number | null;
  CANTIDAD_RECURSOS: number | null;
  ID_CONDICION_ACCESO: number | null;
  ID_DISCIPLINA_TAREA: number | null;
}

export interface CreateActividadNivelDTO {
  IDN: number;
  IDT?: number | null;
  ORDEN: number;
  DESCRIPCION: string;
  FUNCIONALIDAD?: string | null;
  MODO_FALLA?: string | null;
  EFECTO_FALLA?: string | null;
  TIEMPO_PROMEDIO_FALLA?: number | null;
  UNIDAD_TIEMPO_FALLA?: string | null;
  ID_CONSECUENCIA_FALLA?: number | null;
  ID_CLASE_MANTENCION?: number | null;
  TAREA_MANTENCION?: string | null;
  FRECUENCIA_TAREA?: number | null;
  UNIDAD_FRECUENCIA?: string | null;
  DURACION_TAREA?: number | null;
  CANTIDAD_RECURSOS?: number | null;
  ID_CONDICION_ACCESO?: number | null;
  ID_DISCIPLINA_TAREA?: number | null;
}

export interface UpdateActividadNivelDTO {
  IDN?: number;
  IDT?: number | null;
  ORDEN?: number;
  DESCRIPCION?: string;
  FUNCIONALIDAD?: string | null;
  MODO_FALLA?: string | null;
  EFECTO_FALLA?: string | null;
  TIEMPO_PROMEDIO_FALLA?: number | null;
  UNIDAD_TIEMPO_FALLA?: string | null;
  ID_CONSECUENCIA_FALLA?: number | null;
  ID_CLASE_MANTENCION?: number | null;
  TAREA_MANTENCION?: string | null;
  FRECUENCIA_TAREA?: number | null;
  UNIDAD_FRECUENCIA?: string | null;
  DURACION_TAREA?: number | null;
  CANTIDAD_RECURSOS?: number | null;
  ID_CONDICION_ACCESO?: number | null;
  ID_DISCIPLINA_TAREA?: number | null;
}

export interface ActividadNivelFilters {
  IDN?: number;
  IDT?: number;
  DESCRIPCION?: string;
  ID_CONSECUENCIA_FALLA?: number;
  ID_CLASE_MANTENCION?: number;
  ID_CONDICION_ACCESO?: number;
  ID_DISCIPLINA_TAREA?: number;
}


