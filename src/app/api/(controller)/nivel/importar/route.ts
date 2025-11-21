import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Nivel, ActividadNivel } from '@/models';

/**
 * Función auxiliar para copiar recursivamente un nivel y toda su estructura
 * @param idOrigen ID del nivel que se va a copiar
 * @param idPadreDestino ID del nivel padre donde se insertará la copia
 */
async function copiarNivelRecursivo(idOrigen: number, idPadreDestino: number): Promise<void> {
  // 1. Obtener datos del nivel origen
  const nivelOrigen = await query<Nivel>(
    `SELECT * FROM [NIVEL] WHERE IDN = @id`,
    { id: idOrigen }
  );

  if (nivelOrigen.length === 0) return;
  const origen = nivelOrigen[0];

  console.log(`📝 Copiando nivel: ${origen.NOMBRE} (Origen: ${origen.IDN}) al padre ${idPadreDestino}`);

  // 2. Insertar copia del nivel
  const nuevoNivelResult = await query<Nivel>(
    `INSERT INTO [NIVEL] (IDJ, IDNP, NOMBRE, PLANTILLA, NROPM, ICONO, GENERICO, COMENTARIO, ID_USR, FECHA_CREACION)
     OUTPUT INSERTED.*
     VALUES (@IDJ, @IDNP, @NOMBRE, @PLANTILLA, @NROPM, @ICONO, @GENERICO, @COMENTARIO, @ID_USR, @FECHA_CREACION)`,
    {
      IDJ: origen.IDJ,
      IDNP: idPadreDestino,
      NOMBRE: origen.NOMBRE,
      PLANTILLA: 0, // Al importar componentes, no deberían ser plantillas por defecto
      NROPM: origen.NROPM,
      ICONO: origen.ICONO,
      GENERICO: 0, // Ni genéricos
      COMENTARIO: origen.COMENTARIO,
      ID_USR: origen.ID_USR,
      FECHA_CREACION: new Date()
    }
  );

  if (nuevoNivelResult.length === 0) return;
  const nuevoId = nuevoNivelResult[0].IDN;

  // 3. Copiar actividades del nivel
  const actividades = await query<ActividadNivel>(
    `SELECT * FROM [ACTIVIDAD_NIVEL] WHERE IDN = @idn`,
    { idn: idOrigen }
  );

  for (const actividad of actividades) {
    // Insertar actividad
    const nuevaActividadResult = await query<ActividadNivel>(
      `INSERT INTO [ACTIVIDAD_NIVEL] (IDN, IDT, ORDEN, DESCRIPCION)
       OUTPUT INSERTED.*
       VALUES (@IDN, @IDT, @ORDEN, @DESCRIPCION)`,
      {
        IDN: nuevoId,
        IDT: actividad.IDT,
        ORDEN: actividad.ORDEN,
        DESCRIPCION: actividad.DESCRIPCION
      }
    );

    if (nuevaActividadResult.length > 0) {
      const nuevaActividadId = nuevaActividadResult[0].IDA;

      // Copiar atributos-valor
      const atributos = await query(
        `SELECT * FROM [ATRIBUTO_VALOR] WHERE IDA = @ida`,
        { ida: actividad.IDA }
      );

      for (const atributo of atributos) {
        await query(
          `INSERT INTO [ATRIBUTO_VALOR] (IDA, VALOR)
           VALUES (@IDA, @VALOR)`,
          {
            IDA: nuevaActividadId,
            VALOR: atributo.VALOR
          }
        );
      }
    }
  }

  // 4. Obtener hijos y llamar recursivamente
  // Importante: Al importar un componente específico, queremos copiar TODO lo que tenga adentro
  // incluyendo si tiene sub-plantillas o sub-genéricos definidos en el original
  const hijos = await query<Nivel>(
    `SELECT * FROM [NIVEL] WHERE IDNP = @idPadre ORDER BY IDN ASC`,
    { idPadre: idOrigen }
  );

  for (const hijo of hijos) {
    await copiarNivelRecursivo(hijo.IDN, nuevoId);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceId, targetParentId } = body;

    if (!sourceId || !targetParentId) {
      return NextResponse.json({
        success: false,
        message: 'Faltan parámetros requeridos (sourceId, targetParentId)'
      }, { status: 400 });
    }

    console.log(`🚀 Iniciando importación de componente ${sourceId} a ${targetParentId}`);
    
    // Iniciar el proceso de copia recursiva
    await copiarNivelRecursivo(sourceId, targetParentId);

    return NextResponse.json({
      success: true,
      message: 'Componente importado exitosamente'
    }, { status: 201 });

  } catch (error) {
    console.error('Error en importación:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al importar componente'
    }, { status: 500 });
  }
}

