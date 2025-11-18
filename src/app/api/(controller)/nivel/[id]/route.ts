import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Nivel, UpdateNivelDTO } from '@/models';

/**
 * GET /api/nivel/[id]
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

    const result = await query<Nivel>(
      'SELECT * FROM [NIVEL] WHERE IDN = @ID',
      { ID: id }
    );

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Nivel no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Nivel encontrado',
    }, { status: 200 });

  } catch (error) {
    console.error(`Error en GET /api/nivel/[id]:`, error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener nivel',
    }, { status: 500 });
  }
}

/**
 * PUT /api/nivel/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body: UpdateNivelDTO = await request.json();

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

    if (body.IDJ !== undefined) {
      updates.push('IDJ = @IDJ');
      queryParams.IDJ = body.IDJ;
    }

    if (body.IDNP !== undefined) {
      updates.push('IDNP = @IDNP');
      queryParams.IDNP = body.IDNP || null;
    }

    if (body.NOMBRE !== undefined) {
      updates.push('NOMBRE = @NOMBRE');
      queryParams.NOMBRE = body.NOMBRE;
    }

    if (body.PLANTILLA !== undefined) {
      updates.push('PLANTILLA = @PLANTILLA');
      queryParams.PLANTILLA = body.PLANTILLA ? 1 : 0;
    }

    if (body.NROPM !== undefined) {
      updates.push('NROPM = @NROPM');
      queryParams.NROPM = body.NROPM;
    }

    if (updates.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'No hay campos para actualizar',
      }, { status: 400 });
    }

    const sqlQuery = `
      UPDATE [NIVEL] 
      SET ${updates.join(', ')}
      OUTPUT INSERTED.*
      WHERE IDN = @ID`;

    const result = await query<Nivel>(sqlQuery, queryParams);

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Nivel no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Nivel actualizado exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error(`Error en PUT /api/nivel/[id]:`, error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar nivel',
    }, { status: 500 });
  }
}

/**
 * DELETE /api/nivel/[id]
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
      DELETE FROM [NIVEL]
      OUTPUT DELETED.*
      WHERE IDN = @ID`;

    const result = await query<Nivel>(sqlQuery, { ID: id });

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Nivel no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Nivel eliminado exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error(`Error en DELETE /api/nivel/[id]:`, error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar nivel',
    }, { status: 500 });
  }
}

