# Estructura MVC de la Aplicación

Esta aplicación está organizada siguiendo el patrón **Model-View-Controller (MVC)** adaptado para Next.js con App Router.

## 📁 Estructura de Carpetas

```
src/
├── app/                    # Next.js App Router
│   ├── actividad/         # Páginas de Actividades
│   │   └── page.tsx              # Página principal de actividades (/actividad)
│   └── page.tsx          # Página principal (redirige a /actividad)
├── backend/               # Backend - Controllers (Server Actions)
│   ├── (controller)/      # Carpeta de controllers
│   │   ├── actividad-actions.ts   # Controllers para ACTIVIDAD
│   │   ├── db-actions.ts          # Utilidades de BD
│   │   └── index.ts               # Exportaciones centralizadas
│   └── index.ts                   # Re-exporta desde (controller)
├── models/               # Models (Tipos/Interfaces)
│   ├── actividad.model.ts    # Modelo de ACTIVIDAD
│   └── index.ts
├── types/                # Tipos comunes
│   └── common.ts             # Tipos compartidos
├── lib/                  # Utilidades
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
    │   ├── actividad/
    │   │   ├── ActividadList.tsx        # Lista de actividades (usa TankTable)
    │   │   └── actividad-columns.tsx    # Definición de columnas
    │   └── index.ts
    ├── ui/                   # Componentes de shadcn
    └── theme-provider.tsx    # Provider de tema
```

## 🏗️ Arquitectura MVC

### **Models** (`src/models/`)
Define la estructura de datos y tipos TypeScript.

- `actividad.model.ts`: Interfaz `Actividad`, DTOs y filtros
- Cada modelo representa una tabla de la base de datos
- Tipos exportados para uso en toda la aplicación

**Ejemplo:**
```typescript
export interface Actividad {
  ID_ACT: number;
  TITULO?: string | null;
  DESCRIPCION?: string | null;
  // ...
}
```

### **Controllers** (`src/backend/(controller)/`)
Lógica de negocio usando Server Actions de Next.js.

- `actividad-actions.ts`: Funciones para CRUD de actividades
- Cada función es una Server Action (marcada con `'use server'`)
- Maneja validación, transformación de datos y errores
- Organizados en la carpeta `(controller)` para seguir el patrón MVC
- Ubicados en `backend/` para mejor organización y separación de concerns

**Ejemplo:**
```typescript
export async function getAllActividades(): Promise<DbActionResult<Actividad[]>> {
  // Lógica de negocio aquí
}
```

### **Views** (`src/components/(views)/`)
Componentes React que muestran la interfaz de usuario.

- `ActividadList.tsx`: Componente que usa TankTable
- `actividad-columns.tsx`: Definición de columnas para TankTable
- Son Client Components que consumen Server Actions
- Organizados en la carpeta `(views)` para seguir el patrón MVC

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

1. **Definir las columnas** (`*-columns.tsx`):
```typescript
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

2. **Usar TankTable** en el componente:
```typescript
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
│ Controller  │ (Server Action)
│  (Action)   │
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
- **Controllers**: `*-actions.ts` (ej: `actividad-actions.ts`)
- **Views**: PascalCase (ej: `ActividadList.tsx`)
- **Columns**: `*-columns.tsx` (ej: `actividad-columns.tsx`)
- **Pages**: `page.tsx` dentro de carpetas con nombre de ruta

### Rutas
- Las rutas se crean automáticamente según la estructura de carpetas en `app/`
- `app/actividad/page.tsx` → `/actividad`
- `app/page.tsx` → `/` (raíz)

### Server Actions
- Todas en `src/backend/(controller)/`
- Marcadas con `'use server'`
- Retornan `DbActionResult<T>`
- La carpeta `(controller)` identifica claramente los controllers del patrón MVC
- Organizadas en `backend/` para separación clara del código del frontend

### Componentes
- Client Components cuando necesitan interactividad
- Server Components cuando solo renderizan datos
- **Views** organizadas en `components/(views)/` por entidad (ej: `components/(views)/actividad/`)
- **Componentes UI** globales en `components/ui/`
- La carpeta `(views)` identifica claramente las vistas del patrón MVC

### Tablas
- Usar TankTable para todas las tablas
- Definir columnas en archivo separado `*-columns.tsx`
- Configurar paginación, búsqueda y exportación según necesidades

## 🚀 Agregar Nueva Entidad

Para agregar una nueva entidad (ej: `Tarea`):

1. **Model**: Crear `src/models/tarea.model.ts`
2. **Controller**: Crear `src/backend/(controller)/tarea-actions.ts`
3. **Columns**: Crear `src/components/(views)/tarea/tarea-columns.tsx`
4. **View**: Crear `src/components/(views)/tarea/TareaList.tsx` (usando TankTable)
5. **Page**: Crear `src/app/tarea/page.tsx`
6. **Exportar**: Actualizar `index.ts` en cada carpeta

## 📚 Ejemplo Completo: ACTIVIDAD

### Estructura de Rutas
- `/` → Redirige a `/actividad`
- `/actividad` → Lista de actividades

### Model
```typescript
// src/models/actividad.model.ts
export interface Actividad {
  ID_ACT: number;
  TITULO?: string | null;
  DESCRIPCION?: string | null;
  // ...
}
```

### Controller
```typescript
// src/backend/(controller)/actividad-actions.ts
'use server';
export async function getAllActividades() {
  const result = await query<Actividad>('SELECT * FROM ACTIVIDAD');
  return { success: true, data: result };
}
```

### Columns
```typescript
// src/components/(views)/actividad/actividad-columns.tsx
import { ColumnDef } from "@tanstack/react-table";

export const actividadColumns: ColumnDef<Actividad>[] = [
  { accessorKey: "ID_ACT", header: "ID" },
  { accessorKey: "TITULO", header: "Título" },
  // ...
];
```

### View
```typescript
// src/components/(views)/actividad/ActividadList.tsx
'use client';
import { TankTable } from '@/lib/utils/tanktable-enhanted';
import { actividadColumns } from './actividad-columns';

export function ActividadList() {
  return (
    <TankTable
      data={actividades}
      columns={actividadColumns}
      showPagination={true}
    />
  );
}
```

### Page
```typescript
// src/app/actividad/page.tsx
import { ActividadList } from "@/components/(views)/actividad/ActividadList";

export default function ActividadPage() {
  return (
    <div>
      <h1>Actividades</h1>
      <ActividadList />
    </div>
  );
}
```

## 🎨 Diseño y UI

- **Tema**: Dark por defecto (configurado con next-themes)
- **UI Library**: shadcn/ui (componentes accesibles y personalizables)
- **Tablas**: TankTable (TanStack Table con funcionalidades avanzadas)
- **Estilos**: Tailwind CSS v4
- **Fuentes**: Geist Sans y Geist Mono
