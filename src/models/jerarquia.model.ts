/**
 * Modelo: JERARQUIA
 * Tabla maestra de jerarquías
 */

export interface Jerarquia {
  IDJ: number;
  DESCRIPCION: string;
}

export interface CreateJerarquiaDTO {
  DESCRIPCION: string;
}

export interface UpdateJerarquiaDTO {
  DESCRIPCION?: string;
}

export interface JerarquiaFilters {
  DESCRIPCION?: string;
}


