/**
 * Modelo para la tabla ACTIVIDAD
 * Estructura real de la base de datos
 */

export interface Actividad {
  ID_ACT: number; // Primary Key
  ID_CON?: string | null; // varchar(50)
  ID_CLM?: string | null; // varchar(50)
  ID_DIS?: number | null; // int
  TITULO?: string | null; // varchar(800)
  ID_UM?: string | null; // varchar(50)
  ID_FRC?: number | null; // int
  ID_RAN?: number | null; // int
  ESPECIFICACION?: string | null; // varchar(250)
  INICIO?: number | null; // float
  FIN?: number | null; // float
  REFERENCIA?: string | null; // varchar(250)
  REFERENCIA_URL?: string | null; // varchar(250)
  HABILITADO?: boolean | null; // bit
  DESCRIPCION?: string | null; // varchar(500)
  DURACION?: number | null; // decimal(12,2)
  SUBACTIVIDAD?: string | null; // varchar(500)
  LOGIN?: number | null; // int
  ID_PM?: number | null; // int (Foreign Key)
  IdMaestro?: number | null; // int
}

/**
 * DTO para crear una nueva actividad
 */
export interface CreateActividadDTO {
  ID_CON?: string;
  ID_CLM?: string;
  ID_DIS?: number;
  TITULO?: string;
  ID_UM?: string;
  ID_FRC?: number;
  ID_RAN?: number;
  ESPECIFICACION?: string;
  INICIO?: number;
  FIN?: number;
  REFERENCIA?: string;
  REFERENCIA_URL?: string;
  HABILITADO?: boolean;
  DESCRIPCION?: string;
  DURACION?: number;
  SUBACTIVIDAD?: string;
  LOGIN?: number;
  ID_PM?: number;
  IdMaestro?: number;
}

/**
 * DTO para actualizar una actividad existente
 */
export interface UpdateActividadDTO {
  ID_CON?: string;
  ID_CLM?: string;
  ID_DIS?: number;
  TITULO?: string;
  ID_UM?: string;
  ID_FRC?: number;
  ID_RAN?: number;
  ESPECIFICACION?: string;
  INICIO?: number;
  FIN?: number;
  REFERENCIA?: string;
  REFERENCIA_URL?: string;
  HABILITADO?: boolean;
  DESCRIPCION?: string;
  DURACION?: number;
  SUBACTIVIDAD?: string;
  LOGIN?: number;
  ID_PM?: number;
  IdMaestro?: number;
}

/**
 * Filtros para buscar actividades
 */
export interface ActividadFilters {
  HABILITADO?: boolean;
  TITULO?: string;
  ID_CON?: string;
  ID_CLM?: string;
  ID_DIS?: number;
  ID_PM?: number;
  searchTerm?: string; // Buscar en TITULO, DESCRIPCION, ESPECIFICACION
}
