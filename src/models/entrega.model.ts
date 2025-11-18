/**
 * Modelo: ENTREGA
 * Tabla maestra de entregas
 */

export interface Entrega {
  IDE: number;
  DESCRIPCION: string;
  ORDEN: number;
}

export interface CreateEntregaDTO {
  DESCRIPCION: string;
  ORDEN: number;
}

export interface UpdateEntregaDTO {
  DESCRIPCION?: string;
  ORDEN?: number;
}

export interface EntregaFilters {
  DESCRIPCION?: string;
  ORDEN?: number;
}


