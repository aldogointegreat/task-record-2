import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Usuario, UpdateUsuarioDTO } from '@/models';

/**
 * GET /api/usuario/[id]
 * Obtiene un usuario por ID
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

    const result = await query<Usuario>(
      'SELECT * FROM [USUARIO] WHERE ID_USR = @ID',
      { ID: id }
    );

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Usuario no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Usuario encontrado',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/usuario/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener usuario',
    }, { status: 500 });
  }
}

/**
 * PUT /api/usuario/[id]
 * Actualiza un usuario por ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body: UpdateUsuarioDTO = await request.json();

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

    if (body.ID_ROL !== undefined) {
      updates.push('ID_ROL = @ID_ROL');
      queryParams.ID_ROL = body.ID_ROL || null;
    }
    if (body.ID_DIS !== undefined) {
      updates.push('ID_DIS = @ID_DIS');
      queryParams.ID_DIS = body.ID_DIS || null;
    }
    if (body.NOMBRE !== undefined) {
      updates.push('NOMBRE = @NOMBRE');
      queryParams.NOMBRE = body.NOMBRE;
    }
    if (body.USUARIO !== undefined) {
      updates.push('USUARIO = @USUARIO');
      queryParams.USUARIO = body.USUARIO;
    }
    if (body.CONTRASENA !== undefined) {
      updates.push('CONTRASENA = @CONTRASENA');
      queryParams.CONTRASENA = body.CONTRASENA;
    }

    if (updates.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'No hay campos para actualizar',
      }, { status: 400 });
    }

    const sqlQuery = `
      UPDATE [USUARIO] 
      SET ${updates.join(', ')}
      OUTPUT INSERTED.*
      WHERE ID_USR = @ID`;

    const result = await query<Usuario>(sqlQuery, queryParams);

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Usuario no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Usuario actualizado exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en PUT /api/usuario/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar usuario',
    }, { status: 500 });
  }
}

/**
 * DELETE /api/usuario/[id]
 * Elimina un usuario por ID
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
      DELETE FROM [USUARIO]
      OUTPUT DELETED.*
      WHERE ID_USR = @ID`;

    const result = await query<Usuario>(sqlQuery, { ID: id });

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Usuario no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Usuario eliminado exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en DELETE /api/usuario/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar usuario',
    }, { status: 500 });
  }
}

