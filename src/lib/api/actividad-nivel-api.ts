import type { 
  ActividadNivel, 
  CreateActividadNivelDTO,
  UpdateActividadNivelDTO,
  ActividadNivelFilters 
} from '@/models';
import type { DbActionResult } from '@/types/common';

/**
 * Obtiene todas las actividades de nivel
 */
export async function getAllActividadNiveles(
  filters?: ActividadNivelFilters
): Promise<DbActionResult<ActividadNivel[]>> {
  try {
    const params = new URLSearchParams();
    if (filters?.IDN !== undefined) params.append('IDN', filters.IDN.toString());
    if (filters?.IDT !== undefined) params.append('IDT', filters.IDT.toString());
    if (filters?.DESCRIPCION) params.append('DESCRIPCION', filters.DESCRIPCION);

    const url = `/api/actividad-nivel${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener actividades de nivel',
    };
  }
}

/**
 * Obtiene una actividad de nivel por ID
 */
export async function getActividadNivelById(
  id: number
): Promise<DbActionResult<ActividadNivel>> {
  try {
    const response = await fetch(`/api/actividad-nivel/${id}`);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener actividad de nivel',
    };
  }
}

/**
 * Crea una nueva actividad de nivel
 */
export async function createActividadNivel(
  data: CreateActividadNivelDTO
): Promise<DbActionResult<ActividadNivel>> {
  try {
    const response = await fetch('/api/actividad-nivel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear actividad de nivel',
    };
  }
}

/**
 * Actualiza una actividad de nivel
 */
export async function updateActividadNivel(
  id: number,
  data: UpdateActividadNivelDTO
): Promise<DbActionResult<ActividadNivel>> {
  try {
    const response = await fetch(`/api/actividad-nivel/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar actividad de nivel',
    };
  }
}

/**
 * Elimina una actividad de nivel
 */
export async function deleteActividadNivel(
  id: number
): Promise<DbActionResult<ActividadNivel>> {
  try {
    const response = await fetch(`/api/actividad-nivel/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar actividad de nivel',
    };
  }
}
