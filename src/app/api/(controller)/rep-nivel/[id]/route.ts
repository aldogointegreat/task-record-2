import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { REPNivel, UpdateREPNivelDTO } from '@/models';

/**
 * GET /api/rep-nivel/[id]
 * Obtiene un registro REP_NIVEL por ID
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

    const result = await query<REPNivel>(
      'SELECT * FROM [REP_NIVEL] WHERE IDRN = @ID',
      { ID: id }
    );

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Registro REP_NIVEL no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Registro REP_NIVEL encontrado',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/rep-nivel/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener registro REP_NIVEL',
    }, { status: 500 });
  }
}

/**
 * PUT /api/rep-nivel/[id]
 * Actualiza un registro REP_NIVEL por ID
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

    const body = await request.json() as UpdateREPNivelDTO;

    // Construir query dinámico
    const updates: string[] = [];
    const queryParams: Record<string, unknown> = { ID: id };

    if (body.IDPM !== undefined) {
      updates.push('IDPM = @IDPM');
      queryParams.IDPM = body.IDPM;
    }
    if (body.IDN !== undefined) {
      updates.push('IDN = @IDN');
      queryParams.IDN = body.IDN;
    }
    if (body.IDJ !== undefined) {
      updates.push('IDJ = @IDJ');
      queryParams.IDJ = body.IDJ;
    }
    if (body.IDNP !== undefined) {
      updates.push('IDNP = @IDNP');
      queryParams.IDNP = body.IDNP;
    }
    if (body.DESCRIPCION !== undefined) {
      updates.push('DESCRIPCION = @DESCRIPCION');
      queryParams.DESCRIPCION = body.DESCRIPCION;
    }

    if (updates.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'No se proporcionaron campos para actualizar',
      }, { status: 400 });
    }

    const sqlQuery = `
      UPDATE [REP_NIVEL]
      SET ${updates.join(', ')}
      OUTPUT INSERTED.*
      WHERE IDRN = @ID`;

    const result = await query<REPNivel>(sqlQuery, queryParams);

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Registro REP_NIVEL no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Registro REP_NIVEL actualizado exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en PUT /api/rep-nivel/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar registro REP_NIVEL',
    }, { status: 500 });
  }
}

/**
 * DELETE /api/rep-nivel/[id]
 * Elimina un registro REP_NIVEL por ID
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
    const existing = await query<REPNivel>(
      'SELECT * FROM [REP_NIVEL] WHERE IDRN = @ID',
      { ID: id }
    );

    if (existing.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Registro REP_NIVEL no encontrado',
      }, { status: 404 });
    }

    // Eliminar
    await query('DELETE FROM [REP_NIVEL] WHERE IDRN = @ID', { ID: id });

    return NextResponse.json({
      success: true,
      data: existing[0],
      message: 'Registro REP_NIVEL eliminado exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en DELETE /api/rep-nivel/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar registro REP_NIVEL',
    }, { status: 500 });
  }
}

