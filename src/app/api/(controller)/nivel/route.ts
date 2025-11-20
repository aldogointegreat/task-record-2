import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Nivel, CreateNivelDTO, NivelFilters } from '@/models';

/**
 * GET /api/nivel
 * Obtiene todos los niveles con filtros opcionales
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: NivelFilters = {};

    // Construir filtros desde query params
    if (searchParams.has('NOMBRE')) {
      filters.NOMBRE = searchParams.get('NOMBRE') || undefined;
    }
    if (searchParams.has('IDJ')) {
      const idj = searchParams.get('IDJ');
      if (idj) filters.IDJ = parseInt(idj);
    }
    if (searchParams.has('IDNP')) {
      const idnp = searchParams.get('IDNP');
      if (idnp) filters.IDNP = parseInt(idnp);
    }
    if (searchParams.has('PLANTILLA')) {
      filters.PLANTILLA = searchParams.get('PLANTILLA') === 'true';
    }

    // Construir condiciones WHERE
    let whereClause = 'WHERE 1=1';
    const params: Record<string, unknown> = {};

    if (filters.NOMBRE) {
      whereClause += ' AND NOMBRE LIKE @NOMBRE';
      params.NOMBRE = `%${filters.NOMBRE}%`;
    }
    if (filters.IDJ !== undefined) {
      whereClause += ' AND IDJ = @IDJ';
      params.IDJ = filters.IDJ;
    }
    if (filters.IDNP !== undefined) {
      whereClause += ' AND IDNP = @IDNP';
      params.IDNP = filters.IDNP;
    }
    if (filters.PLANTILLA !== undefined) {
      whereClause += ' AND PLANTILLA = @PLANTILLA';
      params.PLANTILLA = filters.PLANTILLA ? 1 : 0;
    }

    // Ejecutar query
    const result = await query<Nivel>(
      `SELECT * FROM [NIVEL] ${whereClause} ORDER BY IDN ASC`,
      params
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: `Se encontraron ${result.length} niveles`,
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/nivel:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener niveles',
    }, { status: 500 });
  }
}

/**
 * POST /api/nivel
 * Crea un nuevo nivel
 */
export async function POST(request: NextRequest) {
  let body: CreateNivelDTO | null = null;
  try {
    body = await request.json() as CreateNivelDTO;

    // Validar campos requeridos
    if (!body.NOMBRE) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo NOMBRE es requerido',
      }, { status: 400 });
    }
    if (!body.IDJ) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo IDJ (Jerarquía) es requerido',
      }, { status: 400 });
    }

    // Construir query dinámica
    const fields: string[] = [];
    const values: string[] = [];
    const params: Record<string, unknown> = {};

    fields.push('IDJ');
    values.push('@IDJ');
    params.IDJ = body.IDJ;

    if (body.IDNP !== undefined) {
      fields.push('IDNP');
      values.push('@IDNP');
      params.IDNP = body.IDNP || null;
    }

    fields.push('NOMBRE');
    values.push('@NOMBRE');
    params.NOMBRE = body.NOMBRE;

    if (body.PLANTILLA !== undefined) {
      fields.push('PLANTILLA');
      values.push('@PLANTILLA');
      params.PLANTILLA = body.PLANTILLA ? 1 : 0;
    }

    if (body.NROPM !== undefined) {
      fields.push('NROPM');
      values.push('@NROPM');
      params.NROPM = body.NROPM;
    }

    if (body.ICONO !== undefined) {
      fields.push('ICONO');
      values.push('@ICONO');
      params.ICONO = body.ICONO;
    }

    if (body.GENERADO !== undefined) {
      fields.push('GENERADO');
      values.push('@GENERADO');
      params.GENERADO = body.GENERADO ? 1 : 0;
    }

    if (body.COMENTARIO !== undefined) {
      fields.push('COMENTARIO');
      values.push('@COMENTARIO');
      params.COMENTARIO = body.COMENTARIO || null;
    }

    if (body.ID_USR !== undefined) {
      fields.push('ID_USR');
      values.push('@ID_USR');
      params.ID_USR = body.ID_USR || null;
    }

    if (body.FECHA_CREACION !== undefined) {
      fields.push('FECHA_CREACION');
      values.push('@FECHA_CREACION');
      params.FECHA_CREACION = body.FECHA_CREACION || null;
    }

    const sqlQuery = `
      INSERT INTO [NIVEL] (${fields.join(', ')})
      OUTPUT INSERTED.*
      VALUES (${values.join(', ')})`;

    const result = await query<Nivel>(sqlQuery, params);

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Nivel creado exitosamente',
    }, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/nivel:', error);
    
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear nivel',
    }, { status: 500 });
  }
}

