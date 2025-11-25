import type { 
  REPNivel, 
  CreateREPNivelDTO, 
  UpdateREPNivelDTO,
  REPNivelFilters 
} from '@/models';
import type { DbActionResult } from '@/types/common';

/**
 * Obtiene todos los registros REP_NIVEL
 */
export async function getAllREPNivel(
  filters?: REPNivelFilters
): Promise<DbActionResult<REPNivel[]>> {
  try {
    const params = new URLSearchParams();
    if (filters?.IDPM !== undefined) params.append('IDPM', filters.IDPM.toString());
    if (filters?.IDN !== undefined) params.append('IDN', filters.IDN.toString());
    if (filters?.IDJ !== undefined) params.append('IDJ', filters.IDJ.toString());
    if (filters?.IDNP !== undefined) params.append('IDNP', filters.IDNP.toString());

    const url = `/api/rep-nivel${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener registros REP_NIVEL',
    };
  }
}

/**
 * Obtiene un registro REP_NIVEL por ID
 */
export async function getREPNivelById(
  id: number
): Promise<DbActionResult<REPNivel>> {
  try {
    const response = await fetch(`/api/rep-nivel/${id}`);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener registro REP_NIVEL',
    };
  }
}

/**
 * Crea un nuevo registro REP_NIVEL
 */
export async function createREPNivel(
  data: CreateREPNivelDTO
): Promise<DbActionResult<REPNivel>> {
  try {
    const response = await fetch('/api/rep-nivel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear registro REP_NIVEL',
    };
  }
}

/**
 * Actualiza un registro REP_NIVEL
 */
export async function updateREPNivel(
  id: number,
  data: UpdateREPNivelDTO
): Promise<DbActionResult<REPNivel>> {
  try {
    const response = await fetch(`/api/rep-nivel/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar registro REP_NIVEL',
    };
  }
}

/**
 * Elimina un registro REP_NIVEL
 */
export async function deleteREPNivel(
  id: number
): Promise<DbActionResult<REPNivel>> {
  try {
    const response = await fetch(`/api/rep-nivel/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar registro REP_NIVEL',
    };
  }
}

