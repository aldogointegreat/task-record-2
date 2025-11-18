import 'server-only';
import sql from 'mssql';

// Configuración de conexión a SQL Server
const dbConfig: sql.config = {
  server: 'localhost',
  port: 1433,
  database: 'TaskRecords',
  user: 'sa',
  password: 'Abcdefg123!',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Pool de conexiones (singleton)
let pool: sql.ConnectionPool | null = null;

/**
 * Obtiene o crea un pool de conexiones a la base de datos
 */
export async function getConnection(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await sql.connect(dbConfig);
    console.log('Connected to SQL Server');
  }
  return pool;
}

/**
 * Cierra la conexión a la base de datos
 */
export async function closeConnection(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('SQL Server connection closed');
  }
}

/**
 * Ejecuta una consulta SQL
 */
export async function query<T = any>(
  queryString: string,
  params?: Record<string, any>
): Promise<T[]> {
  const connection = await getConnection();
  const request = connection.request();
  
  if (params) {
    Object.keys(params).forEach(key => {
      request.input(key, params[key]);
    });
  }
  
  const result = await request.query(queryString);
  return result.recordset as T[];
}

/**
 * Ejecuta un stored procedure
 */
export async function execute<T = any>(
  procedureName: string,
  params?: Record<string, any>
): Promise<T[]> {
  const connection = await getConnection();
  const request = connection.request();
  
  if (params) {
    Object.keys(params).forEach(key => {
      request.input(key, params[key]);
    });
  }
  
  const result = await request.execute(procedureName);
  return result.recordset as T[];
}

/**
 * Obtiene un request preparado para consultas más complejas
 */
export async function getRequest(): Promise<sql.Request> {
  const connection = await getConnection();
  return connection.request();
}
