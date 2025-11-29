import { NextRequest, NextResponse } from "next/server";
import { query, getConnection } from "@/lib/db";
import sql from "mssql";
import type { ActividadFiltrada } from "@/models";

/**
 * GET /api/pm/[id]/actividades
 * Obtiene todas las actividades asociadas a una PM específica
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idpm = parseInt(id);

    if (isNaN(idpm)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "ID de PM inválido",
        },
        { status: 400 }
      );
    }

    // Obtener las actividades de la PM a través de REP_NIVEL y REP_ACTIVIDAD
    // Luego hacer JOIN con ACTIVIDAD_NIVEL para obtener información completa
    const result = await query<ActividadFiltrada>(
      `
      SELECT DISTINCT
        AN.IDA,
        AN.IDN,
        AN.ORDEN,
        AN.DESCRIPCION,
        AN.ID_DISCIPLINA_TAREA AS IDDT,
        DT.NOMBRE as DISCIPLINA_TAREA,
        AN.ID_CLASE_MANTENCION AS IDCM,
        CM.NOMBRE as CLASE_MANTENCION,
        AN.ID_CONDICION_ACCESO AS IDCA,
        CA.NOMBRE as CONDICION_ACCESO,
        AN.FRECUENCIA_TAREA,
        AN.UNIDAD_FRECUENCIA,
        AN.FUNCIONALIDAD,
        AN.TAREA_MANTENCION,
        AN.DURACION_TAREA,
        N.NOMBRE AS NIVEL_NOMBRE,
        N.IDJ AS NIVEL_IDJ,
        N.IDNP AS NIVEL_IDNP,
        J.DESCRIPCION AS JERARQUIA_NOMBRE,
        J.COLOR AS JERARQUIA_COLOR,
        DT.NOMBRE AS DISCIPLINA_TAREA_NOMBRE,
        CM.NOMBRE AS CLASE_MANTENCION_NOMBRE,
        CA.NOMBRE AS CONDICION_ACCESO_NOMBRE
      FROM [REP_NIVEL] RN
      INNER JOIN [REP_ACTIVIDAD] RA ON RN.IDRN = RA.IDRN
      INNER JOIN [ACTIVIDAD_NIVEL] AN ON RN.IDN = AN.IDN AND RA.ORDEN = AN.ORDEN
      INNER JOIN [NIVEL] N ON AN.IDN = N.IDN
      LEFT JOIN [JERARQUIA] J ON N.IDJ = J.IDJ
      LEFT JOIN [DISCIPLINA_TAREA] DT ON AN.ID_DISCIPLINA_TAREA = DT.ID_DISCIPLINA_TAREA
      LEFT JOIN [CLASE_MANTENCION] CM ON AN.ID_CLASE_MANTENCION = CM.ID_CLASE
      LEFT JOIN [CONDICION_ACCESO] CA ON AN.ID_CONDICION_ACCESO = CA.ID_CONDICION
      WHERE RN.IDPM = @IDPM
      ORDER BY AN.IDN, AN.ORDEN
    `,
      { IDPM: idpm }
    );

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: `Se encontraron ${result.length} actividades para la PM ${idpm}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en GET /api/pm/[id]/actividades:", error);

    return NextResponse.json(
      {
        success: false,
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "Error al obtener actividades de la PM",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/pm/[id]/actividades
 * Actualiza las actividades de una PM
 * Elimina las actividades actuales y crea nuevas basadas en los IDs proporcionados
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let body: { actividadesIds: number[] } | null = null;
  try {
    const { id } = await params;
    const idpm = parseInt(id);

    if (isNaN(idpm)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "ID de PM inválido",
        },
        { status: 400 }
      );
    }

    body = (await request.json()) as { actividadesIds: number[] };

    if (!body.actividadesIds || !Array.isArray(body.actividadesIds)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "El campo actividadesIds es requerido y debe ser un array",
        },
        { status: 400 }
      );
    }

    // Usar una transacción para asegurar atomicidad
    const connection = await getConnection();
    const transaction = new sql.Transaction(connection);

    try {
      await transaction.begin();

      // 1. Obtener los REP_NIVEL asociados a esta PM
      const repNivelesRequest = new sql.Request(transaction);
      repNivelesRequest.input("IDPM", idpm);
      const repNivelesResult = await repNivelesRequest.query<{
        IDRN: number;
      }>(`
        SELECT IDRN FROM [REP_NIVEL] WHERE IDPM = @IDPM
      `);
      const repNiveles = repNivelesResult.recordset;

      // 2. Eliminar todas las REP_ACTIVIDAD asociadas a estos REP_NIVEL
      if (repNiveles.length > 0) {
        const idrns = repNiveles.map((rn) => rn.IDRN).join(",");
        const deleteActividadesRequest = new sql.Request(transaction);
        await deleteActividadesRequest.query(`
          DELETE FROM [REP_ACTIVIDAD] WHERE IDRN IN (${idrns})
        `);
      }

      // 3. Eliminar todos los REP_NIVEL asociados a esta PM
      const deleteNivelesRequest = new sql.Request(transaction);
      deleteNivelesRequest.input("IDPM", idpm);
      await deleteNivelesRequest.query(`
        DELETE FROM [REP_NIVEL] WHERE IDPM = @IDPM
      `);

      // 4. Si hay nuevas actividades, crearlas
      if (body.actividadesIds.length > 0) {
        // Obtener información de las actividades seleccionadas
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

        // Obtener niveles únicos
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

        // Obtener los máximos de IDRN e IDRA
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

        // Crear registros en REP_NIVEL
        const mapNivelToIDRN = new Map<number, number>();

        for (const nivel of niveles) {
          currentIDRN += 1;
          const nuevoIDRN = currentIDRN;

          const repNivelRequest = new sql.Request(transaction);
          repNivelRequest.input("IDRN", nuevoIDRN);
          repNivelRequest.input("IDPM", idpm);
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

        // Crear registros en REP_ACTIVIDAD
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
      }

      await transaction.commit();

      return NextResponse.json(
        {
          success: true,
          data: null,
          message: `Actividades de la PM ${idpm} actualizadas exitosamente`,
        },
        { status: 200 }
      );
    } catch (transactionError) {
      await transaction.rollback();
      throw transactionError;
    }
  } catch (error) {
    console.error("Error en PUT /api/pm/[id]/actividades:", error);

    return NextResponse.json(
      {
        success: false,
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "Error al actualizar actividades de la PM",
      },
      { status: 500 }
    );
  }
}
