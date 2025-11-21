import type { 
  CondicionAcceso, 
  CreateCondicionAccesoDTO,
  UpdateCondicionAccesoDTO,
  CondicionAccesoFilters 
} from '@/models';
import type { DbActionResult } from '@/types/common';

export async function getAllCondicionesAcceso(
  filters?: CondicionAccesoFilters
): Promise<DbActionResult<CondicionAcceso[]>> {
  try {
    const params = new URLSearchParams();
    if (filters?.CODIGO) params.append('CODIGO', filters.CODIGO);
    if (filters?.NOMBRE) params.append('NOMBRE', filters.NOMBRE);

    const url = `/api/condicion-acceso${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener condiciones de acceso',
    };
  }
}

export async function getCondicionAccesoById(
  id: number
): Promise<DbActionResult<CondicionAcceso>> {
  try {
    const response = await fetch(`/api/condicion-acceso/${id}`);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener condición de acceso',
    };
  }
}

export async function createCondicionAcceso(
  data: CreateCondicionAccesoDTO
): Promise<DbActionResult<CondicionAcceso>> {
  try {
    const response = await fetch('/api/condicion-acceso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear condición de acceso',
    };
  }
}

export async function updateCondicionAcceso(
  id: number,
  data: UpdateCondicionAccesoDTO
): Promise<DbActionResult<CondicionAcceso>> {
  try {
    const response = await fetch(`/api/condicion-acceso/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar condición de acceso',
    };
  }
}

export async function deleteCondicionAcceso(
  id: number
): Promise<DbActionResult<CondicionAcceso>> {
  try {
    const response = await fetch(`/api/condicion-acceso/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar condición de acceso',
    };
  }
}

