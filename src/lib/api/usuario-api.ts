import type { 
  Usuario, 
  CreateUsuarioDTO, 
  UpdateUsuarioDTO,
  UsuarioFilters 
} from '@/models';
import type { DbActionResult } from '@/types/common';

/**
 * Obtiene todos los usuarios
 */
export async function getAllUsuarios(
  filters?: UsuarioFilters
): Promise<DbActionResult<Usuario[]>> {
  try {
    const params = new URLSearchParams();
    if (filters?.NOMBRE) params.append('NOMBRE', filters.NOMBRE);
    if (filters?.USUARIO) params.append('USUARIO', filters.USUARIO);
    if (filters?.ID_ROL !== undefined) params.append('ID_ROL', filters.ID_ROL.toString());
    if (filters?.ID_DIS !== undefined) params.append('ID_DIS', filters.ID_DIS.toString());

    const url = `/api/usuario${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener usuarios',
    };
  }
}

/**
 * Obtiene un usuario por ID
 */
export async function getUsuarioById(
  id: number
): Promise<DbActionResult<Usuario>> {
  try {
    const response = await fetch(`/api/usuario/${id}`);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener usuario',
    };
  }
}

/**
 * Crea un nuevo usuario
 */
export async function createUsuario(
  data: CreateUsuarioDTO
): Promise<DbActionResult<Usuario>> {
  try {
    const response = await fetch('/api/usuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear usuario',
    };
  }
}

/**
 * Actualiza un usuario
 */
export async function updateUsuario(
  id: number,
  data: UpdateUsuarioDTO
): Promise<DbActionResult<Usuario>> {
  try {
    const response = await fetch(`/api/usuario/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar usuario',
    };
  }
}

/**
 * Elimina un usuario
 */
export async function deleteUsuario(
  id: number
): Promise<DbActionResult<Usuario>> {
  try {
    const response = await fetch(`/api/usuario/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar usuario',
    };
  }
}

