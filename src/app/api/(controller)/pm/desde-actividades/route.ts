import { NextRequest, NextResponse } from "next/server";
import { query, getConnection } from "@/lib/db";
import sql from "mssql";
import type { PM, CreatePMFromActividadesDTO } from "@/models";

/**
 * POST /api/pm/desde-actividades
 * Crea un nuevo registro PM desde actividades seleccionadas manualmente
 *
 * A diferencia del endpoint POST /api/pm que copia desde plantillas,
 * este endpoint toma actividades seleccionadas y construye la estructura
 * de REP_NIVEL y REP_ACTIVIDAD desde las actividades hacia arriba.
 */
export async function POST(request: NextRequest) {
  let body: CreatePMFromActividadesDTO | null = null;
  try {
    body = (await request.json()) as CreatePMFromActividadesDTO;

    // Validar campos requeridos
    if (body.IDN === undefined || body.IDN === null) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "El campo IDN es requerido",
        },
        { status: 400 }
      );
    }
    if (body.NRO === undefined || body.NRO === null) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "El campo NRO es requerido",
        },
        { status: 400 }
      );
    }
    if (body.CONJUNTO === undefined || body.CONJUNTO === null) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "El campo CONJUNTO es requerido",
        },
        { status: 400 }
      );
    }
    if (!body.PROGRAMACION) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "El campo PROGRAMACION es requerido",
        },
        { status: 400 }
      );
    }
    if (!body.ESTADO) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "El campo ESTADO es requerido",
        },
        { status: 400 }
      );
    }
    if (!body.INICIO) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "El campo INICIO es requerido",
        },
        { status: 400 }
      );
    }
    if (!body.FIN) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "El campo FIN es requerido",
        },
        { status: 400 }
      );
    }
    if (!body.actividadesIds || body.actividadesIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Debe seleccionar al menos una actividad",
        },
        { status: 400 }
      );
    }

    // Obtener el último IDPM de manera eficiente
    const maxIDPMResult = await query<{ maxIDPM: number }>(
      "SELECT ISNULL(MAX(IDPM), 0) as maxIDPM FROM [PM]"
    );
    const maxIDPM = maxIDPMResult[0]?.maxIDPM ?? 0;
    const nuevoIDPM = maxIDPM + 1;

    // Usar una transacción para asegurar atomicidad
    const connection = await getConnection();
    const transaction = new sql.Transaction(connection);

    try {
      await transaction.begin();
      const request = new sql.Request(transaction);

      // 1. Crear el registro PM
      request.input("IDPM", nuevoIDPM);
      request.input("IDN", body.IDN);
      request.input("NRO", body.NRO);
      request.input("CONJUNTO", body.CONJUNTO);
      request.input("PLT", body.PLT ?? null);
      request.input("PROGRAMACION", body.PROGRAMACION);
      request.input("ESTADO", body.ESTADO);
      request.input("HOROMETRO", body.HOROMETRO ?? 0);
      request.input("INICIO", body.INICIO);
      request.input("FIN", body.FIN);

      const insertPMResult = await request.query(`
        SET IDENTITY_INSERT [PM] ON;
        INSERT INTO [PM] (IDPM, IDN, NRO, CONJUNTO, PLT, PROGRAMACION, ESTADO, HOROMETRO, INICIO, FIN)
        OUTPUT INSERTED.*
        VALUES (@IDPM, @IDN, @NRO, @CONJUNTO, @PLT, @PROGRAMACION, @ESTADO, @HOROMETRO, @INICIO, @FIN);
        SET IDENTITY_INSERT [PM] OFF;
      `);

      let nuevoPM: PM;
      if (
        Array.isArray(insertPMResult.recordsets) &&
        insertPMResult.recordsets.length > 1
      ) {
        nuevoPM = insertPMResult.recordsets[1][0] as PM;
      } else if (
        insertPMResult.recordset &&
        insertPMResult.recordset.length > 0
      ) {
        nuevoPM = insertPMResult.recordset[0] as PM;
      } else {
        throw new Error("No se pudo obtener el registro PM creado");
      }

      // 2. Obtener información de actividades seleccionadas
      // Construir parámetros para query IN
      const actividadesIdsStr = body.actividadesIds.join(",");

      const actividadesRequest = new sql.Request(transaction);
      const actividadesResult = await actividadesRequest.query<{
        IDA: number;
        IDN: number;
        ORDEN: number;
        DESCRIPCION: string;
      }>(`
        SELECT IDA, IDN, ORDEN, DESCRIPCION
        FROM [ACTIVIDAD_NIVEL]
        WHERE IDA IN (${actividadesIdsStr})
        ORDER BY IDN, ORDEN
      `);
      const actividades = actividadesResult.recordset;

      if (actividades.length === 0) {
        throw new Error("No se encontraron las actividades seleccionadas");
      }

      // 3. Obtener niveles únicos de las actividades para crear REP_NIVEL
      const nivelesUnicos = [...new Set(actividades.map((a) => a.IDN))];

      // Obtener información completa de esos niveles
      const nivelesRequest = new sql.Request(transaction);
      const nivelesResult = await nivelesRequest.query<{
        IDN: number;
        IDJ: number;
        IDNP: number | null;
        NOMBRE: string;
      }>(`
        SELECT IDN, IDJ, IDNP, NOMBRE
        FROM [NIVEL]
        WHERE IDN IN (${nivelesUnicos.join(",")})
      `);
      const niveles = nivelesResult.recordset;

      // 4. Obtener los máximos de IDRN e IDRA
      const maxIDRNRequest = new sql.Request(transaction);
      const maxIDRNResult = await maxIDRNRequest.query<{ maxIDRN: number }>(
        "SELECT ISNULL(MAX(IDRN), 0) as maxIDRN FROM [REP_NIVEL]"
      );
      let currentIDRN =
        (maxIDRNResult.recordset[0] as { maxIDRN: number })?.maxIDRN ?? 0;

      const maxIDRARequest = new sql.Request(transaction);
      const maxIDRAResult = await maxIDRARequest.query<{ maxIDRA: number }>(
        "SELECT ISNULL(MAX(IDRA), 0) as maxIDRA FROM [REP_ACTIVIDAD]"
      );
      let currentIDRA =
        (maxIDRAResult.recordset[0] as { maxIDRA: number })?.maxIDRA ?? 0;

      // 5. Crear registros en REP_NIVEL para cada nivel único
      // Map para guardar IDN -> IDRN para usar al crear actividades
      const mapNivelToIDRN = new Map<number, number>();

      for (const nivel of niveles) {
        currentIDRN += 1;
        const nuevoIDRN = currentIDRN;

        const repNivelRequest = new sql.Request(transaction);
        repNivelRequest.input("IDRN", nuevoIDRN);
        repNivelRequest.input("IDPM", nuevoPM.IDPM);
        repNivelRequest.input("IDN", nivel.IDN);
        repNivelRequest.input("IDJ", nivel.IDJ);
        repNivelRequest.input("IDNP", nivel.IDNP ?? 0);
        repNivelRequest.input("DESCRIPCION", nivel.NOMBRE);

        await repNivelRequest.query(`
          SET IDENTITY_INSERT [REP_NIVEL] ON;
          INSERT INTO [REP_NIVEL] (IDRN, IDPM, IDN, IDJ, IDNP, DESCRIPCION)
          VALUES (@IDRN, @IDPM, @IDN, @IDJ, @IDNP, @DESCRIPCION);
          SET IDENTITY_INSERT [REP_NIVEL] OFF;
        `);

        mapNivelToIDRN.set(nivel.IDN, nuevoIDRN);
      }

      // 6. Crear registros en REP_ACTIVIDAD para cada actividad seleccionada
      for (const actividad of actividades) {
        const idrn = mapNivelToIDRN.get(actividad.IDN);
        if (!idrn) {
          throw new Error(`No se encontró IDRN para nivel ${actividad.IDN}`);
        }

        currentIDRA += 1;
        const nuevoIDRA = currentIDRA;

        const repActividadRequest = new sql.Request(transaction);
        repActividadRequest.input("IDRA", nuevoIDRA);
        repActividadRequest.input("IDRN", idrn);
        repActividadRequest.input("ORDEN", actividad.ORDEN);
        repActividadRequest.input("DESCRIPCION", actividad.DESCRIPCION);
        repActividadRequest.input("REFERENCIA", "-");
        repActividadRequest.input("DURACION", 1);

        await repActividadRequest.query(`
          SET IDENTITY_INSERT [REP_ACTIVIDAD] ON;
          INSERT INTO [REP_ACTIVIDAD] (IDRA, IDRN, ORDEN, DESCRIPCION, REFERENCIA, DURACION)
          VALUES (@IDRA, @IDRN, @ORDEN, @DESCRIPCION, @REFERENCIA, @DURACION);
          SET IDENTITY_INSERT [REP_ACTIVIDAD] OFF;
        `);
      }

      // Commit de toda la transacción
      await transaction.commit();

      return NextResponse.json(
        {
          success: true,
          data: nuevoPM,
          message: `PM creada exitosamente con ${actividades.length} actividades`,
        },
        { status: 201 }
      );
    } catch (transactionError) {
      await transaction.rollback();
      throw transactionError;
    }
  } catch (error) {
    console.error("Error en POST /api/pm/desde-actividades:", error);

    return NextResponse.json(
      {
        success: false,
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "Error al crear PM desde actividades",
      },
      { status: 500 }
    );
  }
}
