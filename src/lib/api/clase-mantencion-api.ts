import type { 
  ClaseMantencion, 
  CreateClaseMantencionDTO,
  UpdateClaseMantencionDTO,
  ClaseMantencionFilters 
} from '@/models';
import type { DbActionResult } from '@/types/common';

export async function getAllClasesMantencion(
  filters?: ClaseMantencionFilters
): Promise<DbActionResult<ClaseMantencion[]>> {
  try {
    const params = new URLSearchParams();
    if (filters?.CODIGO) params.append('CODIGO', filters.CODIGO);
    if (filters?.NOMBRE) params.append('NOMBRE', filters.NOMBRE);

    const url = `/api/clase-mantencion${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener clases de mantención',
    };
  }
}

export async function getClaseMantencionById(
  id: number
): Promise<DbActionResult<ClaseMantencion>> {
  try {
    const response = await fetch(`/api/clase-mantencion/${id}`);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener clase de mantención',
    };
  }
}

export async function createClaseMantencion(
  data: CreateClaseMantencionDTO
): Promise<DbActionResult<ClaseMantencion>> {
  try {
    const response = await fetch('/api/clase-mantencion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear clase de mantención',
    };
  }
}

export async function updateClaseMantencion(
  id: number,
  data: UpdateClaseMantencionDTO
): Promise<DbActionResult<ClaseMantencion>> {
  try {
    const response = await fetch(`/api/clase-mantencion/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar clase de mantención',
    };
  }
}

export async function deleteClaseMantencion(
  id: number
): Promise<DbActionResult<ClaseMantencion>> {
  try {
    const response = await fetch(`/api/clase-mantencion/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar clase de mantención',
    };
  }
}

