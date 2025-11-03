
import { useState, useMemo } from "react";
import type { RowSelectionState } from "@tanstack/react-table";

export function useRowSelection<TData extends object>() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const selectedRows = useMemo(() => {
    return Object.keys(rowSelection).filter(key => rowSelection[key]);
  }, [rowSelection]);

  const selectedCount = selectedRows.length;
  const isAllSelected = selectedRows.length > 0;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < Object.keys(rowSelection).length;

  const clearSelection = () => {
    setRowSelection({});
  };

  const selectAll = (allRowIds: string[]) => {
    const newSelection: RowSelectionState = {};
    allRowIds.forEach(id => {
      newSelection[id] = true;
    });
    setRowSelection(newSelection);
  };

  const toggleRowSelection = (rowId: string) => {
    setRowSelection(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  };

  return {
    rowSelection,
    setRowSelection,
    selectedRows,
    selectedCount,
    isAllSelected,
    isIndeterminate,
    clearSelection,
    selectAll,
    toggleRowSelection,
  };
}
