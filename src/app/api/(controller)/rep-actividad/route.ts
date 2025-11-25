import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { REPActividad, CreateREPActividadDTO, REPActividadFilters } from '@/models';

/**
 * GET /api/rep-actividad
 * Obtiene todos los registros REP_ACTIVIDAD con filtros opcionales
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: REPActividadFilters = {};

    // Construir filtros desde query params
    if (searchParams.has('IDRN')) {
      const idrn = searchParams.get('IDRN');
      if (idrn) filters.IDRN = parseInt(idrn);
    }
    if (searchParams.has('ORDEN')) {
      const orden = searchParams.get('ORDEN');
      if (orden) filters.ORDEN = parseInt(orden);
    }

    // Construir condiciones WHERE
    let whereClause = 'WHERE 1=1';
    const params: Record<string, unknown> = {};

    if (filters.IDRN !== undefined) {
      whereClause += ' AND IDRN = @IDRN';
      params.IDRN = filters.IDRN;
    }
    if (filters.ORDEN !== undefined) {
      whereClause += ' AND ORDEN = @ORDEN';
      params.ORDEN = filters.ORDEN;
    }

    // Ejecutar query
    const result = await query<REPActividad>(
      `SELECT * FROM [REP_ACTIVIDAD] ${whereClause} ORDER BY IDRA ASC`,
      params
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: `Se encontraron ${result.length} registros REP_ACTIVIDAD`,
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/rep-actividad:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener registros REP_ACTIVIDAD',
    }, { status: 500 });
  }
}

/**
 * POST /api/rep-actividad
 * Crea un nuevo registro REP_ACTIVIDAD
 */
export async function POST(request: NextRequest) {
  let body: CreateREPActividadDTO | null = null;
  try {
    body = await request.json() as CreateREPActividadDTO;

    // Validar campos requeridos
    if (!body.IDRN || body.ORDEN === undefined || !body.DESCRIPCION || !body.REFERENCIA || body.DURACION === undefined) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Faltan campos requeridos: IDRN, ORDEN, DESCRIPCION, REFERENCIA, DURACION',
      }, { status: 400 });
    }

    const sqlQuery = `
      INSERT INTO [REP_ACTIVIDAD] (IDRN, ORDEN, DESCRIPCION, REFERENCIA, DURACION)
      OUTPUT INSERTED.*
      VALUES (@IDRN, @ORDEN, @DESCRIPCION, @REFERENCIA, @DURACION)`;

    const params: Record<string, unknown> = {
      IDRN: body.IDRN,
      ORDEN: body.ORDEN,
      DESCRIPCION: body.DESCRIPCION,
      REFERENCIA: body.REFERENCIA,
      DURACION: body.DURACION,
    };

    const result = await query<REPActividad>(sqlQuery, params);
    const nuevoREPActividad = result[0];

    return NextResponse.json({
      success: true,
      data: nuevoREPActividad,
      message: 'Registro REP_ACTIVIDAD creado exitosamente',
    }, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/rep-actividad:', error);
    
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear registro REP_ACTIVIDAD',
    }, { status: 500 });
  }
}

