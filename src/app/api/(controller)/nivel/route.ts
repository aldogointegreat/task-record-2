import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Nivel, CreateNivelDTO, NivelFilters, ActividadNivel } from '@/models';

/**
 * Función auxiliar para copiar la estructura de un nivel padre
 * @param idPadreOrigen ID del nivel padre original del que se copiará la estructura
 * @param idPadreDestino ID del nuevo nivel plantilla donde se copiará la estructura
 * @param esPrimerNivel Si es true, excluye plantillas y genéricos. Si es false, copia todo.
 */
async function copiarEstructuraNivel(idPadreOrigen: number, idPadreDestino: number, esPrimerNivel: boolean = true): Promise<void> {
  console.log(`🔄 Copiando estructura de padre origen ${idPadreOrigen} a destino ${idPadreDestino} (Primer nivel: ${esPrimerNivel})`);
  
  // 1. Obtener niveles hijos - solo excluir plantillas/genéricos en el primer nivel
  let sqlQuery = `SELECT * FROM [NIVEL] WHERE IDNP = @idPadre`;
  
  if (esPrimerNivel) {
    // En el primer nivel, excluir plantillas y genéricos
    sqlQuery += ` AND (PLANTILLA = 0 OR PLANTILLA IS NULL) AND (GENERICO = 0 OR GENERICO IS NULL)`;
  }
  
  sqlQuery += ` ORDER BY IDN ASC`;
  
  const nivelesHijos = await query<Nivel>(sqlQuery, { idPadre: idPadreOrigen });

  console.log(`📊 Encontrados ${nivelesHijos.length} niveles hijos a copiar:`, nivelesHijos.map(n => ({ IDN: n.IDN, NOMBRE: n.NOMBRE })));

  // 2. Copiar cada nivel hijo y su estructura recursivamente
  for (const hijo of nivelesHijos) {
    console.log(`📝 Copiando nivel hijo: ${hijo.NOMBRE} (IDN: ${hijo.IDN})`);
    
    // Crear una copia del nivel hijo
    const nuevoNivel = await query<Nivel>(
      `INSERT INTO [NIVEL] (IDJ, IDNP, NOMBRE, PLANTILLA, NROPM, ICONO, GENERICO, COMENTARIO, ID_USR, FECHA_CREACION, ID_DISCIPLINA_NIVEL, UNIDAD_MANTENIBLE)
       OUTPUT INSERTED.*
       VALUES (@IDJ, @IDNP, @NOMBRE, @PLANTILLA, @NROPM, @ICONO, @GENERICO, @COMENTARIO, @ID_USR, @FECHA_CREACION, @ID_DISCIPLINA_NIVEL, @UNIDAD_MANTENIBLE)`,
      {
        IDJ: hijo.IDJ,
        IDNP: idPadreDestino, // Nuevo padre
        NOMBRE: hijo.NOMBRE,
        PLANTILLA: 0,
        NROPM: hijo.NROPM,
        ICONO: hijo.ICONO,
        GENERICO: 0,
        COMENTARIO: hijo.COMENTARIO,
        ID_USR: hijo.ID_USR,
        FECHA_CREACION: hijo.FECHA_CREACION,
        ID_DISCIPLINA_NIVEL: hijo.ID_DISCIPLINA_NIVEL || null,
        UNIDAD_MANTENIBLE: hijo.UNIDAD_MANTENIBLE ? 1 : 0,
      }
    );

    if (nuevoNivel.length === 0) {
      console.log(`❌ No se pudo crear el nivel ${hijo.NOMBRE}`);
      continue;
    }
    
    const nuevoNivelId = nuevoNivel[0].IDN;
    console.log(`✅ Nivel creado exitosamente: ${hijo.NOMBRE} con nuevo IDN: ${nuevoNivelId}`);

    // 3. Copiar las actividades del nivel hijo
    const actividadesHijo = await query<ActividadNivel>(
      `SELECT * FROM [ACTIVIDAD_NIVEL] WHERE IDN = @idn`,
      { idn: hijo.IDN }
    );

    console.log(`📋 Encontradas ${actividadesHijo.length} actividades para el nivel ${hijo.NOMBRE}`);

    for (const actividad of actividadesHijo) {
      console.log(`  📌 Copiando actividad: ${actividad.DESCRIPCION} (IDA origen: ${actividad.IDA})`);
      
      // Insertar la actividad y obtener el nuevo ID
      const nuevaActividadResult = await query<ActividadNivel>(
        `INSERT INTO [ACTIVIDAD_NIVEL] (IDN, IDT, ORDEN, DESCRIPCION)
         OUTPUT INSERTED.*
         VALUES (@IDN, @IDT, @ORDEN, @DESCRIPCION)`,
        {
          IDN: nuevoNivelId,
          IDT: actividad.IDT,
          ORDEN: actividad.ORDEN,
          DESCRIPCION: actividad.DESCRIPCION
        }
      );

      if (nuevaActividadResult.length === 0) {
        console.log(`    ❌ Error al insertar actividad ${actividad.DESCRIPCION}`);
        continue;
      }

      const nuevaActividadId = nuevaActividadResult[0].IDA;
      console.log(`    ✅ Actividad insertada con nuevo IDA: ${nuevaActividadId}`);

      // Copiar atributos-valor de cada actividad
      const atributos = await query(
        `SELECT * FROM [ATRIBUTO_VALOR] WHERE IDA = @ida`,
        { ida: actividad.IDA }
      );

      if (atributos.length > 0) {
        console.log(`    📎 Copiando ${atributos.length} atributos-valor para la actividad ${actividad.DESCRIPCION}`);
        
        for (const atributo of atributos) {
          // IDAV es IDENTITY, no debe insertarse explícitamente
          await query(
            `INSERT INTO [ATRIBUTO_VALOR] (IDA, VALOR)
             VALUES (@IDA, @VALOR)`,
            {
              IDA: nuevaActividadId,
              VALOR: atributo.VALOR
            }
          );
          console.log(`      ✓ Atributo copiado: ${atributo.VALOR}`);
        }
      }
    }

    // 4. Recursivamente copiar la estructura de este hijo (ya no es primer nivel, copiar todo)
    console.log(`🔁 Llamando recursivamente para copiar sub-niveles de ${hijo.NOMBRE} (${hijo.IDN} -> ${nuevoNivelId})`);
    await copiarEstructuraNivel(hijo.IDN, nuevoNivelId, false); // false = no es primer nivel, copiar todo
  }
  
  console.log(`✅ Completado copiado de estructura de padre ${idPadreOrigen} a ${idPadreDestino}`);
}

/**
 * GET /api/nivel
 * Obtiene todos los niveles con filtros opcionales
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: NivelFilters = {};

    // Construir filtros desde query params
    if (searchParams.has('NOMBRE')) {
      filters.NOMBRE = searchParams.get('NOMBRE') || undefined;
    }
    if (searchParams.has('IDJ')) {
      const idj = searchParams.get('IDJ');
      if (idj) filters.IDJ = parseInt(idj);
    }
    if (searchParams.has('IDNP')) {
      const idnp = searchParams.get('IDNP');
      if (idnp) filters.IDNP = parseInt(idnp);
    }
    if (searchParams.has('PLANTILLA')) {
      filters.PLANTILLA = searchParams.get('PLANTILLA') === 'true';
    }
  if (searchParams.has('ID_DISCIPLINA_NIVEL')) {
    const idDisc = searchParams.get('ID_DISCIPLINA_NIVEL');
    if (idDisc) filters.ID_DISCIPLINA_NIVEL = parseInt(idDisc);
  }
  if (searchParams.has('UNIDAD_MANTENIBLE')) {
    filters.UNIDAD_MANTENIBLE = searchParams.get('UNIDAD_MANTENIBLE') === 'true';
  }

    // Construir condiciones WHERE
    let whereClause = 'WHERE 1=1';
    const params: Record<string, unknown> = {};

    if (filters.NOMBRE) {
      whereClause += ' AND NOMBRE LIKE @NOMBRE';
      params.NOMBRE = `%${filters.NOMBRE}%`;
    }
    if (filters.IDJ !== undefined) {
      whereClause += ' AND IDJ = @IDJ';
      params.IDJ = filters.IDJ;
    }
    if (filters.IDNP !== undefined) {
      whereClause += ' AND IDNP = @IDNP';
      params.IDNP = filters.IDNP;
    }
    if (filters.PLANTILLA !== undefined) {
      whereClause += ' AND PLANTILLA = @PLANTILLA';
      params.PLANTILLA = filters.PLANTILLA ? 1 : 0;
    }
  if (filters.ID_DISCIPLINA_NIVEL !== undefined) {
    whereClause += ' AND ID_DISCIPLINA_NIVEL = @ID_DISCIPLINA_NIVEL';
    params.ID_DISCIPLINA_NIVEL = filters.ID_DISCIPLINA_NIVEL;
  }
  if (filters.UNIDAD_MANTENIBLE !== undefined) {
    whereClause += ' AND UNIDAD_MANTENIBLE = @UNIDAD_MANTENIBLE';
    params.UNIDAD_MANTENIBLE = filters.UNIDAD_MANTENIBLE ? 1 : 0;
  }

    // Ejecutar query
    const result = await query<Nivel>(
      `SELECT * FROM [NIVEL] ${whereClause} ORDER BY IDN ASC`,
      params
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: `Se encontraron ${result.length} niveles`,
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/nivel:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener niveles',
    }, { status: 500 });
  }
}

/**
 * POST /api/nivel
 * Crea un nuevo nivel
 */
export async function POST(request: NextRequest) {
  let body: CreateNivelDTO | null = null;
  try {
    body = await request.json() as CreateNivelDTO;

    // Validar campos requeridos
    if (!body.NOMBRE) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo NOMBRE es requerido',
      }, { status: 400 });
    }
    if (!body.IDJ) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo IDJ (Jerarquía) es requerido',
      }, { status: 400 });
    }

    // Construir query dinámica
    const fields: string[] = [];
    const values: string[] = [];
    const params: Record<string, unknown> = {};

    fields.push('IDJ');
    values.push('@IDJ');
    params.IDJ = body.IDJ;

    if (body.IDNP !== undefined) {
      fields.push('IDNP');
      values.push('@IDNP');
      params.IDNP = body.IDNP || null;
    }

    fields.push('NOMBRE');
    values.push('@NOMBRE');
    params.NOMBRE = body.NOMBRE;

    if (body.PLANTILLA !== undefined) {
      fields.push('PLANTILLA');
      values.push('@PLANTILLA');
      params.PLANTILLA = body.PLANTILLA ? 1 : 0;
    }

    if (body.NROPM !== undefined) {
      fields.push('NROPM');
      values.push('@NROPM');
      params.NROPM = body.NROPM;
    }

    if (body.ICONO !== undefined) {
      fields.push('ICONO');
      values.push('@ICONO');
      params.ICONO = body.ICONO && body.ICONO.trim() !== '' ? body.ICONO : null;
    }

    if (body.GENERICO !== undefined) {
      fields.push('GENERICO');
      values.push('@GENERICO');
      params.GENERICO = body.GENERICO ? 1 : 0;
    }

    if (body.COMENTARIO !== undefined) {
      fields.push('COMENTARIO');
      values.push('@COMENTARIO');
      params.COMENTARIO = body.COMENTARIO || null;
    }

    if (body.ID_USR !== undefined) {
      fields.push('ID_USR');
      values.push('@ID_USR');
      params.ID_USR = body.ID_USR || null;
    }

    if (body.FECHA_CREACION !== undefined) {
      fields.push('FECHA_CREACION');
      values.push('@FECHA_CREACION');
      params.FECHA_CREACION = body.FECHA_CREACION || null;
    }

    if (body.ID_DISCIPLINA_NIVEL !== undefined) {
      fields.push('ID_DISCIPLINA_NIVEL');
      values.push('@ID_DISCIPLINA_NIVEL');
      params.ID_DISCIPLINA_NIVEL = body.ID_DISCIPLINA_NIVEL || null;
    }

    if (body.UNIDAD_MANTENIBLE !== undefined) {
      fields.push('UNIDAD_MANTENIBLE');
      values.push('@UNIDAD_MANTENIBLE');
      params.UNIDAD_MANTENIBLE = body.UNIDAD_MANTENIBLE ? 1 : 0;
    }

    const sqlQuery = `
      INSERT INTO [NIVEL] (${fields.join(', ')})
      OUTPUT INSERTED.*
      VALUES (${values.join(', ')})`;

    const result = await query<Nivel>(sqlQuery, params);
    const nuevoNivel = result[0];

    // Si es una plantilla y tiene padre, copiar la estructura del padre
    if (body.PLANTILLA && body.IDNP) {
      console.log(`🎯 Nivel creado como PLANTILLA, iniciando copia de estructura...`);
      console.log(`   Padre (IDNP): ${body.IDNP}, Nuevo nivel (IDN): ${nuevoNivel.IDN}`);
      
      try {
        // Verificar que el padre es genérico
        const padre = await query<Nivel>(
          'SELECT * FROM [NIVEL] WHERE IDN = @idn',
          { idn: body.IDNP }
        );

        console.log(`   Padre encontrado:`, padre.length > 0 ? { IDN: padre[0].IDN, NOMBRE: padre[0].NOMBRE, GENERICO: padre[0].GENERICO } : 'No encontrado');

        if (padre.length > 0 && padre[0].GENERICO) {
          console.log(`✅ Padre es genérico, iniciando copia...`);
          // Copiar la estructura del padre al nuevo nivel plantilla
          // true = es primer nivel, excluir plantillas y genéricos solo en este nivel
          await copiarEstructuraNivel(body.IDNP, nuevoNivel.IDN, true);
          console.log(`✅ Copia de estructura completada`);
        } else {
          console.log(`❌ Padre no es genérico o no existe, no se copiará estructura`);
        }
      } catch (copyError) {
        console.error('❌ Error al copiar estructura:', copyError);
        // No fallar la creación si hay error en la copia
      }
    }

    return NextResponse.json({
      success: true,
      data: nuevoNivel,
      message: body.PLANTILLA 
        ? 'Nivel plantilla creado exitosamente con estructura copiada' 
        : 'Nivel creado exitosamente',
    }, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/nivel:', error);
    
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear nivel',
    }, { status: 500 });
  }
}

