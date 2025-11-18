import type { 
  Entrega, 
  CreateEntregaDTO, 
  UpdateEntregaDTO,
  EntregaFilters 
} from '@/models';
import type { DbActionResult } from '@/types/common';

/**
 * Obtiene todas las entregas
 */
export async function getAllEntregas(
  filters?: EntregaFilters
): Promise<DbActionResult<Entrega[]>> {
  try {
    const params = new URLSearchParams();
    if (filters?.DESCRIPCION) params.append('DESCRIPCION', filters.DESCRIPCION);
    if (filters?.ORDEN !== undefined) {
      params.append('ORDEN', filters.ORDEN.toString());
    }

    const url = `/api/entrega${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener entregas',
    };
  }
}

/**
 * Obtiene una entrega por ID
 */
export async function getEntregaById(
  id: number
): Promise<DbActionResult<Entrega>> {
  try {
    const response = await fetch(`/api/entrega/${id}`);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener entrega',
    };
  }
}

/**
 * Crea una nueva entrega
 */
export async function createEntrega(
  data: CreateEntregaDTO
): Promise<DbActionResult<Entrega>> {
  try {
    const response = await fetch('/api/entrega', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear entrega',
    };
  }
}

/**
 * Actualiza una entrega
 */
export async function updateEntrega(
  id: number,
  data: UpdateEntregaDTO
): Promise<DbActionResult<Entrega>> {
  try {
    const response = await fetch(`/api/entrega/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar entrega',
    };
  }
}

/**
 * Elimina una entrega
 */
export async function deleteEntrega(
  id: number
): Promise<DbActionResult<Entrega>> {
  try {
    const response = await fetch(`/api/entrega/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar entrega',
    };
  }
}


