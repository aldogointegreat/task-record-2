import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { DisciplinaTarea, CreateDisciplinaTareaDTO, DisciplinaTareaFilters } from '@/models';

/**
 * GET /api/disciplina-tarea
 * Obtiene todas las disciplinas de tarea con filtros opcionales
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: DisciplinaTareaFilters = {};

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

    const result = await query<DisciplinaTarea>(
      `SELECT * FROM [DISCIPLINA_TAREA] ${whereClause} ORDER BY ID_DISCIPLINA_TAREA ASC`,
      params
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: `Se encontraron ${result.length} disciplinas de tarea`,
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/disciplina-tarea:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener disciplinas de tarea',
    }, { status: 500 });
  }
}

/**
 * POST /api/disciplina-tarea
 * Crea una nueva disciplina de tarea
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateDisciplinaTareaDTO = await request.json();

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
      INSERT INTO [DISCIPLINA_TAREA] (CODIGO, NOMBRE)
      OUTPUT INSERTED.*
      VALUES (@CODIGO, @NOMBRE)`;

    const result = await query<DisciplinaTarea>(sqlQuery, {
      CODIGO: body.CODIGO,
      NOMBRE: body.NOMBRE,
    });

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Disciplina de tarea creada exitosamente',
    }, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/disciplina-tarea:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear disciplina de tarea',
    }, { status: 500 });
  }
}

