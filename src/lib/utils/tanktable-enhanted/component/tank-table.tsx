"use client";
import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { Table } from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

// Import modular components
import { SearchBar } from "./search-bar";
import { TableHeader } from "./table-header";
import { TableBody } from "./table-body";
import { PaginationControls } from "./table-pagination";
import { CreateFormDialog } from "./create-form-dialog";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { BulkActionsBar } from "./bulk-actions-bar";
import { ExportMenu } from "./export-menu";
import { LoadingSkeleton, EmptyState, ErrorState } from "./loading-skeleton";
import { SimpleVirtualizedTable } from "./simple-virtualized-table";
import { MobileCardView } from "./mobile-card-view";
import { UserMobileCardView } from "./user-mobile-card-view";

import { MobileMenu } from "./mobile-menu";
import { ColumnVisibilityMenu } from "./column-visibility-menu";
import { GenericAdvancedFilters } from "./generic-advanced-filters";

// Import hooks
import { useTableState, useFormState } from "../hooks/use-table-state";
import { useTableFilters } from "../hooks/use-table-filters";
import { useFormHandlers } from "../hooks/use-form-handlers";
import { useDataExport } from "../hooks/use-data-export";
import { useVirtualization } from "../hooks/use-virtualization";


// Import types
import type { TankTableProps } from "../types/tank-table.types";

// Import provider
import { InlineEditProvider } from "@/lib/utils/tanktable-enhanted/provider/inlineEdit-provider";



const TankTable = <TData extends object>({
  data,
  columns,
  mobileViewType = 'default',
  onRowSave,
  onRowDelete,
  showPagination = false,
  pageSizeOptions = [10, 50, 100],
  initialPageSize = 10,
  showAdd = false,
  onAdd,
  addButtonLabel = "Add",
  tableMeta,
  createForm,
  deleteConfirm,
  updateSuccessMessage,
  bulkActions,
  exportOptions,
  loadingStates,
  enableRowSelection = false,
  virtualization,
  columnVisibility,
  advancedFilters,
}: TankTableProps<TData>) => {
  // Use custom hooks for state management
  const {
    globalFilter,
    setGlobalFilter,
    sorting,
    setSorting,
    pagination,
    setPagination,
    rowSelection,
    setRowSelection,
  } = useTableState(initialPageSize);

  const {
    openCreate,
    setOpenCreate,
    initialLoading,
    setInitialLoading,
    formValues,
    setFormValues,
    openDelete,
    setOpenDelete,
    rowPendingDelete,
    setRowPendingDelete,
  } = useFormState<TData>();

  // Use custom hooks for business logic
  const filteredData = useTableFilters(
    data,
    globalFilter,
    tableMeta?.searchTextExtractor
  );

  const {
    setFieldValue,
    handleOpenCreate,
    submitCreate,
    requestDelete,
    requestSave,
    handleDeleteConfirm,
  } = useFormHandlers<TData>();

  // Export functionality
  const { exportData } = useDataExport<TData>();

  // Virtualization logic
  const { shouldVirtualize, virtualizationConfig } = useVirtualization(data, virtualization);

  // Initialize column visibility state
  const [columnVisibilityState, setColumnVisibilityState] = useState<Record<string, boolean>>(() => {
    if (columnVisibility?.enabled && columnVisibility.storageKey) {
      try {
        const saved = localStorage.getItem(columnVisibility.storageKey);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (error) {
        console.warn('Failed to load column visibility from localStorage:', error);
      }
    }
    
    // Return default hidden columns
    const defaultHidden = columnVisibility?.defaultHiddenColumns || [];
    return defaultHidden.reduce((acc, columnId) => {
      acc[columnId] = false;
      return acc;
    }, {} as Record<string, boolean>);
  });

  // Initialize advanced filters state
  const [advancedFiltersState, setAdvancedFiltersState] = useState<Record<string, unknown>>(() => {
    if (advancedFilters?.enabled && advancedFilters.storageKey) {
      try {
        const saved = localStorage.getItem(advancedFilters.storageKey);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (error) {
        console.warn('Failed to load advanced filters from localStorage:', error);
      }
    }
    return {};
  });

  // Handle loading and error states
  const isLoading = loadingStates?.loading ?? false;
  const error = loadingStates?.error;
  const loadingRows = loadingStates?.loadingRows ?? 5;

  const table = useReactTable<TData>({
    data: filteredData,
    columns,
    state: { 
      pagination, 
      sorting, 
      rowSelection: enableRowSelection ? rowSelection : undefined,
      globalFilter: enableRowSelection ? globalFilter : undefined,
      columnVisibility: columnVisibility?.enabled ? columnVisibilityState : undefined,
    },
    meta: { 
      onRowSave: (row) => requestSave(row, onRowSave, updateSuccessMessage), 
      onRowDelete: (row) => requestDelete(row, deleteConfirm, onRowDelete, setRowPendingDelete, setOpenDelete), 
      ...(tableMeta ?? {}) 
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowSelectionChange: enableRowSelection ? setRowSelection : undefined,
    onGlobalFilterChange: enableRowSelection ? setGlobalFilter : undefined,
    onColumnVisibilityChange: columnVisibility?.enabled ? setColumnVisibilityState : undefined,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: enableRowSelection,
  });

  // Save column visibility to localStorage
  useEffect(() => {
    if (columnVisibility?.enabled && columnVisibility.storageKey) {
      try {
        localStorage.setItem(columnVisibility.storageKey, JSON.stringify(columnVisibilityState));
      } catch (error) {
        console.warn('Failed to save column visibility to localStorage:', error);
      }
    }
  }, [columnVisibilityState, columnVisibility?.enabled, columnVisibility?.storageKey]);

  // Save advanced filters to localStorage
  useEffect(() => {
    if (advancedFilters?.enabled && advancedFilters.storageKey) {
      try {
        localStorage.setItem(advancedFilters.storageKey, JSON.stringify(advancedFiltersState));
      } catch (error) {
        console.warn('Failed to save advanced filters to localStorage:', error);
      }
    }
  }, [advancedFiltersState, advancedFilters?.enabled, advancedFilters?.storageKey]);



  // Helper functions for advanced filters
  const updateFilter = (key: string, value: unknown) => {
    setAdvancedFiltersState(prev => ({ ...prev, [key]: value }));
  };

  const clearFilter = (key: string) => {
    setAdvancedFiltersState(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  };

  const clearAllFilters = () => {
    setAdvancedFiltersState({});
  };

  const getFilterOptions = (filterKey: string) => {
    const filter = advancedFilters?.filters.find(f => f.key === filterKey);
    if (!filter || filter.type !== 'select') return [];

    if (filter.options) {
      return filter.options;
    }

    // Generate options from data
    const uniqueValues = new Set();
    data.forEach(row => {
      const value = filter.getValue ? filter.getValue(row as TData) : (row as Record<string, unknown>)[filter.key];
      if (value !== undefined && value !== null) {
        uniqueValues.add(value);
      }
    });

    return Array.from(uniqueValues).map(value => ({
      value,
      label: String(value),
    }));
  };

  const activeFiltersCount = Object.values(advancedFiltersState).filter(value => 
    value !== undefined && value !== null && value !== ''
  ).length;

  // Handle error state
  if (error) {
    return (
      <InlineEditProvider>
        <Toaster richColors position="top-right" />
        <ErrorState error={error} />
      </InlineEditProvider>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <InlineEditProvider>
        <Toaster richColors position="top-right" />
        <LoadingSkeleton rows={loadingRows} columns={columns.length} />
      </InlineEditProvider>
    );
  }

  // Handle empty state
  if (!isLoading && data.length === 0) {
    return (
      <InlineEditProvider>
        <Toaster richColors position="top-right" />
        {loadingStates?.emptyState || <EmptyState />}
      </InlineEditProvider>
    );
  }

  return (
    <InlineEditProvider>
      <Toaster richColors position="top-right" />
      <div tabIndex={-1}>
      
      {/* Bulk Actions Bar */}
      {enableRowSelection && bulkActions && (
        <BulkActionsBar
          selectedCount={table.getSelectedRowModel().rows.length}
          selectedRows={table.getSelectedRowModel().rows.map(row => row.original)}
          bulkActions={bulkActions}
          onClearSelection={() => setRowSelection({})}
          onExport={(selectedData) => exportData(selectedData, 'csv')}
        />
      )}
      
      {/* Search, Filters and Action Buttons - Single Row Layout */}
      <div className="flex flex-col xl:flex-row gap-3 justify-between items-start xl:items-center mb-3">
        {/* Left side - Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-3 w-full xl:w-auto">
          <div className="w-full lg:w-64">
            <SearchBar 
              globalFilter={globalFilter} 
              setGlobalFilter={setGlobalFilter} 
              className="w-full"
            />
          </div>
          

        </div>
        
        {/* Right side - Actions */}
        <div className="flex items-center gap-2 w-full xl:w-auto">
          {/* Mobile Menu - Only on small screens */}
          <div className="lg:hidden">
            <MobileMenu
              onSearch={() => {
                const searchInput = document.querySelector('input[role="searchbox"]') as HTMLInputElement;
                searchInput?.focus();
              }}
              onAdd={() => handleOpenCreate(createForm, onAdd, setInitialLoading, setFormValues, setOpenCreate)}
              onExport={() => exportData(filteredData, 'csv')}
              onFilters={() => {
                // TODO: Implement filter panel toggle
                console.log('Open filters');
              }}
              onSettings={() => {
                // TODO: Implement settings panel
                console.log('Open settings');
              }}
              onAnalytics={() => {
                // TODO: Implement analytics view
                console.log('Open analytics');
              }}
            />
          </div>
          
          {/* Desktop Actions - Hidden on mobile/tablet */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Column Visibility Menu */}
            {columnVisibility?.enabled && (
              <ColumnVisibilityMenu table={table as unknown as import("@tanstack/react-table").Table<Record<string, unknown>>} />
            )}
            
            {/* Generic Advanced Filters */}
            {advancedFilters?.enabled && (
              <GenericAdvancedFilters
                filters={advancedFilters.filters}
                filterState={advancedFiltersState}
                onUpdateFilter={updateFilter}
                onClearFilter={clearFilter}
                onClearAll={clearAllFilters}
                activeFiltersCount={activeFiltersCount}
                getFilterOptions={getFilterOptions}
              />
            )}
            
            {exportOptions && (
              <ExportMenu
                data={filteredData}
                exportOptions={exportOptions}
                onExport={exportData}
              />
            )}
            {showAdd && (
              <Button 
                size="sm" 
                variant="outline" 
                className="h-10 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
                onClick={() => handleOpenCreate(createForm, onAdd, setInitialLoading, setFormValues, setOpenCreate)}
                aria-label={`Agregar nuevo producto`}
              >
                {addButtonLabel}
              </Button>
            )}
          </div>
        </div>
      </div>



      {/* Table Container - Responsive */}
      <div className="mt-2 rounded-xl sm:border sm:bg-card text-card-foreground sm:shadow-sm overflow-hidden pb-2">
        {shouldVirtualize && virtualizationConfig ? (
          <div className="overflow-hidden">
            <SimpleVirtualizedTable
              table={table}
              height={virtualizationConfig.height}
              overscan={virtualizationConfig.overscan}
              rowHeight={virtualizationConfig.rowHeight}
            />
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table className="w-full min-w-[800px]">
                <TableHeader table={table} />
                <TableBody table={table} />
              </Table>
            </div>
            
            {/* Mobile Card View */}
            <div className="md:hidden">
              {mobileViewType === 'users' ? (
                <UserMobileCardView table={table as unknown as import("@tanstack/react-table").Table<Record<string, unknown>>} />
              ) : (
                <MobileCardView table={table as unknown as import("@tanstack/react-table").Table<Record<string, unknown>>} />
              )}
            </div>
            
            {/* Pagination Controls - Outside the table */}
            <PaginationControls 
              table={table}
              showPagination={showPagination}
              pageSizeOptions={pageSizeOptions}
              setPagination={setPagination}
            />
          </>
        )}
      </div>

      {/* Create Form Dialog */}
      {createForm && (
        <CreateFormDialog
          open={openCreate}
          onOpenChange={setOpenCreate}
          createForm={createForm}
          formValues={formValues}
          setFieldValue={setFieldValue}
          setFormValues={setFormValues}
          onSubmit={(e) => submitCreate(e, createForm, formValues, setOpenCreate)}
          initialLoading={initialLoading}
        />
      )}

      {/* Delete Confirm Dialog */}
      {deleteConfirm && (
        <DeleteConfirmDialog
          open={openDelete}
          onOpenChange={setOpenDelete}
          deleteConfirm={deleteConfirm}
          rowPendingDelete={rowPendingDelete}
          onConfirm={() => handleDeleteConfirm(
            rowPendingDelete,
            onRowDelete,
            deleteConfirm,
            setOpenDelete,
            setRowPendingDelete
          )}
        />
      )}
      </div>
    </InlineEditProvider>
  );
};

export default TankTable;
