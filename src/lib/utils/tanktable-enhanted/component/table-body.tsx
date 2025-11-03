import React from "react";
import { flexRender, type Table } from "@tanstack/react-table";
import { TableBody as TableBodyComponent, TableCell, TableRow } from "@/components/ui/table";

interface TableBodyProps<TData extends object> {
  table: Table<TData>;
}

export function TableBody<TData extends object>({ table }: TableBodyProps<TData>) {
  return (
    <TableBodyComponent className="divide-y divide-border">
      {table.getRowModel().rows.map((row) => (
        <TableRow 
          key={row.id} 
          className="hover:bg-muted/50 transition-colors border-b border-border"
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell 
              key={cell.id} 
              className="py-3 px-3 text-sm text-foreground align-top"
              style={{
                minWidth: cell.column.id === 'select' ? '48px' : 
                         cell.column.id === 'actions' ? '100px' :
                         cell.column.id === 'codigo_sku' ? '120px' :
                         cell.column.id === 'nombre' ? '200px' :
                         cell.column.id === 'categoria_id' ? '150px' :
                         cell.column.id === 'descripcion' ? '250px' :
                         cell.column.id === 'precio_venta' ? '120px' :
                         cell.column.id === 'stock_minimo' ? '120px' :
                         cell.column.id === 'activo' ? '80px' : 'auto'
              }}
            >
              <div className="truncate max-w-full">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBodyComponent>
  );
}
