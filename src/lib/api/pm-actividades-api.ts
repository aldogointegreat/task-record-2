import type { REPActividad, ActividadFiltrada } from "@/models";
import type { DbActionResult } from "@/types/common";

/**
 * Obtiene las actividades de una PM específica
 */
export async function getActividadesByPM(
  idpm: number
): Promise<DbActionResult<ActividadFiltrada[]>> {
  try {
    const response = await fetch(`/api/pm/${idpm}/actividades`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: undefined,
      message:
        error instanceof Error
          ? error.message
          : "Error al obtener actividades de la PM",
    };
  }
}

/**
 * Actualiza las actividades de una PM
 */
export async function updateActividadesPM(
  idpm: number,
  actividadesIds: number[]
): Promise<DbActionResult<void>> {
  try {
    const response = await fetch(`/api/pm/${idpm}/actividades`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actividadesIds }),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: undefined,
      message:
        error instanceof Error
          ? error.message
          : "Error al actualizar actividades de la PM",
    };
  }
}
