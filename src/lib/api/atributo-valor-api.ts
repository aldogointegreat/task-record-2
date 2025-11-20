import type { 
  AtributoValor,
  CreateAtributoValorDTO,
  UpdateAtributoValorDTO,
  AtributoValorFilters 
} from '@/models';
import type { DbActionResult } from '@/types/common';

/**
 * Obtiene todos los valores de atributo
 */
export async function getAllAtributoValores(
  filters?: AtributoValorFilters
): Promise<DbActionResult<AtributoValor[]>> {
  try {
    const params = new URLSearchParams();
    if (filters?.IDA !== undefined) params.append('IDA', filters.IDA.toString());
    if (filters?.VALOR) params.append('VALOR', filters.VALOR);

    const url = `/api/atributo-valor${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener valores de atributo',
    };
  }
}

/**
 * Obtiene un valor de atributo por ID
 */
export async function getAtributoValorById(
  id: number
): Promise<DbActionResult<AtributoValor>> {
  try {
    const response = await fetch(`/api/atributo-valor/${id}`);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener valor de atributo',
    };
  }
}

/**
 * Crea un nuevo valor de atributo
 */
export async function createAtributoValor(
  data: CreateAtributoValorDTO
): Promise<DbActionResult<AtributoValor>> {
  try {
    const response = await fetch('/api/atributo-valor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear valor de atributo',
    };
  }
}

/**
 * Actualiza un valor de atributo
 */
export async function updateAtributoValor(
  id: number,
  data: UpdateAtributoValorDTO
): Promise<DbActionResult<AtributoValor>> {
  try {
    const response = await fetch(`/api/atributo-valor/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar valor de atributo',
    };
  }
}

/**
 * Elimina un valor de atributo
 */
export async function deleteAtributoValor(
  id: number
): Promise<DbActionResult<AtributoValor>> {
  try {
    const response = await fetch(`/api/atributo-valor/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar valor de atributo',
    };
  }
}

