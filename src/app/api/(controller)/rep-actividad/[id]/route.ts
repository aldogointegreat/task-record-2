import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { REPActividad, UpdateREPActividadDTO } from '@/models';

/**
 * GET /api/rep-actividad/[id]
 * Obtiene un registro REP_ACTIVIDAD por ID
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

    const result = await query<REPActividad>(
      'SELECT * FROM [REP_ACTIVIDAD] WHERE IDRA = @ID',
      { ID: id }
    );

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Registro REP_ACTIVIDAD no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Registro REP_ACTIVIDAD encontrado',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/rep-actividad/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener registro REP_ACTIVIDAD',
    }, { status: 500 });
  }
}

/**
 * PUT /api/rep-actividad/[id]
 * Actualiza un registro REP_ACTIVIDAD por ID
 */
export async function PUT(
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

    const body = await request.json() as UpdateREPActividadDTO;

    // Construir query dinámico
    const updates: string[] = [];
    const queryParams: Record<string, unknown> = { ID: id };

    if (body.IDRN !== undefined) {
      updates.push('IDRN = @IDRN');
      queryParams.IDRN = body.IDRN;
    }
    if (body.ORDEN !== undefined) {
      updates.push('ORDEN = @ORDEN');
      queryParams.ORDEN = body.ORDEN;
    }
    if (body.DESCRIPCION !== undefined) {
      updates.push('DESCRIPCION = @DESCRIPCION');
      queryParams.DESCRIPCION = body.DESCRIPCION;
    }
    if (body.REFERENCIA !== undefined) {
      updates.push('REFERENCIA = @REFERENCIA');
      queryParams.REFERENCIA = body.REFERENCIA;
    }
    if (body.DURACION !== undefined) {
      updates.push('DURACION = @DURACION');
      queryParams.DURACION = body.DURACION;
    }

    if (updates.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'No se proporcionaron campos para actualizar',
      }, { status: 400 });
    }

    const sqlQuery = `
      UPDATE [REP_ACTIVIDAD]
      SET ${updates.join(', ')}
      OUTPUT INSERTED.*
      WHERE IDRA = @ID`;

    const result = await query<REPActividad>(sqlQuery, queryParams);

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Registro REP_ACTIVIDAD no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Registro REP_ACTIVIDAD actualizado exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en PUT /api/rep-actividad/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar registro REP_ACTIVIDAD',
    }, { status: 500 });
  }
}

/**
 * DELETE /api/rep-actividad/[id]
 * Elimina un registro REP_ACTIVIDAD por ID
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

    // Verificar si existe
    const existing = await query<REPActividad>(
      'SELECT * FROM [REP_ACTIVIDAD] WHERE IDRA = @ID',
      { ID: id }
    );

    if (existing.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Registro REP_ACTIVIDAD no encontrado',
      }, { status: 404 });
    }

    // Eliminar
    await query('DELETE FROM [REP_ACTIVIDAD] WHERE IDRA = @ID', { ID: id });

    return NextResponse.json({
      success: true,
      data: existing[0],
      message: 'Registro REP_ACTIVIDAD eliminado exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en DELETE /api/rep-actividad/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar registro REP_ACTIVIDAD',
    }, { status: 500 });
  }
}

