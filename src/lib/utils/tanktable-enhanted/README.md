# 📊 TankTable Enhanced

Sistema de tabla avanzada para React 19 y Next.js 15+ con características profesionales listas para producción.

## ⚡ Inicio Rápido

### 1. Copiar Carpeta

```bash
cp -r src/utils/tanktable-enhanted /tu-proyecto/src/utils/
```

### 2. Instalar Dependencias

```bash
npm install @tanstack/react-table @tanstack/react-virtual lucide-react
```

### 3. Agregar shadcn/ui (si es necesario)

```bash
npx shadcn-ui@latest add button card checkbox dialog dropdown-menu input label select sheet skeleton table textarea badge alert progress
```

### 4. Usar el Componente

```typescript
"use client";
import { TankTable } from "@/utils/tanktable-enhanted";
import { ColumnDef } from "@tanstack/react-table";

type Product = {
  id: string;
  nombre: string;
  precio: number;
  activo: boolean;
};

const columns: ColumnDef<Product>[] = [
  { accessorKey: "nombre", header: "Nombre" },
  { accessorKey: "precio", header: "Precio" },
  { accessorKey: "activo", header: "Activo" },
];

export default function Page() {
  const data: Product[] = [
    { id: "1", nombre: "Producto 1", precio: 100, activo: true },
  ];

  return (
    <TankTable
      data={data}
      columns={columns}
      showPagination={true}
      enableRowSelection={true}
      exportOptions={{ formats: ["csv", "json"] }}
    />
  );
}
```

---

## 🎯 Características Principales

| Característica | Descripción |
|---|---|
| **Paginación** | Controles completos |
| **Búsqueda** | En tiempo real |
| **Selección** | Checkboxes para múltiples filas |
| **Acciones en Lote** | Operar en múltiples filas |
| **Exportación** | CSV y JSON |
| **Filtros Avanzados** | Select, Range, Boolean, Text, Date |
| **Virtualización** | Maneja 100k+ registros |
| **Edición Inline** | Editar celdas directamente |
| **Visibilidad de Columnas** | Mostrar/ocultar columnas |
| **Navegación Teclado** | Atajos Ctrl+A, E, D |
| **Responsivo** | Mobile y desktop |
| **Estados de Carga** | Skeleton, error, vacío |

---

## 📦 Props Principales

```typescript
interface TankTableProps<TData> {
  data: TData[];                                    // Datos de la tabla
  columns: ColumnDef<TData, unknown>[];             // Columnas
  showPagination?: boolean;                         // Mostrar paginación
  initialPageSize?: number;                         // Tamaño de página (default: 10)
  enableRowSelection?: boolean;                     // Selección de filas
  showAdd?: boolean;                                // Botón agregar
  onRowSave?: (row: TData) => Promise<void>;       // Callback guardar
  onRowDelete?: (row: TData) => Promise<void>;     // Callback eliminar
  
  // Características avanzadas
  bulkActions?: BulkActions<TData>;                // Acciones en lote
  exportOptions?: ExportOptions<TData>;            // Opciones exportación
  loadingStates?: LoadingStates;                   // Estados carga/error
  virtualization?: VirtualizationOptions;         // Virtualización
  columnVisibility?: ColumnVisibilityOptions;     // Visibilidad columnas
  keyboardNavigation?: KeyboardNavigationOptions; // Nav teclado
  advancedFilters?: AdvancedFiltersOptions;       // Filtros avanzados
  createForm?: CreateFormConfig<TData>;           // Formulario creación
  deleteConfirm?: DeleteConfirmConfig<TData>;     // Confirmación delete
}
```

---

## 🔧 Ejemplos de Configuración

### Con Selección y Acciones en Lote

```typescript
<TankTable
  data={data}
  columns={columns}
  enableRowSelection={true}
  bulkActions={{
    onBulkDelete: async (rows) => console.log("Eliminar:", rows),
    onBulkExport: (rows) => console.log("Exportar:", rows),
    bulkDeleteLabel: "Eliminar",
    bulkExportLabel: "Exportar",
  }}
/>
```

### Con Filtros Avanzados

```typescript
<TankTable
  data={data}
  columns={columns}
  advancedFilters={{
    enabled: true,
    filters: [
      {
        key: "precio",
        label: "Precio",
        type: "range",
        min: 0,
        max: 1000,
      },
      {
        key: "activo",
        label: "Estado",
        type: "boolean",
      },
      {
        key: "nombre",
        label: "Búsqueda",
        type: "text",
      },
    ],
  }}
/>
```

### Con Virtualización

```typescript
<TankTable
  data={data}
  columns={columns}
  virtualization={{
    enabled: true,
    height: 600,
    rowHeight: 50,
    threshold: 100,
  }}
/>
```

### Con Formulario de Creación

```typescript
<TankTable
  data={data}
  columns={columns}
  showAdd={true}
  createForm={{
    title: "Nuevo Producto",
    fields: [
      { name: "nombre", label: "Nombre", inputType: "text", required: true },
      { name: "precio", label: "Precio", inputType: "number", required: true },
      { name: "activo", label: "Activo", inputType: "checkbox" },
    ],
    onSubmit: async (newItem) => {
      console.log("Crear:", newItem);
    },
  }}
/>
```

### Con Estados de Carga

```typescript
<TankTable
  data={data}
  columns={columns}
  loadingStates={{
    loading: isLoading,
    error: errorMessage,
    loadingRows: 5,
    emptyState: <div>No hay datos</div>,
  }}
/>
```

---

## 🎣 Hooks Disponibles

```typescript
// Exportación de datos
import { useDataExport } from "@/utils/tanktable-enhanted";
const { exportToCSV, exportToJSON } = useDataExport();

// Selección de filas
import { useRowSelection } from "@/utils/tanktable-enhanted";
const { selectedRows, toggleRow } = useRowSelection();

// Filtros avanzados
import { useAdvancedFilters } from "@/utils/tanktable-enhanted";
const { filters, addFilter } = useAdvancedFilters();

// Visibilidad de columnas
import { useColumnVisibility } from "@/utils/tanktable-enhanted";
const { visibleColumns, toggleColumn } = useColumnVisibility();

// Navegación teclado
import { useKeyboardNavigation } from "@/utils/tanktable-enhanted";
const { focusedCell } = useKeyboardNavigation();
```

---

## 📂 Estructura

```txt
tanktable-enhanted/
├── component/              # 21 componentes
├── hooks/                  # 9 hooks personalizados
├── types/                  # Tipos TypeScript
├── provider/               # Contexto para edición inline
├── examples/               # 2 ejemplos funcionando
├── index.ts                # Exportaciones
├── GUIA-COMPLETA.md        # Tutorial detallado
└── README.md               # Este archivo
```

---

## 🔄 Integración con Supabase

```typescript
"use client";
import { TankTable } from "@/utils/tanktable-enhanted";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function MyTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: items } = await supabase.from("items").select("*");
      setData(items || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <TankTable
      data={data}
      columns={columns}
      loadingStates={{ loading }}
      onRowSave={async (row) => {
        await supabase.from("items").update(row).eq("id", row.id);
      }}
      onRowDelete={async (row) => {
        await supabase.from("items").delete().eq("id", row.id);
      }}
    />
  );
}
```

---

## 🚀 Para Agentes de IA

### Para entender qué hacer

1. El componente principal es **`TankTable`** en `index.ts`
2. Importa de `@/utils/tanktable-enhanted`
3. Requiere `data` (array de objetos) y `columns` (definición de columnas)
4. Todas las características son opcionales vía props
5. Ver `examples/` para implementaciones completas

### Estructura de tipos

- **TData**: Tipo genérico para los datos
- **ColumnDef**: De TanStack Table
- Tipos exportados: ver `types/tank-table.types.ts`

### Componentes internos

- `tank-table.tsx` - componente principal
- `search-bar.tsx`, `export-menu.tsx`, `bulk-actions-bar.tsx` - características
- `actions-cell.tsx`, `create-form-dialog.tsx` - interacciones

### Cómo extender

1. Imports se hacen desde `index.ts`
2. Componentes pueden ser usados individualmente
3. Hooks pueden ser usados independientemente
4. Todo está tipado con TypeScript

---

## ⌨️ Atajos de Teclado

| Tecla | Acción |
|-------|--------|
| `↑↓←→` | Navegar entre celdas |
| `Enter` | Seleccionar/editar |
| `Delete` | Eliminar fila |
| `Ctrl+A` | Agregar nuevo |
| `Ctrl+E` | Editar |
| `Ctrl+D` | Eliminar |
| `Escape` | Limpiar focus |

---

## 🐛 Problemas Comunes

| Problema | Solución |
|----------|----------|
| Componentes no se renderizan | Agregar `"use client"` |
| Estilos no aplican | Verificar Tailwind CSS en layout |
| Datos no se exportan | Configurar `exportOptions` |
| Tabla lenta | Activar `virtualization` |
| Types error | Instalar dependencias: `npm install` |

---

## 📚 Más Información

Ver archivos:

- `GUIA-COMPLETA.md` - Tutorial exhaustivo con todos los ejemplos
- `examples/enhanced-dashboard-example.tsx` - Dashboard funcional
- `examples/enhanced-table-example.tsx` - Tabla de usuarios

---

## ✨ Resumen

- **Listo para usar**: 0 configuración necesaria
- **Tipado**: 100% TypeScript
- **Optimizado**: Performance garantizado
- **Responsivo**: Móvil + Desktop
- **Accesible**: WCAG compliant
- **Productivo**: 15+ características

**Copia y usa. ¡Listo!**
