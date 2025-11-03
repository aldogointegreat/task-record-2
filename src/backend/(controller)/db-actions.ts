'use server';

import { query } from '@/lib/db';
import type { DbActionResult } from '@/types/common';

interface TestConnectionData {
  version: string;
  currentDate: Date;
  databaseName: string;
}

interface TableInfo {
  TABLE_SCHEMA: string;
  TABLE_NAME: string;
  TABLE_TYPE: string;
}

interface ColumnInfo {
  COLUMN_NAME: string;
  DATA_TYPE: string;
  IS_NULLABLE: string;
  CHARACTER_MAXIMUM_LENGTH?: number;
}

/**
 * Server Action para probar la conexión a SQL Server
 */
export async function testConnection(): Promise<DbActionResult<TestConnectionData>> {
  try {
    const result = await query<TestConnectionData>(
      'SELECT @@VERSION AS version, GETDATE() AS currentDate, DB_NAME() AS databaseName'
    );
    return {
      success: true,
      data: result[0],
      message: 'Conexión a SQL Server exitosa',
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const errorDetails = String(error);
    console.error('Error en la conexión a SQL Server:', error);
    return {
      success: false,
      error: errorMessage || 'Error al conectar con la base de datos',
      details: errorDetails,
    };
  }
}

/**
 * Server Action para obtener todas las tablas de la base de datos
 */
export async function getTables(): Promise<DbActionResult<TableInfo[]>> {
  try {
    const result = await query<TableInfo>(`
      SELECT 
        TABLE_SCHEMA,
        TABLE_NAME,
        TABLE_TYPE
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_SCHEMA, TABLE_NAME
    `);
    return {
      success: true,
      data: result,
      message: `Se encontraron ${result.length} tablas`,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const errorDetails = String(error);
    console.error('Error al obtener tablas:', error);
    return {
      success: false,
      error: errorMessage || 'Error al obtener las tablas',
      details: errorDetails,
    };
  }
}

/**
 * Server Action para obtener la estructura de una tabla
 */
export async function getTableStructure(
  tableName: string
): Promise<DbActionResult<ColumnInfo[]>> {
  try {
    const result = await query<ColumnInfo>(`
      SELECT 
        COLUMN_NAME,
        DATA_TYPE,
        IS_NULLABLE,
        CHARACTER_MAXIMUM_LENGTH
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = @tableName
      ORDER BY ORDINAL_POSITION
    `, { tableName });
    return {
      success: true,
      data: result,
      message: `Estructura de la tabla ${tableName}`,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const errorDetails = String(error);
    console.error('Error al obtener estructura de tabla:', error);
    return {
      success: false,
      error: errorMessage || 'Error al obtener la estructura de la tabla',
      details: errorDetails,
    };
  }
}

/**
 * Server Action genérica para ejecutar consultas SQL
 */
export async function executeQuery(
  sqlQuery: string,
  params?: Record<string, unknown>
): Promise<DbActionResult<unknown[]>> {
  try {
    const result = await query(sqlQuery, params);
    return {
      success: true,
      data: result,
      message: 'Consulta ejecutada exitosamente',
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const errorDetails = String(error);
    console.error('Error en la consulta:', error);
    return {
      success: false,
      error: errorMessage || 'Error al ejecutar la consulta',
      details: errorDetails,
    };
  }
}

