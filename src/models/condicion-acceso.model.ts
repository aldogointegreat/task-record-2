/**
 * Modelo: CONDICION_ACCESO
 * Catálogo de condiciones de acceso para actividades de nivel
 */

export interface CondicionAcceso {
  ID_CONDICION: number;
  CODIGO: string;
  NOMBRE: string;
}

export interface CreateCondicionAccesoDTO {
  CODIGO: string;
  NOMBRE: string;
}

export interface UpdateCondicionAccesoDTO {
  CODIGO?: string;
  NOMBRE?: string;
}

export interface CondicionAccesoFilters {
  CODIGO?: string;
  NOMBRE?: string;
}

