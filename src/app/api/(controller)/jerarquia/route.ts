import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Jerarquia, CreateJerarquiaDTO, JerarquiaFilters } from '@/models';

/**
 * GET /api/jerarquia
 * Obtiene todas las jerarquías con filtros opcionales
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: JerarquiaFilters = {};

    // Construir filtros desde query params
    if (searchParams.has('DESCRIPCION')) {
      filters.DESCRIPCION = searchParams.get('DESCRIPCION') || undefined;
    }

    // Construir condiciones WHERE
    let whereClause = 'WHERE 1=1';
    const params: Record<string, unknown> = {};

    if (filters.DESCRIPCION) {
      whereClause += ' AND DESCRIPCION LIKE @DESCRIPCION';
      params.DESCRIPCION = `%${filters.DESCRIPCION}%`;
    }

    // Ejecutar query
    const result = await query<Jerarquia>(
      `SELECT * FROM [JERARQUIA] ${whereClause} ORDER BY IDJ ASC`,
      params
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: `Se encontraron ${result.length} jerarquías`,
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/jerarquia:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener jerarquías',
    }, { status: 500 });
  }
}

/**
 * POST /api/jerarquia
 * Crea una nueva jerarquía
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateJerarquiaDTO = await request.json();

    // Validar campos requeridos
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

    if (body.DESCRIPCION !== undefined) {
      fields.push('DESCRIPCION');
      values.push('@DESCRIPCION');
      params.DESCRIPCION = body.DESCRIPCION;
    }

    const sqlQuery = `
      INSERT INTO [JERARQUIA] (${fields.join(', ')})
      OUTPUT INSERTED.*
      VALUES (${values.join(', ')})`;

    const result = await query<Jerarquia>(sqlQuery, params);

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Jerarquía creada exitosamente',
    }, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/jerarquia:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear jerarquía',
    }, { status: 500 });
  }
}

