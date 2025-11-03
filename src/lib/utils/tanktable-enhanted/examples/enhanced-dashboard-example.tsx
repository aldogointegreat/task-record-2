"use client";

import React from "react";
import TankTable from "../component/tank-table";
import type { TankTableProps } from "../types/tank-table.types";

// Example usage of the new enhanced features
export function EnhancedDashboardExample<TData extends Record<string, unknown>>({
  data,
  columns,
  onRowSave,
  onRowDelete,
  categories = [],
}: {
  data: TData[];
  columns: any[];
  onRowSave?: (row: TData) => Promise<void> | void;
  onRowDelete?: (row: TData) => Promise<void> | void;
  categories?: Array<{ id: number; nombre: string }>;
}) {

  const enhancedProps: TankTableProps<TData> = {
    data,
    columns,
    onRowSave,
    onRowDelete,
    showPagination: true,
    pageSizeOptions: [5, 10, 20],
    initialPageSize: 10,
    showAdd: true,
    addButtonLabel: "Agregar Producto",
    
    // Enhanced features
    enableRowSelection: true,
    
    // Column visibility
    columnVisibility: {
      enabled: true,
      storageKey: 'dashboard-column-visibility',
      defaultHiddenColumns: ['descripcion'], // Hide description by default
    },
    
    // Keyboard navigation
    keyboardNavigation: {
      enabled: true,
      onRowSelect: (row) => console.log('Selected row:', row),
      onRowEdit: (row) => console.log('Edit row:', row),
      onRowDelete: (row) => console.log('Delete row:', row),
      onAdd: () => console.log('Add new item'),
    },
    
    // Advanced filters
    advancedFilters: {
      enabled: true,
      storageKey: 'dashboard-advanced-filters',
      filters: [
        {
          key: 'categoria_id',
          label: 'Categoría',
          type: 'select',
          options: categories.map(c => ({ value: c.id, label: c.nombre })),
        },
        {
          key: 'precio_venta',
          label: 'Precio',
          type: 'range',
          min: 0,
          max: 1000,
          step: 0.1,
        },
        {
          key: 'activo',
          label: 'Estado',
          type: 'boolean',
        },
        {
          key: 'nombre',
          label: 'Nombre',
          type: 'text',
        },
        {
          key: 'fecha_creacion',
          label: 'Fecha de Creación',
          type: 'date',
        },
      ],
    },
    
    // Bulk actions
    bulkActions: {
      onBulkDelete: async (selectedRows) => {
        console.log('Bulk delete:', selectedRows);
      },
      onBulkExport: (selectedRows) => {
        console.log('Bulk export:', selectedRows);
      },
      bulkDeleteLabel: "Eliminar Seleccionados",
      bulkExportLabel: "Exportar Seleccionados",
    },
    
    // Export options
    exportOptions: {
      formats: ['csv', 'json'],
      filename: 'productos-veterinarios',
      includeHeaders: true,
      onExport: (data, format) => {
        console.log(`Exporting ${data.length} items as ${format}`);
      },
    },
    
    // Loading states
    loadingStates: {
      loading: false,
      error: null,
      loadingRows: 5,
      emptyState: (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
          <p className="text-gray-500 mb-4">Comienza agregando tu primer producto veterinario</p>
        </div>
      ),
    },
    
    // Virtualization
    virtualization: {
      enabled: true,
      height: 600,
      overscan: 10,
      rowHeight: 50,
      threshold: 50,
    },
  };

  return <TankTable {...enhancedProps} />;
}

// Keyboard shortcuts documentation
export const KEYBOARD_SHORTCUTS = {
  'Arrow Keys': 'Navigate between cells',
  'Enter': 'Select row',
  'Shift + Enter': 'Edit row',
  'Delete': 'Delete selected row',
  'Ctrl + A': 'Add new item',
  'Ctrl + E': 'Edit selected row',
  'Ctrl + D': 'Delete selected row',
  'Escape': 'Clear focus',
};

// Usage instructions
export const USAGE_INSTRUCTIONS = `
## Enhanced TankTable Features

### 1. Column Visibility
- Click the "Columnas" button to show/hide columns
- Your preferences are saved automatically
- Use "Reset" to restore default visibility

### 2. Keyboard Navigation
- Use arrow keys to navigate between cells
- Press Enter to select a row
- Press Shift + Enter to edit a row
- Press Delete to delete the selected row
- Use Ctrl + A to add a new item
- Press Escape to clear focus

### 3. Advanced Filters
- Click "Filtros" to access advanced filtering
- Filter by category, price range, status, text search, and dates
- Multiple filters can be applied simultaneously
- Clear individual filters or all at once

### 4. Bulk Actions
- Select multiple rows using checkboxes
- Use bulk actions bar for mass operations
- Export selected data in multiple formats

### 5. Export Options
- Export all data or selected rows
- Multiple formats: CSV, JSON
- Customizable filename and headers
`;
