/**
 * Modelo: USUARIO
 * Tabla de usuarios del sistema
 */

export interface Usuario {
  ID_USR: number;
  ID_ROL: number | null;
  ID_DIS: number | null;
  NOMBRE: string;
  USUARIO: string;
  CONTRASENA: string;
}

export interface CreateUsuarioDTO {
  ID_ROL?: number | null;
  ID_DIS?: number | null;
  NOMBRE: string;
  USUARIO: string;
  CONTRASENA: string;
}

export interface UpdateUsuarioDTO {
  ID_ROL?: number | null;
  ID_DIS?: number | null;
  NOMBRE?: string;
  USUARIO?: string;
  CONTRASENA?: string;
}

export interface UsuarioFilters {
  NOMBRE?: string;
  USUARIO?: string;
  ID_ROL?: number;
  ID_DIS?: number;
}

