import type { 
  Nivel, 
  CreateNivelDTO, 
  UpdateNivelDTO,
  NivelFilters 
} from '@/models';
import type { DbActionResult } from '@/types/common';

/**
 * Obtiene todos los niveles
 */
export async function getAllNiveles(
  filters?: NivelFilters
): Promise<DbActionResult<Nivel[]>> {
  try {
    const params = new URLSearchParams();
    if (filters?.NOMBRE) params.append('NOMBRE', filters.NOMBRE);
    if (filters?.IDJ !== undefined) params.append('IDJ', filters.IDJ.toString());
    if (filters?.IDNP !== undefined) params.append('IDNP', filters.IDNP.toString());
    if (filters?.PLANTILLA !== undefined) params.append('PLANTILLA', filters.PLANTILLA.toString());
    if (filters?.ID_DISCIPLINA_NIVEL !== undefined) {
      params.append('ID_DISCIPLINA_NIVEL', filters.ID_DISCIPLINA_NIVEL.toString());
    }
    if (filters?.UNIDAD_MANTENIBLE !== undefined) {
      params.append('UNIDAD_MANTENIBLE', filters.UNIDAD_MANTENIBLE.toString());
    }

    const url = `/api/nivel${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener niveles',
    };
  }
}

/**
 * Obtiene un nivel por ID
 */
export async function getNivelById(
  id: number
): Promise<DbActionResult<Nivel>> {
  try {
    const response = await fetch(`/api/nivel/${id}`);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener nivel',
    };
  }
}

/**
 * Crea un nuevo nivel
 */
export async function createNivel(
  data: CreateNivelDTO
): Promise<DbActionResult<Nivel>> {
  try {
    const response = await fetch('/api/nivel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear nivel',
    };
  }
}

/**
 * Actualiza un nivel
 */
export async function updateNivel(
  id: number,
  data: UpdateNivelDTO
): Promise<DbActionResult<Nivel>> {
  try {
    const response = await fetch(`/api/nivel/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar nivel',
    };
  }
}

/**
 * Elimina un nivel
 */
export async function deleteNivel(
  id: number
): Promise<DbActionResult<Nivel>> {
  try {
    const response = await fetch(`/api/nivel/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar nivel',
    };
  }
}

/**
 * Importa un nivel existente (y su estructura) a un nuevo padre
 */
export async function importarNivel(sourceId: number, targetParentId: number): Promise<DbActionResult<void>> {
  try {
    const response = await fetch('/api/nivel/importar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sourceId, targetParentId }),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al importar componente',
    };
  }
}

