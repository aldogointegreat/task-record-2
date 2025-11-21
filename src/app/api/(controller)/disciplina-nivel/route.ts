import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { DisciplinaNivel, CreateDisciplinaNivelDTO, DisciplinaNivelFilters } from '@/models';

/**
 * GET /api/disciplina-nivel
 * Listar disciplinas de nivel con filtros opcionales
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: DisciplinaNivelFilters = {};

    if (searchParams.has('CODIGO')) {
      filters.CODIGO = searchParams.get('CODIGO') || undefined;
    }
    if (searchParams.has('DESCRIPCION')) {
      filters.DESCRIPCION = searchParams.get('DESCRIPCION') || undefined;
    }

    let whereClause = 'WHERE 1=1';
    const params: Record<string, unknown> = {};

    if (filters.CODIGO) {
      whereClause += ' AND CODIGO LIKE @CODIGO';
      params.CODIGO = `%${filters.CODIGO}%`;
    }

    if (filters.DESCRIPCION) {
      whereClause += ' AND DESCRIPCION LIKE @DESCRIPCION';
      params.DESCRIPCION = `%${filters.DESCRIPCION}%`;
    }

    const result = await query<DisciplinaNivel>(
      `SELECT * FROM [DISCIPLINA_NIVEL] ${whereClause} ORDER BY ID_DISCIPLINA_NIVEL ASC`,
      params
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: `Se encontraron ${result.length} disciplinas de nivel`,
    }, { status: 200 });
  } catch (error) {
    console.error('Error en GET /api/disciplina-nivel:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener disciplinas de nivel',
    }, { status: 500 });
  }
}

/**
 * POST /api/disciplina-nivel
 * Crear una nueva disciplina de nivel
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateDisciplinaNivelDTO = await request.json();

    if (!body.CODIGO) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo CODIGO es requerido',
      }, { status: 400 });
    }

    if (!body.DESCRIPCION) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo DESCRIPCION es requerido',
      }, { status: 400 });
    }

    const sqlQuery = `
      INSERT INTO [DISCIPLINA_NIVEL] (CODIGO, DESCRIPCION)
      OUTPUT INSERTED.*
      VALUES (@CODIGO, @DESCRIPCION)`;

    const result = await query<DisciplinaNivel>(sqlQuery, {
      CODIGO: body.CODIGO,
      DESCRIPCION: body.DESCRIPCION,
    });

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Disciplina de nivel creada exitosamente',
    }, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/disciplina-nivel:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear disciplina de nivel',
    }, { status: 500 });
  }
}


