/**
 * Modelo: PM
 * Tabla de Programación de Mantención (Pautas de Mantención)
 */

export interface PM {
  IDPM: number;
  IDN: number;
  NRO: number;
  CONJUNTO: number;
  PLT: number | null;
  PROGRAMACION: Date | string;
  ESTADO: string;
  HOROMETRO: number;
  INICIO: Date | string;
  FIN: Date | string;
}

export interface CreatePMDTO {
  IDN: number;
  NRO: number;
  CONJUNTO: number;
  PLT?: number | null;
  PROGRAMACION: Date | string;
  ESTADO: string;
  HOROMETRO?: number;
  INICIO: Date | string;
  FIN: Date | string;
}

export interface UpdatePMDTO {
  IDN?: number;
  NRO?: number;
  CONJUNTO?: number;
  PLT?: number | null;
  PROGRAMACION?: Date | string;
  ESTADO?: string;
  HOROMETRO?: number;
  INICIO?: Date | string;
  FIN?: Date | string;
}

export interface PMFilters {
  IDN?: number;
  NRO?: number;
  CONJUNTO?: number;
  ESTADO?: string;
}

/**
 * DTO para crear PM desde actividades seleccionadas
 * (Nueva funcionalidad de creación manual de PMs)
 */
export interface CreatePMFromActividadesDTO {
  // Campos básicos de PM
  NRO: number;
  HOROMETRO: number;
  IDN: number;
  CONJUNTO: number;
  PROGRAMACION: Date | string;
  ESTADO: string;
  INICIO: Date | string;
  FIN: Date | string;
  PLT?: number | null;

  // IDs de actividades seleccionadas
  actividadesIds: number[];
}
