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
  GENERADO: boolean;
  COMENTARIO?: string;
  ID_USR?: number;
  FECHA_CREACION?: Date | string;
}

export interface CreateNivelDTO {
  IDJ: number;
  IDNP?: number | null;
  NOMBRE: string;
  PLANTILLA?: boolean;
  NROPM?: number;
  ICONO?: string;
  GENERADO?: boolean;
  COMENTARIO?: string;
  ID_USR?: number;
  FECHA_CREACION?: Date | string;
}

export interface UpdateNivelDTO {
  IDJ?: number;
  IDNP?: number | null;
  NOMBRE?: string;
  PLANTILLA?: boolean;
  NROPM?: number;
  ICONO?: string;
  GENERADO?: boolean;
  COMENTARIO?: string;
  ID_USR?: number;
  FECHA_CREACION?: Date | string;
}

export interface NivelFilters {
  NOMBRE?: string;
  IDJ?: number;
  IDNP?: number;
  PLANTILLA?: boolean;
}
