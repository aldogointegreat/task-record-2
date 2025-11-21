import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { ConsecuenciaFalla, CreateConsecuenciaFallaDTO, ConsecuenciaFallaFilters } from '@/models';

/**
 * GET /api/consecuencia-falla
 * Obtiene todas las consecuencias de falla con filtros opcionales
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: ConsecuenciaFallaFilters = {};

    // Construir filtros desde query params
    if (searchParams.has('CODIGO')) {
      filters.CODIGO = searchParams.get('CODIGO') || undefined;
    }
    if (searchParams.has('NOMBRE')) {
      filters.NOMBRE = searchParams.get('NOMBRE') || undefined;
    }

    // Construir condiciones WHERE
    let whereClause = 'WHERE 1=1';
    const params: Record<string, unknown> = {};

    if (filters.CODIGO) {
      whereClause += ' AND CODIGO LIKE @CODIGO';
      params.CODIGO = `%${filters.CODIGO}%`;
    }

    if (filters.NOMBRE) {
      whereClause += ' AND NOMBRE LIKE @NOMBRE';
      params.NOMBRE = `%${filters.NOMBRE}%`;
    }

    // Ejecutar query
    const result = await query<ConsecuenciaFalla>(
      `SELECT * FROM [CONSECUENCIA_FALLA] ${whereClause} ORDER BY ID_CONSECUENCIA ASC`,
      params
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: `Se encontraron ${result.length} consecuencias de falla`,
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/consecuencia-falla:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener consecuencias de falla',
    }, { status: 500 });
  }
}

/**
 * POST /api/consecuencia-falla
 * Crea una nueva consecuencia de falla
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateConsecuenciaFallaDTO = await request.json();

    // Validar campos requeridos
    if (!body.CODIGO) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo CODIGO es requerido',
      }, { status: 400 });
    }

    if (!body.NOMBRE) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo NOMBRE es requerido',
      }, { status: 400 });
    }

    const sqlQuery = `
      INSERT INTO [CONSECUENCIA_FALLA] (CODIGO, NOMBRE)
      OUTPUT INSERTED.*
      VALUES (@CODIGO, @NOMBRE)`;

    const result = await query<ConsecuenciaFalla>(sqlQuery, {
      CODIGO: body.CODIGO,
      NOMBRE: body.NOMBRE,
    });

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Consecuencia de falla creada exitosamente',
    }, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/consecuencia-falla:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear consecuencia de falla',
    }, { status: 500 });
  }
}

