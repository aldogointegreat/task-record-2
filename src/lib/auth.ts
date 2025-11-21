import 'server-only';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import type { Usuario } from '@/models';

/**
 * Clave secreta para firmar las cookies de sesión
 * En producción, debería estar en variables de entorno
 */
const SESSION_SECRET = process.env.SESSION_SECRET || 'task-record-secret-key-change-in-production';
const SESSION_COOKIE_NAME = 'session_token';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

/**
 * Información de sesión almacenada en la cookie
 */
export interface SessionData {
  userId: number;
  usuario: string;
  nombre: string;
  idRol: number | null;
  idDis: number | null;
}

/**
 * Crea una sesión para el usuario autenticado
 */
export async function createSession(user: Usuario): Promise<string> {
  const sessionData: SessionData = {
    userId: user.ID_USR,
    usuario: user.USUARIO,
    nombre: user.NOMBRE,
    idRol: user.ID_ROL,
    idDis: user.ID_DIS,
  };
  
  // En una aplicación real, podrías usar JWT o almacenar en base de datos
  // Por simplicidad, usaremos una cookie con los datos del usuario
  // En producción, deberías usar una librería como jose o jsonwebtoken para firmar
  
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
  
  return JSON.stringify(sessionData);
}

/**
 * Obtiene la sesión actual del usuario
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    
    if (!sessionToken) {
      return null;
    }
    
    const sessionData = JSON.parse(sessionToken) as SessionData;
    
    // Verificar que el usuario aún existe en la base de datos
    const users = await query<Usuario>(
      'SELECT * FROM [USUARIO] WHERE ID_USR = @userId',
      { userId: sessionData.userId }
    );
    
    if (users.length === 0) {
      // Usuario eliminado, invalidar sesión
      await destroySession();
      return null;
    }
    
    return sessionData;
  } catch (error) {
    console.error('Error al obtener sesión:', error);
    return null;
  }
}

/**
 * Destruye la sesión actual
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Autentica un usuario con usuario y contraseña
 */
export async function authenticateUser(
  usuario: string,
  contrasena: string
): Promise<Usuario | null> {
  try {
    // Buscar usuario por nombre de usuario
    const users = await query<Usuario>(
      'SELECT * FROM [USUARIO] WHERE USUARIO = @usuario',
      { usuario }
    );
    
    if (users.length === 0) {
      return null;
    }
    
    const user = users[0];
    
    // Verificar contraseña (en producción, debería estar hasheada)
    // Por ahora, comparación directa ya que las contraseñas están en texto plano
    if (user.CONTRASENA !== contrasena) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error al autenticar usuario:', error);
    return null;
  }
}

