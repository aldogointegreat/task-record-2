import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Jerarquia, UpdateJerarquiaDTO } from '@/models';

/**
 * GET /api/jerarquia/[id]
 * Obtiene una jerarquía por ID
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

    const result = await query<Jerarquia>(
      'SELECT * FROM [JERARQUIA] WHERE IDJ = @ID',
      { ID: id }
    );

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Jerarquía no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Jerarquía encontrada',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/jerarquia/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener jerarquía',
    }, { status: 500 });
  }
}

/**
 * PUT /api/jerarquia/[id]
 * Actualiza una jerarquía por ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body: UpdateJerarquiaDTO = await request.json();

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

    if (body.DESCRIPCION !== undefined) {
      updates.push('DESCRIPCION = @DESCRIPCION');
      queryParams.DESCRIPCION = body.DESCRIPCION;
    }

    if (body.COLOR !== undefined) {
      updates.push('COLOR = @COLOR');
      queryParams.COLOR = body.COLOR;
    }

    if (updates.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'No hay campos para actualizar',
      }, { status: 400 });
    }

    const sqlQuery = `
      UPDATE [JERARQUIA] 
      SET ${updates.join(', ')}
      OUTPUT INSERTED.*
      WHERE IDJ = @ID`;

    const result = await query<Jerarquia>(sqlQuery, queryParams);

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Jerarquía no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Jerarquía actualizada exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en PUT /api/jerarquia/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar jerarquía',
    }, { status: 500 });
  }
}

/**
 * DELETE /api/jerarquia/[id]
 * Elimina una jerarquía por ID
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
      DELETE FROM [JERARQUIA]
      OUTPUT DELETED.*
      WHERE IDJ = @ID`;

    const result = await query<Jerarquia>(sqlQuery, { ID: id });

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Jerarquía no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Jerarquía eliminada exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en DELETE /api/jerarquia/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar jerarquía',
    }, { status: 500 });
  }
}

