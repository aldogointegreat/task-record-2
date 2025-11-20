import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { ActividadNivel, UpdateActividadNivelDTO } from '@/models';

/**
 * GET /api/actividad-nivel/[id]
 * Obtiene una actividad de nivel por ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

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
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
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
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'ID inválido',
      }, { status: 400 });
    }

    const sqlQuery = `
      DELETE FROM [ACTIVIDAD_NIVEL]
      OUTPUT DELETED.*
      WHERE IDA = @ID`;

    const result = await query<ActividadNivel>(sqlQuery, { ID: id });

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

