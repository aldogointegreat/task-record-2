import React from "react";
import { flexRender, type Table } from "@tanstack/react-table";
import { TableFooter, TableHead, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface TablePaginationProps<TData extends object> {
  table: Table<TData>;
  showPagination: boolean;
  pageSizeOptions: number[];
  setPagination: React.Dispatch<React.SetStateAction<{
    pageIndex: number;
    pageSize: number;
  }>>;
}

interface TableFooterProps<TData extends object> {
  table: Table<TData>;
}

export function TablePagination<TData extends object>({
  table,
}: TableFooterProps<TData>) {
  return (
    <TableFooter>
      {table.getFooterGroups().map((footerGroup) => (
        <TableRow key={footerGroup.id}>
          {footerGroup.headers.map((header) => (
            <TableHead key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.footer,
                    header.getContext()
                  )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableFooter>
  );
}

export function PaginationControls<TData extends object>({
  table,
  showPagination,
  pageSizeOptions,
  setPagination,
}: TablePaginationProps<TData>) {
  if (!showPagination) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between sm:justify-end items-start sm:items-center gap-3 mt-4 px-4 pb-2">
      {/* Page size selector */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground whitespace-nowrap">
          Rows per page:
        </label>
        <Select
          value={String(table.getState().pagination.pageSize)}
          onValueChange={(value: string) => {
            const newPageSize = Number(value);
            // Usar el método de la tabla para cambiar la paginación (dispara onPaginationChange)
            table.setPagination({
              pageIndex: 0,
              pageSize: newPageSize,
            });
            // También actualizar el estado local para mantener sincronización
            setPagination({ pageIndex: 0, pageSize: newPageSize });
          }}
        >
          <SelectTrigger className="w-20 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((sz) => (
              <SelectItem key={sz} value={String(sz)}>
                {sz}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pagination info and controls */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        
        <div className="flex items-center gap-1">
          <button
            className="px-3 py-1 text-sm border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-background text-foreground"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">‹</span>
          </button>
          <button
            className="px-3 py-1 text-sm border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-background text-foreground"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
