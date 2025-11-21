import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Nivel, UpdateNivelDTO, ActividadNivel } from '@/models';

/**
 * Función auxiliar para eliminar un nivel en cascada
 * Elimina recursivamente: atributos-valor -> actividades -> niveles hijos -> nivel
 */
async function eliminarNivelCascada(nivelId: number): Promise<void> {
  console.log(`🗑️ Eliminando en cascada nivel IDN: ${nivelId}`);
  
  // 1. Obtener todas las actividades de este nivel
  const actividades = await query<ActividadNivel>(
    `SELECT * FROM [ACTIVIDAD_NIVEL] WHERE IDN = @idn`,
    { idn: nivelId }
  );
  
  console.log(`  📋 Encontradas ${actividades.length} actividades a eliminar`);
  
  // 2. Para cada actividad, eliminar sus atributos-valor primero
  for (const actividad of actividades) {
    console.log(`    🗑️ Eliminando atributos-valor de actividad IDA: ${actividad.IDA}`);
    await query(
      `DELETE FROM [ATRIBUTO_VALOR] WHERE IDA = @ida`,
      { ida: actividad.IDA }
    );
  }
  
  // 3. Eliminar todas las actividades del nivel
  if (actividades.length > 0) {
    console.log(`  🗑️ Eliminando ${actividades.length} actividades del nivel`);
    await query(
      `DELETE FROM [ACTIVIDAD_NIVEL] WHERE IDN = @idn`,
      { idn: nivelId }
    );
  }
  
  // 4. Obtener todos los niveles hijos
  const nivelesHijos = await query<Nivel>(
    `SELECT * FROM [NIVEL] WHERE IDNP = @idnp`,
    { idnp: nivelId }
  );
  
  console.log(`  📁 Encontrados ${nivelesHijos.length} niveles hijos a eliminar`);
  
  // 5. Recursivamente eliminar cada nivel hijo
  for (const hijo of nivelesHijos) {
    await eliminarNivelCascada(hijo.IDN);
  }
  
  // 6. Finalmente, eliminar el nivel mismo
  console.log(`  ✅ Eliminando nivel IDN: ${nivelId}`);
  await query(
    `DELETE FROM [NIVEL] WHERE IDN = @idn`,
    { idn: nivelId }
  );
}

/**
 * GET /api/nivel/[id]
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
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

    if (body.ICONO !== undefined) {
      updates.push('ICONO = @ICONO');
      queryParams.ICONO = body.ICONO && body.ICONO.trim() !== '' ? body.ICONO : null;
    }

    if (body.GENERICO !== undefined) {
      updates.push('GENERICO = @GENERICO');
      queryParams.GENERICO = body.GENERICO ? 1 : 0;
    }

    if (body.COMENTARIO !== undefined) {
      updates.push('COMENTARIO = @COMENTARIO');
      queryParams.COMENTARIO = body.COMENTARIO || null;
    }

    if (body.ID_USR !== undefined) {
      updates.push('ID_USR = @ID_USR');
      queryParams.ID_USR = body.ID_USR || null;
    }

    if (body.ID_DISCIPLINA_NIVEL !== undefined) {
      updates.push('ID_DISCIPLINA_NIVEL = @ID_DISCIPLINA_NIVEL');
      queryParams.ID_DISCIPLINA_NIVEL = body.ID_DISCIPLINA_NIVEL || null;
    }

    if (body.UNIDAD_MANTENIBLE !== undefined) {
      updates.push('UNIDAD_MANTENIBLE = @UNIDAD_MANTENIBLE');
      queryParams.UNIDAD_MANTENIBLE = body.UNIDAD_MANTENIBLE ? 1 : 0;
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
 * Elimina un nivel en cascada (con todos sus hijos, actividades y atributos)
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

    // Verificar que el nivel existe antes de eliminarlo
    const nivelExistente = await query<Nivel>(
      `SELECT * FROM [NIVEL] WHERE IDN = @id`,
      { id }
    );

    if (nivelExistente.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Nivel no encontrado',
      }, { status: 404 });
    }

    const nivelEliminado = nivelExistente[0];

    // Eliminar en cascada
    console.log(`🚀 Iniciando eliminación en cascada de nivel ${id} (${nivelEliminado.NOMBRE})`);
    await eliminarNivelCascada(id);
    console.log(`✅ Eliminación en cascada completada`);

    return NextResponse.json({
      success: true,
      data: nivelEliminado,
      message: 'Nivel y todos sus dependientes eliminados exitosamente',
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

