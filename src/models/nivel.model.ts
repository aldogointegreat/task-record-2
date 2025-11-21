/**
 * Modelo: NIVEL
 * Tabla de niveles jerárquicos con relación padre-hijo
 */

export interface Nivel {
  IDN: number;
  IDJ: number;
  IDNP: number | null;
  NOMBRE: string;
  PLANTILLA: boolean;
  NROPM: number;
  ICONO?: string;
  // Nuevos campos
  GENERICO: boolean;
  COMENTARIO?: string;
  ID_USR?: number;
  FECHA_CREACION?: Date | string;
  ID_DISCIPLINA_NIVEL?: number | null;
  UNIDAD_MANTENIBLE?: boolean;
}

export interface CreateNivelDTO {
  IDJ: number;
  IDNP?: number | null;
  NOMBRE: string;
  PLANTILLA?: boolean;
  NROPM?: number;
  ICONO?: string;
  GENERICO?: boolean;
  COMENTARIO?: string;
  ID_USR?: number;
  FECHA_CREACION?: Date | string;
  ID_DISCIPLINA_NIVEL?: number | null;
  UNIDAD_MANTENIBLE?: boolean;
}

export interface UpdateNivelDTO {
  IDJ?: number;
  IDNP?: number | null;
  NOMBRE?: string;
  PLANTILLA?: boolean;
  NROPM?: number;
  ICONO?: string;
  GENERICO?: boolean;
  COMENTARIO?: string;
  ID_USR?: number;
  FECHA_CREACION?: Date | string;
  ID_DISCIPLINA_NIVEL?: number | null;
  UNIDAD_MANTENIBLE?: boolean;
}

export interface NivelFilters {
  NOMBRE?: string;
  IDJ?: number;
  IDNP?: number;
  PLANTILLA?: boolean;
  ID_DISCIPLINA_NIVEL?: number;
  UNIDAD_MANTENIBLE?: boolean;
}
