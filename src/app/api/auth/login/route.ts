import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, createSession } from '@/lib/auth';

/**
 * POST /api/auth/login
 * Autentica un usuario y crea una sesión
 */
export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Error al procesar la solicitud. Verifica el formato de los datos.',
        },
        { status: 400 }
      );
    }

    const { usuario, contrasena } = body;
    
    // Validar campos requeridos
    if (!usuario || !contrasena) {
      return NextResponse.json(
        {
          success: false,
          message: 'Usuario y contraseña son requeridos',
        },
        { status: 400 }
      );
    }
    
    // Autenticar usuario
    let user;
    try {
      user = await authenticateUser(usuario, contrasena);
    } catch (dbError) {
      console.error('Error de base de datos en autenticación:', dbError);
      return NextResponse.json(
        {
          success: false,
          message: 'Error al conectar con la base de datos',
        },
        { status: 500 }
      );
    }
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Usuario o contraseña incorrectos',
        },
        { status: 401 }
      );
    }
    
    // Crear sesión
    try {
      await createSession(user);
    } catch (sessionError) {
      console.error('Error al crear sesión:', sessionError);
      return NextResponse.json(
        {
          success: false,
          message: 'Error al crear la sesión',
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      {
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          id: user.ID_USR,
          nombre: user.NOMBRE,
          usuario: user.USUARIO,
          idRol: user.ID_ROL,
          idDis: user.ID_DIS,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error inesperado en POST /api/auth/login:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error inesperado al iniciar sesión',
      },
      { status: 500 }
    );
  }
}

