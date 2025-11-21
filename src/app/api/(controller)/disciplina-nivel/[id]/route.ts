import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { DisciplinaNivel, UpdateDisciplinaNivelDTO } from '@/models';

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

    const result = await query<DisciplinaNivel>(
      'SELECT * FROM [DISCIPLINA_NIVEL] WHERE ID_DISCIPLINA_NIVEL = @ID',
      { ID: id }
    );

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Disciplina de nivel no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Disciplina de nivel encontrada',
    }, { status: 200 });
  } catch (error) {
    console.error('Error en GET /api/disciplina-nivel/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener disciplina de nivel',
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
    const body: UpdateDisciplinaNivelDTO = await request.json();

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
      UPDATE [DISCIPLINA_NIVEL]
      SET ${updates.join(', ')}
      OUTPUT INSERTED.*
      WHERE ID_DISCIPLINA_NIVEL = @ID`;

    const result = await query<DisciplinaNivel>(sqlQuery, sqlParams);

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Disciplina de nivel no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Disciplina de nivel actualizada exitosamente',
    }, { status: 200 });
  } catch (error) {
    console.error('Error en PUT /api/disciplina-nivel/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar disciplina de nivel',
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
      DELETE FROM [DISCIPLINA_NIVEL]
      OUTPUT DELETED.*
      WHERE ID_DISCIPLINA_NIVEL = @ID`;

    const result = await query<DisciplinaNivel>(sqlQuery, { ID: id });

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Disciplina de nivel no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Disciplina de nivel eliminada exitosamente',
    }, { status: 200 });
  } catch (error) {
    console.error('Error en DELETE /api/disciplina-nivel/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar disciplina de nivel',
    }, { status: 500 });
  }
}


