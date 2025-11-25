import { NextRequest, NextResponse } from 'next/server';
import { query, getConnection } from '@/lib/db';
import sql from 'mssql';
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

    // Obtener el último IDPM de manera eficiente
    const maxIDPMResult = await query<{ maxIDPM: number }>(
      'SELECT ISNULL(MAX(IDPM), 0) as maxIDPM FROM [PM]'
    );
    const maxIDPM = maxIDPMResult[0]?.maxIDPM ?? 0;
    const nuevoIDPM = maxIDPM + 1;

    // Usar una transacción y ejecutar todo en un solo batch para IDENTITY_INSERT
    const connection = await getConnection();
    const transaction = new sql.Transaction(connection);
    
    try {
      await transaction.begin();
      const request = new sql.Request(transaction);
      
      // Preparar parámetros
      request.input('IDPM', nuevoIDPM);
      request.input('IDN', body.IDN);
      request.input('NRO', body.NRO);
      request.input('CONJUNTO', body.CONJUNTO);
      request.input('PLT', body.PLT ?? null);
      request.input('PROGRAMACION', body.PROGRAMACION);
      request.input('ESTADO', body.ESTADO);
      request.input('HOROMETRO', body.HOROMETRO ?? 0);
      request.input('INICIO', body.INICIO);
      request.input('FIN', body.FIN);
      
      // Ejecutar todo en un solo batch: activar IDENTITY_INSERT, insertar, y desactivar
      const insertResult = await request.query(`
        SET IDENTITY_INSERT [PM] ON;
        INSERT INTO [PM] (IDPM, IDN, NRO, CONJUNTO, PLT, PROGRAMACION, ESTADO, HOROMETRO, INICIO, FIN)
        OUTPUT INSERTED.*
        VALUES (@IDPM, @IDN, @NRO, @CONJUNTO, @PLT, @PROGRAMACION, @ESTADO, @HOROMETRO, @INICIO, @FIN);
        SET IDENTITY_INSERT [PM] OFF;
      `);
      
      await transaction.commit();
      
      // El resultado del INSERT está en el recordset (puede estar en recordsets si hay múltiples resultsets)
      let nuevoPM: PM;
      if (Array.isArray(insertResult.recordsets) && insertResult.recordsets.length > 1) {
        // Si hay múltiples resultsets, el INSERT está en el segundo
        nuevoPM = insertResult.recordsets[1][0] as PM;
      } else if (insertResult.recordset && insertResult.recordset.length > 0) {
        // Si hay un solo recordset, usar ese
        nuevoPM = insertResult.recordset[0] as PM;
      } else {
        throw new Error('No se pudo obtener el registro PM creado');
      }
      
      // Si se seleccionó una PLT, crear registros en REP_NIVEL para los hijos de la plantilla
      if (body.PLT !== null && body.PLT !== undefined) {
        try {
          // Obtener todos los hijos de la PLT (niveles donde IDNP = PLT) - fuera de transacción
          const hijosPLT = await query<{
            IDN: number;
            IDJ: number;
            IDNP: number | null;
            NOMBRE: string;
          }>(
            'SELECT IDN, IDJ, IDNP, NOMBRE FROM [NIVEL] WHERE IDNP = @PLT',
            { PLT: body.PLT }
          );

          // Obtener los máximos dentro de la transacción para evitar problemas de concurrencia
          const maxIDRNRequest = new sql.Request(transaction);
          const maxIDRNResult = await maxIDRNRequest.query<{ maxIDRN: number }>(
            'SELECT ISNULL(MAX(IDRN), 0) as maxIDRN FROM [REP_NIVEL]'
          );
          let currentIDRN = (maxIDRNResult.recordset[0] as { maxIDRN: number })?.maxIDRN ?? 0;

          const maxIDRARequest = new sql.Request(transaction);
          const maxIDRAResult = await maxIDRARequest.query<{ maxIDRA: number }>(
            'SELECT ISNULL(MAX(IDRA), 0) as maxIDRA FROM [REP_ACTIVIDAD]'
          );
          let currentIDRA = (maxIDRAResult.recordset[0] as { maxIDRA: number })?.maxIDRA ?? 0;

          // Insertar cada hijo en REP_NIVEL
          if (hijosPLT.length > 0) {
            for (const hijo of hijosPLT) {
              // IDNP debería ser igual a PLT ya que son hijos directos
              const idnp = hijo.IDNP ?? body.PLT;
              
              // Calcular el siguiente IDRN
              currentIDRN += 1;
              const nuevoIDRN = currentIDRN;
              
              // Insertar en REP_NIVEL con IDRN calculado usando IDENTITY_INSERT
              const repNivelRequest = new sql.Request(transaction);
              repNivelRequest.input('IDRN', nuevoIDRN);
              repNivelRequest.input('IDPM', nuevoPM.IDPM);
              repNivelRequest.input('IDN', hijo.IDN);
              repNivelRequest.input('IDJ', hijo.IDJ);
              repNivelRequest.input('IDNP', idnp);
              repNivelRequest.input('DESCRIPCION', hijo.NOMBRE);
              
              const repNivelResult = await repNivelRequest.query(`
                SET IDENTITY_INSERT [REP_NIVEL] ON;
                INSERT INTO [REP_NIVEL] (IDRN, IDPM, IDN, IDJ, IDNP, DESCRIPCION)
                OUTPUT INSERTED.IDRN
                VALUES (@IDRN, @IDPM, @IDN, @IDJ, @IDNP, @DESCRIPCION);
                SET IDENTITY_INSERT [REP_NIVEL] OFF;
              `);
              
              // Obtener el IDRN del resultado
              let idrn: number;
              if (Array.isArray(repNivelResult.recordsets) && repNivelResult.recordsets.length > 1) {
                idrn = repNivelResult.recordsets[1][0]?.IDRN || nuevoIDRN;
              } else if (repNivelResult.recordset && repNivelResult.recordset.length > 0) {
                idrn = repNivelResult.recordset[0]?.IDRN || nuevoIDRN;
              } else {
                idrn = nuevoIDRN;
              }
              
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
                  // Calcular el siguiente IDRA
                  currentIDRA += 1;
                  const nuevoIDRA = currentIDRA;
                  
                  // Insertar en REP_ACTIVIDAD con IDRA calculado usando IDENTITY_INSERT
                  const repActividadRequest = new sql.Request(transaction);
                  repActividadRequest.input('IDRA', nuevoIDRA);
                  repActividadRequest.input('IDRN', idrn);
                  repActividadRequest.input('ORDEN', actividad.ORDEN);
                  repActividadRequest.input('DESCRIPCION', actividad.DESCRIPCION);
                  repActividadRequest.input('REFERENCIA', '-');
                  repActividadRequest.input('DURACION', 1);
                  
                  await repActividadRequest.query(`
                    SET IDENTITY_INSERT [REP_ACTIVIDAD] ON;
                    INSERT INTO [REP_ACTIVIDAD] (IDRA, IDRN, ORDEN, DESCRIPCION, REFERENCIA, DURACION)
                    VALUES (@IDRA, @IDRN, @ORDEN, @DESCRIPCION, @REFERENCIA, @DURACION);
                    SET IDENTITY_INSERT [REP_ACTIVIDAD] OFF;
                  `);
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
      
    } catch (transactionError) {
      await transaction.rollback();
      throw transactionError;
    }

  } catch (error) {
    console.error('Error en POST /api/pm:', error);
    
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear registro PM',
    }, { status: 500 });
  }
}

