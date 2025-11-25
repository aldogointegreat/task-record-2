import type { 
  REPActividad, 
  CreateREPActividadDTO, 
  UpdateREPActividadDTO,
  REPActividadFilters 
} from '@/models';
import type { DbActionResult } from '@/types/common';

/**
 * Obtiene todos los registros REP_ACTIVIDAD
 */
export async function getAllREPActividad(
  filters?: REPActividadFilters
): Promise<DbActionResult<REPActividad[]>> {
  try {
    const params = new URLSearchParams();
    if (filters?.IDRN !== undefined) params.append('IDRN', filters.IDRN.toString());
    if (filters?.ORDEN !== undefined) params.append('ORDEN', filters.ORDEN.toString());

    const url = `/api/rep-actividad${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener registros REP_ACTIVIDAD',
    };
  }
}

/**
 * Obtiene un registro REP_ACTIVIDAD por ID
 */
export async function getREPActividadById(
  id: number
): Promise<DbActionResult<REPActividad>> {
  try {
    const response = await fetch(`/api/rep-actividad/${id}`);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener registro REP_ACTIVIDAD',
    };
  }
}

/**
 * Crea un nuevo registro REP_ACTIVIDAD
 */
export async function createREPActividad(
  data: CreateREPActividadDTO
): Promise<DbActionResult<REPActividad>> {
  try {
    const response = await fetch('/api/rep-actividad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear registro REP_ACTIVIDAD',
    };
  }
}

/**
 * Actualiza un registro REP_ACTIVIDAD
 */
export async function updateREPActividad(
  id: number,
  data: UpdateREPActividadDTO
): Promise<DbActionResult<REPActividad>> {
  try {
    const response = await fetch(`/api/rep-actividad/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar registro REP_ACTIVIDAD',
    };
  }
}

/**
 * Elimina un registro REP_ACTIVIDAD
 */
export async function deleteREPActividad(
  id: number
): Promise<DbActionResult<REPActividad>> {
  try {
    const response = await fetch(`/api/rep-actividad/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar registro REP_ACTIVIDAD',
    };
  }
}

