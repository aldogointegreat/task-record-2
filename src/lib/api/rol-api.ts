import type { 
  Rol, 
  CreateRolDTO, 
  UpdateRolDTO,
  RolFilters 
} from '@/models';
import type { DbActionResult } from '@/types/common';

/**
 * Obtiene todos los roles
 */
export async function getAllRoles(
  filters?: RolFilters
): Promise<DbActionResult<Rol[]>> {
  try {
    const params = new URLSearchParams();
    if (filters?.NOMBRE) params.append('NOMBRE', filters.NOMBRE);
    if (filters?.ADMINISTRADOR !== undefined) {
      params.append('ADMINISTRADOR', filters.ADMINISTRADOR.toString());
    }

    const url = `/api/rol${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener roles',
    };
  }
}

/**
 * Obtiene un rol por ID
 */
export async function getRolById(
  id: number
): Promise<DbActionResult<Rol>> {
  try {
    const response = await fetch(`/api/rol/${id}`);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener rol',
    };
  }
}

/**
 * Crea un nuevo rol
 */
export async function createRol(
  data: CreateRolDTO
): Promise<DbActionResult<Rol>> {
  try {
    const response = await fetch('/api/rol', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear rol',
    };
  }
}

/**
 * Actualiza un rol
 */
export async function updateRol(
  id: number,
  data: UpdateRolDTO
): Promise<DbActionResult<Rol>> {
  try {
    const response = await fetch(`/api/rol/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar rol',
    };
  }
}

/**
 * Elimina un rol
 */
export async function deleteRol(
  id: number
): Promise<DbActionResult<Rol>> {
  try {
    const response = await fetch(`/api/rol/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar rol',
    };
  }
}


