import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';

/**
 * POST /api/auth/logout
 * Cierra la sesión del usuario actual
 */
export async function POST(request: NextRequest) {
  try {
    await destroySession();
    
    return NextResponse.json(
      {
        success: true,
        message: 'Sesión cerrada exitosamente',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en POST /api/auth/logout:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al cerrar sesión',
      },
      { status: 500 }
    );
  }
}

