/**
 * Modelo: ROL
 * Tabla maestra de roles de usuario
 */

export interface Rol {
  ID_ROL: number;
  NOMBRE: string;
  ADMINISTRADOR: boolean;
}

export interface CreateRolDTO {
  NOMBRE: string;
  ADMINISTRADOR: boolean;
}

export interface UpdateRolDTO {
  NOMBRE?: string;
  ADMINISTRADOR?: boolean;
}

export interface RolFilters {
  NOMBRE?: string;
  ADMINISTRADOR?: boolean;
}


