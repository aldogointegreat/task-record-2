import type { 
  ConsecuenciaFalla, 
  CreateConsecuenciaFallaDTO,
  UpdateConsecuenciaFallaDTO,
  ConsecuenciaFallaFilters 
} from '@/models';
import type { DbActionResult } from '@/types/common';

export async function getAllConsecuenciasFalla(
  filters?: ConsecuenciaFallaFilters
): Promise<DbActionResult<ConsecuenciaFalla[]>> {
  try {
    const params = new URLSearchParams();
    if (filters?.CODIGO) params.append('CODIGO', filters.CODIGO);
    if (filters?.NOMBRE) params.append('NOMBRE', filters.NOMBRE);

    const url = `/api/consecuencia-falla${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener consecuencias de falla',
    };
  }
}

export async function getConsecuenciaFallaById(
  id: number
): Promise<DbActionResult<ConsecuenciaFalla>> {
  try {
    const response = await fetch(`/api/consecuencia-falla/${id}`);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener consecuencia de falla',
    };
  }
}

export async function createConsecuenciaFalla(
  data: CreateConsecuenciaFallaDTO
): Promise<DbActionResult<ConsecuenciaFalla>> {
  try {
    const response = await fetch('/api/consecuencia-falla', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear consecuencia de falla',
    };
  }
}

export async function updateConsecuenciaFalla(
  id: number,
  data: UpdateConsecuenciaFallaDTO
): Promise<DbActionResult<ConsecuenciaFalla>> {
  try {
    const response = await fetch(`/api/consecuencia-falla/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar consecuencia de falla',
    };
  }
}

export async function deleteConsecuenciaFalla(
  id: number
): Promise<DbActionResult<ConsecuenciaFalla>> {
  try {
    const response = await fetch(`/api/consecuencia-falla/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar consecuencia de falla',
    };
  }
}

