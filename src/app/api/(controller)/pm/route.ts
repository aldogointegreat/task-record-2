import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { PM, CreatePMDTO, PMFilters } from '@/models';

/**
 * GET /api/pm
 * Obtiene todos los registros PM con filtros opcionales
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: PMFilters = {};

    // Construir filtros desde query params
    if (searchParams.has('IDN')) {
      const idN = searchParams.get('IDN');
      if (idN) filters.IDN = parseInt(idN);
    }
    if (searchParams.has('NRO')) {
      const nro = searchParams.get('NRO');
      if (nro) filters.NRO = parseInt(nro);
    }
    if (searchParams.has('CONJUNTO')) {
      const conjunto = searchParams.get('CONJUNTO');
      if (conjunto) filters.CONJUNTO = parseInt(conjunto);
    }
    if (searchParams.has('ESTADO')) {
      filters.ESTADO = searchParams.get('ESTADO') || undefined;
    }

    // Construir condiciones WHERE
    let whereClause = 'WHERE 1=1';
    const params: Record<string, unknown> = {};

    if (filters.IDN !== undefined) {
      whereClause += ' AND IDN = @IDN';
      params.IDN = filters.IDN;
    }
    if (filters.NRO !== undefined) {
      whereClause += ' AND NRO = @NRO';
      params.NRO = filters.NRO;
    }
    if (filters.CONJUNTO !== undefined) {
      whereClause += ' AND CONJUNTO = @CONJUNTO';
      params.CONJUNTO = filters.CONJUNTO;
    }
    if (filters.ESTADO) {
      whereClause += ' AND ESTADO = @ESTADO';
      params.ESTADO = filters.ESTADO;
    }

    // Ejecutar query
    const result = await query<PM>(
      `SELECT * FROM [PM] ${whereClause} ORDER BY IDPM ASC`,
      params
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: `Se encontraron ${result.length} registros PM`,
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/pm:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener registros PM',
    }, { status: 500 });
  }
}

/**
 * POST /api/pm
 * Crea un nuevo registro PM
 */
export async function POST(request: NextRequest) {
  let body: CreatePMDTO | null = null;
  try {
    body = await request.json() as CreatePMDTO;

    // Validar campos requeridos
    if (body.IDN === undefined || body.IDN === null) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo IDN es requerido',
      }, { status: 400 });
    }
    if (body.NRO === undefined || body.NRO === null) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo NRO es requerido',
      }, { status: 400 });
    }
    if (body.CONJUNTO === undefined || body.CONJUNTO === null) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo CONJUNTO es requerido',
      }, { status: 400 });
    }
    if (!body.PROGRAMACION) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo PROGRAMACION es requerido',
      }, { status: 400 });
    }
    if (!body.ESTADO) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo ESTADO es requerido',
      }, { status: 400 });
    }
    if (!body.INICIO) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo INICIO es requerido',
      }, { status: 400 });
    }
    if (!body.FIN) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo FIN es requerido',
      }, { status: 400 });
    }

    // Construir query
    const sqlQuery = `
      INSERT INTO [PM] (IDN, NRO, CONJUNTO, PLT, PROGRAMACION, ESTADO, HOROMETRO, INICIO, FIN)
      OUTPUT INSERTED.*
      VALUES (@IDN, @NRO, @CONJUNTO, @PLT, @PROGRAMACION, @ESTADO, @HOROMETRO, @INICIO, @FIN)`;

    const params: Record<string, unknown> = {
      IDN: body.IDN,
      NRO: body.NRO,
      CONJUNTO: body.CONJUNTO,
      PLT: body.PLT ?? null,
      PROGRAMACION: body.PROGRAMACION,
      ESTADO: body.ESTADO,
      HOROMETRO: body.HOROMETRO ?? 0,
      INICIO: body.INICIO,
      FIN: body.FIN,
    };

    const result = await query<PM>(sqlQuery, params);

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Registro PM creado exitosamente',
    }, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/pm:', error);
    
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear registro PM',
    }, { status: 500 });
  }
}

