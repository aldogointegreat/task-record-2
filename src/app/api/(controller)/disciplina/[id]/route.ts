import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Disciplina, UpdateDisciplinaDTO } from '@/models';

/**
 * GET /api/disciplina/[id]
 * Obtiene una disciplina por ID
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

    const result = await query<Disciplina>(
      'SELECT * FROM [DISCIPLINA] WHERE ID_DIS = @ID',
      { ID: id }
    );

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Disciplina no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Disciplina encontrada',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/disciplina/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener disciplina',
    }, { status: 500 });
  }
}

/**
 * PUT /api/disciplina/[id]
 * Actualiza una disciplina por ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body: UpdateDisciplinaDTO = await request.json();

    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'ID inválido',
      }, { status: 400 });
    }

    // Construir SET clause dinámico
    const updates: string[] = [];
    const params: Record<string, unknown> = { ID: id };

    if (body.NOMBRE !== undefined) {
      updates.push('NOMBRE = @NOMBRE');
      params.NOMBRE = body.NOMBRE;
    }

    if (updates.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'No hay campos para actualizar',
      }, { status: 400 });
    }

    const sqlQuery = `
      UPDATE [DISCIPLINA] 
      SET ${updates.join(', ')}
      OUTPUT INSERTED.*
      WHERE ID_DIS = @ID`;

    const result = await query<Disciplina>(sqlQuery, params);

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Disciplina no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Disciplina actualizada exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en PUT /api/disciplina/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar disciplina',
    }, { status: 500 });
  }
}

/**
 * DELETE /api/disciplina/[id]
 * Elimina una disciplina por ID
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
      DELETE FROM [DISCIPLINA]
      OUTPUT DELETED.*
      WHERE ID_DIS = @ID`;

    const result = await query<Disciplina>(sqlQuery, { ID: id });

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Disciplina no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Disciplina eliminada exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en DELETE /api/disciplina/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar disciplina',
    }, { status: 500 });
  }
}

