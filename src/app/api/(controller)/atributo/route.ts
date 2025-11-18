import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Atributo, CreateAtributoDTO, AtributoFilters } from '@/models';

/**
 * GET /api/atributo
 * Obtiene todos los atributos con filtros opcionales
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: AtributoFilters = {};

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
    const result = await query<Atributo>(
      `SELECT * FROM [ATRIBUTO] ${whereClause} ORDER BY IDT ASC`,
      params
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: `Se encontraron ${result.length} atributos`,
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/atributo:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener atributos',
    }, { status: 500 });
  }
}

/**
 * POST /api/atributo
 * Crea un nuevo atributo
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateAtributoDTO = await request.json();

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
      INSERT INTO [ATRIBUTO] (${fields.join(', ')})
      OUTPUT INSERTED.*
      VALUES (${values.join(', ')})`;

    const result = await query<Atributo>(sqlQuery, params);

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Atributo creado exitosamente',
    }, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/atributo:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear atributo',
    }, { status: 500 });
  }
}

