import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { ConsecuenciaFalla, UpdateConsecuenciaFallaDTO } from '@/models';

/**
 * GET /api/consecuencia-falla/[id]
 * Obtiene una consecuencia de falla por ID
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

    const result = await query<ConsecuenciaFalla>(
      'SELECT * FROM [CONSECUENCIA_FALLA] WHERE ID_CONSECUENCIA = @ID',
      { ID: id }
    );

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Consecuencia de falla no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Consecuencia de falla encontrada',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/consecuencia-falla/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener consecuencia de falla',
    }, { status: 500 });
  }
}

/**
 * PUT /api/consecuencia-falla/[id]
 * Actualiza una consecuencia de falla por ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body: UpdateConsecuenciaFallaDTO = await request.json();

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

    if (body.CODIGO !== undefined) {
      updates.push('CODIGO = @CODIGO');
      sqlParams.CODIGO = body.CODIGO;
    }

    if (body.NOMBRE !== undefined) {
      updates.push('NOMBRE = @NOMBRE');
      sqlParams.NOMBRE = body.NOMBRE;
    }

    if (updates.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'No hay campos para actualizar',
      }, { status: 400 });
    }

    const sqlQuery = `
      UPDATE [CONSECUENCIA_FALLA] 
      SET ${updates.join(', ')}
      OUTPUT INSERTED.*
      WHERE ID_CONSECUENCIA = @ID`;

    const result = await query<ConsecuenciaFalla>(sqlQuery, sqlParams);

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Consecuencia de falla no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Consecuencia de falla actualizada exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en PUT /api/consecuencia-falla/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar consecuencia de falla',
    }, { status: 500 });
  }
}

/**
 * DELETE /api/consecuencia-falla/[id]
 * Elimina una consecuencia de falla por ID
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
      DELETE FROM [CONSECUENCIA_FALLA]
      OUTPUT DELETED.*
      WHERE ID_CONSECUENCIA = @ID`;

    const result = await query<ConsecuenciaFalla>(sqlQuery, { ID: id });

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Consecuencia de falla no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Consecuencia de falla eliminada exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en DELETE /api/consecuencia-falla/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar consecuencia de falla',
    }, { status: 500 });
  }
}

