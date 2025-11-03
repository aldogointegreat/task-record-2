import { useState, useEffect, useCallback } from "react";
import type { Table } from "@tanstack/react-table";

interface UseColumnVisibilityOptions<TData extends Record<string, unknown>> {
  table: Table<TData>;
  storageKey?: string;
  defaultHiddenColumns?: string[];
}

export function useColumnVisibility<TData extends Record<string, unknown>>({
  table,
  storageKey,
  defaultHiddenColumns = []
}: UseColumnVisibilityOptions<TData>) {
  const [isInitialized, setIsInitialized] = useState(false);

  // Load column visibility from localStorage
  const loadColumnVisibility = useCallback(() => {
    if (!storageKey) return {};

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load column visibility from localStorage:', error);
    }

    // Return default hidden columns
    return defaultHiddenColumns.reduce((acc, columnId) => {
      acc[columnId] = false;
      return acc;
    }, {} as Record<string, boolean>);
  }, [storageKey, defaultHiddenColumns]);

  // Save column visibility to localStorage
  const saveColumnVisibility = useCallback((visibility: Record<string, boolean>) => {
    if (!storageKey) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(visibility));
    } catch (error) {
      console.warn('Failed to save column visibility to localStorage:', error);
    }
  }, [storageKey]);

  // Initialize column visibility
  useEffect(() => {
    if (!isInitialized) {
      const savedVisibility = loadColumnVisibility();
      table.setColumnVisibility(savedVisibility);
      setIsInitialized(true);
    }
  }, [table, loadColumnVisibility, isInitialized]);

  // Save visibility changes
  useEffect(() => {
    if (isInitialized) {
      const visibility = table.getState().columnVisibility;
      saveColumnVisibility(visibility);
    }
  }, [table.getState().columnVisibility, saveColumnVisibility, isInitialized]);

  // Reset to default
  const resetColumnVisibility = useCallback(() => {
    table.resetColumnVisibility();
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  }, [table, storageKey]);

  // Toggle column visibility
  const toggleColumn = useCallback((columnId: string) => {
    const column = table.getColumn(columnId);
    if (column) {
      column.toggleVisibility();
    }
  }, [table]);

  // Toggle all columns
  const toggleAllColumns = useCallback((visible: boolean) => {
    const columns = table.getAllColumns();
    const visibility = columns.reduce((acc, column) => {
      acc[column.id] = visible;
      return acc;
    }, {} as Record<string, boolean>);
    table.setColumnVisibility(visibility);
  }, [table]);

  return {
    isInitialized,
    resetColumnVisibility,
    toggleColumn,
    toggleAllColumns,
    visibleColumns: table.getVisibleLeafColumns(),
    hiddenColumns: table.getAllColumns().filter(col => !col.getIsVisible()),
  };
}
