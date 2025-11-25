/**
 * Modelo: REP_NIVEL
 * Tabla de Repetición de Niveles (Niveles de Repetición)
 */

export interface REPNivel {
  IDRN: number;
  IDPM: number;
  IDN: number;
  IDJ: number;
  IDNP: number | null;
  DESCRIPCION: string;
}

export interface CreateREPNivelDTO {
  IDPM: number;
  IDN: number;
  IDJ: number;
  IDNP?: number | null;
  DESCRIPCION: string;
}

export interface UpdateREPNivelDTO {
  IDPM?: number;
  IDN?: number;
  IDJ?: number;
  IDNP?: number | null;
  DESCRIPCION?: string;
}

export interface REPNivelFilters {
  IDPM?: number;
  IDN?: number;
  IDJ?: number;
  IDNP?: number;
}

