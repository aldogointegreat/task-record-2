import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Disciplina, CreateDisciplinaDTO, DisciplinaFilters } from '@/models';

/**
 * GET /api/disciplina
 * Obtiene todas las disciplinas con filtros opcionales
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: DisciplinaFilters = {};

    // Construir filtros desde query params
    if (searchParams.has('NOMBRE')) {
      filters.NOMBRE = searchParams.get('NOMBRE') || undefined;
    }

    // Construir condiciones WHERE
    let whereClause = 'WHERE 1=1';
    const params: Record<string, unknown> = {};

    if (filters.NOMBRE) {
      whereClause += ' AND NOMBRE LIKE @NOMBRE';
      params.NOMBRE = `%${filters.NOMBRE}%`;
    }

    // Ejecutar query
    const result = await query<Disciplina>(
      `SELECT * FROM [DISCIPLINA] ${whereClause} ORDER BY ID_DIS ASC`,
      params
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: `Se encontraron ${result.length} disciplinas`,
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/disciplina:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener disciplinas',
    }, { status: 500 });
  }
}

/**
 * POST /api/disciplina
 * Crea una nueva disciplina
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateDisciplinaDTO = await request.json();

    // Validar campos requeridos
    if (!body.NOMBRE) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo NOMBRE es requerido',
      }, { status: 400 });
    }

    // Construir query dinámica
    const fields: string[] = [];
    const values: string[] = [];
    const params: Record<string, unknown> = {};

    if (body.NOMBRE !== undefined) {
      fields.push('NOMBRE');
      values.push('@NOMBRE');
      params.NOMBRE = body.NOMBRE;
    }

    const sqlQuery = `
      INSERT INTO [DISCIPLINA] (${fields.join(', ')})
      OUTPUT INSERTED.*
      VALUES (${values.join(', ')})`;

    const result = await query<Disciplina>(sqlQuery, params);

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Disciplina creada exitosamente',
    }, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/disciplina:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear disciplina',
    }, { status: 500 });
  }
}

