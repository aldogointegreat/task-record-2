# Estructura MVC de la Aplicación

Esta aplicación está organizada siguiendo el patrón **Model-View-Controller (MVC)** adaptado para Next.js con App Router.

## 📁 Estructura de Carpetas

```
src/
├── app/                    # Next.js App Router
│   ├── api/              # API Routes (REST endpoints)
│   │   └── (controller)/     # Controladores API (organización)
│   │       ├── disciplina/     # Endpoints de disciplinas
│   │       ├── rol/            # Endpoints de roles
│   │       ├── jerarquia/      # Endpoints de jerarquías
│   │       ├── atributo/       # Endpoints de atributos
│   │       └── entrega/        # Endpoints de entregas
│   ├── disciplinas/      # Página de Disciplinas
│   │   └── page.tsx
│   ├── roles/            # Página de Roles
│   │   └── page.tsx
│   ├── jerarquias/       # Página de Jerarquías
│   │   └── page.tsx
│   ├── atributos/        # Página de Atributos
│   │   └── page.tsx
│   ├── entregas/         # Página de Entregas
│   │   └── page.tsx
│   └── page.tsx          # Página principal
├── models/               # Models (Tipos/Interfaces)
│   ├── disciplina.model.ts   # Modelo de DISCIPLINA
│   ├── rol.model.ts          # Modelo de ROL
│   ├── jerarquia.model.ts    # Modelo de JERARQUIA
│   ├── atributo.model.ts     # Modelo de ATRIBUTO
│   ├── entrega.model.ts      # Modelo de ENTREGA
│   └── index.ts
├── types/                # Tipos comunes
│   └── common.ts             # Tipos compartidos
├── lib/                  # Utilidades
│   ├── api/              # Clientes API (helpers para endpoints REST)
│   │   ├── disciplina-api.ts    # Cliente API para disciplinas
│   │   ├── rol-api.ts           # Cliente API para roles
│   │   ├── jerarquia-api.ts     # Cliente API para jerarquías
│   │   ├── atributo-api.ts      # Cliente API para atributos
│   │   ├── entrega-api.ts       # Cliente API para entregas
│   │   └── index.ts             # Exportaciones centralizadas
│   ├── db.ts                  # Conexión a base de datos
│   ├── db.config.ts           # Configuración de BD
│   └── utils/
│       └── tanktable-enhanted/  # Sistema de tablas TanStack
│           ├── component/       # Componentes de tabla
│           ├── hooks/           # Hooks personalizados
│           ├── types/           # Tipos TypeScript
│           └── index.ts         # Exportaciones
└── components/           # Componentes y Views
    ├── (views)/             # Views (Componentes React)
    │   ├── (tables)/         # Vistas de tablas/datos
    │   │   ├── disciplina/
    │   │   │   ├── DisciplinaList.tsx       # Lista de disciplinas
    │   │   │   └── disciplina-columns.tsx   # Definición de columnas
    │   │   ├── rol/
    │   │   │   ├── RolList.tsx              # Lista de roles
    │   │   │   └── rol-columns.tsx          # Definición de columnas
    │   │   ├── jerarquia/
    │   │   │   ├── JerarquiaList.tsx        # Lista de jerarquías
    │   │   │   └── jerarquia-columns.tsx    # Definición de columnas
    │   │   ├── atributo/
    │   │   │   ├── AtributoList.tsx         # Lista de atributos
    │   │   │   └── atributo-columns.tsx     # Definición de columnas
    │   │   └── entrega/
    │   │       ├── EntregaList.tsx          # Lista de entregas
    │   │       └── entrega-columns.tsx      # Definición de columnas
    │   ├── (use cases)/      # Casos de uso / Componentes de lógica de negocio
    │   │   └── ... (casos de uso)
    │   └── index.ts          # Exportaciones centralizadas
    ├── ui/                   # Componentes de shadcn
    └── theme-provider.tsx    # Provider de tema
```

## 🏗️ Arquitectura MVC

### 📊 Jerarquía de Carpetas con `()`

Las carpetas con paréntesis `()` en Next.js son **Route Groups** que ayudan a organizar el código sin afectar las URLs:

- **`(controller)`**: Organiza los controladores API en `app/api/(controller)/`
  - Los archivos dentro de `(controller)` no afectan la URL final
  - `app/api/(controller)/actividad/route.ts` → URL: `/api/actividad`
  - Facilita la organización y agrupación lógica de controladores

- **`(views)`**: Organiza las vistas en `components/(views)/`
  - `(tables)`: Vistas de tablas y datos tabulares
  - `(use cases)`: Casos de uso y componentes de lógica de negocio

**Ventajas**:
- ✅ Organización clara y jerárquica
- ✅ No afecta las URLs finales
- ✅ Facilita el mantenimiento y la navegación del código
- ✅ Permite agrupar funcionalidades relacionadas

### **Models** (`src/models/`)
Define la estructura de datos y tipos TypeScript.

- Cada modelo representa una tabla de la base de datos
- Incluye interfaces principales, DTOs para crear/actualizar, y tipos de filtros
- Tipos exportados para uso en toda la aplicación

**Tablas Maestras Implementadas:**
- `disciplina.model.ts`: Interfaz `Disciplina`, DTOs y filtros
- `rol.model.ts`: Interfaz `Rol`, DTOs y filtros
- `jerarquia.model.ts`: Interfaz `Jerarquia`, DTOs y filtros
- `atributo.model.ts`: Interfaz `Atributo`, DTOs y filtros
- `entrega.model.ts`: Interfaz `Entrega`, DTOs y filtros

**Ejemplo:**
```typescript
export interface Disciplina {
  ID_DIS: number;
  NOMBRE: string;
}

export interface CreateDisciplinaDTO {
  NOMBRE: string;
}

export interface UpdateDisciplinaDTO {
  NOMBRE?: string;
}

export interface DisciplinaFilters {
  NOMBRE?: string;
}
```

### **API Routes** (`src/app/api/(controller)/`)
Endpoints REST HTTP que contienen toda la lógica de negocio y acceso a datos.

- **Organización**: La carpeta `(controller)` agrupa todos los controladores API sin afectar las URLs
- `api/(controller)/actividad/route.ts`: GET (listar) y POST (crear) → `/api/actividad`
- `api/(controller)/actividad/[id]/route.ts`: GET, PUT, DELETE por ID → `/api/actividad/[id]`
- Cada endpoint maneja un método HTTP específico
- Contienen toda la lógica: parsing de request, validación, consultas SQL, y respuestas HTTP
- Retornan `NextResponse` con JSON
- Compatibles con estándares REST
- Diseñadas para ser consumidas desde cualquier cliente (web, mobile, etc.)
- **Nota**: Las carpetas con `()` no afectan la URL final (Next.js route groups)

**Ejemplo:**
```typescript
// src/app/api/(controller)/actividad/route.ts
// GET /api/actividad
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filters: ActividadFilters = {};
  
  // Construir filtros desde query params
  if (searchParams.has('HABILITADO')) {
    filters.HABILITADO = searchParams.get('HABILITADO') === 'true';
  }
  
  // Construir condiciones WHERE y ejecutar query
  let whereClause = 'WHERE 1=1';
  const params: Record<string, unknown> = {};
  
  if (filters.HABILITADO !== undefined) {
    whereClause += ' AND HABILITADO = @HABILITADO';
    params.HABILITADO = filters.HABILITADO ? 1 : 0;
  }
  
  const result = await query<Actividad>(
    `SELECT * FROM ACTIVIDAD ${whereClause} ORDER BY ID_ACT DESC`,
    params
  );
  
  return NextResponse.json({
    success: true,
    data: result,
    message: `Se encontraron ${result.length} actividades`,
  }, { status: 200 });
}

// POST /api/actividad
export async function POST(request: NextRequest) {
  const body: CreateActividadDTO = await request.json();
  
  // Construir query dinámica y ejecutar
  const fields: string[] = [];
  const values: string[] = [];
  const params: Record<string, unknown> = {};
  
  if (body.TITULO !== undefined) {
    fields.push('TITULO');
    values.push('@TITULO');
    params.TITULO = body.TITULO;
  }
  
  const sqlQuery = `
    INSERT INTO ACTIVIDAD (${fields.join(', ')})
    OUTPUT INSERTED.*
    VALUES (${values.join(', ')})`;
  
  const result = await query<Actividad>(sqlQuery, params);
  
  return NextResponse.json({
    success: true,
    data: result[0],
    message: 'Actividad creada exitosamente',
  }, { status: 201 });
}
```

### **API Clients** (`src/lib/api/`)
Helpers para hacer peticiones a los endpoints REST desde el cliente.

- `actividad-api.ts`: Cliente API para actividades
- Facilita las llamadas fetch con tipos TypeScript
- Mantiene compatibilidad con código existente

**Ejemplo:**
```typescript
import { getAllActividades, createActividad } from '@/lib/api';

// Uso en componente
const result = await getAllActividades({ HABILITADO: true });
```

### **Views** (`src/components/(views)/`)
Componentes React que muestran la interfaz de usuario.

#### **Tables** (`src/components/(views)/(tables)/`)
Vistas de tablas y datos tabulares:
- `actividad/ActividadList.tsx`: Componente que usa TankTable
- `actividad/actividad-columns.tsx`: Definición de columnas para TankTable
- Todas las vistas de tablas se organizan aquí
- Son Client Components que consumen API Routes mediante API Clients

#### **Use Cases** (`src/components/(views)/(use cases)/`)
Componentes de casos de uso y lógica de negocio específica:
- Casos de uso complejos que no son solo tablas
- Componentes con lógica de negocio específica
- Flujos de trabajo y procesos

La carpeta `(views)` identifica claramente las vistas del patrón MVC, separadas en:
- `(tables)`: Para vistas de datos tabulares
- `(use cases)`: Para casos de uso y lógica de negocio

**Ejemplo:**
```typescript
'use client';
export function ActividadList() {
  return (
    <TankTable
      data={actividades}
      columns={actividadColumns}
      showPagination={true}
      // ... más props
    />
  );
}
```

### **Pages** (`src/app/[ruta]/page.tsx`)
Páginas de Next.js que organizan las vistas.

- `app/actividad/page.tsx`: Página principal de actividades (`/actividad`)
- `app/page.tsx`: Página principal que redirige a `/actividad`

## 📊 TankTable - Sistema de Tablas Estándar

Todas las tablas de la aplicación usan **TankTable**, un wrapper de TanStack Table con funcionalidades avanzadas.

### Características de TankTable

- **Paginación**: Controles de paginación personalizables
- **Búsqueda global**: Búsqueda en tiempo real
- **Ordenamiento**: Ordenamiento por columnas
- **Visibilidad de columnas**: Mostrar/ocultar columnas
- **Exportación**: Exportar a CSV/JSON
- **Filtros avanzados**: Filtros personalizables
- **Virtualización**: Para grandes conjuntos de datos
- **Estados de carga**: Loading, error, empty states
- **Responsive**: Vista de tabla en desktop, cards en mobile
- **Tema dark**: Integrado con shadcn/ui

### Crear una nueva tabla

1. **Definir las columnas** (`*-columns.tsx`) en `src/components/(views)/(tables)/[entidad]/`:
```typescript
// src/components/(views)/(tables)/mi-modelo/mi-modelo-columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import type { MiModelo } from "@/models/mi-modelo.model";

export const miModeloColumns: ColumnDef<MiModelo>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ getValue }) => <span>{getValue<string>()}</span>,
  },
  // ... más columnas
];
```

2. **Usar TankTable** en el componente en `src/components/(views)/(tables)/[entidad]/`:
```typescript
// src/components/(views)/(tables)/mi-modelo/MiModeloList.tsx
'use client';
import { TankTable, type LoadingStates } from '@/lib/utils/tanktable-enhanted';
import { miModeloColumns } from './mi-modelo-columns';

export function MiModeloList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadingStates: LoadingStates = {
    loading,
    loadingRows: 8,
  };

  return (
    <TankTable
      data={data}
      columns={miModeloColumns}
      showPagination={true}
      loadingStates={loadingStates}
      exportOptions={{
        formats: ['csv', 'json'],
        filename: 'mi-modelo',
      }}
    />
  );
}
```

3. **Exportar** desde `src/components/(views)/index.ts`:
```typescript
export * from './(tables)/mi-modelo/MiModeloList';
```

## 🔄 Flujo de Datos

```
┌─────────────┐
│   Page      │ (Página Next.js)
│ (page.tsx)  │
└──────┬──────┘
       │ usa
       ▼
┌─────────────┐
│   View      │ (Componente React)
│ (Component) │
└──────┬──────┘
       │ usa
       ▼
┌─────────────┐
│  TankTable  │ (Tabla con datos)
│   (View)    │
└──────┬──────┘
       │ llama
       ▼
┌─────────────┐
│ API Client  │ (Cliente API Helper)
│ (lib/api/)  │
└──────┬──────┘
       │ fetch HTTP
       ▼
┌─────────────┐
│ API Route   │ (Lógica completa: HTTP + SQL)
│ (api/(controller)/) │
└──────┬──────┘
       │ usa
       ▼
┌─────────────┐
│   Model     │ (Tipo TypeScript)
│  (Model)    │
└──────┬──────┘
       │ mapea desde
       ▼
┌─────────────┐
│  Database   │ (SQL Server)
│    Table    │
└─────────────┘
```

## 📝 Convenciones

### Naming
- **Models**: `*.model.ts` (ej: `actividad.model.ts`)
- **API Routes**: `route.ts` dentro de `api/(controller)/[entidad]/` (ej: `api/(controller)/actividad/route.ts`)
- **Views**: PascalCase (ej: `ActividadList.tsx`)
- **Columns**: `*-columns.tsx` (ej: `actividad-columns.tsx`)
- **Pages**: `page.tsx` dentro de carpetas con nombre de ruta
- **API Clients**: `*-api.ts` (ej: `actividad-api.ts`)

### Rutas
- Las rutas se crean automáticamente según la estructura de carpetas en `app/`
- `app/actividad/page.tsx` → `/actividad`
- `app/page.tsx` → `/` (raíz)

### API Routes
- **Lógica completa** en `src/app/api/(controller)/[entidad]/`
- **Organización**: La carpeta `(controller)` agrupa todos los controladores API sin afectar las URLs
- Contienen toda la lógica: parsing de requests, validación, consultas SQL, y respuestas HTTP
- Cada endpoint maneja métodos HTTP (GET, POST, PUT, DELETE)
- Retornan `NextResponse` con `DbActionResult<T>`
- Fáciles de migrar a nube/microservicios
- Compatibles con estándares REST
- Diseñadas para ser consumidas desde cualquier cliente (web, mobile, etc.)
- **Nota**: Las carpetas con `()` son route groups de Next.js y no afectan la URL final

### API Clients
- Helpers en `src/lib/api/`
- Facilita las llamadas fetch desde componentes
- Mantiene tipos TypeScript
- Exporta funciones compatibles con código legacy

### Componentes
- Client Components cuando necesitan interactividad
- Server Components cuando solo renderizan datos
- **Views - Tables**: Organizadas en `components/(views)/(tables)/` por entidad (ej: `components/(views)/(tables)/actividad/`)
- **Views - Use Cases**: Organizadas en `components/(views)/(use cases)/` por caso de uso
- **Componentes UI** globales en `components/ui/`
- La carpeta `(views)` identifica claramente las vistas del patrón MVC, separadas en:
  - `(tables)`: Vistas de tablas y datos tabulares
  - `(use cases)`: Casos de uso y componentes con lógica de negocio

### Tablas
- Usar TankTable para todas las tablas
- Definir columnas en archivo separado `*-columns.tsx`
- Configurar paginación, búsqueda y exportación según necesidades

## 🚀 Agregar Nueva Entidad

Para agregar una nueva entidad (ej: `Tarea`):

1. **Model**: Crear `src/models/tarea.model.ts`
2. **API Routes**: Crear `src/app/api/(controller)/tarea/route.ts` y `src/app/api/(controller)/tarea/[id]/route.ts` (lógica completa)
3. **API Client**: Crear `src/lib/api/tarea-api.ts`
4. **Columns**: Crear `src/components/(views)/(tables)/tarea/tarea-columns.tsx`
5. **View**: Crear `src/components/(views)/(tables)/tarea/TareaList.tsx` (usando TankTable)
6. **Page**: Crear `src/app/tarea/page.tsx`
7. **Exportar**: Actualizar `index.ts` en cada carpeta
8. **Homepage**: ⚠️ **OBLIGATORIO** - Agregar acceso rápido en `src/app/page.tsx` en la sección "Tablas Maestras" con:
   - Título descriptivo
   - Descripción breve
   - Ícono apropiado (de lucide-react)
   - Color único (ej: `bg-[color]-500/10 text-[color]-500 border-[color]-500/20`)
   - Ruta correcta (`/tarea`)

### Agregar Nuevo Caso de Uso

Para agregar un caso de uso (ej: `GenerarReporte`):

1. **Component**: Crear `src/components/(views)/(use cases)/generar-reporte/GenerarReporte.tsx`
2. **Page**: Crear `src/app/generar-reporte/page.tsx` (si es necesario)
3. **Exportar**: Actualizar `index.ts` si es necesario

## 📚 Tablas Maestras Implementadas

Este proyecto incluye 5 tablas maestras con implementación completa MVC + TanStack Table:

### 1. DISCIPLINA
Tabla maestra de disciplinas/especialidades.

**Campos:**
- `ID_DIS`: INTEGER (PK, IDENTITY)
- `NOMBRE`: VARCHAR(255) NOT NULL

**Endpoints:**
- `GET /api/disciplina` - Listar todas
- `GET /api/disciplina/[id]` - Obtener por ID
- `POST /api/disciplina` - Crear nueva
- `PUT /api/disciplina/[id]` - Actualizar
- `DELETE /api/disciplina/[id]` - Eliminar

**Página:**
- `/disciplinas` - Vista de tabla con TankTable

### 2. ROL
Tabla maestra de roles de usuario.

**Campos:**
- `ID_ROL`: INTEGER (PK, IDENTITY)
- `NOMBRE`: VARCHAR(255) NOT NULL
- `ADMINISTRADOR`: BIT NOT NULL

**Endpoints:**
- `GET /api/rol` - Listar todos
- `GET /api/rol/[id]` - Obtener por ID
- `POST /api/rol` - Crear nuevo
- `PUT /api/rol/[id]` - Actualizar
- `DELETE /api/rol/[id]` - Eliminar

**Página:**
- `/roles` - Vista de tabla con TankTable

### 3. JERARQUIA
Tabla maestra de jerarquías.

**Campos:**
- `IDJ`: INTEGER (PK, IDENTITY)
- `DESCRIPCION`: VARCHAR(255) NOT NULL

**Endpoints:**
- `GET /api/jerarquia` - Listar todas
- `GET /api/jerarquia/[id]` - Obtener por ID
- `POST /api/jerarquia` - Crear nueva
- `PUT /api/jerarquia/[id]` - Actualizar
- `DELETE /api/jerarquia/[id]` - Eliminar

**Página:**
- `/jerarquias` - Vista de tabla con TankTable

### 4. ATRIBUTO
Tabla maestra de atributos.

**Campos:**
- `IDT`: INTEGER (PK, IDENTITY)
- `DESCRIPCION`: VARCHAR(255) NOT NULL

**Endpoints:**
- `GET /api/atributo` - Listar todos
- `GET /api/atributo/[id]` - Obtener por ID
- `POST /api/atributo` - Crear nuevo
- `PUT /api/atributo/[id]` - Actualizar
- `DELETE /api/atributo/[id]` - Eliminar

**Página:**
- `/atributos` - Vista de tabla con TankTable

### 5. ENTREGA
Tabla maestra de entregas.

**Campos:**
- `IDE`: INTEGER (PK, IDENTITY)
- `DESCRIPCION`: VARCHAR(255) NOT NULL
- `ORDEN`: INTEGER NOT NULL

**Endpoints:**
- `GET /api/entrega` - Listar todas
- `GET /api/entrega/[id]` - Obtener por ID
- `POST /api/entrega` - Crear nueva
- `PUT /api/entrega/[id]` - Actualizar
- `DELETE /api/entrega/[id]` - Eliminar

**Página:**
- `/entregas` - Vista de tabla con TankTable

## 📚 Ejemplo Completo: DISCIPLINA

### Model
```typescript
// src/models/disciplina.model.ts
export interface Disciplina {
  ID_DIS: number;
  NOMBRE: string;
}

export interface CreateDisciplinaDTO {
  NOMBRE: string;
}

export interface UpdateDisciplinaDTO {
  NOMBRE?: string;
}

export interface DisciplinaFilters {
  NOMBRE?: string;
}
```

### API Route (Lógica Completa)
```typescript
// src/app/api/(controller)/disciplina/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Disciplina, CreateDisciplinaDTO, DisciplinaFilters } from '@/models';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: DisciplinaFilters = {};
    
    if (searchParams.has('NOMBRE')) {
      filters.NOMBRE = searchParams.get('NOMBRE') || undefined;
    }
    
    let whereClause = 'WHERE 1=1';
    const params: Record<string, unknown> = {};
    
    if (filters.NOMBRE) {
      whereClause += ' AND NOMBRE LIKE @NOMBRE';
      params.NOMBRE = `%${filters.NOMBRE}%`;
    }
    
    const result = await query<Disciplina>(
      `SELECT * FROM DISCIPLINA ${whereClause} ORDER BY ID_DIS ASC`,
      params
    );
    
    return NextResponse.json({
      success: true,
      data: result,
      message: `Se encontraron ${result.length} disciplinas`,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener disciplinas',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateDisciplinaDTO = await request.json();
    
    if (!body.NOMBRE) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'El campo NOMBRE es requerido',
      }, { status: 400 });
    }
    
    const sqlQuery = `
      INSERT INTO DISCIPLINA (NOMBRE)
      OUTPUT INSERTED.*
      VALUES (@NOMBRE)`;
    
    const result = await query<Disciplina>(sqlQuery, { NOMBRE: body.NOMBRE });
    
    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Disciplina creada exitosamente',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear disciplina',
    }, { status: 500 });
  }
}
```

### API Client
```typescript
// src/lib/api/disciplina-api.ts
import type { Disciplina, CreateDisciplinaDTO, DisciplinaFilters } from '@/models';
import type { DbActionResult } from '@/types/common';

export async function getAllDisciplinas(
  filters?: DisciplinaFilters
): Promise<DbActionResult<Disciplina[]>> {
  try {
    const params = new URLSearchParams();
    if (filters?.NOMBRE) params.append('NOMBRE', filters.NOMBRE);
    
    const url = `/api/disciplina${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener disciplinas',
    };
  }
}

export async function createDisciplina(
  data: CreateDisciplinaDTO
): Promise<DbActionResult<Disciplina>> {
  try {
    const response = await fetch('/api/disciplina', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear disciplina',
    };
  }
}
```

### Columns
```typescript
// src/components/(views)/(tables)/disciplina/disciplina-columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import type { Disciplina } from "@/models";

export const disciplinaColumns: ColumnDef<Disciplina>[] = [
  {
    accessorKey: "ID_DIS",
    header: "ID",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <span className="font-mono text-sm">{value}</span>;
    },
  },
  {
    accessorKey: "NOMBRE",
    header: "Nombre",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <span className="font-medium">{value}</span>;
    },
  },
];
```

### View
```typescript
// src/components/(views)/(tables)/disciplina/DisciplinaList.tsx
'use client';

import { useState, useEffect } from 'react';
import { TankTable, type LoadingStates } from '@/lib/utils/tanktable-enhanted';
import { getAllDisciplinas } from '@/lib/api';
import type { Disciplina } from '@/models';
import { disciplinaColumns } from './disciplina-columns';

export function DisciplinaList() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDisciplinas();
  }, []);

  const loadDisciplinas = async () => {
    setLoading(true);
    const result = await getAllDisciplinas();
    if (result.success && result.data) {
      setDisciplinas(result.data);
    }
    setLoading(false);
  };

  const loadingStates: LoadingStates = {
    loading,
    loadingRows: 8,
  };

  return (
    <div className="space-y-4">
      <TankTable
        data={disciplinas}
        columns={disciplinaColumns}
        showPagination={true}
        loadingStates={loadingStates}
        exportOptions={{
          formats: ['csv', 'json'],
          filename: 'disciplinas',
        }}
      />
    </div>
  );
}
```

### Page
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

**Rutas disponibles:**
- `/disciplinas` - Página de disciplinas
- `/roles` - Página de roles
- `/jerarquias` - Página de jerarquías
- `/atributos` - Página de atributos
- `/entregas` - Página de entregas

## 🎨 Diseño y UI

- **Tema**: Dark por defecto (configurado con next-themes)
- **UI Library**: shadcn/ui (componentes accesibles y personalizables)
- **Tablas**: TankTable (TanStack Table con funcionalidades avanzadas)
- **Estilos**: Tailwind CSS v4
- **Fuentes**: Geist Sans y Geist Mono
