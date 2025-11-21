import type { 
  DisciplinaNivel, 
  CreateDisciplinaNivelDTO, 
  UpdateDisciplinaNivelDTO, 
  DisciplinaNivelFilters 
} from '@/models';
import type { DbActionResult } from '@/types/common';

export async function getAllDisciplinasNivel(
  filters?: DisciplinaNivelFilters
): Promise<DbActionResult<DisciplinaNivel[]>> {
  try {
    const params = new URLSearchParams();
    if (filters?.CODIGO) params.append('CODIGO', filters.CODIGO);
    if (filters?.DESCRIPCION) params.append('DESCRIPCION', filters.DESCRIPCION);

    const url = `/api/disciplina-nivel${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener disciplinas de nivel',
    };
  }
}

export async function createDisciplinaNivel(
  data: CreateDisciplinaNivelDTO
): Promise<DbActionResult<DisciplinaNivel>> {
  try {
    const response = await fetch('/api/disciplina-nivel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear disciplina de nivel',
    };
  }
}

export async function updateDisciplinaNivel(
  id: number,
  data: UpdateDisciplinaNivelDTO
): Promise<DbActionResult<DisciplinaNivel>> {
  try {
    const response = await fetch(`/api/disciplina-nivel/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar disciplina de nivel',
    };
  }
}

export async function deleteDisciplinaNivel(
  id: number
): Promise<DbActionResult<DisciplinaNivel>> {
  try {
    const response = await fetch(`/api/disciplina-nivel/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar disciplina de nivel',
    };
  }
}


