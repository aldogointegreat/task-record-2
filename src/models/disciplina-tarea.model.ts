/**
 * Modelo: DISCIPLINA_TAREA
 * Catálogo de disciplinas de tareas para actividades de nivel
 */

export interface DisciplinaTarea {
  ID_DISCIPLINA_TAREA: number;
  CODIGO: string;
  NOMBRE: string;
}

export interface CreateDisciplinaTareaDTO {
  CODIGO: string;
  NOMBRE: string;
}

export interface UpdateDisciplinaTareaDTO {
  CODIGO?: string;
  NOMBRE?: string;
}

export interface DisciplinaTareaFilters {
  CODIGO?: string;
  NOMBRE?: string;
}

