import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { ClaseMantencion, CreateClaseMantencionDTO, ClaseMantencionFilters } from '@/models';

/**
 * GET /api/clase-mantencion
 * Obtiene todas las clases de mantención con filtros opcionales
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: ClaseMantencionFilters = {};

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

    const result = await query<ClaseMantencion>(
      `SELECT * FROM [CLASE_MANTENCION] ${whereClause} ORDER BY ID_CLASE ASC`,
      params
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: `Se encontraron ${result.length} clases de mantención`,
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/clase-mantencion:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener clases de mantención',
    }, { status: 500 });
  }
}

/**
 * POST /api/clase-mantencion
 * Crea una nueva clase de mantención
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateClaseMantencionDTO = await request.json();

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
      INSERT INTO [CLASE_MANTENCION] (CODIGO, NOMBRE)
      OUTPUT INSERTED.*
      VALUES (@CODIGO, @NOMBRE)`;

    const result = await query<ClaseMantencion>(sqlQuery, {
      CODIGO: body.CODIGO,
      NOMBRE: body.NOMBRE,
    });

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Clase de mantención creada exitosamente',
    }, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/clase-mantencion:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear clase de mantención',
    }, { status: 500 });
  }
}

