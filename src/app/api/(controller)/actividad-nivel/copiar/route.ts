import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { ActividadNivel, AtributoValor } from '@/models';

interface CopiarActividadNivelDTO {
  sourceId: number;
  targetNivelId: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: CopiarActividadNivelDTO = await request.json();

    if (!body.sourceId || !body.targetNivelId) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'sourceId y targetNivelId son requeridos',
      }, { status: 400 });
    }

    // 1. Obtener la actividad origen
    const sourceActividadResult = await query<ActividadNivel>(
      'SELECT * FROM [ACTIVIDAD_NIVEL] WHERE IDA = @sourceId',
      { sourceId: body.sourceId }
    );

    if (sourceActividadResult.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Actividad origen no encontrada',
      }, { status: 404 });
    }

    const sourceActividad = sourceActividadResult[0];

    // 2. Calcular el nuevo orden para el nivel destino
    const maxOrdenResult = await query<{ MAX_ORDEN: number }>(
      'SELECT MAX(ORDEN) as MAX_ORDEN FROM [ACTIVIDAD_NIVEL] WHERE IDN = @targetNivelId',
      { targetNivelId: body.targetNivelId }
    );
    
    const nuevoOrden = (maxOrdenResult[0]?.MAX_ORDEN || 0) + 1;

    // 3. Insertar la nueva actividad
    const fields = [
      'IDN', 'IDT', 'ORDEN', 'DESCRIPCION', 
      'FUNCIONALIDAD', 'MODO_FALLA', 'EFECTO_FALLA', 
      'TIEMPO_PROMEDIO_FALLA', 'UNIDAD_TIEMPO_FALLA', 
      'ID_CONSECUENCIA_FALLA', 'ID_CLASE_MANTENCION', 
      'TAREA_MANTENCION', 'FRECUENCIA_TAREA', 'UNIDAD_FRECUENCIA', 
      'DURACION_TAREA', 'CANTIDAD_RECURSOS', 
      'ID_CONDICION_ACCESO', 'ID_DISCIPLINA_TAREA'
    ];
    
    const paramsName = fields.map(f => `@${f}`).join(', ');
    
    const insertActividadQuery = `
      INSERT INTO [ACTIVIDAD_NIVEL] (${fields.join(', ')})
      OUTPUT INSERTED.*
      VALUES (${paramsName})`;

    const nuevaActividadResult = await query<ActividadNivel>(insertActividadQuery, {
      IDN: body.targetNivelId,
      IDT: sourceActividad.IDT,
      ORDEN: nuevoOrden,
      DESCRIPCION: sourceActividad.DESCRIPCION,
      FUNCIONALIDAD: sourceActividad.FUNCIONALIDAD,
      MODO_FALLA: sourceActividad.MODO_FALLA,
      EFECTO_FALLA: sourceActividad.EFECTO_FALLA,
      TIEMPO_PROMEDIO_FALLA: sourceActividad.TIEMPO_PROMEDIO_FALLA,
      UNIDAD_TIEMPO_FALLA: sourceActividad.UNIDAD_TIEMPO_FALLA,
      ID_CONSECUENCIA_FALLA: sourceActividad.ID_CONSECUENCIA_FALLA,
      ID_CLASE_MANTENCION: sourceActividad.ID_CLASE_MANTENCION,
      TAREA_MANTENCION: sourceActividad.TAREA_MANTENCION,
      FRECUENCIA_TAREA: sourceActividad.FRECUENCIA_TAREA,
      UNIDAD_FRECUENCIA: sourceActividad.UNIDAD_FRECUENCIA,
      DURACION_TAREA: sourceActividad.DURACION_TAREA,
      CANTIDAD_RECURSOS: sourceActividad.CANTIDAD_RECURSOS,
      ID_CONDICION_ACCESO: sourceActividad.ID_CONDICION_ACCESO,
      ID_DISCIPLINA_TAREA: sourceActividad.ID_DISCIPLINA_TAREA
    });

    const nuevaActividad = nuevaActividadResult[0];

    // 4. Copiar atributos-valor
    const atributosResult = await query<AtributoValor>(
      'SELECT * FROM [ATRIBUTO_VALOR] WHERE IDA = @sourceId',
      { sourceId: body.sourceId }
    );

    for (const atributo of atributosResult) {
      await query(
        'INSERT INTO [ATRIBUTO_VALOR] (IDA, VALOR) VALUES (@IDA, @VALOR)',
        {
          IDA: nuevaActividad.IDA,
          VALOR: atributo.VALOR
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: nuevaActividad,
      message: 'Actividad copiada exitosamente',
    }, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/actividad-nivel/copiar:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al copiar actividad',
    }, { status: 500 });
  }
}


