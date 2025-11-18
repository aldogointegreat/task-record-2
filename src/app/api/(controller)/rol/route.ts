import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Rol, CreateRolDTO, RolFilters } from '@/models';

/**
 * GET /api/rol
 * Obtiene todos los roles con filtros opcionales
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: RolFilters = {};

    // Construir filtros desde query params
    if (searchParams.has('NOMBRE')) {
      filters.NOMBRE = searchParams.get('NOMBRE') || undefined;
    }
    if (searchParams.has('ADMINISTRADOR')) {
      filters.ADMINISTRADOR = searchParams.get('ADMINISTRADOR') === 'true';
    }

    // Construir condiciones WHERE
    let whereClause = 'WHERE 1=1';
    const params: Record<string, unknown> = {};

    if (filters.NOMBRE) {
      whereClause += ' AND NOMBRE LIKE @NOMBRE';
      params.NOMBRE = `%${filters.NOMBRE}%`;
    }
    if (filters.ADMINISTRADOR !== undefined) {
      whereClause += ' AND ADMINISTRADOR = @ADMINISTRADOR';
      params.ADMINISTRADOR = filters.ADMINISTRADOR ? 1 : 0;
    }

    // Ejecutar query
    const result = await query<Rol>(
      `SELECT * FROM [ROL] ${whereClause} ORDER BY ID_ROL ASC`,
      params
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: `Se encontraron ${result.length} roles`,
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/rol:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener roles',
    }, { status: 500 });
  }
}

/**
 * POST /api/rol
 * Crea un nuevo rol
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateRolDTO = await request.json();

    // Validar campos requeridos
    if (!body.NOMBRE) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo NOMBRE es requerido',
      }, { status: 400 });
    }
    if (body.ADMINISTRADOR === undefined) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo ADMINISTRADOR es requerido',
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
    if (body.ADMINISTRADOR !== undefined) {
      fields.push('ADMINISTRADOR');
      values.push('@ADMINISTRADOR');
      params.ADMINISTRADOR = body.ADMINISTRADOR ? 1 : 0;
    }

    const sqlQuery = `
      INSERT INTO [ROL] (${fields.join(', ')})
      OUTPUT INSERTED.*
      VALUES (${values.join(', ')})`;

    const result = await query<Rol>(sqlQuery, params);

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Rol creado exitosamente',
    }, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/rol:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear rol',
    }, { status: 500 });
  }
}

