import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { REPNivel, CreateREPNivelDTO, REPNivelFilters } from '@/models';

/**
 * GET /api/rep-nivel
 * Obtiene todos los registros REP_NIVEL con filtros opcionales
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: REPNivelFilters = {};

    // Construir filtros desde query params
    if (searchParams.has('IDPM')) {
      const idpm = searchParams.get('IDPM');
      if (idpm) filters.IDPM = parseInt(idpm);
    }
    if (searchParams.has('IDN')) {
      const idN = searchParams.get('IDN');
      if (idN) filters.IDN = parseInt(idN);
    }
    if (searchParams.has('IDJ')) {
      const idJ = searchParams.get('IDJ');
      if (idJ) filters.IDJ = parseInt(idJ);
    }
    if (searchParams.has('IDNP')) {
      const idnp = searchParams.get('IDNP');
      if (idnp) filters.IDNP = parseInt(idnp);
    }

    // Construir condiciones WHERE
    let whereClause = 'WHERE 1=1';
    const params: Record<string, unknown> = {};

    if (filters.IDPM !== undefined) {
      whereClause += ' AND IDPM = @IDPM';
      params.IDPM = filters.IDPM;
    }
    if (filters.IDN !== undefined) {
      whereClause += ' AND IDN = @IDN';
      params.IDN = filters.IDN;
    }
    if (filters.IDJ !== undefined) {
      whereClause += ' AND IDJ = @IDJ';
      params.IDJ = filters.IDJ;
    }
    if (filters.IDNP !== undefined) {
      whereClause += ' AND IDNP = @IDNP';
      params.IDNP = filters.IDNP;
    }

    // Ejecutar query
    const result = await query<REPNivel>(
      `SELECT * FROM [REP_NIVEL] ${whereClause} ORDER BY IDRN ASC`,
      params
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: `Se encontraron ${result.length} registros REP_NIVEL`,
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/rep-nivel:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener registros REP_NIVEL',
    }, { status: 500 });
  }
}

/**
 * POST /api/rep-nivel
 * Crea un nuevo registro REP_NIVEL
 */
export async function POST(request: NextRequest) {
  let body: CreateREPNivelDTO | null = null;
  try {
    body = await request.json() as CreateREPNivelDTO;

    // Validar campos requeridos
    if (!body.IDPM || !body.IDN || !body.IDJ || !body.DESCRIPCION) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Faltan campos requeridos: IDPM, IDN, IDJ, DESCRIPCION',
      }, { status: 400 });
    }

    const sqlQuery = `
      INSERT INTO [REP_NIVEL] (IDPM, IDN, IDJ, IDNP, DESCRIPCION)
      OUTPUT INSERTED.*
      VALUES (@IDPM, @IDN, @IDJ, @IDNP, @DESCRIPCION)`;

    const params: Record<string, unknown> = {
      IDPM: body.IDPM,
      IDN: body.IDN,
      IDJ: body.IDJ,
      IDNP: body.IDNP ?? null,
      DESCRIPCION: body.DESCRIPCION,
    };

    const result = await query<REPNivel>(sqlQuery, params);
    const nuevoREPNivel = result[0];

    return NextResponse.json({
      success: true,
      data: nuevoREPNivel,
      message: 'Registro REP_NIVEL creado exitosamente',
    }, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/rep-nivel:', error);
    
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear registro REP_NIVEL',
    }, { status: 500 });
  }
}

