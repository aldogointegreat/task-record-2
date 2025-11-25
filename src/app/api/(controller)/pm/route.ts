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
    const nuevoPM = result[0];

    // Si se seleccionó una PLT, crear registros en REP_NIVEL para los hijos de la plantilla
    if (body.PLT !== null && body.PLT !== undefined) {
      try {
        // Obtener todos los hijos de la PLT (niveles donde IDNP = PLT)
        const hijosPLT = await query<{
          IDN: number;
          IDJ: number;
          IDNP: number | null;
          NOMBRE: string;
        }>(
          'SELECT IDN, IDJ, IDNP, NOMBRE FROM [NIVEL] WHERE IDNP = @PLT',
          { PLT: body.PLT }
        );

        // Insertar cada hijo en REP_NIVEL
        if (hijosPLT.length > 0) {
          for (const hijo of hijosPLT) {
            // IDNP debería ser igual a PLT ya que son hijos directos
            const idnp = hijo.IDNP ?? body.PLT;
            
            // Insertar en REP_NIVEL y obtener el IDRN generado
            const repNivelResult = await query<{ IDRN: number }>(
              `INSERT INTO [REP_NIVEL] (IDPM, IDN, IDJ, IDNP, DESCRIPCION)
               OUTPUT INSERTED.IDRN
               VALUES (@IDPM, @IDN, @IDJ, @IDNP, @DESCRIPCION)`,
              {
                IDPM: nuevoPM.IDPM,
                IDN: hijo.IDN,
                IDJ: hijo.IDJ,
                IDNP: idnp,
                DESCRIPCION: hijo.NOMBRE,
              }
            );
            
            const idrn = repNivelResult[0]?.IDRN;
            
            if (idrn) {
              // Buscar todas las actividades del nivel en ACTIVIDAD_NIVEL donde IDT es NULL
              const actividadesNivel = await query<{
                ORDEN: number;
                DESCRIPCION: string;
              }>(
                'SELECT ORDEN, DESCRIPCION FROM [ACTIVIDAD_NIVEL] WHERE IDN = @IDN AND IDT IS NULL ORDER BY ORDEN',
                { IDN: hijo.IDN }
              );
              
              // Crear un registro en REP_ACTIVIDAD por cada actividad encontrada
              for (const actividad of actividadesNivel) {
                await query(
                  `INSERT INTO [REP_ACTIVIDAD] (IDRN, ORDEN, DESCRIPCION, REFERENCIA, DURACION)
                   VALUES (@IDRN, @ORDEN, @DESCRIPCION, @REFERENCIA, @DURACION)`,
                  {
                    IDRN: idrn,
                    ORDEN: actividad.ORDEN,
                    DESCRIPCION: actividad.DESCRIPCION,
                    REFERENCIA: '-', // Valor dummy
                    DURACION: 1, // Valor dummy
                  }
                );
              }
            }
          }
        }
      } catch (repNivelError) {
        console.error('Error al crear registros en REP_NIVEL:', repNivelError);
        // No fallar la creación del PM si hay error en REP_NIVEL, solo loguear
      }
    }

    return NextResponse.json({
      success: true,
      data: nuevoPM,
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

