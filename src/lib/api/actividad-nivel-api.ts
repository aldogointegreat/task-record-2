import type { 
  ActividadNivel, 
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
      message: error instanceof Error ? error.message : 'Error al obtener actividades',
    };
  }
}


