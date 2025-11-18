import type { 
  Atributo, 
  CreateAtributoDTO, 
  UpdateAtributoDTO,
  AtributoFilters 
} from '@/models';
import type { DbActionResult } from '@/types/common';

/**
 * Obtiene todos los atributos
 */
export async function getAllAtributos(
  filters?: AtributoFilters
): Promise<DbActionResult<Atributo[]>> {
  try {
    const params = new URLSearchParams();
    if (filters?.DESCRIPCION) params.append('DESCRIPCION', filters.DESCRIPCION);

    const url = `/api/atributo${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener atributos',
    };
  }
}

/**
 * Obtiene un atributo por ID
 */
export async function getAtributoById(
  id: number
): Promise<DbActionResult<Atributo>> {
  try {
    const response = await fetch(`/api/atributo/${id}`);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener atributo',
    };
  }
}

/**
 * Crea un nuevo atributo
 */
export async function createAtributo(
  data: CreateAtributoDTO
): Promise<DbActionResult<Atributo>> {
  try {
    const response = await fetch('/api/atributo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear atributo',
    };
  }
}

/**
 * Actualiza un atributo
 */
export async function updateAtributo(
  id: number,
  data: UpdateAtributoDTO
): Promise<DbActionResult<Atributo>> {
  try {
    const response = await fetch(`/api/atributo/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar atributo',
    };
  }
}

/**
 * Elimina un atributo
 */
export async function deleteAtributo(
  id: number
): Promise<DbActionResult<Atributo>> {
  try {
    const response = await fetch(`/api/atributo/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar atributo',
    };
  }
}


