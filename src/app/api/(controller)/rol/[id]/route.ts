import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Rol, UpdateRolDTO } from '@/models';

/**
 * GET /api/rol/[id]
 * Obtiene un rol por ID
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

    const result = await query<Rol>(
      'SELECT * FROM [ROL] WHERE ID_ROL = @ID',
      { ID: id }
    );

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Rol no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Rol encontrado',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/rol/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener rol',
    }, { status: 500 });
  }
}

/**
 * PUT /api/rol/[id]
 * Actualiza un rol por ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body: UpdateRolDTO = await request.json();

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
    if (body.ADMINISTRADOR !== undefined) {
      updates.push('ADMINISTRADOR = @ADMINISTRADOR');
      params.ADMINISTRADOR = body.ADMINISTRADOR ? 1 : 0;
    }

    if (updates.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'No hay campos para actualizar',
      }, { status: 400 });
    }

    const sqlQuery = `
      UPDATE [ROL] 
      SET ${updates.join(', ')}
      OUTPUT INSERTED.*
      WHERE ID_ROL = @ID`;

    const result = await query<Rol>(sqlQuery, params);

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Rol no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Rol actualizado exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en PUT /api/rol/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar rol',
    }, { status: 500 });
  }
}

/**
 * DELETE /api/rol/[id]
 * Elimina un rol por ID
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
      DELETE FROM [ROL]
      OUTPUT DELETED.*
      WHERE ID_ROL = @ID`;

    const result = await query<Rol>(sqlQuery, { ID: id });

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Rol no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Rol eliminado exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en DELETE /api/rol/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar rol',
    }, { status: 500 });
  }
}

