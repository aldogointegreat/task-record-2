import type { PM, CreatePMFromActividadesDTO } from "@/models";
import type { DbActionResult } from "@/types/common";

/**
 * Crea un nuevo PM desde actividades seleccionadas
 */
export async function createPMFromActividades(
  data: CreatePMFromActividadesDTO
): Promise<DbActionResult<PM>> {
  try {
    const response = await fetch("/api/pm/desde-actividades", {
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
        error instanceof Error
          ? error.message
          : "Error al crear PM desde actividades",
    };
  }
}
