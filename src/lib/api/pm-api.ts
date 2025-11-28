import type { PM, CreatePMDTO, UpdatePMDTO, PMFilters } from "@/models";
import type { DbActionResult } from "@/types/common";

/**
 * Obtiene todos los registros PM
 */
export async function getAllPM(
  filters?: PMFilters
): Promise<DbActionResult<PM[]>> {
  try {
    const params = new URLSearchParams();
    if (filters?.IDN !== undefined)
      params.append("IDN", filters.IDN.toString());
    if (filters?.NRO !== undefined)
      params.append("NRO", filters.NRO.toString());
    if (filters?.CONJUNTO !== undefined)
      params.append("CONJUNTO", filters.CONJUNTO.toString());
    if (filters?.ESTADO) params.append("ESTADO", filters.ESTADO);
    if (filters?.HOROMETRO !== undefined)
      params.append("HOROMETRO", filters.HOROMETRO.toString());

    const url = `/api/pm${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: undefined,
      message:
        error instanceof Error
          ? error.message
          : "Error al obtener registros PM",
    };
  }
}

/**
 * Obtiene un registro PM por ID
 */
export async function getPMById(id: number): Promise<DbActionResult<PM>> {
  try {
    const response = await fetch(`/api/pm/${id}`);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: undefined,
      message:
        error instanceof Error ? error.message : "Error al obtener registro PM",
    };
  }
}

/**
 * Crea un nuevo registro PM
 */
export async function createPM(data: CreatePMDTO): Promise<DbActionResult<PM>> {
  try {
    const response = await fetch("/api/pm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: undefined,
      message:
        error instanceof Error ? error.message : "Error al crear registro PM",
    };
  }
}

/**
 * Actualiza un registro PM
 */
export async function updatePM(
  id: number,
  data: UpdatePMDTO
): Promise<DbActionResult<PM>> {
  try {
    const response = await fetch(`/api/pm/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: undefined,
      message:
        error instanceof Error
          ? error.message
          : "Error al actualizar registro PM",
    };
  }
}

/**
 * Elimina un registro PM
 */
export async function deletePM(id: number): Promise<DbActionResult<PM>> {
  try {
    const response = await fetch(`/api/pm/${id}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: undefined,
      message:
        error instanceof Error
          ? error.message
          : "Error al eliminar registro PM",
    };
  }
}
