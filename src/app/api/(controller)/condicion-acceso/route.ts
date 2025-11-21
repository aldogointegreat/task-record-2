import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { CondicionAcceso, CreateCondicionAccesoDTO, CondicionAccesoFilters } from '@/models';

/**
 * GET /api/condicion-acceso
 * Obtiene todas las condiciones de acceso con filtros opcionales
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: CondicionAccesoFilters = {};

    if (searchParams.has('CODIGO')) {
      filters.CODIGO = searchParams.get('CODIGO') || undefined;
    }
    if (searchParams.has('NOMBRE')) {
      filters.NOMBRE = searchParams.get('NOMBRE') || undefined;
    }

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

    const result = await query<CondicionAcceso>(
      `SELECT * FROM [CONDICION_ACCESO] ${whereClause} ORDER BY ID_CONDICION ASC`,
      params
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: `Se encontraron ${result.length} condiciones de acceso`,
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/condicion-acceso:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener condiciones de acceso',
    }, { status: 500 });
  }
}

/**
 * POST /api/condicion-acceso
 * Crea una nueva condición de acceso
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateCondicionAccesoDTO = await request.json();

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
      INSERT INTO [CONDICION_ACCESO] (CODIGO, NOMBRE)
      OUTPUT INSERTED.*
      VALUES (@CODIGO, @NOMBRE)`;

    const result = await query<CondicionAcceso>(sqlQuery, {
      CODIGO: body.CODIGO,
      NOMBRE: body.NOMBRE,
    });

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Condición de acceso creada exitosamente',
    }, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/condicion-acceso:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear condición de acceso',
    }, { status: 500 });
  }
}

