import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Entrega, UpdateEntregaDTO } from '@/models';

/**
 * GET /api/entrega/[id]
 * Obtiene una entrega por ID
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

    const result = await query<Entrega>(
      'SELECT * FROM [ENTREGA] WHERE IDE = @ID',
      { ID: id }
    );

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Entrega no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Entrega encontrada',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/entrega/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener entrega',
    }, { status: 500 });
  }
}

/**
 * PUT /api/entrega/[id]
 * Actualiza una entrega por ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body: UpdateEntregaDTO = await request.json();

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
    if (body.ORDEN !== undefined) {
      updates.push('ORDEN = @ORDEN');
      params.ORDEN = body.ORDEN;
    }

    if (updates.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'No hay campos para actualizar',
      }, { status: 400 });
    }

    const sqlQuery = `
      UPDATE [ENTREGA] 
      SET ${updates.join(', ')}
      OUTPUT INSERTED.*
      WHERE IDE = @ID`;

    const result = await query<Entrega>(sqlQuery, params);

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Entrega no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Entrega actualizada exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en PUT /api/entrega/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar entrega',
    }, { status: 500 });
  }
}

/**
 * DELETE /api/entrega/[id]
 * Elimina una entrega por ID
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
      DELETE FROM [ENTREGA]
      OUTPUT DELETED.*
      WHERE IDE = @ID`;

    const result = await query<Entrega>(sqlQuery, { ID: id });

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Entrega no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Entrega eliminada exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en DELETE /api/entrega/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar entrega',
    }, { status: 500 });
  }
}

