import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { ClaseMantencion, UpdateClaseMantencionDTO } from '@/models';

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

    const result = await query<ClaseMantencion>(
      'SELECT * FROM [CLASE_MANTENCION] WHERE ID_CLASE = @ID',
      { ID: id }
    );

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Clase de mantención no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Clase de mantención encontrada',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/clase-mantencion/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener clase de mantención',
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
    const body: UpdateClaseMantencionDTO = await request.json();

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
      UPDATE [CLASE_MANTENCION] 
      SET ${updates.join(', ')}
      OUTPUT INSERTED.*
      WHERE ID_CLASE = @ID`;

    const result = await query<ClaseMantencion>(sqlQuery, sqlParams);

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Clase de mantención no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Clase de mantención actualizada exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en PUT /api/clase-mantencion/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar clase de mantención',
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
      DELETE FROM [CLASE_MANTENCION]
      OUTPUT DELETED.*
      WHERE ID_CLASE = @ID`;

    const result = await query<ClaseMantencion>(sqlQuery, { ID: id });

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Clase de mantención no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Clase de mantención eliminada exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en DELETE /api/clase-mantencion/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar clase de mantención',
    }, { status: 500 });
  }
}

