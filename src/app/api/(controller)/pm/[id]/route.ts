import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { PM, UpdatePMDTO } from '@/models';

/**
 * GET /api/pm/[id]
 * Obtiene un registro PM por ID
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

    const result = await query<PM>(
      'SELECT * FROM [PM] WHERE IDPM = @ID',
      { ID: id }
    );

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Registro PM no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Registro PM encontrado',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/pm/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener registro PM',
    }, { status: 500 });
  }
}

/**
 * PUT /api/pm/[id]
 * Actualiza un registro PM por ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body: UpdatePMDTO = await request.json();

    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'ID inválido',
      }, { status: 400 });
    }

    // Construir SET clause dinámico
    const updates: string[] = [];
    const queryParams: Record<string, unknown> = { ID: id };

    if (body.IDN !== undefined) {
      updates.push('IDN = @IDN');
      queryParams.IDN = body.IDN;
    }
    if (body.NRO !== undefined) {
      updates.push('NRO = @NRO');
      queryParams.NRO = body.NRO;
    }
    if (body.CONJUNTO !== undefined) {
      updates.push('CONJUNTO = @CONJUNTO');
      queryParams.CONJUNTO = body.CONJUNTO;
    }
    if (body.PROGRAMACION !== undefined) {
      updates.push('PROGRAMACION = @PROGRAMACION');
      queryParams.PROGRAMACION = body.PROGRAMACION;
    }
    if (body.ESTADO !== undefined) {
      updates.push('ESTADO = @ESTADO');
      queryParams.ESTADO = body.ESTADO;
    }
    if (body.HOROMETRO !== undefined) {
      updates.push('HOROMETRO = @HOROMETRO');
      queryParams.HOROMETRO = body.HOROMETRO;
    }
    if (body.INICIO !== undefined) {
      updates.push('INICIO = @INICIO');
      queryParams.INICIO = body.INICIO;
    }
    if (body.FIN !== undefined) {
      updates.push('FIN = @FIN');
      queryParams.FIN = body.FIN;
    }

    if (updates.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'No hay campos para actualizar',
      }, { status: 400 });
    }

    const sqlQuery = `
      UPDATE [PM] 
      SET ${updates.join(', ')}
      OUTPUT INSERTED.*
      WHERE IDPM = @ID`;

    const result = await query<PM>(sqlQuery, queryParams);

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Registro PM no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Registro PM actualizado exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en PUT /api/pm/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar registro PM',
    }, { status: 500 });
  }
}

/**
 * DELETE /api/pm/[id]
 * Elimina un registro PM por ID
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

    const sqlQuery = `
      DELETE FROM [PM]
      OUTPUT DELETED.*
      WHERE IDPM = @ID`;

    const result = await query<PM>(sqlQuery, { ID: id });

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Registro PM no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Registro PM eliminado exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en DELETE /api/pm/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar registro PM',
    }, { status: 500 });
  }
}


