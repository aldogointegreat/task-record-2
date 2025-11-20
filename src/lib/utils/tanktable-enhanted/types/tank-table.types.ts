import type { RowData, ColumnDef, SortingState } from "@tanstack/react-table";

// Extend TanStack Table types
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    onRowSave?: (row: TData) => Promise<void> | void;
    onRowDelete?: (row: TData) => Promise<void> | void;
    categories?: { id: number; nombre: string }[];
    searchTextExtractor?: (row: TData) => string;
  }
}

export type InputKind = "text" | "number" | "textarea" | "checkbox" | "select" | "date" | "color" | "icon";

export interface FormField<TData extends object> {
  name: keyof TData & string;
  label: string;
  inputType: InputKind;
  required?: boolean;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  step?: string;
  options?: { value: unknown; label: string }[];
  encode?: (v: unknown) => string;
  decode?: (s: string) => unknown;
  parse?: (raw: string | boolean) => unknown;
}

export interface CreateFormConfig<TData extends object> {
  title?: string;
  submitLabel?: string;
  cancelLabel?: string;
  getInitialValues?: () => Promise<Partial<TData>> | Partial<TData>;
  onSubmit: (data: TData) => Promise<void> | void;
  successMessage?: string | ((data: TData) => string);
  fields: FormField<TData>[];
}

export interface DeleteConfirmConfig<TData extends object> {
  title?: string;
  description?: string | ((row: TData | null) => string);
  confirmLabel?: string;
  cancelLabel?: string;
  successMessage?: string | ((row: TData) => string);
}

export type MobileViewType = 'default' | 'users' | 'products';

export interface TankTableProps<TData extends object> {
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
  tableMeta?: Partial<import("@tanstack/react-table").TableMeta<TData>>;
  createForm?: CreateFormConfig<TData>;
  deleteConfirm?: DeleteConfirmConfig<TData>;
  updateSuccessMessage?: string | ((row: TData) => string);
  
  // New high-priority features
  bulkActions?: BulkActions<TData>;
  exportOptions?: ExportOptions<TData>;
  loadingStates?: LoadingStates;
  enableRowSelection?: boolean;
  virtualization?: VirtualizationOptions;
  
  // Column visibility
  columnVisibility?: ColumnVisibilityOptions;
  
  // Keyboard navigation
  keyboardNavigation?: KeyboardNavigationOptions;
  
  // Advanced filters
  advancedFilters?: AdvancedFiltersOptions;

  // Server-side pagination
  serverSidePagination?: boolean;
  pageCount?: number; // Total de páginas cuando se usa server-side pagination
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
}

// Column Visibility Types
export interface ColumnVisibilityOptions {
  enabled?: boolean;
  storageKey?: string;
  defaultHiddenColumns?: string[];
}

// Keyboard Navigation Types
export interface KeyboardNavigationOptions {
  enabled?: boolean;
  onRowSelect?: (row: any) => void;
  onRowEdit?: (row: any) => void;
  onRowDelete?: (row: any) => void;
  onAdd?: () => void;
}

// Advanced Filters Types
export interface AdvancedFiltersOptions {
  enabled?: boolean;
  storageKey?: string;
  filters: Array<{
    key: string;
    label: string;
    type: 'select' | 'range' | 'boolean' | 'text' | 'date';
    options?: Array<{ value: unknown; label: string }>;
    getValue?: (row: any) => unknown;
    getDisplayValue?: (row: any) => string;
    min?: number;
    max?: number;
    step?: number;
  }>;
}

export interface TableState {
  globalFilter: string;
  sorting: SortingState;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
}

export interface FormState<TData extends object> {
  openCreate: boolean;
  initialLoading: boolean;
  formValues: Record<string, unknown>;
  openDelete: boolean;
  rowPendingDelete: TData | null;
}

// Row Selection Types
export interface BulkActions<TData extends object> {
  onBulkDelete?: (selectedRows: TData[]) => Promise<void> | void;
  onBulkUpdate?: (selectedRows: TData[], updates: Partial<TData>) => Promise<void> | void;
  onBulkExport?: (selectedRows: TData[]) => void;
  bulkDeleteLabel?: string;
  bulkUpdateLabel?: string;
  bulkExportLabel?: string;
}

// Export Types
export type ExportFormat = 'csv' | 'json';

export interface ExportOptions<TData extends object = any> {
  formats: ExportFormat[];
  filename?: string;
  includeHeaders?: boolean;
  onExport?: (data: TData[], format: ExportFormat) => void;
}

// Loading States
export interface LoadingStates {
  loading?: boolean;
  error?: string | null;
  emptyState?: React.ReactNode;
  loadingRows?: number; // Number of skeleton rows to show
}

// Virtualization Types
export interface VirtualizationOptions {
  enabled: boolean;
  height?: number;
  overscan?: number;
  rowHeight?: number;
  threshold?: number; // Minimum rows to enable virtualization
}
