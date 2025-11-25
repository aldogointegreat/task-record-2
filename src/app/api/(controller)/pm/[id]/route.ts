import { NextRequest, NextResponse } from 'next/server';
import { query, getConnection } from '@/lib/db';
import sql from 'mssql';
import type { PM, UpdatePMDTO } from '@/models';

/**
 * GET /api/pm/[id]
 * Obtiene un registro PM por ID
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

    const result = await query<PM>(
      'SELECT * FROM [PM] WHERE IDPM = @ID',
      { ID: id }
    );

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Registro PM no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Registro PM encontrado',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/pm/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener registro PM',
    }, { status: 500 });
  }
}

/**
 * PUT /api/pm/[id]
 * Actualiza un registro PM por ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body: UpdatePMDTO = await request.json();

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

    if (body.IDN !== undefined) {
      updates.push('IDN = @IDN');
      queryParams.IDN = body.IDN;
    }
    if (body.NRO !== undefined) {
      updates.push('NRO = @NRO');
      queryParams.NRO = body.NRO;
    }
    if (body.CONJUNTO !== undefined) {
      updates.push('CONJUNTO = @CONJUNTO');
      queryParams.CONJUNTO = body.CONJUNTO;
    }
    if (body.PLT !== undefined) {
      updates.push('PLT = @PLT');
      queryParams.PLT = body.PLT;
    }
    if (body.PROGRAMACION !== undefined) {
      updates.push('PROGRAMACION = @PROGRAMACION');
      queryParams.PROGRAMACION = body.PROGRAMACION;
    }
    if (body.ESTADO !== undefined) {
      updates.push('ESTADO = @ESTADO');
      queryParams.ESTADO = body.ESTADO;
    }
    if (body.HOROMETRO !== undefined) {
      updates.push('HOROMETRO = @HOROMETRO');
      queryParams.HOROMETRO = body.HOROMETRO;
    }
    if (body.INICIO !== undefined) {
      updates.push('INICIO = @INICIO');
      queryParams.INICIO = body.INICIO;
    }
    if (body.FIN !== undefined) {
      updates.push('FIN = @FIN');
      queryParams.FIN = body.FIN;
    }

    if (updates.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'No hay campos para actualizar',
      }, { status: 400 });
    }

    const sqlQuery = `
      UPDATE [PM] 
      SET ${updates.join(', ')}
      OUTPUT INSERTED.*
      WHERE IDPM = @ID`;

    const result = await query<PM>(sqlQuery, queryParams);

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Registro PM no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Registro PM actualizado exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en PUT /api/pm/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar registro PM',
    }, { status: 500 });
  }
}

/**
 * DELETE /api/pm/[id]
 * Elimina un registro PM por ID con eliminación en cascada:
 * 1. Elimina todas las REP_ACTIVIDAD de los REP_NIVEL de la PM
 * 2. Elimina todos los REP_NIVEL de la PM
 * 3. Elimina la PM
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const connection = await getConnection();
  const transaction = new sql.Transaction(connection);

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

    // Verificar que la PM existe antes de comenzar la transacción
    const pmCheck = await query<PM>(
      'SELECT * FROM [PM] WHERE IDPM = @ID',
      { ID: id }
    );

    if (pmCheck.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Registro PM no encontrado',
      }, { status: 404 });
    }

    const pmToDelete = pmCheck[0];

    // Iniciar transacción
    await transaction.begin();
    const requestTransaction = new sql.Request(transaction);

    // Paso 1: Obtener todos los REP_NIVEL de esta PM
    requestTransaction.input('IDPM', sql.Int, id);
    const repNivelesResult = await requestTransaction.query<{ IDRN: number }>(
      'SELECT IDRN FROM [REP_NIVEL] WHERE IDPM = @IDPM'
    );
    const repNiveles = repNivelesResult.recordset;

    // Paso 2: Para cada REP_NIVEL, eliminar todas las REP_ACTIVIDAD asociadas
    for (const repNivel of repNiveles) {
      const deleteActividadesRequest = new sql.Request(transaction);
      deleteActividadesRequest.input('IDRN', sql.Int, repNivel.IDRN);
      await deleteActividadesRequest.query(
        'DELETE FROM [REP_ACTIVIDAD] WHERE IDRN = @IDRN'
      );
    }

    // Paso 3: Eliminar todos los REP_NIVEL de esta PM
    const deleteRepNivelesRequest = new sql.Request(transaction);
    deleteRepNivelesRequest.input('IDPM', sql.Int, id);
    await deleteRepNivelesRequest.query(
      'DELETE FROM [REP_NIVEL] WHERE IDPM = @IDPM'
    );

    // Paso 4: Finalmente eliminar la PM
    const deletePMRequest = new sql.Request(transaction);
    deletePMRequest.input('IDPM', sql.Int, id);
    const deletePMResult = await deletePMRequest.query<PM>(
      'DELETE FROM [PM] OUTPUT DELETED.* WHERE IDPM = @IDPM'
    );

    // Commit de la transacción
    await transaction.commit();

    if (deletePMResult.recordset.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Error al eliminar registro PM',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: deletePMResult.recordset[0],
      message: `Registro PM eliminado exitosamente. Se eliminaron ${repNiveles.length} REP_NIVEL y sus REP_ACTIVIDAD asociadas.`,
    }, { status: 200 });

  } catch (error) {
    // Rollback en caso de error
    try {
      await transaction.rollback();
    } catch (rollbackError) {
      console.error('Error al hacer rollback:', rollbackError);
    }

    console.error('Error en DELETE /api/pm/[id]:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar registro PM',
    }, { status: 500 });
  }
}



