/**
 * Modelo: ATRIBUTO_VALOR
 * Valores de atributos asociados a actividades de nivel
 */

export interface AtributoValor {
  IDAV: number;
  IDA: number;
  VALOR: string;
}

export interface CreateAtributoValorDTO {
  IDA: number;
  VALOR: string;
}

export interface UpdateAtributoValorDTO {
  IDA?: number;
  VALOR?: string;
}

export interface AtributoValorFilters {
  IDA?: number;
  VALOR?: string;
}

