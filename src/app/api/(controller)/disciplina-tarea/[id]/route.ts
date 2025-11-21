import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { DisciplinaTarea, UpdateDisciplinaTareaDTO } from '@/models';

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

    const result = await query<DisciplinaTarea>(
      'SELECT * FROM [DISCIPLINA_TAREA] WHERE ID_DISCIPLINA_TAREA = @ID',
      { ID: id }
    );

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Disciplina de tarea no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Disciplina de tarea encontrada',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/disciplina-tarea/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener disciplina de tarea',
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body: UpdateDisciplinaTareaDTO = await request.json();

    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'ID inválido',
      }, { status: 400 });
    }

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
      UPDATE [DISCIPLINA_TAREA] 
      SET ${updates.join(', ')}
      OUTPUT INSERTED.*
      WHERE ID_DISCIPLINA_TAREA = @ID`;

    const result = await query<DisciplinaTarea>(sqlQuery, sqlParams);

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Disciplina de tarea no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Disciplina de tarea actualizada exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en PUT /api/disciplina-tarea/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar disciplina de tarea',
    }, { status: 500 });
  }
}

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
      DELETE FROM [DISCIPLINA_TAREA]
      OUTPUT DELETED.*
      WHERE ID_DISCIPLINA_TAREA = @ID`;

    const result = await query<DisciplinaTarea>(sqlQuery, { ID: id });

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Disciplina de tarea no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Disciplina de tarea eliminada exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en DELETE /api/disciplina-tarea/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar disciplina de tarea',
    }, { status: 500 });
  }
}

