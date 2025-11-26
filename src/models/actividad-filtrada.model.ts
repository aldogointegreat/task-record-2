/**
 * Modelo: Actividad Filtrada
 * Extiende ActividadNivel con información adicional para mostrar en la tabla de filtrado
 */

import type { ActividadNivel } from "./actividad-nivel.model";

export interface ActividadFiltrada extends ActividadNivel {
  // Información del nivel padre
  NIVEL_NOMBRE: string;
  NIVEL_IDJ: number;
  NIVEL_IDNP: number | null;

  // Información de la jerarquía
  JERARQUIA_NOMBRE: string;
  JERARQUIA_COLOR: string | null;

  // Nombres descriptivos de las relaciones (para mostrar en tabla)
  DISCIPLINA_TAREA_NOMBRE?: string;
  CLASE_MANTENCION_NOMBRE?: string;
  CONDICION_ACCESO_NOMBRE?: string;
  CONSECUENCIA_FALLA_NOMBRE?: string;
}

export interface ActividadFiltradaFilters {
  // Filtro principal: nivel (incluye todos los descendientes)
  nivelId?: number;

  // Filtros adicionales de ACTIVIDAD_NIVEL
  disciplinaTareaId?: number;
  frecuenciaTarea?: number;
  unidadFrecuencia?: string;
  condicionAccesoId?: number;
  claseMantencionId?: number;
  consecuenciaFallaId?: number;
}
