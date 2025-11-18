import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { ActividadNivel, CreateActividadNivelDTO, ActividadNivelFilters } from '@/models';

/**
 * GET /api/actividad-nivel
 * Obtiene todas las actividades de nivel con filtros opcionales
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: ActividadNivelFilters = {};

    if (searchParams.has('IDN')) {
      const idn = searchParams.get('IDN');
      if (idn) filters.IDN = parseInt(idn);
    }
    if (searchParams.has('IDT')) {
      const idt = searchParams.get('IDT');
      if (idt) filters.IDT = parseInt(idt);
    }
    if (searchParams.has('DESCRIPCION')) {
      filters.DESCRIPCION = searchParams.get('DESCRIPCION') || undefined;
    }

    let whereClause = 'WHERE 1=1';
    const params: Record<string, unknown> = {};

    if (filters.IDN !== undefined) {
      whereClause += ' AND IDN = @IDN';
      params.IDN = filters.IDN;
    }
    if (filters.IDT !== undefined) {
      whereClause += ' AND IDT = @IDT';
      params.IDT = filters.IDT;
    }
    if (filters.DESCRIPCION) {
      whereClause += ' AND DESCRIPCION LIKE @DESCRIPCION';
      params.DESCRIPCION = `%${filters.DESCRIPCION}%`;
    }

    const result = await query<ActividadNivel>(
      `SELECT * FROM [ACTIVIDAD_NIVEL] ${whereClause} ORDER BY IDN ASC, ORDEN ASC`,
      params
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: `Se encontraron ${result.length} actividades`,
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/actividad-nivel:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener actividades',
    }, { status: 500 });
  }
}


