import type { 
  Jerarquia, 
  CreateJerarquiaDTO, 
  UpdateJerarquiaDTO,
  JerarquiaFilters 
} from '@/models';
import type { DbActionResult } from '@/types/common';

/**
 * Obtiene todas las jerarquías
 */
export async function getAllJerarquias(
  filters?: JerarquiaFilters
): Promise<DbActionResult<Jerarquia[]>> {
  try {
    const params = new URLSearchParams();
    if (filters?.DESCRIPCION) params.append('DESCRIPCION', filters.DESCRIPCION);

    const url = `/api/jerarquia${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener jerarquías',
    };
  }
}

/**
 * Obtiene una jerarquía por ID
 */
export async function getJerarquiaById(
  id: number
): Promise<DbActionResult<Jerarquia>> {
  try {
    const response = await fetch(`/api/jerarquia/${id}`);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener jerarquía',
    };
  }
}

/**
 * Crea una nueva jerarquía
 */
export async function createJerarquia(
  data: CreateJerarquiaDTO
): Promise<DbActionResult<Jerarquia>> {
  try {
    const response = await fetch('/api/jerarquia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear jerarquía',
    };
  }
}

/**
 * Actualiza una jerarquía
 */
export async function updateJerarquia(
  id: number,
  data: UpdateJerarquiaDTO
): Promise<DbActionResult<Jerarquia>> {
  try {
    const response = await fetch(`/api/jerarquia/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar jerarquía',
    };
  }
}

/**
 * Elimina una jerarquía
 */
export async function deleteJerarquia(
  id: number
): Promise<DbActionResult<Jerarquia>> {
  try {
    const response = await fetch(`/api/jerarquia/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar jerarquía',
    };
  }
}


