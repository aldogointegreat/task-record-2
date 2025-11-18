/**
 * Modelo: DISCIPLINA
 * Tabla maestra de disciplinas/especialidades
 */

export interface Disciplina {
  ID_DIS: number;
  NOMBRE: string;
}

export interface CreateDisciplinaDTO {
  NOMBRE: string;
}

export interface UpdateDisciplinaDTO {
  NOMBRE?: string;
}

export interface DisciplinaFilters {
  NOMBRE?: string;
}


