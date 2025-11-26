import type { ActividadFiltrada, ActividadFiltradaFilters } from "@/models";
import type { DbActionResult } from "@/types/common";

/**
 * Obtiene actividades filtradas jerárquicamente
 */
export async function getActividadesFiltradas(
  filters?: ActividadFiltradaFilters
): Promise<DbActionResult<ActividadFiltrada[]>> {
  try {
    const params = new URLSearchParams();

    if (filters?.nivelId !== undefined) {
      params.append("nivelId", filters.nivelId.toString());
    }
    if (filters?.disciplinaTareaId !== undefined) {
      params.append("disciplinaTareaId", filters.disciplinaTareaId.toString());
    }
    if (filters?.frecuenciaTarea !== undefined) {
      params.append("frecuenciaTarea", filters.frecuenciaTarea.toString());
    }
    if (filters?.unidadFrecuencia) {
      params.append("unidadFrecuencia", filters.unidadFrecuencia);
    }
    if (filters?.condicionAccesoId !== undefined) {
      params.append("condicionAccesoId", filters.condicionAccesoId.toString());
    }
    if (filters?.claseMantencionId !== undefined) {
      params.append("claseMantencionId", filters.claseMantencionId.toString());
    }
    if (filters?.consecuenciaFallaId !== undefined) {
      params.append(
        "consecuenciaFallaId",
        filters.consecuenciaFallaId.toString()
      );
    }

    const url = `/api/actividades-filtradas${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: undefined,
      message:
        error instanceof Error
          ? error.message
          : "Error al obtener actividades filtradas",
    };
  }
}
