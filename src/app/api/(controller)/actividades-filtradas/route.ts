import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { ActividadFiltrada, ActividadFiltradaFilters } from "@/models";

/**
 * GET /api/actividades-filtradas
 * Obtiene actividades con filtrado jerárquico y múltiple
 *
 * Query params:
 * - nivelId: ID del nivel (incluye todos los descendientes recursivamente)
 * - disciplinaTareaId: ID de disciplina de tarea
 * - frecuenciaTarea: Número de frecuencia
 * - unidadFrecuencia: Unidad de frecuencia (string)
 * - condicionAccesoId: ID de condición de acceso
 * - claseMantencionId: ID de clase de mantención
 * - consecuenciaFallaId: ID de consecuencia de falla
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: ActividadFiltradaFilters = {};

    // Construir filtros desde query params
    if (searchParams.has("nivelId")) {
      const nivelId = searchParams.get("nivelId");
      if (nivelId) filters.nivelId = parseInt(nivelId);
    }
    if (searchParams.has("disciplinaTareaId")) {
      const disciplinaTareaId = searchParams.get("disciplinaTareaId");
      if (disciplinaTareaId)
        filters.disciplinaTareaId = parseInt(disciplinaTareaId);
    }
    if (searchParams.has("frecuenciaTarea")) {
      const frecuenciaTarea = searchParams.get("frecuenciaTarea");
      if (frecuenciaTarea)
        filters.frecuenciaTarea = parseFloat(frecuenciaTarea);
    }
    if (searchParams.has("unidadFrecuencia")) {
      filters.unidadFrecuencia =
        searchParams.get("unidadFrecuencia") || undefined;
    }
    if (searchParams.has("condicionAccesoId")) {
      const condicionAccesoId = searchParams.get("condicionAccesoId");
      if (condicionAccesoId)
        filters.condicionAccesoId = parseInt(condicionAccesoId);
    }
    if (searchParams.has("claseMantencionId")) {
      const claseMantencionId = searchParams.get("claseMantencionId");
      if (claseMantencionId)
        filters.claseMantencionId = parseInt(claseMantencionId);
    }
    if (searchParams.has("consecuenciaFallaId")) {
      const consecuenciaFallaId = searchParams.get("consecuenciaFallaId");
      if (consecuenciaFallaId)
        filters.consecuenciaFallaId = parseInt(consecuenciaFallaId);
    }

    // Construir query con CTE recursivo para obtener todos los niveles descendientes
    let sqlQuery = "";
    const params: Record<string, unknown> = {};

    if (filters.nivelId) {
      // Usar CTE recursivo para obtener el nivel y todos sus descendientes
      sqlQuery = `
        WITH NivelesRecursivos AS (
          -- Nivel base (el seleccionado)
          SELECT IDN, IDJ, IDNP, NOMBRE
          FROM [NIVEL]
          WHERE IDN = @nivelId
          
          UNION ALL
          
          -- Niveles descendientes recursivamente
          SELECT n.IDN, n.IDJ, n.IDNP, n.NOMBRE
          FROM [NIVEL] n
          INNER JOIN NivelesRecursivos nr ON n.IDNP = nr.IDN
        )
        SELECT 
          a.*,
          n.NOMBRE AS NIVEL_NOMBRE,
          n.IDJ AS NIVEL_IDJ,
          n.IDNP AS NIVEL_IDNP,
          j.DESCRIPCION AS JERARQUIA_NOMBRE,
          j.COLOR AS JERARQUIA_COLOR,
          dt.NOMBRE AS DISCIPLINA_TAREA_NOMBRE,
          cm.NOMBRE AS CLASE_MANTENCION_NOMBRE,
          ca.NOMBRE AS CONDICION_ACCESO_NOMBRE,
          cf.NOMBRE AS CONSECUENCIA_FALLA_NOMBRE
        FROM [ACTIVIDAD_NIVEL] a
        INNER JOIN NivelesRecursivos n ON a.IDN = n.IDN
        LEFT JOIN [JERARQUIA] j ON n.IDJ = j.IDJ
        LEFT JOIN [DISCIPLINA_TAREA] dt ON a.ID_DISCIPLINA_TAREA = dt.ID_DISCIPLINA_TAREA
        LEFT JOIN [CLASE_MANTENCION] cm ON a.ID_CLASE_MANTENCION = cm.ID_CLASE
        LEFT JOIN [CONDICION_ACCESO] ca ON a.ID_CONDICION_ACCESO = ca.ID_CONDICION
        LEFT JOIN [CONSECUENCIA_FALLA] cf ON a.ID_CONSECUENCIA_FALLA = cf.ID_CONSECUENCIA
        WHERE 1=1
      `;
      params.nivelId = filters.nivelId;
    } else {
      // Si no hay filtro de nivel, obtener todas las actividades
      sqlQuery = `
        SELECT 
          a.*,
          n.NOMBRE AS NIVEL_NOMBRE,
          n.IDJ AS NIVEL_IDJ,
          n.IDNP AS NIVEL_IDNP,
          j.DESCRIPCION AS JERARQUIA_NOMBRE,
          j.COLOR AS JERARQUIA_COLOR,
          dt.NOMBRE AS DISCIPLINA_TAREA_NOMBRE,
          cm.NOMBRE AS CLASE_MANTENCION_NOMBRE,
          ca.NOMBRE AS CONDICION_ACCESO_NOMBRE,
          cf.NOMBRE AS CONSECUENCIA_FALLA_NOMBRE
        FROM [ACTIVIDAD_NIVEL] a
        INNER JOIN [NIVEL] n ON a.IDN = n.IDN
        LEFT JOIN [JERARQUIA] j ON n.IDJ = j.IDJ
        LEFT JOIN [DISCIPLINA_TAREA] dt ON a.ID_DISCIPLINA_TAREA = dt.ID_DISCIPLINA_TAREA
        LEFT JOIN [CLASE_MANTENCION] cm ON a.ID_CLASE_MANTENCION = cm.ID_CLASE
        LEFT JOIN [CONDICION_ACCESO] ca ON a.ID_CONDICION_ACCESO = ca.ID_CONDICION
        LEFT JOIN [CONSECUENCIA_FALLA] cf ON a.ID_CONSECUENCIA_FALLA = cf.ID_CONSECUENCIA
        WHERE 1=1
      `;
    }

    // Agregar filtros adicionales
    if (filters.disciplinaTareaId !== undefined) {
      sqlQuery += " AND a.ID_DISCIPLINA_TAREA = @disciplinaTareaId";
      params.disciplinaTareaId = filters.disciplinaTareaId;
    }

    if (filters.frecuenciaTarea !== undefined) {
      sqlQuery += " AND a.FRECUENCIA_TAREA = @frecuenciaTarea";
      params.frecuenciaTarea = filters.frecuenciaTarea;
    }

    if (filters.unidadFrecuencia) {
      sqlQuery += " AND a.UNIDAD_FRECUENCIA = @unidadFrecuencia";
      params.unidadFrecuencia = filters.unidadFrecuencia;
    }

    if (filters.condicionAccesoId !== undefined) {
      sqlQuery += " AND a.ID_CONDICION_ACCESO = @condicionAccesoId";
      params.condicionAccesoId = filters.condicionAccesoId;
    }

    if (filters.claseMantencionId !== undefined) {
      sqlQuery += " AND a.ID_CLASE_MANTENCION = @claseMantencionId";
      params.claseMantencionId = filters.claseMantencionId;
    }

    if (filters.consecuenciaFallaId !== undefined) {
      sqlQuery += " AND a.ID_CONSECUENCIA_FALLA = @consecuenciaFallaId";
      params.consecuenciaFallaId = filters.consecuenciaFallaId;
    }

    // Ordenar por nivel y orden
    sqlQuery += " ORDER BY n.NOMBRE ASC, a.ORDEN ASC";

    // Ejecutar query
    const result = await query<ActividadFiltrada>(sqlQuery, params);

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: `Se encontraron ${result.length} actividades`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en GET /api/actividades-filtradas:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "Error al obtener actividades filtradas",
      },
      { status: 500 }
    );
  }
}
