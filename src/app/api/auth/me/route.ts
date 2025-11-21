import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

/**
 * GET /api/auth/me
 * Obtiene la información del usuario actual autenticado
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: 'No hay sesión activa',
        },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      {
        success: true,
        data: session,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en GET /api/auth/me:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al obtener información de sesión',
      },
      { status: 500 }
    );
  }
}

