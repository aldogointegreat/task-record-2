/**
 * Modelo: ATRIBUTO
 * Tabla maestra de atributos
 */

export interface Atributo {
  IDT: number;
  DESCRIPCION: string;
}

export interface CreateAtributoDTO {
  DESCRIPCION: string;
}

export interface UpdateAtributoDTO {
  DESCRIPCION?: string;
}

export interface AtributoFilters {
  DESCRIPCION?: string;
}


