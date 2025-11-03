'use server';

import { query } from '@/lib/db';
import type { Actividad, CreateActividadDTO, UpdateActividadDTO, ActividadFilters } from '@/models/actividad.model';
import type { DbActionResult } from '@/types/common';

/**
 * Controller: Obtener todas las actividades
 */
export async function getAllActividades(filters?: ActividadFilters): Promise<DbActionResult<Actividad[]>> {
  try {
    let sqlQuery = 'SELECT * FROM ACTIVIDAD WHERE 1=1';
    const params: Record<string, unknown> = {};

    // Aplicar filtros si existen
    if (filters?.HABILITADO !== undefined) {
      sqlQuery += ' AND HABILITADO = @HABILITADO';
      params.HABILITADO = filters.HABILITADO ? 1 : 0;
    }

    if (filters?.ID_CON) {
      sqlQuery += ' AND ID_CON = @ID_CON';
      params.ID_CON = filters.ID_CON;
    }

    if (filters?.ID_CLM) {
      sqlQuery += ' AND ID_CLM = @ID_CLM';
      params.ID_CLM = filters.ID_CLM;
    }

    if (filters?.ID_DIS !== undefined) {
      sqlQuery += ' AND ID_DIS = @ID_DIS';
      params.ID_DIS = filters.ID_DIS;
    }

    if (filters?.ID_PM !== undefined) {
      sqlQuery += ' AND ID_PM = @ID_PM';
      params.ID_PM = filters.ID_PM;
    }

    if (filters?.searchTerm) {
      sqlQuery += ' AND (TITULO LIKE @searchTerm OR DESCRIPCION LIKE @searchTerm OR ESPECIFICACION LIKE @searchTerm)';
      params.searchTerm = `%${filters.searchTerm}%`;
    }

    sqlQuery += ' ORDER BY ID_ACT DESC';

    const result = await query<Actividad>(sqlQuery, params);

    return {
      success: true,
      data: result,
      message: `Se encontraron ${result.length} actividades`,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const errorDetails = String(error);
    console.error('Error al obtener actividades:', error);
    return {
      success: false,
      error: errorMessage || 'Error al obtener las actividades',
      details: errorDetails,
    };
  }
}

/**
 * Controller: Obtener una actividad por ID
 */
export async function getActividadById(id: number): Promise<DbActionResult<Actividad>> {
  try {
    const result = await query<Actividad>(
      'SELECT * FROM ACTIVIDAD WHERE ID_ACT = @id',
      { id }
    );

    if (result.length === 0) {
      return {
        success: false,
        error: 'Actividad no encontrada',
      };
    }

    return {
      success: true,
      data: result[0],
      message: 'Actividad encontrada',
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const errorDetails = String(error);
    console.error('Error al obtener actividad:', error);
    return {
      success: false,
      error: errorMessage || 'Error al obtener la actividad',
      details: errorDetails,
    };
  }
}

/**
 * Controller: Crear una nueva actividad
 */
export async function createActividad(dto: CreateActividadDTO): Promise<DbActionResult<Actividad>> {
  try {
    // Construir la query dinámicamente basada en los campos proporcionados
    const fields: string[] = [];
    const values: string[] = [];
    const params: Record<string, unknown> = {};

    // Agregar campos solo si están definidos
    if (dto.ID_CON !== undefined) { fields.push('ID_CON'); values.push('@ID_CON'); params.ID_CON = dto.ID_CON; }
    if (dto.ID_CLM !== undefined) { fields.push('ID_CLM'); values.push('@ID_CLM'); params.ID_CLM = dto.ID_CLM; }
    if (dto.ID_DIS !== undefined) { fields.push('ID_DIS'); values.push('@ID_DIS'); params.ID_DIS = dto.ID_DIS; }
    if (dto.TITULO !== undefined) { fields.push('TITULO'); values.push('@TITULO'); params.TITULO = dto.TITULO; }
    if (dto.ID_UM !== undefined) { fields.push('ID_UM'); values.push('@ID_UM'); params.ID_UM = dto.ID_UM; }
    if (dto.ID_FRC !== undefined) { fields.push('ID_FRC'); values.push('@ID_FRC'); params.ID_FRC = dto.ID_FRC; }
    if (dto.ID_RAN !== undefined) { fields.push('ID_RAN'); values.push('@ID_RAN'); params.ID_RAN = dto.ID_RAN; }
    if (dto.ESPECIFICACION !== undefined) { fields.push('ESPECIFICACION'); values.push('@ESPECIFICACION'); params.ESPECIFICACION = dto.ESPECIFICACION; }
    if (dto.INICIO !== undefined) { fields.push('INICIO'); values.push('@INICIO'); params.INICIO = dto.INICIO; }
    if (dto.FIN !== undefined) { fields.push('FIN'); values.push('@FIN'); params.FIN = dto.FIN; }
    if (dto.REFERENCIA !== undefined) { fields.push('REFERENCIA'); values.push('@REFERENCIA'); params.REFERENCIA = dto.REFERENCIA; }
    if (dto.REFERENCIA_URL !== undefined) { fields.push('REFERENCIA_URL'); values.push('@REFERENCIA_URL'); params.REFERENCIA_URL = dto.REFERENCIA_URL; }
    if (dto.HABILITADO !== undefined) { fields.push('HABILITADO'); values.push('@HABILITADO'); params.HABILITADO = dto.HABILITADO ? 1 : 0; }
    if (dto.DESCRIPCION !== undefined) { fields.push('DESCRIPCION'); values.push('@DESCRIPCION'); params.DESCRIPCION = dto.DESCRIPCION; }
    if (dto.DURACION !== undefined) { fields.push('DURACION'); values.push('@DURACION'); params.DURACION = dto.DURACION; }
    if (dto.SUBACTIVIDAD !== undefined) { fields.push('SUBACTIVIDAD'); values.push('@SUBACTIVIDAD'); params.SUBACTIVIDAD = dto.SUBACTIVIDAD; }
    if (dto.LOGIN !== undefined) { fields.push('LOGIN'); values.push('@LOGIN'); params.LOGIN = dto.LOGIN; }
    if (dto.ID_PM !== undefined) { fields.push('ID_PM'); values.push('@ID_PM'); params.ID_PM = dto.ID_PM; }
    if (dto.IdMaestro !== undefined) { fields.push('IdMaestro'); values.push('@IdMaestro'); params.IdMaestro = dto.IdMaestro; }

    if (fields.length === 0) {
      return {
        success: false,
        error: 'Debe proporcionar al menos un campo para crear la actividad',
      };
    }

    const sqlQuery = `
      INSERT INTO ACTIVIDAD (${fields.join(', ')})
      OUTPUT INSERTED.*
      VALUES (${values.join(', ')})`;

    const result = await query<Actividad>(sqlQuery, params);

    return {
      success: true,
      data: result[0],
      message: 'Actividad creada exitosamente',
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const errorDetails = String(error);
    console.error('Error al crear actividad:', error);
    return {
      success: false,
      error: errorMessage || 'Error al crear la actividad',
      details: errorDetails,
    };
  }
}

/**
 * Controller: Actualizar una actividad existente
 */
export async function updateActividad(
  id: number,
  dto: UpdateActividadDTO
): Promise<DbActionResult<Actividad>> {
  try {
    const updates: string[] = [];
    const params: Record<string, unknown> = { id };

    if (dto.ID_CON !== undefined) { updates.push('ID_CON = @ID_CON'); params.ID_CON = dto.ID_CON; }
    if (dto.ID_CLM !== undefined) { updates.push('ID_CLM = @ID_CLM'); params.ID_CLM = dto.ID_CLM; }
    if (dto.ID_DIS !== undefined) { updates.push('ID_DIS = @ID_DIS'); params.ID_DIS = dto.ID_DIS; }
    if (dto.TITULO !== undefined) { updates.push('TITULO = @TITULO'); params.TITULO = dto.TITULO; }
    if (dto.ID_UM !== undefined) { updates.push('ID_UM = @ID_UM'); params.ID_UM = dto.ID_UM; }
    if (dto.ID_FRC !== undefined) { updates.push('ID_FRC = @ID_FRC'); params.ID_FRC = dto.ID_FRC; }
    if (dto.ID_RAN !== undefined) { updates.push('ID_RAN = @ID_RAN'); params.ID_RAN = dto.ID_RAN; }
    if (dto.ESPECIFICACION !== undefined) { updates.push('ESPECIFICACION = @ESPECIFICACION'); params.ESPECIFICACION = dto.ESPECIFICACION; }
    if (dto.INICIO !== undefined) { updates.push('INICIO = @INICIO'); params.INICIO = dto.INICIO; }
    if (dto.FIN !== undefined) { updates.push('FIN = @FIN'); params.FIN = dto.FIN; }
    if (dto.REFERENCIA !== undefined) { updates.push('REFERENCIA = @REFERENCIA'); params.REFERENCIA = dto.REFERENCIA; }
    if (dto.REFERENCIA_URL !== undefined) { updates.push('REFERENCIA_URL = @REFERENCIA_URL'); params.REFERENCIA_URL = dto.REFERENCIA_URL; }
    if (dto.HABILITADO !== undefined) { updates.push('HABILITADO = @HABILITADO'); params.HABILITADO = dto.HABILITADO ? 1 : 0; }
    if (dto.DESCRIPCION !== undefined) { updates.push('DESCRIPCION = @DESCRIPCION'); params.DESCRIPCION = dto.DESCRIPCION; }
    if (dto.DURACION !== undefined) { updates.push('DURACION = @DURACION'); params.DURACION = dto.DURACION; }
    if (dto.SUBACTIVIDAD !== undefined) { updates.push('SUBACTIVIDAD = @SUBACTIVIDAD'); params.SUBACTIVIDAD = dto.SUBACTIVIDAD; }
    if (dto.LOGIN !== undefined) { updates.push('LOGIN = @LOGIN'); params.LOGIN = dto.LOGIN; }
    if (dto.ID_PM !== undefined) { updates.push('ID_PM = @ID_PM'); params.ID_PM = dto.ID_PM; }
    if (dto.IdMaestro !== undefined) { updates.push('IdMaestro = @IdMaestro'); params.IdMaestro = dto.IdMaestro; }

    if (updates.length === 0) {
      return {
        success: false,
        error: 'No hay campos para actualizar',
      };
    }

    const result = await query<Actividad>(
      `UPDATE ACTIVIDAD 
       SET ${updates.join(', ')}
       OUTPUT INSERTED.*
       WHERE ID_ACT = @id`,
      params
    );

    if (result.length === 0) {
      return {
        success: false,
        error: 'Actividad no encontrada',
      };
    }

    return {
      success: true,
      data: result[0],
      message: 'Actividad actualizada exitosamente',
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const errorDetails = String(error);
    console.error('Error al actualizar actividad:', error);
    return {
      success: false,
      error: errorMessage || 'Error al actualizar la actividad',
      details: errorDetails,
    };
  }
}

/**
 * Controller: Eliminar una actividad
 */
export async function deleteActividad(id: number): Promise<DbActionResult<void>> {
  try {
    const result = await query<{ ID_ACT: number }>(
      'DELETE FROM ACTIVIDAD OUTPUT DELETED.ID_ACT WHERE ID_ACT = @id',
      { id }
    );

    if (result.length === 0) {
      return {
        success: false,
        error: 'Actividad no encontrada',
      };
    }

    return {
      success: true,
      message: 'Actividad eliminada exitosamente',
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const errorDetails = String(error);
    console.error('Error al eliminar actividad:', error);
    return {
      success: false,
      error: errorMessage || 'Error al eliminar la actividad',
      details: errorDetails,
    };
  }
}

