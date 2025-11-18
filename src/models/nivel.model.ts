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
}

export interface CreateNivelDTO {
  IDJ: number;
  IDNP?: number | null;
  NOMBRE: string;
  PLANTILLA?: boolean;
  NROPM?: number;
}

export interface UpdateNivelDTO {
  IDJ?: number;
  IDNP?: number | null;
  NOMBRE?: string;
  PLANTILLA?: boolean;
  NROPM?: number;
}

export interface NivelFilters {
  NOMBRE?: string;
  IDJ?: number;
  IDNP?: number;
  PLANTILLA?: boolean;
}

