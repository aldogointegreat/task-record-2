import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Usuario, CreateUsuarioDTO, UsuarioFilters } from '@/models';

/**
 * GET /api/usuario
 * Obtiene todos los usuarios con filtros opcionales
 * Incluye JOINs con ROL y DISCIPLINA para obtener nombres relacionados
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: UsuarioFilters = {};

    // Construir filtros desde query params
    if (searchParams.has('NOMBRE')) {
      filters.NOMBRE = searchParams.get('NOMBRE') || undefined;
    }
    if (searchParams.has('USUARIO')) {
      filters.USUARIO = searchParams.get('USUARIO') || undefined;
    }
    if (searchParams.has('ID_ROL')) {
      const idRol = searchParams.get('ID_ROL');
      if (idRol) filters.ID_ROL = parseInt(idRol);
    }
    if (searchParams.has('ID_DIS')) {
      const idDis = searchParams.get('ID_DIS');
      if (idDis) filters.ID_DIS = parseInt(idDis);
    }

    // Construir condiciones WHERE
    let whereClause = 'WHERE 1=1';
    const params: Record<string, unknown> = {};

    if (filters.NOMBRE) {
      whereClause += ' AND NOMBRE LIKE @NOMBRE';
      params.NOMBRE = `%${filters.NOMBRE}%`;
    }
    if (filters.USUARIO) {
      whereClause += ' AND USUARIO LIKE @USUARIO';
      params.USUARIO = `%${filters.USUARIO}%`;
    }
    if (filters.ID_ROL !== undefined) {
      whereClause += ' AND ID_ROL = @ID_ROL';
      params.ID_ROL = filters.ID_ROL;
    }
    if (filters.ID_DIS !== undefined) {
      whereClause += ' AND ID_DIS = @ID_DIS';
      params.ID_DIS = filters.ID_DIS;
    }

    // Ejecutar query
    const result = await query<Usuario>(
      `SELECT * FROM [USUARIO] ${whereClause} ORDER BY ID_USR ASC`,
      params
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: `Se encontraron ${result.length} usuarios`,
    }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/usuario:', error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener usuarios',
    }, { status: 500 });
  }
}

/**
 * POST /api/usuario
 * Crea un nuevo usuario
 */
export async function POST(request: NextRequest) {
  let body: CreateUsuarioDTO | null = null;
  try {
    body = await request.json() as CreateUsuarioDTO;

    // Validar campos requeridos
    if (!body.NOMBRE) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo NOMBRE es requerido',
      }, { status: 400 });
    }
    if (!body.USUARIO) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo USUARIO es requerido',
      }, { status: 400 });
    }
    if (!body.CONTRASENA) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo CONTRASENA es requerido',
      }, { status: 400 });
    }

    // Construir query dinámica
    const fields: string[] = [];
    const values: string[] = [];
    const params: Record<string, unknown> = {};

    if (body.ID_ROL !== undefined) {
      fields.push('ID_ROL');
      values.push('@ID_ROL');
      params.ID_ROL = body.ID_ROL || null;
    }
    if (body.ID_DIS !== undefined) {
      fields.push('ID_DIS');
      values.push('@ID_DIS');
      params.ID_DIS = body.ID_DIS || null;
    }
    if (body.NOMBRE !== undefined) {
      fields.push('NOMBRE');
      values.push('@NOMBRE');
      params.NOMBRE = body.NOMBRE;
    }
    if (body.USUARIO !== undefined) {
      fields.push('USUARIO');
      values.push('@USUARIO');
      params.USUARIO = body.USUARIO;
    }
    if (body.CONTRASENA !== undefined) {
      fields.push('CONTRASENA');
      values.push('@CONTRASENA');
      params.CONTRASENA = body.CONTRASENA;
    }

    const sqlQuery = `
      INSERT INTO [USUARIO] (${fields.join(', ')})
      OUTPUT INSERTED.*
      VALUES (${values.join(', ')})`;

    const result = await query<Usuario>(sqlQuery, params);

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Usuario creado exitosamente',
    }, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/usuario:', error);
    
    // Detectar error de clave única (usuario duplicado)
    if (error instanceof Error) {
      const errorMessage = error.message;
      const errorCode = (error as any).number;
      
      // Error 2627 es violación de UNIQUE KEY constraint en SQL Server
      if (errorCode === 2627 || errorMessage.includes('UNIQUE KEY constraint') || errorMessage.includes('UQ_USUARIO_LOGIN')) {
        // Extraer el nombre de usuario del mensaje de error o usar el del body
        let usuarioNombre = 'este nombre de usuario';
        if (body?.USUARIO) {
          usuarioNombre = `"${body.USUARIO}"`;
        } else {
          // Intentar extraer del mensaje de error: "duplicate key value is (testeoo)"
          const match = errorMessage.match(/duplicate key value is \(([^)]+)\)/i);
          if (match && match[1]) {
            usuarioNombre = `"${match[1]}"`;
          }
        }
        
        return NextResponse.json({
          success: false,
          data: null,
          message: `El nombre de usuario ${usuarioNombre} ya existe. Por favor, elija otro nombre de usuario.`,
        }, { status: 409 }); // 409 Conflict
      }
    }
    
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear usuario',
    }, { status: 500 });
  }
}

