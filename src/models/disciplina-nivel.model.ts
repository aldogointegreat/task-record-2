/**
 * Modelo: DISCIPLINA_NIVEL
 * Catálogo de disciplinas para la tabla NIVEL
 */

export interface DisciplinaNivel {
  ID_DISCIPLINA_NIVEL: number;
  CODIGO: string;
  DESCRIPCION: string;
}

export interface CreateDisciplinaNivelDTO {
  CODIGO: string;
  DESCRIPCION: string;
}

export interface UpdateDisciplinaNivelDTO {
  CODIGO?: string;
  DESCRIPCION?: string;
}

export interface DisciplinaNivelFilters {
  CODIGO?: string;
  DESCRIPCION?: string;
}


