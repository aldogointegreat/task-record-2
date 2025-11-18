import type { 
  Disciplina, 
  CreateDisciplinaDTO, 
  UpdateDisciplinaDTO,
  DisciplinaFilters 
} from '@/models';
import type { DbActionResult } from '@/types/common';

/**
 * Obtiene todas las disciplinas
 */
export async function getAllDisciplinas(
  filters?: DisciplinaFilters
): Promise<DbActionResult<Disciplina[]>> {
  try {
    const params = new URLSearchParams();
    if (filters?.NOMBRE) params.append('NOMBRE', filters.NOMBRE);

    const url = `/api/disciplina${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener disciplinas',
    };
  }
}

/**
 * Obtiene una disciplina por ID
 */
export async function getDisciplinaById(
  id: number
): Promise<DbActionResult<Disciplina>> {
  try {
    const response = await fetch(`/api/disciplina/${id}`);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener disciplina',
    };
  }
}

/**
 * Crea una nueva disciplina
 */
export async function createDisciplina(
  data: CreateDisciplinaDTO
): Promise<DbActionResult<Disciplina>> {
  try {
    const response = await fetch('/api/disciplina', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear disciplina',
    };
  }
}

/**
 * Actualiza una disciplina
 */
export async function updateDisciplina(
  id: number,
  data: UpdateDisciplinaDTO
): Promise<DbActionResult<Disciplina>> {
  try {
    const response = await fetch(`/api/disciplina/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar disciplina',
    };
  }
}

/**
 * Elimina una disciplina
 */
export async function deleteDisciplina(
  id: number
): Promise<DbActionResult<Disciplina>> {
  try {
    const response = await fetch(`/api/disciplina/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar disciplina',
    };
  }
}


