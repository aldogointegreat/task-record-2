# Tablas Maestras - Implementación Completa

Este documento resume la implementación de las tablas maestras del sistema TaskRecord con arquitectura MVC completa.

## 📋 Tablas Implementadas

Se han implementado **6 tablas maestras** con funcionalidad CRUD completa:

1. **DISCIPLINA** - Disciplinas/especialidades
2. **ROL** - Roles de usuario
3. **JERARQUIA** - Jerarquías del sistema
4. **ATRIBUTO** - Atributos de actividades
5. **ENTREGA** - Entregas ordenadas
6. **USUARIO** - Usuarios del sistema ⭐ (CRUD completo con edición inline y loading states)

## 🏗️ Arquitectura Implementada

Cada tabla maestra incluye:

### 1. **Models** (`src/models/[tabla].model.ts`)
- ✅ Interface principal con tipos TypeScript
- ✅ DTO para crear (`Create[Tabla]DTO`)
- ✅ DTO para actualizar (`Update[Tabla]DTO`)
- ✅ Interface de filtros (`[Tabla]Filters`)

### 2. **API Routes** (`src/app/api/(controller)/[tabla]/`)
- ✅ `GET /api/[tabla]` - Listar todos con filtros opcionales
- ✅ `GET /api/[tabla]/[id]` - Obtener por ID
- ✅ `POST /api/[tabla]` - Crear nuevo registro
- ✅ `PUT /api/[tabla]/[id]` - Actualizar registro
- ✅ `DELETE /api/[tabla]/[id]` - Eliminar registro

### 3. **API Clients** (`src/lib/api/[tabla]-api.ts`)
- ✅ `getAll[Tabla]s()` - Cliente para listar
- ✅ `get[Tabla]ById()` - Cliente para obtener por ID
- ✅ `create[Tabla]()` - Cliente para crear
- ✅ `update[Tabla]()` - Cliente para actualizar
- ✅ `delete[Tabla]()` - Cliente para eliminar

### 4. **Columns** (`src/components/(views)/(tables)/[tabla]/[tabla]-columns.tsx`)
- ✅ Definición de columnas para TanStack Table
- ✅ Formateo personalizado de celdas
- ✅ Badges y estilos según el tipo de dato

### 5. **Views** (`src/components/(views)/(tables)/[tabla]/[Tabla]List.tsx`)
- ✅ Componente React Client
- ✅ Integración con TankTable
- ✅ Estados de carga
- ✅ Paginación
- ✅ Búsqueda
- ✅ Exportación (CSV/JSON)

## 📊 Detalles de Cada Tabla

### 1. DISCIPLINA
**Tabla:** `DISCIPLINA`
**Campos:**
- `ID_DIS` (INTEGER, PK, IDENTITY)
- `NOMBRE` (VARCHAR(255), NOT NULL)

**Endpoints:**
- GET `/api/disciplina` - Listar disciplinas
- GET `/api/disciplina/[id]` - Obtener disciplina por ID
- POST `/api/disciplina` - Crear disciplina
- PUT `/api/disciplina/[id]` - Actualizar disciplina
- DELETE `/api/disciplina/[id]` - Eliminar disciplina

**Filtros disponibles:**
- `NOMBRE` (búsqueda con LIKE)

---

### 2. ROL
**Tabla:** `ROL`
**Campos:**
- `ID_ROL` (INTEGER, PK, IDENTITY)
- `NOMBRE` (VARCHAR(255), NOT NULL)
- `ADMINISTRADOR` (BIT, NOT NULL)

**Endpoints:**
- GET `/api/rol` - Listar roles
- GET `/api/rol/[id]` - Obtener rol por ID
- POST `/api/rol` - Crear rol
- PUT `/api/rol/[id]` - Actualizar rol
- DELETE `/api/rol/[id]` - Eliminar rol

**Filtros disponibles:**
- `NOMBRE` (búsqueda con LIKE)
- `ADMINISTRADOR` (booleano)

---

### 3. JERARQUIA
**Tabla:** `JERARQUIA`
**Campos:**
- `IDJ` (INTEGER, PK, IDENTITY)
- `DESCRIPCION` (VARCHAR(255), NOT NULL)

**Endpoints:**
- GET `/api/jerarquia` - Listar jerarquías
- GET `/api/jerarquia/[id]` - Obtener jerarquía por ID
- POST `/api/jerarquia` - Crear jerarquía
- PUT `/api/jerarquia/[id]` - Actualizar jerarquía
- DELETE `/api/jerarquia/[id]` - Eliminar jerarquía

**Filtros disponibles:**
- `DESCRIPCION` (búsqueda con LIKE)

---

### 4. ATRIBUTO
**Tabla:** `ATRIBUTO`
**Campos:**
- `IDT` (INTEGER, PK, IDENTITY)
- `DESCRIPCION` (VARCHAR(255), NOT NULL)

**Endpoints:**
- GET `/api/atributo` - Listar atributos
- GET `/api/atributo/[id]` - Obtener atributo por ID
- POST `/api/atributo` - Crear atributo
- PUT `/api/atributo/[id]` - Actualizar atributo
- DELETE `/api/atributo/[id]` - Eliminar atributo

**Filtros disponibles:**
- `DESCRIPCION` (búsqueda con LIKE)

---

### 5. ENTREGA
**Tabla:** `ENTREGA`
**Campos:**
- `IDE` (INTEGER, PK, IDENTITY)
- `DESCRIPCION` (VARCHAR(255), NOT NULL)
- `ORDEN` (INTEGER, NOT NULL)

**Endpoints:**
- GET `/api/entrega` - Listar entregas
- GET `/api/entrega/[id]` - Obtener entrega por ID
- POST `/api/entrega` - Crear entrega
- PUT `/api/entrega/[id]` - Actualizar entrega
- DELETE `/api/entrega/[id]` - Eliminar entrega

**Filtros disponibles:**
- `DESCRIPCION` (búsqueda con LIKE)
- `ORDEN` (exacto)

---

### 6. USUARIO ⭐
**Tabla:** `USUARIO`
**Campos:**
- `ID_USR` (INTEGER, PK, IDENTITY)
- `ID_ROL` (INTEGER, FK a ROL, nullable)
- `ID_DIS` (INTEGER, FK a DISCIPLINA, nullable)
- `NOMBRE` (VARCHAR(255), NOT NULL)
- `USUARIO` (VARCHAR(255), NOT NULL, UNIQUE)
- `CONTRASENA` (VARCHAR(255), NOT NULL)

**Endpoints:**
- GET `/api/usuario` - Listar usuarios
- GET `/api/usuario/[id]` - Obtener usuario por ID
- POST `/api/usuario` - Crear usuario
- PUT `/api/usuario/[id]` - Actualizar usuario
- DELETE `/api/usuario/[id]` - Eliminar usuario

**Filtros disponibles:**
- `NOMBRE` (búsqueda con LIKE)
- `USUARIO` (búsqueda con LIKE)
- `ID_ROL` (exacto)
- `ID_DIS` (exacto)

**Características especiales:**
- ✅ Edición inline en la tabla
- ✅ Estados de loading visuales
- ✅ Actualización optimista (sin recargar tabla)
- ✅ Manejo de errores UNIQUE KEY con mensajes claros
- ✅ Relaciones con ROL y DISCIPLINA (selects)
- ✅ Formulario de creación con validación
- ✅ Confirmación de eliminación

## 🚀 Páginas Creadas

Se han creado **6 páginas** para visualizar cada tabla maestra:

- ✅ `/disciplinas` - Página de Disciplinas
- ✅ `/roles` - Página de Roles
- ✅ `/jerarquias` - Página de Jerarquías
- ✅ `/atributos` - Página de Atributos
- ✅ `/entregas` - Página de Entregas
- ✅ `/usuarios` - Página de Usuarios (con CRUD completo)

Cada página incluye:
- Título y descripción
- Componente List con TankTable
- Diseño responsive con container
- Integración completa con la arquitectura MVC

### Ejemplo de página creada:

```typescript
// src/app/disciplinas/page.tsx
import { DisciplinaList } from "@/components/(views)";

export default function DisciplinasPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Disciplinas</h1>
        <p className="text-muted-foreground">
          Gestión de disciplinas y especialidades del sistema
        </p>
      </div>
      <DisciplinaList />
    </div>
  );
}
```

### Ejemplo de uso del API client:

```typescript
import { getAllDisciplinas, createDisciplina } from '@/lib/api';

// Obtener todas las disciplinas
const result = await getAllDisciplinas();
if (result.success) {
  console.log(result.data); // Array de disciplinas
}

// Crear una nueva disciplina
const newDisciplina = await createDisciplina({
  NOMBRE: 'Ingeniería Civil'
});
if (newDisciplina.success) {
  console.log('Disciplina creada:', newDisciplina.data);
}
```

## 📁 Estructura de Archivos Creados

```
src/
├── models/
│   ├── disciplina.model.ts
│   ├── rol.model.ts
│   ├── jerarquia.model.ts
│   ├── atributo.model.ts
│   ├── entrega.model.ts
│   └── usuario.model.ts
│
├── app/api/(controller)/
│   ├── disciplina/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── rol/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── jerarquia/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── atributo/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── entrega/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   └── usuario/
│       ├── route.ts
│       └── [id]/route.ts
│
├── lib/api/
│   ├── disciplina-api.ts
│   ├── rol-api.ts
│   ├── jerarquia-api.ts
│   ├── atributo-api.ts
│   ├── entrega-api.ts
│   └── usuario-api.ts
│
├── app/
│   ├── disciplinas/
│   │   └── page.tsx
│   ├── roles/
│   │   └── page.tsx
│   ├── jerarquias/
│   │   └── page.tsx
│   ├── atributos/
│   │   └── page.tsx
│   ├── entregas/
│   │   └── page.tsx
│   └── usuarios/
│       └── page.tsx
│
└── components/(views)/(tables)/
    ├── disciplina/
    │   ├── DisciplinaList.tsx
    │   └── disciplina-columns.tsx
    ├── rol/
    │   ├── RolList.tsx
    │   └── rol-columns.tsx
    ├── jerarquia/
    │   ├── JerarquiaList.tsx
    │   └── jerarquia-columns.tsx
    ├── atributo/
    │   ├── AtributoList.tsx
    │   └── atributo-columns.tsx
    ├── entrega/
    │   ├── EntregaList.tsx
    │   └── entrega-columns.tsx
    └── usuario/
        ├── UsuarioList.tsx
        └── usuario-columns.tsx
```

## 🚀 Guía Completa: Implementar CRUD con Edición Inline y Loading States

Esta guía detalla cómo implementar un CRUD completo con todas las características avanzadas, siguiendo el patrón implementado en **USUARIO** como referencia.

### 📋 Características Incluidas

- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Edición inline en la tabla
- ✅ Estados de loading visuales
- ✅ Actualización optimista (sin recargar toda la tabla)
- ✅ Manejo de errores con mensajes claros
- ✅ Formulario de creación con validación
- ✅ Confirmación de eliminación
- ✅ Relaciones con otras tablas (selects)
- ✅ Feedback visual durante operaciones

---

## 📝 Paso 1: Crear el Model

**Archivo:** `src/models/[entidad].model.ts`

```typescript
/**
 * Modelo: [ENTIDAD]
 * Descripción de la entidad
 */

export interface [Entidad] {
  ID_[ENT]: number;
  // ... otros campos
  CAMPO_RELACION?: number | null; // Para relaciones opcionales
}

export interface Create[Entidad]DTO {
  // Campos requeridos para crear
  CAMPO: string;
  CAMPO_RELACION?: number | null;
}

export interface Update[Entidad]DTO {
  // Todos los campos opcionales para actualizar
  CAMPO?: string;
  CAMPO_RELACION?: number | null;
}

export interface [Entidad]Filters {
  // Filtros para búsqueda
  CAMPO?: string;
  CAMPO_RELACION?: number;
}
```

**Ejemplo real (Usuario):**
```typescript
export interface Usuario {
  ID_USR: number;
  ID_ROL: number | null;
  ID_DIS: number | null;
  NOMBRE: string;
  USUARIO: string;
  CONTRASENA: string;
}
```

---

## 📝 Paso 2: Crear API Routes

### 2.1. Route Principal (`src/app/api/(controller)/[entidad]/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { [Entidad], Create[Entidad]DTO, [Entidad]Filters } from '@/models';

/**
 * GET /api/[entidad]
 * Lista todos los registros con filtros opcionales
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: [Entidad]Filters = {};

    // Construir filtros desde query params
    if (searchParams.has('CAMPO')) {
      filters.CAMPO = searchParams.get('CAMPO') || undefined;
    }

    // Construir condiciones WHERE
    let whereClause = 'WHERE 1=1';
    const params: Record<string, unknown> = {};

    if (filters.CAMPO) {
      whereClause += ' AND CAMPO LIKE @CAMPO';
      params.CAMPO = `%${filters.CAMPO}%`;
    }

    const result = await query<[Entidad]>(
      `SELECT * FROM [[ENTIDAD]]] ${whereClause} ORDER BY ID_[ENT] ASC`,
      params
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: `Se encontraron ${result.length} registros`,
    }, { status: 200 });

  } catch (error) {
    console.error(`Error en GET /api/[entidad]:`, error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener registros',
    }, { status: 500 });
  }
}

/**
 * POST /api/[entidad]
 * Crea un nuevo registro
 */
export async function POST(request: NextRequest) {
  let body: Create[Entidad]DTO | null = null;
  try {
    body = await request.json() as Create[Entidad]DTO;

    // Validar campos requeridos
    if (!body.CAMPO_REQUERIDO) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo CAMPO_REQUERIDO es requerido',
      }, { status: 400 });
    }

    // Construir query dinámica
    const fields: string[] = [];
    const values: string[] = [];
    const params: Record<string, unknown> = {};

    if (body.CAMPO !== undefined) {
      fields.push('CAMPO');
      values.push('@CAMPO');
      params.CAMPO = body.CAMPO;
    }

    const sqlQuery = `
      INSERT INTO [[ENTIDAD]]] (${fields.join(', ')})
      OUTPUT INSERTED.*
      VALUES (${values.join(', ')})`;

    const result = await query<[Entidad]>(sqlQuery, params);

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Registro creado exitosamente',
    }, { status: 201 });

  } catch (error) {
    console.error(`Error en POST /api/[entidad]:`, error);
    
    // Detectar errores específicos (ej: UNIQUE KEY constraint)
    if (error instanceof Error) {
      const errorMessage = error.message;
      const errorCode = (error as any).number;
      
      // Error 2627 es violación de UNIQUE KEY constraint en SQL Server
      if (errorCode === 2627 || errorMessage.includes('UNIQUE KEY constraint')) {
        let valorDuplicado = 'este valor';
        if (body?.CAMPO) {
          valorDuplicado = `"${body.CAMPO}"`;
        } else {
          const match = errorMessage.match(/duplicate key value is \(([^)]+)\)/i);
          if (match && match[1]) {
            valorDuplicado = `"${match[1]}"`;
          }
        }
        
        return NextResponse.json({
          success: false,
          data: null,
          message: `El valor ${valorDuplicado} ya existe. Por favor, elija otro valor.`,
        }, { status: 409 }); // 409 Conflict
      }
    }
    
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear registro',
    }, { status: 500 });
  }
}
```

### 2.2. Route por ID (`src/app/api/(controller)/[entidad]/[id]/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { [Entidad], Update[Entidad]DTO } from '@/models';

/**
 * GET /api/[entidad]/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'ID inválido',
      }, { status: 400 });
    }

    const result = await query<[Entidad]>(
      'SELECT * FROM [[ENTIDAD]]] WHERE ID_[ENT] = @ID',
      { ID: id }
    );

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Registro no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Registro encontrado',
    }, { status: 200 });

  } catch (error) {
    console.error(`Error en GET /api/[entidad]/[id]:`, error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener registro',
    }, { status: 500 });
  }
}

/**
 * PUT /api/[entidad]/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body: Update[Entidad]DTO = await request.json();

    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'ID inválido',
      }, { status: 400 });
    }

    // Construir SET clause dinámico
    const updates: string[] = [];
    const queryParams: Record<string, unknown> = { ID: id };

    if (body.CAMPO !== undefined) {
      updates.push('CAMPO = @CAMPO');
      queryParams.CAMPO = body.CAMPO;
    }

    if (updates.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'No hay campos para actualizar',
      }, { status: 400 });
    }

    const sqlQuery = `
      UPDATE [[ENTIDAD]]] 
      SET ${updates.join(', ')}
      OUTPUT INSERTED.*
      WHERE ID_[ENT] = @ID`;

    const result = await query<[Entidad]>(sqlQuery, queryParams);

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Registro no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Registro actualizado exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error(`Error en PUT /api/[entidad]/[id]:`, error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar registro',
    }, { status: 500 });
  }
}

/**
 * DELETE /api/[entidad]/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'ID inválido',
      }, { status: 400 });
    }

    const sqlQuery = `
      DELETE FROM [[ENTIDAD]]]
      OUTPUT DELETED.*
      WHERE ID_[ENT] = @ID`;

    const result = await query<[Entidad]>(sqlQuery, { ID: id });

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'Registro no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Registro eliminado exitosamente',
    }, { status: 200 });

  } catch (error) {
    console.error(`Error en DELETE /api/[entidad]/[id]:`, error);
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar registro',
    }, { status: 500 });
  }
}
```

**⚠️ Nota importante:** En el PUT, usa `queryParams` en lugar de `params` para evitar conflictos con el parámetro `params` de la función.

---

## 📝 Paso 3: Crear API Client

**Archivo:** `src/lib/api/[entidad]-api.ts`

```typescript
import type { 
  [Entidad], 
  Create[Entidad]DTO, 
  Update[Entidad]DTO,
  [Entidad]Filters 
} from '@/models';
import type { DbActionResult } from '@/types/common';

/**
 * Obtiene todos los registros
 */
export async function getAll[Entidad]s(
  filters?: [Entidad]Filters
): Promise<DbActionResult<[Entidad][]>> {
  try {
    const params = new URLSearchParams();
    if (filters?.CAMPO) params.append('CAMPO', filters.CAMPO);

    const url = `/api/[entidad]${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener registros',
    };
  }
}

/**
 * Obtiene un registro por ID
 */
export async function get[Entidad]ById(
  id: number
): Promise<DbActionResult<[Entidad]>> {
  try {
    const response = await fetch(`/api/[entidad]/${id}`);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener registro',
    };
  }
}

/**
 * Crea un nuevo registro
 */
export async function create[Entidad](
  data: Create[Entidad]DTO
): Promise<DbActionResult<[Entidad]>> {
  try {
    const response = await fetch('/api/[entidad]', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear registro',
    };
  }
}

/**
 * Actualiza un registro
 */
export async function update[Entidad](
  id: number,
  data: Update[Entidad]DTO
): Promise<DbActionResult<[Entidad]>> {
  try {
    const response = await fetch(`/api/[entidad]/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar registro',
    };
  }
}

/**
 * Elimina un registro
 */
export async function delete[Entidad](
  id: number
): Promise<DbActionResult<[Entidad]>> {
  try {
    const response = await fetch(`/api/[entidad]/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar registro',
    };
  }
}
```

---

## 📝 Paso 4: Crear Columnas con Edición Inline

**Archivo:** `src/components/(views)/(tables)/[entidad]/[entidad]-columns.tsx`

```typescript
import { ColumnDef } from "@tanstack/react-table";
import type { [Entidad], [EntidadRelacionada] } from "@/models";
import { ActionsCell, EditableCell } from "@/lib/utils/tanktable-enhanted/component/actions-cell";
import { Loader2 } from "lucide-react";

interface [Entidad]ColumnsProps {
  // Datos para selects (si hay relaciones)
  [entidadRelacionada]s?: [EntidadRelacionada][];
  // Estados de loading
  updatingIds?: Set<number>;
  deletingIds?: Set<number>;
}

export const create[Entidad]Columns = (
  props?: [Entidad]ColumnsProps
): ColumnDef<[Entidad]>[] => {
  const { 
    [entidadRelacionada]s = [], 
    updatingIds = new Set(), 
    deletingIds = new Set() 
  } = props || {};

  return [
    {
      accessorKey: "ID_[ENT]",
      header: "ID",
      cell: ({ getValue }) => {
        const value = getValue<number>();
        return <span className="font-mono text-sm">{value}</span>;
      },
    },
    {
      accessorKey: "CAMPO",
      header: "Campo",
      cell: ({ row }) => {
        const isUpdating = updatingIds.has(row.original.ID_[ENT]);
        return (
          <div className="flex items-center gap-2">
            <EditableCell<[Entidad], "CAMPO">
              row={row}
              field="CAMPO"
              inputType="text"
            />
            {isUpdating && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        );
      },
    },
    // Campo con relación (select)
    {
      accessorKey: "ID_RELACION",
      header: "Relación",
      cell: ({ row }) => (
        <EditableCell<[Entidad], "ID_RELACION">
          row={row}
          field="ID_RELACION"
          inputType="select"
          meta={{
            options: [
              { value: null, label: 'Sin relación' },
              ...[entidadRelacionada]s.map((item) => ({
                value: item.ID_[REL],
                label: item.NOMBRE,
              })),
            ],
            encode: (v: unknown) => (v === null || v === undefined ? '__null__' : String(v)),
            decode: (s: string) => (s === '__null__' ? null : Number(s)),
          }}
        />
      ),
    },
    // Columna de acciones
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row, table }) => {
        const meta = table.options.meta;
        const isUpdating = updatingIds.has(row.original.ID_[ENT]);
        const isDeleting = deletingIds.has(row.original.ID_[ENT]);
        
        if (isUpdating || isDeleting) {
          return (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {isUpdating ? 'Guardando...' : 'Eliminando...'}
              </span>
            </div>
          );
        }
        
        return (
          <ActionsCell
            row={row}
            onRowSave={meta?.onRowSave}
            onRowDelete={meta?.onRowDelete}
          />
        );
      },
    },
  ];
};

// Export default columns para compatibilidad
export const [entidad]Columns = create[Entidad]Columns();
```

**Notas importantes:**
- Usa `EditableCell` para campos editables inline
- Para selects con valores null, usa `'__null__'` como valor especial (no `''`)
- Pasa `updatingIds` y `deletingIds` para mostrar loading states

---

## 📝 Paso 5: Crear Componente List con CRUD Completo

**Archivo:** `src/components/(views)/(tables)/[entidad]/[Entidad]List.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { TankTable, type LoadingStates } from '@/lib/utils/tanktable-enhanted';
import { 
  getAll[Entidad]s, 
  create[Entidad], 
  update[Entidad], 
  delete[Entidad],
  // Si hay relaciones, importar también
  getAll[EntidadRelacionada]s
} from '@/lib/api';
import type { 
  [Entidad], 
  Create[Entidad]DTO, 
  Update[Entidad]DTO,
  [EntidadRelacionada]
} from '@/models';
import { create[Entidad]Columns } from './[entidad]-columns';
import { toast } from 'sonner';

export function [Entidad]List() {
  // Estados principales
  const [[entidad]s, set[Entidad]s] = useState<[Entidad][]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para relaciones (si aplica)
  const [[entidadRelacionada]s, set[EntidadRelacionada]s] = useState<[EntidadRelacionada][]>([]);
  
  // Estados de loading para operaciones
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Cargar datos principales y relaciones en paralelo
      const [[entidad]sResult, [entidadRelacionada]sResult] = await Promise.all([
        getAll[Entidad]s(),
        getAll[EntidadRelacionada]s(), // Si hay relaciones
      ]);

      if ([entidad]sResult.success && [entidad]sResult.data) {
        set[Entidad]s([entidad]sResult.data);
      }
      if ([entidadRelacionada]sResult.success && [entidadRelacionada]sResult.data) {
        set[EntidadRelacionada]s([entidadRelacionada]sResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: [Entidad]) => {
    try {
      setCreating(true);
      const createData: Create[Entidad]DTO = {
        CAMPO: data.CAMPO,
        // ... otros campos
      };

      const result = await create[Entidad](createData);
      if (result.success && result.data) {
        // Actualización optimista: agregar al estado local
        set[Entidad]s((prev) => [...prev, result.data!]);
        // El toast se muestra automáticamente desde use-form-handlers
      } else {
        const errorMessage = result.message || 'Error al crear registro';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating [entidad]:', error);
      if (!(error instanceof Error && error.message)) {
        toast.error('Error al crear registro');
      }
      throw error; // Re-lanzar para que el formulario no se cierre
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (data: [Entidad]) => {
    try {
      setUpdatingIds((prev) => new Set(prev).add(data.ID_[ENT]));
      const updateData: Update[Entidad]DTO = {
        CAMPO: data.CAMPO,
        // ... otros campos
      };

      const result = await update[Entidad](data.ID_[ENT], updateData);
      if (result.success && result.data) {
        // Actualización optimista: actualizar solo el registro modificado
        set[Entidad]s((prev) =>
          prev.map((item) =>
            item.ID_[ENT] === data.ID_[ENT] ? result.data! : item
          )
        );
        // El toast se muestra automáticamente desde use-form-handlers
      } else {
        toast.error(result.message || 'Error al actualizar registro');
      }
    } catch (error) {
      console.error('Error updating [entidad]:', error);
      toast.error('Error al actualizar registro');
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(data.ID_[ENT]);
        return next;
      });
    }
  };

  const handleDelete = async (data: [Entidad]) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(data.ID_[ENT]));
      const result = await delete[Entidad](data.ID_[ENT]);
      if (result.success) {
        // Actualización optimista: eliminar del estado local
        set[Entidad]s((prev) =>
          prev.filter((item) => item.ID_[ENT] !== data.ID_[ENT])
        );
        // El toast se muestra automáticamente desde use-form-handlers
      } else {
        toast.error(result.message || 'Error al eliminar registro');
      }
    } catch (error) {
      console.error('Error deleting [entidad]:', error);
      toast.error('Error al eliminar registro');
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(data.ID_[ENT]);
        return next;
      });
    }
  };

  const loadingStates: LoadingStates = {
    loading,
    loadingRows: 8,
  };

  const columns = create[Entidad]Columns({ 
    [entidadRelacionada]s,
    updatingIds,
    deletingIds,
  });

  return (
    <div className="space-y-4">
      <TankTable
        data={[entidad]s}
        columns={columns}
        showPagination={true}
        showAdd={true}
        addButtonLabel="Agregar [Entidad]"
        loadingStates={loadingStates}
        exportOptions={{
          formats: ['csv', 'json'],
          filename: '[entidad]s',
        }}
        onRowSave={handleUpdate}
        onRowDelete={handleDelete}
        createForm={{
          title: 'Agregar Nuevo [Entidad]',
          submitLabel: creating ? 'Creando...' : 'Crear',
          cancelLabel: 'Cancelar',
          fields: [
            {
              name: 'CAMPO',
              label: 'Campo',
              inputType: 'text',
              required: true,
              placeholder: 'Ingrese el valor',
            },
            // Campo con relación (select)
            {
              name: 'ID_RELACION',
              label: 'Relación',
              inputType: 'select',
              options: [
                { value: null, label: 'Sin relación' },
                ...[entidadRelacionada]s.map((item) => ({
                  value: item.ID_[REL],
                  label: item.NOMBRE,
                })),
              ],
              encode: (v) => (v === null || v === undefined ? '__null__' : String(v)),
              decode: (s) => (s === '__null__' ? null : Number(s)),
            },
          ],
          onSubmit: handleCreate,
          successMessage: 'Registro creado exitosamente',
        }}
        deleteConfirm={{
          title: 'Eliminar [Entidad]',
          description: (row) =>
            `¿Está seguro de que desea eliminar este registro? Esta acción no se puede deshacer.`,
          confirmLabel: 'Eliminar',
          cancelLabel: 'Cancelar',
          successMessage: 'Registro eliminado exitosamente',
        }}
        updateSuccessMessage="Registro actualizado exitosamente"
      />
    </div>
  );
}
```

**Características clave:**
- ✅ Estados de loading separados para cada operación
- ✅ Actualización optimista (sin recargar toda la tabla)
- ✅ Manejo de errores con mensajes claros
- ✅ El formulario no se cierra si hay error
- ✅ Loading visual en columnas y acciones

---

## 📝 Paso 6: Crear la Página

**Archivo:** `src/app/[entidad]s/page.tsx`

```typescript
import { [Entidad]List } from "@/components/(views)";

export default function [Entidad]sPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">[Entidad]s</h1>
        <p className="text-muted-foreground">
          Gestión de [entidad]s del sistema
        </p>
      </div>
      <[Entidad]List />
    </div>
  );
}
```

---

## 📝 Paso 7: Actualizar Exports

### 7.1. Models (`src/models/index.ts`)
```typescript
export * from './[entidad].model';
```

### 7.2. API Clients (`src/lib/api/index.ts`)
```typescript
export * from './[entidad]-api';
```

### 7.3. Views (`src/components/(views)/index.ts`)
```typescript
export * from './(tables)/[entidad]/[Entidad]List';
```

---

## 🎯 Patrones y Mejores Prácticas

### 1. **Actualización Optimista**
```typescript
// ✅ CORRECTO: Actualizar estado local directamente
setUsuarios((prev) => prev.map(u => u.ID === id ? updated : u));

// ❌ INCORRECTO: Recargar toda la tabla
await loadData(); // Esto causa parpadeo y es más lento
```

### 2. **Estados de Loading**
```typescript
// Usar Sets para rastrear múltiples operaciones simultáneas
const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());

// Agregar ID al set antes de la operación
setUpdatingIds((prev) => new Set(prev).add(id));

// Remover ID después (en finally)
setUpdatingIds((prev) => {
  const next = new Set(prev);
  next.delete(id);
  return next;
});
```

### 3. **Manejo de Errores en API**
```typescript
// ✅ CORRECTO: Declarar body fuera del try
let body: CreateDTO | null = null;
try {
  body = await request.json();
  // ...
} catch (error) {
  // Ahora body está disponible aquí
  if (body?.CAMPO) { /* ... */ }
}
```

### 4. **Valores Null en Selects**
```typescript
// ✅ CORRECTO: Usar '__null__' como valor especial
encode: (v) => (v === null ? '__null__' : String(v)),
decode: (s) => (s === '__null__' ? null : Number(s)),

// ❌ INCORRECTO: Usar '' (causa error en SelectItem)
encode: (v) => (v === null ? '' : String(v)), // ❌
```

### 5. **Conflictos de Nombres en PUT**
```typescript
// ✅ CORRECTO: Usar queryParams en lugar de params
const queryParams: Record<string, unknown> = { ID: id };

// ❌ INCORRECTO: Usar params (conflicto con params de la función)
const params: Record<string, unknown> = { ID: id }; // ❌
```

### 6. **Errores de UNIQUE KEY**
```typescript
// Detectar y mostrar mensaje amigable
if (errorCode === 2627 || errorMessage.includes('UNIQUE KEY constraint')) {
  return NextResponse.json({
    success: false,
    message: `El valor "${valor}" ya existe. Por favor, elija otro.`,
  }, { status: 409 });
}
```

---

## ✅ Checklist de Implementación

Al implementar un nuevo CRUD, verifica:

- [ ] Model creado con interfaces y DTOs
- [ ] API Routes (GET, POST, PUT, DELETE) implementadas
- [ ] Manejo de errores específicos (UNIQUE KEY, etc.)
- [ ] API Client con todas las funciones
- [ ] Columnas con EditableCell para campos editables
- [ ] Columna de acciones con ActionsCell
- [ ] Estados de loading (updatingIds, deletingIds, creating)
- [ ] Indicadores visuales de loading (spinners)
- [ ] Actualización optimista del estado
- [ ] Formulario de creación con validación
- [ ] Confirmación de eliminación
- [ ] Relaciones cargadas (si aplica)
- [ ] Selects con valores null manejados correctamente
- [ ] Página creada
- [ ] Exports actualizados en index.ts
- [ ] Sin errores de linting

---

## 📚 Ejemplo Completo: USUARIO

La tabla **USUARIO** es el ejemplo de referencia completo con todas las características:

- ✅ CRUD completo
- ✅ Edición inline
- ✅ Relaciones con ROL y DISCIPLINA
- ✅ Estados de loading
- ✅ Actualización optimista
- ✅ Manejo de errores (UNIQUE KEY)
- ✅ Formulario de creación
- ✅ Confirmación de eliminación

**Archivos de referencia:**
- `src/models/usuario.model.ts`
- `src/app/api/(controller)/usuario/route.ts`
- `src/app/api/(controller)/usuario/[id]/route.ts`
- `src/lib/api/usuario-api.ts`
- `src/components/(views)/(tables)/usuario/usuario-columns.tsx`
- `src/components/(views)/(tables)/usuario/UsuarioList.tsx`
- `src/app/usuarios/page.tsx`

---

## ✅ Características Implementadas

### API Routes
- ✅ Validación de campos requeridos
- ✅ Manejo de errores con try/catch
- ✅ Detección de errores específicos (UNIQUE KEY, etc.)
- ✅ Respuestas JSON estandarizadas con `DbActionResult`
- ✅ Códigos de estado HTTP apropiados (200, 201, 400, 404, 409, 500)
- ✅ Queries SQL dinámicas con parámetros
- ✅ Uso de `OUTPUT INSERTED.*` para obtener registros creados/actualizados
- ✅ Manejo correcto de scope de variables (body fuera del try)

### API Clients
- ✅ Tipado completo con TypeScript
- ✅ Manejo de errores
- ✅ Construcción de query params para filtros
- ✅ Respuestas tipadas con `DbActionResult<T>`

### Componentes TankTable
- ✅ Estados de carga con skeleton
- ✅ Paginación automática
- ✅ Búsqueda global
- ✅ Exportación a CSV y JSON
- ✅ Responsive (tabla en desktop, cards en mobile)
- ✅ Tema dark integrado
- ✅ **Edición inline con EditableCell**
- ✅ **Estados de loading visuales**
- ✅ **Actualización optimista del estado**
- ✅ **Formularios de creación con validación**
- ✅ **Confirmación de eliminación**

## ✅ Estado de Implementación

### Completado:
- ✅ Models (TypeScript interfaces)
- ✅ API Routes (CRUD completo)
- ✅ API Clients (helpers tipados)
- ✅ Column Definitions (TanStack Table)
- ✅ List Components (React con TankTable)
- ✅ **Páginas de UI** (5 páginas creadas)

### Próximos Pasos Sugeridos:

Para continuar expandiendo el sistema, considera implementar:

1. **Formularios de creación/edición** con validación
2. **Modales de confirmación** para eliminación
3. **Búsquedas avanzadas** con múltiples filtros
4. **Auditoría** de cambios en las tablas maestras
5. **Permisos y roles** para restricción de operaciones CRUD
6. **Navegación principal** con links a todas las tablas maestras

## 📖 Documentación

Para más detalles sobre la arquitectura y ejemplos completos, consulta:
- `STRUCTURE.md` - Documentación completa de la arquitectura MVC
- `bd_taskrecord.md` - Esquema completo de la base de datos

---

**Fecha de implementación:** Noviembre 2025  
**Arquitectura:** MVC con Next.js App Router  
**Base de datos:** SQL Server (TaskRecord)  
**Framework UI:** shadcn/ui + TanStack Table

