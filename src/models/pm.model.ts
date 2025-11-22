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



