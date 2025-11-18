import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Entrega, CreateEntregaDTO, EntregaFilters } from '@/models';

/**
 * GET /api/entrega
 * Obtiene todas las entregas con filtros opcionales
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: EntregaFilters = {};

    // Construir filtros desde query params
    if (searchParams.has('DESCRIPCION')) {
      filters.DESCRIPCION = searchParams.get('DESCRIPCION') || undefined;
    }
    if (searchParams.has('ORDEN')) {
      const orden = parseInt(searchParams.get('ORDEN') || '');
      if (!isNaN(orden)) {
        filters.ORDEN = orden;
      }
    }

    // Construir condiciones WHERE
    let whereClause = 'WHERE 1=1';
    const params: Record<string, unknown> = {};

    if (filters.DESCRIPCION) {
      whereClause += ' AND DESCRIPCION LIKE @DESCRIPCION';
      params.DESCRIPCION = `%${filters.DESCRIPCION}%`;
    }
    if (filters.ORDEN !== undefined) {
      whereClause += ' AND ORDEN = @ORDEN';
      params.ORDEN = filters.ORDEN;
    }

    // Ejecutar query
    const result = await query<Entrega>(
      `SELECT * FROM [ENTREGA] ${whereClause} ORDER BY ORDEN ASC`,
      params
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: `Se encontraron ${result.length} entregas`,
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/entrega:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener entregas',
    }, { status: 500 });
  }
}

/**
 * POST /api/entrega
 * Crea una nueva entrega
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateEntregaDTO = await request.json();

    // Validar campos requeridos
    if (!body.DESCRIPCION) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo DESCRIPCION es requerido',
      }, { status: 400 });
    }
    if (body.ORDEN === undefined) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo ORDEN es requerido',
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
    if (body.ORDEN !== undefined) {
      fields.push('ORDEN');
      values.push('@ORDEN');
      params.ORDEN = body.ORDEN;
    }

    const sqlQuery = `
      INSERT INTO [ENTREGA] (${fields.join(', ')})
      OUTPUT INSERTED.*
      VALUES (${values.join(', ')})`;

    const result = await query<Entrega>(sqlQuery, params);

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Entrega creada exitosamente',
    }, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/entrega:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear entrega',
    }, { status: 500 });
  }
}

