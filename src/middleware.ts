import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de autenticación y autorización
 * Protege todas las rutas excepto /login y /api/auth/*
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/login'];
  const publicApiRoutes = ['/api/auth/login', '/api/auth/logout', '/api/auth/me'];
  
  // Verificar si es una ruta pública
  const isPublicRoute = publicRoutes.includes(pathname);
  // Verificar rutas de API públicas (coincidencia exacta o que empiecen con la ruta)
  const isPublicApiRoute = pathname.startsWith('/api/auth/') && 
    (pathname === '/api/auth/login' || 
     pathname === '/api/auth/logout' || 
     pathname === '/api/auth/me');
  
  // Si es una ruta pública, permitir acceso
  if (isPublicRoute || isPublicApiRoute) {
    return NextResponse.next();
  }
  
  // Obtener el token de sesión de las cookies
  const sessionToken = request.cookies.get('session_token')?.value;
  
  // Si no hay token de sesión, redirigir al login
  if (!sessionToken) {
    // Si es una ruta de API, devolver 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, message: 'No autorizado. Por favor, inicia sesión.' },
        { status: 401 }
      );
    }
    
    // Si es una ruta de página, redirigir al login (sin parámetros por seguridad)
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // Si hay token, permitir acceso
  return NextResponse.next();
}

/**
 * Configuración de matcher para el middleware
 * Aplica el middleware a todas las rutas excepto:
 * - Archivos estáticos (_next/static, _next/image, favicon.ico, etc.)
 * - Rutas de API públicas de autenticación
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

