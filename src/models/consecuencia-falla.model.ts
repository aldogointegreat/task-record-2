/**
 * Modelo: CONSECUENCIA_FALLA
 * Catálogo de consecuencias de falla para actividades de nivel
 */

export interface ConsecuenciaFalla {
  ID_CONSECUENCIA: number;
  CODIGO: string;
  NOMBRE: string;
}

export interface CreateConsecuenciaFallaDTO {
  CODIGO: string;
  NOMBRE: string;
}

export interface UpdateConsecuenciaFallaDTO {
  CODIGO?: string;
  NOMBRE?: string;
}

export interface ConsecuenciaFallaFilters {
  CODIGO?: string;
  NOMBRE?: string;
}

