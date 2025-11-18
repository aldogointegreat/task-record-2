/**
 * Configuración de la cadena de conexión a SQL Server
 * Puedes mover estas variables a variables de entorno para mayor seguridad
 */
export const dbConnectionString = {
  server: 'localhost',
  port: 1433,
  database: 'TaskRecords',
  user: 'sa',
  password: 'Abcdefg123!',
  trustServerCertificate: true,
  encrypt: false,
};

/**
 * Convierte la configuración a una cadena de conexión
 */
export function getConnectionString(): string {
  return `Server=${dbConnectionString.server},${dbConnectionString.port};Database=${dbConnectionString.database};User ID=${dbConnectionString.user};Password=${dbConnectionString.password};TrustServerCertificate=${dbConnectionString.trustServerCertificate};Encrypt=${dbConnectionString.encrypt};`;
}
