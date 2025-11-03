import React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { flexRender, type Table } from "@tanstack/react-table";
import { TableHeader } from "./table-header";

interface SimpleVirtualizedTableProps<TData extends object> {
  table: Table<TData>;
  height?: number;
  overscan?: number;
  rowHeight?: number;
}

export function SimpleVirtualizedTable<TData extends object>({
  table,
  height = 400,
  overscan = 5,
  rowHeight = 50,
}: SimpleVirtualizedTableProps<TData>) {
  const { rows } = table.getRowModel();
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan,
  });

  const virtualRows = virtualizer.getVirtualItems();

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Debug Info */}
      <div className="bg-muted/50 p-2 text-xs text-muted-foreground border-b border-border">
        <div className="flex justify-between">
          <span>Total Rows: {rows.length.toLocaleString()}</span>
          <span>Visible Rows: {virtualRows.length}</span>
          <span>Container Height: {height}px</span>
          <span>Row Height: {rowHeight}px</span>
        </div>
      </div>

      {/* Table Header */}
      <div className="bg-muted/50 border-b border-border">
        <table className="w-full">
          <TableHeader table={table} />
        </table>
      </div>
      
      {/* Virtualized Body */}
      <div
        ref={parentRef}
        className="overflow-auto"
        style={{ height: `${height}px` }}
      >
        <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
          <table className="w-full">
            <tbody>
              {virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <tr
                    key={row.id}
                    style={{
                      height: `${virtualRow.size}px`,
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="bg-background hover:bg-muted/50 border-b border-border"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-4 px-4 border-b border-border text-foreground">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
