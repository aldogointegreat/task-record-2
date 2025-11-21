import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { ActividadNivel, UpdateActividadNivelDTO } from '@/models';

/**
 * GET /api/actividad-nivel/[id]
 * Obtiene una actividad de nivel por ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'ID inválido',
      }, { status: 400 });
    }

    const result = await query<ActividadNivel>(
      'SELECT * FROM [ACTIVIDAD_NIVEL] WHERE IDA = @ID',
      { ID: id }
    );

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Actividad de nivel no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Actividad de nivel encontrada',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/actividad-nivel/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener actividad de nivel',
    }, { status: 500 });
  }
}

/**
 * PUT /api/actividad-nivel/[id]
 * Actualiza una actividad de nivel por ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body: UpdateActividadNivelDTO = await request.json();

    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'ID inválido',
      }, { status: 400 });
    }

    // Construir SET clause dinámico
    const updates: string[] = [];
    const sqlParams: Record<string, unknown> = { ID: id };

    if (body.IDN !== undefined) {
      updates.push('IDN = @IDN');
      sqlParams.IDN = body.IDN;
    }

    if (body.IDT !== undefined) {
      updates.push('IDT = @IDT');
      sqlParams.IDT = body.IDT;
    }

    if (body.ORDEN !== undefined) {
      updates.push('ORDEN = @ORDEN');
      sqlParams.ORDEN = body.ORDEN;
    }

    if (body.DESCRIPCION !== undefined) {
      updates.push('DESCRIPCION = @DESCRIPCION');
      sqlParams.DESCRIPCION = body.DESCRIPCION;
    }

    if (body.FUNCIONALIDAD !== undefined) {
      updates.push('FUNCIONALIDAD = @FUNCIONALIDAD');
      sqlParams.FUNCIONALIDAD = body.FUNCIONALIDAD || null;
    }

    if (body.MODO_FALLA !== undefined) {
      updates.push('MODO_FALLA = @MODO_FALLA');
      sqlParams.MODO_FALLA = body.MODO_FALLA || null;
    }

    if (body.EFECTO_FALLA !== undefined) {
      updates.push('EFECTO_FALLA = @EFECTO_FALLA');
      sqlParams.EFECTO_FALLA = body.EFECTO_FALLA || null;
    }

    if (body.TIEMPO_PROMEDIO_FALLA !== undefined) {
      updates.push('TIEMPO_PROMEDIO_FALLA = @TIEMPO_PROMEDIO_FALLA');
      sqlParams.TIEMPO_PROMEDIO_FALLA = body.TIEMPO_PROMEDIO_FALLA || null;
    }

    if (body.UNIDAD_TIEMPO_FALLA !== undefined) {
      updates.push('UNIDAD_TIEMPO_FALLA = @UNIDAD_TIEMPO_FALLA');
      sqlParams.UNIDAD_TIEMPO_FALLA = body.UNIDAD_TIEMPO_FALLA || null;
    }

    if (body.ID_CONSECUENCIA_FALLA !== undefined) {
      updates.push('ID_CONSECUENCIA_FALLA = @ID_CONSECUENCIA_FALLA');
      sqlParams.ID_CONSECUENCIA_FALLA = body.ID_CONSECUENCIA_FALLA || null;
    }

    if (body.ID_CLASE_MANTENCION !== undefined) {
      updates.push('ID_CLASE_MANTENCION = @ID_CLASE_MANTENCION');
      sqlParams.ID_CLASE_MANTENCION = body.ID_CLASE_MANTENCION || null;
    }

    if (body.TAREA_MANTENCION !== undefined) {
      updates.push('TAREA_MANTENCION = @TAREA_MANTENCION');
      sqlParams.TAREA_MANTENCION = body.TAREA_MANTENCION || null;
    }

    if (body.FRECUENCIA_TAREA !== undefined) {
      updates.push('FRECUENCIA_TAREA = @FRECUENCIA_TAREA');
      sqlParams.FRECUENCIA_TAREA = body.FRECUENCIA_TAREA || null;
    }

    if (body.UNIDAD_FRECUENCIA !== undefined) {
      updates.push('UNIDAD_FRECUENCIA = @UNIDAD_FRECUENCIA');
      sqlParams.UNIDAD_FRECUENCIA = body.UNIDAD_FRECUENCIA || null;
    }

    if (body.DURACION_TAREA !== undefined) {
      updates.push('DURACION_TAREA = @DURACION_TAREA');
      sqlParams.DURACION_TAREA = body.DURACION_TAREA || null;
    }

    if (body.CANTIDAD_RECURSOS !== undefined) {
      updates.push('CANTIDAD_RECURSOS = @CANTIDAD_RECURSOS');
      sqlParams.CANTIDAD_RECURSOS = body.CANTIDAD_RECURSOS || null;
    }

    if (body.ID_CONDICION_ACCESO !== undefined) {
      updates.push('ID_CONDICION_ACCESO = @ID_CONDICION_ACCESO');
      sqlParams.ID_CONDICION_ACCESO = body.ID_CONDICION_ACCESO || null;
    }

    if (body.ID_DISCIPLINA_TAREA !== undefined) {
      updates.push('ID_DISCIPLINA_TAREA = @ID_DISCIPLINA_TAREA');
      sqlParams.ID_DISCIPLINA_TAREA = body.ID_DISCIPLINA_TAREA || null;
    }

    if (updates.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'No hay campos para actualizar',
      }, { status: 400 });
    }

    const sqlQuery = `
      UPDATE [ACTIVIDAD_NIVEL] 
      SET ${updates.join(', ')}
      OUTPUT INSERTED.*
      WHERE IDA = @ID`;

    const result = await query<ActividadNivel>(sqlQuery, sqlParams);

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Actividad de nivel no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Actividad de nivel actualizada exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en PUT /api/actividad-nivel/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar actividad de nivel',
    }, { status: 500 });
  }
}

/**
 * DELETE /api/actividad-nivel/[id]
 * Elimina una actividad de nivel por ID
 * Primero elimina los valores de atributo asociados para evitar conflictos de clave foránea
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'ID inválido',
      }, { status: 400 });
    }

    // Verificar que la actividad existe antes de eliminarla
    const actividadExistente = await query<ActividadNivel>(
      'SELECT * FROM [ACTIVIDAD_NIVEL] WHERE IDA = @ID',
      { ID: id }
    );

    if (actividadExistente.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Actividad de nivel no encontrada',
      }, { status: 404 });
    }

    // Primero eliminar los valores de atributo asociados
    await query(
      'DELETE FROM [ATRIBUTO_VALOR] WHERE IDA = @ID',
      { ID: id }
    );

    // Luego eliminar la actividad
    const sqlQuery = `
      DELETE FROM [ACTIVIDAD_NIVEL]
      OUTPUT DELETED.*
      WHERE IDA = @ID`;

    const result = await query<ActividadNivel>(sqlQuery, { ID: id });

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Actividad de nivel eliminada exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en DELETE /api/actividad-nivel/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar actividad de nivel',
    }, { status: 500 });
  }
}

