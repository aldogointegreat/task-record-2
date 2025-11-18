import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Atributo, UpdateAtributoDTO } from '@/models';

/**
 * GET /api/atributo/[id]
 * Obtiene un atributo por ID
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

    const result = await query<Atributo>(
      'SELECT * FROM [ATRIBUTO] WHERE IDT = @ID',
      { ID: id }
    );

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Atributo no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Atributo encontrado',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/atributo/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener atributo',
    }, { status: 500 });
  }
}

/**
 * PUT /api/atributo/[id]
 * Actualiza un atributo por ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body: UpdateAtributoDTO = await request.json();

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

    if (body.DESCRIPCION !== undefined) {
      updates.push('DESCRIPCION = @DESCRIPCION');
      params.DESCRIPCION = body.DESCRIPCION;
    }

    if (updates.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'No hay campos para actualizar',
      }, { status: 400 });
    }

    const sqlQuery = `
      UPDATE [ATRIBUTO] 
      SET ${updates.join(', ')}
      OUTPUT INSERTED.*
      WHERE IDT = @ID`;

    const result = await query<Atributo>(sqlQuery, params);

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Atributo no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Atributo actualizado exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en PUT /api/atributo/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar atributo',
    }, { status: 500 });
  }
}

/**
 * DELETE /api/atributo/[id]
 * Elimina un atributo por ID
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
      DELETE FROM [ATRIBUTO]
      OUTPUT DELETED.*
      WHERE IDT = @ID`;

    const result = await query<Atributo>(sqlQuery, { ID: id });

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Atributo no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Atributo eliminado exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en DELETE /api/atributo/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar atributo',
    }, { status: 500 });
  }
}

