import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { AtributoValor, CreateAtributoValorDTO, AtributoValorFilters } from '@/models';

/**
 * GET /api/atributo-valor
 * Obtiene todos los valores de atributo con filtros opcionales
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: AtributoValorFilters = {};

    // Construir filtros desde query params
    if (searchParams.has('IDA')) {
      filters.IDA = parseInt(searchParams.get('IDA') || '0');
    }
    if (searchParams.has('VALOR')) {
      filters.VALOR = searchParams.get('VALOR') || undefined;
    }

    // Construir condiciones WHERE
    let whereClause = 'WHERE 1=1';
    const params: Record<string, unknown> = {};

    if (filters.IDA !== undefined) {
      whereClause += ' AND IDA = @IDA';
      params.IDA = filters.IDA;
    }

    if (filters.VALOR) {
      whereClause += ' AND VALOR LIKE @VALOR';
      params.VALOR = `%${filters.VALOR}%`;
    }

    // Ejecutar query
    const result = await query<AtributoValor>(
      `SELECT * FROM [ATRIBUTO_VALOR] ${whereClause} ORDER BY IDAV ASC`,
      params
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: `Se encontraron ${result.length} valores de atributo`,
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/atributo-valor:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener valores de atributo',
    }, { status: 500 });
  }
}

/**
 * POST /api/atributo-valor
 * Crea un nuevo valor de atributo
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateAtributoValorDTO = await request.json();

    // Validar campos requeridos
    if (!body.IDA) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo IDA es requerido',
      }, { status: 400 });
    }

    if (!body.VALOR) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo VALOR es requerido',
      }, { status: 400 });
    }

    // Construir query dinámica
    const fields: string[] = [];
    const values: string[] = [];
    const params: Record<string, unknown> = {};

    if (body.IDA !== undefined) {
      fields.push('IDA');
      values.push('@IDA');
      params.IDA = body.IDA;
    }

    if (body.VALOR !== undefined) {
      fields.push('VALOR');
      values.push('@VALOR');
      params.VALOR = body.VALOR;
    }

    const sqlQuery = `
      INSERT INTO [ATRIBUTO_VALOR] (${fields.join(', ')})
      OUTPUT INSERTED.*
      VALUES (${values.join(', ')})`;

    const result = await query<AtributoValor>(sqlQuery, params);

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Valor de atributo creado exitosamente',
    }, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/atributo-valor:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear valor de atributo',
    }, { status: 500 });
  }
}

