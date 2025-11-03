import { useState } from "react";
import type { SortingState, RowSelectionState } from "@tanstack/react-table";
import type { TableState, FormState } from "../types/tank-table.types";

export function useTableState<TData extends object>(
  initialPageSize: number = 10
) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  return {
    globalFilter,
    setGlobalFilter,
    sorting,
    setSorting,
    pagination,
    setPagination,
    rowSelection,
    setRowSelection,
  };
}

export function useFormState<TData extends object>() {
  const [openCreate, setOpenCreate] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [openDelete, setOpenDelete] = useState(false);
  const [rowPendingDelete, setRowPendingDelete] = useState<TData | null>(null);

  return {
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
  };
}
