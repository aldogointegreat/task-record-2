import React from "react";
import { flexRender, type Table } from "@tanstack/react-table";
import { TableHead, TableHeader as TableHeaderComponent, TableRow } from "@/components/ui/table";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

interface TableHeaderProps<TData extends object> {
  table: Table<TData>;
}

export function TableHeader<TData extends object>({ table }: TableHeaderProps<TData>) {
  return (
    <TableHeaderComponent className="bg-muted/50 border-b sticky top-0 z-10 backdrop-blur-sm">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="hover:bg-transparent">
          {headerGroup.headers.map((header) => (
            <TableHead 
              key={header.id} 
              className="font-semibold text-foreground px-3 py-4 text-left align-middle whitespace-nowrap bg-muted/50 backdrop-blur-sm"
              style={{
                minWidth: header.id === 'select' ? '48px' : 
                         header.id === 'actions' ? '100px' :
                         header.id === 'codigo_sku' ? '120px' :
                         header.id === 'nombre' ? '200px' :
                         header.id === 'categoria_id' ? '150px' :
                         header.id === 'descripcion' ? '250px' :
                         header.id === 'precio_venta' ? '120px' :
                         header.id === 'stock_minimo' ? '120px' :
                         header.id === 'activo' ? '80px' : 'auto'
              }}
            >
              {header.isPlaceholder ? null : (
                <span
                  className={
                    header.column.getCanSort()
                      ? "cursor-pointer select-none flex items-center gap-1 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 rounded px-1 py-1"
                      : "flex items-center gap-1"
                  }
                  onClick={header.column.getToggleSortingHandler()}
                  tabIndex={header.column.getCanSort() ? 0 : -1}
                  role={header.column.getCanSort() ? "button" : undefined}
                  aria-label={header.column.getCanSort() ? `Ordenar por ${flexRender(header.column.columnDef.header, header.getContext())}` : undefined}
                >
                  <span className="truncate">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </span>
                  {{
                    asc: <FaChevronUp className="h-3 w-3 text-primary flex-shrink-0" />,
                    desc: <FaChevronDown className="h-3 w-3 text-primary flex-shrink-0" />,
                  }[header.column.getIsSorted() as string] ?? null}
                </span>
              )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeaderComponent>
  );
}
