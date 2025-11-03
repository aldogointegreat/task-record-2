import React, { useEffect, useCallback, useRef } from "react";
import type { Table } from "@tanstack/react-table";

interface UseKeyboardNavigationOptions<TData extends Record<string, unknown>> {
  table: Table<TData>;
  enabled?: boolean;
  onRowSelect?: (row: TData) => void;
  onRowEdit?: (row: TData) => void;
  onRowDelete?: (row: TData) => void;
  onAdd?: () => void;
}

export function useKeyboardNavigation<TData extends Record<string, unknown>>({
  table,
  enabled = true,
  onRowSelect,
  onRowEdit,
  onRowDelete,
  onAdd,
}: UseKeyboardNavigationOptions<TData>) {
  const tableRef = useRef<HTMLDivElement>(null);
  const [focusedRowIndex, setFocusedRowIndex] = React.useState<number>(-1);
  const [focusedCellIndex, setFocusedCellIndex] = React.useState<number>(-1);

  const rows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();

  // Focus management
  const focusRow = useCallback((rowIndex: number) => {
    if (rowIndex >= 0 && rowIndex < rows.length) {
      setFocusedRowIndex(rowIndex);
      setFocusedCellIndex(0);
      
      // Scroll to row if needed
      const rowElement = tableRef.current?.querySelector(`[data-row-index="${rowIndex}"]`);
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [rows.length]);

  const focusCell = useCallback((rowIndex: number, cellIndex: number) => {
    if (rowIndex >= 0 && rowIndex < rows.length && 
        cellIndex >= 0 && cellIndex < visibleColumns.length) {
      setFocusedRowIndex(rowIndex);
      setFocusedCellIndex(cellIndex);
      
      // Focus the cell element
      const cellElement = tableRef.current?.querySelector(
        `[data-row-index="${rowIndex}"][data-cell-index="${cellIndex}"]`
      );
      if (cellElement) {
        (cellElement as HTMLElement).focus();
      }
    }
  }, [rows.length, visibleColumns.length]);

  // Keyboard event handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled || !tableRef.current?.contains(event.target as Node)) {
      return;
    }

    const { key, ctrlKey, shiftKey, altKey } = event;

    // Prevent default for handled keys
    const handledKeys = [
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'Enter', 'Escape', 'Delete', 'a', 'A', 'e', 'E', 'd', 'D'
    ];

    if (handledKeys.includes(key)) {
      event.preventDefault();
    }

    switch (key) {
      case 'ArrowUp':
        if (focusedRowIndex > 0) {
          focusRow(focusedRowIndex - 1);
        }
        break;

      case 'ArrowDown':
        if (focusedRowIndex < rows.length - 1) {
          focusRow(focusedRowIndex + 1);
        }
        break;

      case 'ArrowLeft':
        if (focusedCellIndex > 0) {
          focusCell(focusedRowIndex, focusedCellIndex - 1);
        }
        break;

      case 'ArrowRight':
        if (focusedCellIndex < visibleColumns.length - 1) {
          focusCell(focusedRowIndex, focusedCellIndex + 1);
        }
        break;

      case 'Enter':
        if (focusedRowIndex >= 0 && focusedRowIndex < rows.length) {
          const row = rows[focusedRowIndex];
          if (shiftKey && onRowEdit) {
            onRowEdit(row.original);
          } else if (onRowSelect) {
            onRowSelect(row.original);
          }
        }
        break;

      case 'Escape':
        setFocusedRowIndex(-1);
        setFocusedCellIndex(-1);
        break;

      case 'Delete':
        if (focusedRowIndex >= 0 && focusedRowIndex < rows.length && onRowDelete) {
          const row = rows[focusedRowIndex];
          onRowDelete(row.original);
        }
        break;

      case 'a':
      case 'A':
        if (ctrlKey && onAdd) {
          onAdd();
        }
        break;

      case 'e':
      case 'E':
        if (ctrlKey && focusedRowIndex >= 0 && focusedRowIndex < rows.length && onRowEdit) {
          const row = rows[focusedRowIndex];
          onRowEdit(row.original);
        }
        break;

      case 'd':
      case 'D':
        if (ctrlKey && focusedRowIndex >= 0 && focusedRowIndex < rows.length && onRowDelete) {
          const row = rows[focusedRowIndex];
          onRowDelete(row.original);
        }
        break;
    }
  }, [
    enabled,
    focusedRowIndex,
    focusedCellIndex,
    rows,
    visibleColumns.length,
    focusRow,
    focusCell,
    onRowSelect,
    onRowEdit,
    onRowDelete,
    onAdd,
  ]);

  // Mouse click handler
  const handleRowClick = useCallback((rowIndex: number, cellIndex: number = 0) => {
    focusCell(rowIndex, cellIndex);
  }, [focusCell]);

  // Setup event listeners
  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);

  // Reset focus when data changes
  useEffect(() => {
    if (focusedRowIndex >= rows.length) {
      setFocusedRowIndex(-1);
      setFocusedCellIndex(-1);
    }
  }, [rows.length, focusedRowIndex]);

  return {
    tableRef,
    focusedRowIndex,
    focusedCellIndex,
    handleRowClick,
    focusRow,
    focusCell,
    isRowFocused: (rowIndex: number) => focusedRowIndex === rowIndex,
    isCellFocused: (rowIndex: number, cellIndex: number) => 
      focusedRowIndex === rowIndex && focusedCellIndex === cellIndex,
  };
}


