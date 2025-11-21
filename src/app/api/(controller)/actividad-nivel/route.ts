import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { ActividadNivel, CreateActividadNivelDTO, ActividadNivelFilters } from '@/models';

/**
 * GET /api/actividad-nivel
 * Obtiene todas las actividades de nivel con filtros opcionales
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: ActividadNivelFilters = {};

    // Construir filtros desde query params
    if (searchParams.has('IDN')) {
      filters.IDN = parseInt(searchParams.get('IDN') || '0');
    }
    if (searchParams.has('IDT')) {
      filters.IDT = parseInt(searchParams.get('IDT') || '0');
    }
    if (searchParams.has('DESCRIPCION')) {
      filters.DESCRIPCION = searchParams.get('DESCRIPCION') || undefined;
    }

    // Construir condiciones WHERE
    let whereClause = 'WHERE 1=1';
    const params: Record<string, unknown> = {};

    if (filters.IDN !== undefined) {
      whereClause += ' AND IDN = @IDN';
      params.IDN = filters.IDN;
    }

    if (filters.IDT !== undefined) {
      whereClause += ' AND IDT = @IDT';
      params.IDT = filters.IDT;
    }

    if (filters.DESCRIPCION) {
      whereClause += ' AND DESCRIPCION LIKE @DESCRIPCION';
      params.DESCRIPCION = `%${filters.DESCRIPCION}%`;
    }

    // Ejecutar query
    const result = await query<ActividadNivel>(
      `SELECT * FROM [ACTIVIDAD_NIVEL] ${whereClause} ORDER BY IDN ASC, ORDEN ASC`,
      params
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: `Se encontraron ${result.length} actividades de nivel`,
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/actividad-nivel:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener actividades de nivel',
    }, { status: 500 });
  }
}

/**
 * POST /api/actividad-nivel
 * Crea una nueva actividad de nivel
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateActividadNivelDTO = await request.json();

    // Validar campos requeridos
    if (!body.IDN) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo IDN es requerido',
      }, { status: 400 });
    }

    if (!body.ORDEN) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo ORDEN es requerido',
      }, { status: 400 });
    }

    if (!body.DESCRIPCION) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo DESCRIPCION es requerido',
      }, { status: 400 });
    }

    // Construir query dinámica
    const fields: string[] = [];
    const values: string[] = [];
    const params: Record<string, unknown> = {};

    if (body.IDN !== undefined) {
      fields.push('IDN');
      values.push('@IDN');
      params.IDN = body.IDN;
    }

    if (body.IDT !== undefined) {
      fields.push('IDT');
      values.push('@IDT');
      params.IDT = body.IDT;
    }

    if (body.ORDEN !== undefined) {
      fields.push('ORDEN');
      values.push('@ORDEN');
      params.ORDEN = body.ORDEN;
    }

    if (body.DESCRIPCION !== undefined) {
      fields.push('DESCRIPCION');
      values.push('@DESCRIPCION');
      params.DESCRIPCION = body.DESCRIPCION;
    }

    if (body.FUNCIONALIDAD !== undefined) {
      fields.push('FUNCIONALIDAD');
      values.push('@FUNCIONALIDAD');
      params.FUNCIONALIDAD = body.FUNCIONALIDAD || null;
    }

    if (body.MODO_FALLA !== undefined) {
      fields.push('MODO_FALLA');
      values.push('@MODO_FALLA');
      params.MODO_FALLA = body.MODO_FALLA || null;
    }

    if (body.EFECTO_FALLA !== undefined) {
      fields.push('EFECTO_FALLA');
      values.push('@EFECTO_FALLA');
      params.EFECTO_FALLA = body.EFECTO_FALLA || null;
    }

    if (body.TIEMPO_PROMEDIO_FALLA !== undefined) {
      fields.push('TIEMPO_PROMEDIO_FALLA');
      values.push('@TIEMPO_PROMEDIO_FALLA');
      params.TIEMPO_PROMEDIO_FALLA = body.TIEMPO_PROMEDIO_FALLA || null;
    }

    if (body.UNIDAD_TIEMPO_FALLA !== undefined) {
      fields.push('UNIDAD_TIEMPO_FALLA');
      values.push('@UNIDAD_TIEMPO_FALLA');
      params.UNIDAD_TIEMPO_FALLA = body.UNIDAD_TIEMPO_FALLA || null;
    }

    if (body.ID_CONSECUENCIA_FALLA !== undefined) {
      fields.push('ID_CONSECUENCIA_FALLA');
      values.push('@ID_CONSECUENCIA_FALLA');
      params.ID_CONSECUENCIA_FALLA = body.ID_CONSECUENCIA_FALLA || null;
    }

    if (body.ID_CLASE_MANTENCION !== undefined) {
      fields.push('ID_CLASE_MANTENCION');
      values.push('@ID_CLASE_MANTENCION');
      params.ID_CLASE_MANTENCION = body.ID_CLASE_MANTENCION || null;
    }

    if (body.TAREA_MANTENCION !== undefined) {
      fields.push('TAREA_MANTENCION');
      values.push('@TAREA_MANTENCION');
      params.TAREA_MANTENCION = body.TAREA_MANTENCION || null;
    }

    if (body.FRECUENCIA_TAREA !== undefined) {
      fields.push('FRECUENCIA_TAREA');
      values.push('@FRECUENCIA_TAREA');
      params.FRECUENCIA_TAREA = body.FRECUENCIA_TAREA || null;
    }

    if (body.UNIDAD_FRECUENCIA !== undefined) {
      fields.push('UNIDAD_FRECUENCIA');
      values.push('@UNIDAD_FRECUENCIA');
      params.UNIDAD_FRECUENCIA = body.UNIDAD_FRECUENCIA || null;
    }

    if (body.DURACION_TAREA !== undefined) {
      fields.push('DURACION_TAREA');
      values.push('@DURACION_TAREA');
      params.DURACION_TAREA = body.DURACION_TAREA || null;
    }

    if (body.CANTIDAD_RECURSOS !== undefined) {
      fields.push('CANTIDAD_RECURSOS');
      values.push('@CANTIDAD_RECURSOS');
      params.CANTIDAD_RECURSOS = body.CANTIDAD_RECURSOS || null;
    }

    if (body.ID_CONDICION_ACCESO !== undefined) {
      fields.push('ID_CONDICION_ACCESO');
      values.push('@ID_CONDICION_ACCESO');
      params.ID_CONDICION_ACCESO = body.ID_CONDICION_ACCESO || null;
    }

    if (body.ID_DISCIPLINA_TAREA !== undefined) {
      fields.push('ID_DISCIPLINA_TAREA');
      values.push('@ID_DISCIPLINA_TAREA');
      params.ID_DISCIPLINA_TAREA = body.ID_DISCIPLINA_TAREA || null;
    }

    const sqlQuery = `
      INSERT INTO [ACTIVIDAD_NIVEL] (${fields.join(', ')})
      OUTPUT INSERTED.*
      VALUES (${values.join(', ')})`;

    const result = await query<ActividadNivel>(sqlQuery, params);

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Actividad de nivel creada exitosamente',
    }, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/actividad-nivel:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear actividad de nivel',
    }, { status: 500 });
  }
}
