# 📊 TankTable Enhanced - Guía Completa de Uso

> **Sistema de Tablas Avanzado para React 19 y Next.js 15+**

TankTable Enhanced es una librería completa y lista para usar en cualquier proyecto Next.js. Viene con todas las características necesarias para gestionar tablas de datos complejas.

---

## 🎯 Características Principales

✅ **Selección Múltiple** - Checkboxes para seleccionar filas  
✅ **Acciones en Lote** - Ejecutar operaciones en múltiples filas  
✅ **Exportación de Datos** - CSV y JSON  
✅ **Búsqueda y Filtrado** - Búsqueda en tiempo real y filtros avanzados  
✅ **Paginación** - Control total de páginas  
✅ **Virtualización** - Manejo eficiente de miles de registros  
✅ **Visibilidad de Columnas** - Mostrar/ocultar columnas  
✅ **Navegación con Teclado** - Atajos de teclado completos  
✅ **Responsivo** - Funciona perfectamente en móvil  
✅ **Edición Inline** - Editar celdas directamente  
✅ **Estados de Carga** - Skeleton, error y estados vacíos  
✅ **Temas** - Soporte para modo claro/oscuro  

---

## 📦 Requisitos

```json
{
  "@tanstack/react-table": "^8.21.3",
  "@tanstack/react-virtual": "^3.13.12",
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "next": "^15.5.6",
  "shadcn": "^3.2.1"
}
```

### Componentes shadcn/ui necesarios

- `button`
- `card`
- `checkbox`
- `dialog`
- `dropdown-menu`
- `input`
- `label`
- `select`
- `sheet`
- `skeleton`
- `table`
- `textarea`
- `badge`
- `alert`
- `progress`

---

## 🚀 Instalación Rápida

### 1. Copiar la carpeta

```bash
# Desde tu proyecto destino
cp -r /ruta/al/tanktable-enhanted ./src/utils/
```

### 2. Instalar dependencias (si no las tienes)

```bash
npm install @tanstack/react-table @tanstack/react-virtual lucide-react
```

### 3. Agregar componentes shadcn/ui (si no los tienes)

```bash
npx shadcn-ui@latest add button card checkbox dialog dropdown-menu input label select sheet skeleton table textarea badge alert progress
```

---

## 💻 Uso Básico

### 1. Definir tipos de datos

```typescript
type Product = {
  codigo_sku: string;
  nombre: string;
  precio: number;
  stock: number;
  activo: boolean;
};
```

### 2. Crear columnas

```typescript
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<Product>();

const columns: ColumnDef<Product>[] = [
  columnHelper.accessor("codigo_sku", {
    header: "SKU",
  }),
  columnHelper.accessor("nombre", {
    header: "Nombre",
  }),
  columnHelper.accessor("precio", {
    header: "Precio",
  }),
  columnHelper.accessor("stock", {
    header: "Stock",
  }),
  columnHelper.accessor("activo", {
    header: "Activo",
  }),
];
```

### 3. Usar el componente

```typescript
"use client";

import { TankTable } from "@/utils/tanktable-enhanted";

export function ProductsTable() {
  const data: Product[] = [
    { codigo_sku: "PROD001", nombre: "Producto 1", precio: 100, stock: 50, activo: true },
    // ... más datos
  ];

  return (
    <TankTable
      data={data}
      columns={columns}
      showPagination={true}
      initialPageSize={10}
    />
  );
}
```

---

## ⚙️ Configuración Avanzada

### Búsqueda

```typescript
<TankTable
  data={data}
  columns={columns}
  searchOptions={{
    enabled: true,
    placeholder: "Buscar productos...",
    searchableColumns: ["nombre", "codigo_sku"],
  }}
/>
```

### Filtros Avanzados

```typescript
<TankTable
  data={data}
  columns={columns}
  advancedFilters={{
    enabled: true,
    filters: [
      {
        key: "precio",
        label: "Rango de Precio",
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
        label: "Nombre",
        type: "text",
      },
    ],
  }}
/>
```

### Selección Múltiple y Acciones en Lote

```typescript
<TankTable
  data={data}
  columns={columns}
  enableRowSelection={true}
  bulkActions={{
    onBulkDelete: async (selectedRows) => {
      console.log("Eliminar:", selectedRows);
      // Lógica de eliminación
    },
    onBulkExport: (selectedRows) => {
      console.log("Exportar:", selectedRows);
    },
    bulkDeleteLabel: "Eliminar Seleccionados",
    bulkExportLabel: "Exportar Seleccionados",
  }}
/>
```

### Exportación

```typescript
<TankTable
  data={data}
  columns={columns}
  exportOptions={{
    formats: ["csv", "json"],
    filename: "productos",
    includeHeaders: true,
  }}
/>
```

### Virtualización (para muchos registros)

```typescript
<TankTable
  data={data}
  columns={columns}
  virtualization={{
    enabled: true,
    height: 600,
    rowHeight: 50,
    overscan: 10,
    threshold: 100, // Activar solo si hay 100+ filas
  }}
/>
```

### Visibilidad de Columnas

```typescript
<TankTable
  data={data}
  columns={columns}
  columnVisibility={{
    enabled: true,
    storageKey: "products-columns",
    defaultHiddenColumns: ["codigo_sku"],
  }}
/>
```

### Edición Inline

```typescript
<TankTable
  data={data}
  columns={columns}
  onRowSave={async (row) => {
    console.log("Guardar:", row);
    // Lógica de guardado
  }}
/>
```

### Formulario de Creación

```typescript
<TankTable
  data={data}
  columns={columns}
  showAdd={true}
  addButtonLabel="Agregar Producto"
  createForm={{
    title: "Nuevo Producto",
    submitLabel: "Crear",
    fields: [
      {
        name: "codigo_sku",
        label: "SKU",
        inputType: "text",
        required: true,
      },
      {
        name: "nombre",
        label: "Nombre",
        inputType: "text",
        required: true,
      },
      {
        name: "precio",
        label: "Precio",
        inputType: "number",
        required: true,
      },
      {
        name: "stock",
        label: "Stock",
        inputType: "number",
        required: true,
      },
      {
        name: "activo",
        label: "Activo",
        inputType: "checkbox",
      },
    ],
    onSubmit: async (newProduct) => {
      console.log("Crear:", newProduct);
      // Lógica de creación
    },
  }}
/>
```

### Estados de Carga y Error

```typescript
<TankTable
  data={data}
  columns={columns}
  loadingStates={{
    loading: isLoading,
    error: errorMessage,
    loadingRows: 5,
    emptyState: (
      <div className="text-center py-12">
        <h3>No hay datos</h3>
        <p>Comienza agregando tu primer registro</p>
      </div>
    ),
  }}
/>
```

---

## 🎣 Hooks Disponibles

### useDataExport

Exportar datos a CSV o JSON

```typescript
import { useDataExport } from "@/utils/tanktable-enhanted";

const { exportData, exportToCSV, exportToJSON } = useDataExport();

// Exportar a CSV
exportToCSV(data, "export.csv");

// Exportar a JSON
exportToJSON(data, "export.json");
```

### useRowSelection

Gestionar selección de filas

```typescript
import { useRowSelection } from "@/utils/tanktable-enhanted";

const { selectedRows, isAllSelected, toggleAll } = useRowSelection();
```

### useAdvancedFilters

Filtros avanzados

```typescript
import { useAdvancedFilters } from "@/utils/tanktable-enhanted";

const { filters, addFilter, removeFilter, clearFilters } = useAdvancedFilters();
```

### useColumnVisibility

Mostrar/ocultar columnas

```typescript
import { useColumnVisibility } from "@/utils/tanktable-enhanted";

const { visibleColumns, toggleColumn, resetColumns } = useColumnVisibility();
```

---

## 📁 Estructura de Carpetas

```txt
tanktable-enhanted/
├── component/              # Componentes principales
│   ├── tank-table.tsx     # Componente principal
│   ├── table-header.tsx   # Encabezado de tabla
│   ├── table-body.tsx     # Cuerpo de tabla
│   ├── search-bar.tsx     # Barra de búsqueda
│   ├── advanced-filters.tsx # Filtros avanzados
│   ├── bulk-actions-bar.tsx # Acciones en lote
│   ├── export-menu.tsx    # Menú de exportación
│   ├── create-form-dialog.tsx # Diálogo de creación
│   ├── delete-confirm-dialog.tsx # Diálogo de confirmación
│   ├── column-visibility-menu.tsx # Visibilidad de columnas
│   └── ... más componentes
├── hooks/                  # Hooks personalizados
│   ├── use-data-export.ts # Exportación de datos
│   ├── use-row-selection.ts # Selección de filas
│   ├── use-advanced-filters.ts # Filtros avanzados
│   ├── use-column-visibility.ts # Visibilidad de columnas
│   └── ... más hooks
├── types/
│   └── tank-table.types.ts # Tipos TypeScript
├── provider/
│   └── inlineEdit-provider.tsx # Provider para edición inline
├── index.ts                # Exportaciones principales
└── README-ENHANCED-FEATURES.md # Documentación de características
```

---

## 🔄 Integración con Supabase

```typescript
"use client";

import { TankTable } from "@/utils/tanktable-enhanted";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function SupabaseTable() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      const { data: products } = await supabase
        .from("productos")
        .select("*");
      setData(products || []);
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <TankTable
      data={data}
      columns={columns}
      loadingStates={{ loading }}
      onRowSave={async (row) => {
        await supabase
          .from("productos")
          .update(row)
          .eq("id", row.id);
      }}
      onRowDelete={async (row) => {
        await supabase
          .from("productos")
          .delete()
          .eq("id", row.id);
      }}
    />
  );
}
```

---

## 🎨 Personalización

### Clases CSS personalizadas

Todos los componentes aceptan `className` para personalización:

```typescript
<TankTable
  data={data}
  columns={columns}
  className="my-custom-table"
/>
```

### Temas

Los componentes respetan los temas de Next.js:

```typescript
// En tu layout.tsx
import { ThemeProvider } from "next-themes"

export default function RootLayout() {
  return (
    <ThemeProvider attribute="class">
      {/* Tu contenido */}
    </ThemeProvider>
  )
}
```

---

## ⌨️ Atajos de Teclado

Con `keyboardNavigation` habilitado:

| Tecla | Acción |
|-------|--------|
| `↑↓←→` | Navegar entre celdas |
| `Enter` | Seleccionar fila |
| `Shift + Enter` | Editar fila |
| `Delete` | Eliminar fila |
| `Ctrl + A` | Agregar nuevo |
| `Ctrl + E` | Editar |
| `Ctrl + D` | Eliminar |
| `Escape` | Limpiar focus |

---

## 🧪 Ejemplos Completos

### Dashboard de Productos

Ver: `examples/enhanced-dashboard-example.tsx`

### Tabla de Usuarios

Ver: `examples/enhanced-table-example.tsx`

---

## 🐛 Troubleshooting

### Problema: Componentes no se renderizan

**Solución:** Asegúrate de que tienes `"use client"` en el archivo

### Problema: Estilos no se aplican

**Solución:** Verifica que Tailwind CSS esté configurado correctamente

### Problema: Datos no se exportan

**Solución:** Asegúrate de tener `exportOptions` configurado

### Problema: Tabla muy lenta con muchos datos

**Solución:** Activa `virtualization` con `threshold` bajo

---

## 📝 Tipos principales

```typescript
// Props principales
type TankTableProps<TData extends object> = {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  mobileViewType?: MobileViewType;
  onRowSave?: (row: TData) => Promise<void> | void;
  onRowDelete?: (row: TData) => Promise<void> | void;
  showPagination?: boolean;
  pageSizeOptions?: number[];
  initialPageSize?: number;
  showAdd?: boolean;
  onAdd?: () => void;
  addButtonLabel?: string;
  createForm?: CreateFormConfig<TData>;
  deleteConfirm?: DeleteConfirmConfig<TData>;
  bulkActions?: BulkActions<TData>;
  exportOptions?: ExportOptions<TData>;
  loadingStates?: LoadingStates;
  enableRowSelection?: boolean;
  virtualization?: VirtualizationOptions;
  columnVisibility?: ColumnVisibilityOptions;
  keyboardNavigation?: KeyboardNavigationOptions;
  advancedFilters?: AdvancedFiltersOptions;
};
```

---

## 📚 Importaciones Principales

```typescript
// Componente principal
import { TankTable } from "@/utils/tanktable-enhanted";

// Tipos
import type {
  TankTableProps,
  BulkActions,
  ExportOptions,
  LoadingStates,
  VirtualizationOptions,
  ColumnVisibilityOptions,
  KeyboardNavigationOptions,
  AdvancedFiltersOptions,
} from "@/utils/tanktable-enhanted";

// Hooks
import {
  useDataExport,
  useRowSelection,
  useAdvancedFilters,
  useColumnVisibility,
  useKeyboardNavigation,
  useTableFilters,
  useFormHandlers,
  useVirtualization,
} from "@/utils/tanktable-enhanted";

// Componentes específicos
import {
  SearchBar,
  ExportMenu,
  BulkActionsBar,
  ColumnVisibilityMenu,
} from "@/utils/tanktable-enhanted";
```

---

## 🎓 Mejores Prácticas

1. **Usar TypeScript**: Define tipos para tus datos
2. **Memoizar Columnas**: Define columnas fuera del componente
3. **Lazy Loading**: Cargar datos bajo demanda con Supabase
4. **Virtualización**: Activarla para >100 registros
5. **Validación**: Validar datos antes de guardar
6. **Manejo de Errores**: Usar `loadingStates` para errores
7. **Accesibilidad**: Usar atributos ARIA cuando sea necesario
8. **Performance**: Memoizar callbacks con `useCallback`

---

## 🔗 Recursos

- [TanStack Table Docs](https://tanstack.com/table/latest)
- [React Virtual Docs](https://tanstack.com/virtual/latest)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [Next.js Documentation](https://nextjs.org/docs)

---

## 📄 Licencia

Libre para usar en tus proyectos

---

## ✨ Resumen

TankTable Enhanced es una solución completa, lista para producción, que incluye:

✅ 21 componentes  
✅ 9 hooks personalizados  
✅ Tipos TypeScript completos  
✅ 15+ características avanzadas  
✅ Ejemplos de uso  
✅ 100% responsive  
✅ Accesible  
✅ Performante  

**¡Lista para usar en cualquier proyecto!**
