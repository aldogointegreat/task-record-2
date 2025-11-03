import React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { flexRender, type Table } from "@tanstack/react-table";
import { TableBody as TableBodyComponent, TableCell, TableRow } from "@/components/ui/table";

interface VirtualizedTableBodyProps<TData extends object> {
  table: Table<TData>;
  height?: number;
  overscan?: number;
  rowHeight?: number;
}

export function VirtualizedTableBody<TData extends object>({
  table,
  height = 400,
  overscan = 5,
  rowHeight = 50,
}: VirtualizedTableBodyProps<TData>) {
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
    <div
      ref={parentRef}
      className="overflow-auto"
      style={{ height: `${height}px` }}
    >
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        <TableBodyComponent className="bg-background">
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <TableRow
                key={row.id}
                style={{
                  height: `${virtualRow.size}px`,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-4 px-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBodyComponent>
      </div>
    </div>
  );
}
