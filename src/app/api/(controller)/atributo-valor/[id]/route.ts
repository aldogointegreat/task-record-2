import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { AtributoValor, UpdateAtributoValorDTO } from '@/models';

/**
 * GET /api/atributo-valor/[id]
 * Obtiene un valor de atributo por ID
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

    const result = await query<AtributoValor>(
      'SELECT * FROM [ATRIBUTO_VALOR] WHERE IDAV = @ID',
      { ID: id }
    );

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Valor de atributo no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Valor de atributo encontrado',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/atributo-valor/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener valor de atributo',
    }, { status: 500 });
  }
}

/**
 * PUT /api/atributo-valor/[id]
 * Actualiza un valor de atributo por ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body: UpdateAtributoValorDTO = await request.json();

    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'ID inválido',
      }, { status: 400 });
    }

    // Construir SET clause dinámico
    const updates: string[] = [];
    const sqlParams: Record<string, unknown> = { ID: id };

    if (body.IDA !== undefined) {
      updates.push('IDA = @IDA');
      sqlParams.IDA = body.IDA;
    }

    if (body.VALOR !== undefined) {
      updates.push('VALOR = @VALOR');
      sqlParams.VALOR = body.VALOR;
    }

    if (updates.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'No hay campos para actualizar',
      }, { status: 400 });
    }

    const sqlQuery = `
      UPDATE [ATRIBUTO_VALOR] 
      SET ${updates.join(', ')}
      OUTPUT INSERTED.*
      WHERE IDAV = @ID`;

    const result = await query<AtributoValor>(sqlQuery, sqlParams);

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Valor de atributo no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Valor de atributo actualizado exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en PUT /api/atributo-valor/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar valor de atributo',
    }, { status: 500 });
  }
}

/**
 * DELETE /api/atributo-valor/[id]
 * Elimina un valor de atributo por ID
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
      DELETE FROM [ATRIBUTO_VALOR]
      OUTPUT DELETED.*
      WHERE IDAV = @ID`;

    const result = await query<AtributoValor>(sqlQuery, { ID: id });

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Valor de atributo no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Valor de atributo eliminado exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en DELETE /api/atributo-valor/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar valor de atributo',
    }, { status: 500 });
  }
}

