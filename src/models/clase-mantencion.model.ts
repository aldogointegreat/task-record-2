/**
 * Modelo: CLASE_MANTENCION
 * Catálogo de clases de mantención para actividades de nivel
 */

export interface ClaseMantencion {
  ID_CLASE: number;
  CODIGO: string;
  NOMBRE: string;
}

export interface CreateClaseMantencionDTO {
  CODIGO: string;
  NOMBRE: string;
}

export interface UpdateClaseMantencionDTO {
  CODIGO?: string;
  NOMBRE?: string;
}

export interface ClaseMantencionFilters {
  CODIGO?: string;
  NOMBRE?: string;
}

