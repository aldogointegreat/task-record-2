/**
 * Modelo: JERARQUIA
 * Tabla maestra de jerarquías
 */

export interface Jerarquia {
  IDJ: number;
  DESCRIPCION: string;
  COLOR?: string;
}

export interface CreateJerarquiaDTO {
  DESCRIPCION: string;
  COLOR?: string;
}

export interface UpdateJerarquiaDTO {
  DESCRIPCION?: string;
  COLOR?: string;
}

export interface JerarquiaFilters {
  DESCRIPCION?: string;
}
