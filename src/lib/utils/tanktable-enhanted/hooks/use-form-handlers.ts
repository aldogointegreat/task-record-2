import { toast } from "sonner";
import type { CreateFormConfig, DeleteConfirmConfig } from "../types/tank-table.types";

export function useFormHandlers<TData extends object>() {
  const setFieldValue = (
    formValues: Record<string, unknown>,
    setFormValues: React.Dispatch<React.SetStateAction<Record<string, unknown>>>,
    name: string,
    value: unknown
  ) => setFormValues((prev) => ({ ...prev, [name]: value }));

  const handleOpenCreate = async (
    createForm: CreateFormConfig<TData> | undefined,
    onAdd: (() => void) | undefined,
    setInitialLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setFormValues: React.Dispatch<React.SetStateAction<Record<string, unknown>>>,
    setOpenCreate: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!createForm) {
      onAdd?.();
      return;
    }
    
    try {
      setInitialLoading(true);
      const base = createForm.getInitialValues
        ? await createForm.getInitialValues()
        : {};
      setFormValues({ ...(base as Record<string, unknown>) });
    } finally {
      setInitialLoading(false);
      setOpenCreate(true);
    }
  };

  const submitCreate = async (
    e: React.FormEvent,
    createForm: CreateFormConfig<TData> | undefined,
    formValues: Record<string, unknown>,
    setOpenCreate: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    e.preventDefault();
    if (!createForm) return;
    
    const payload: Record<string, unknown> = {};
    for (const f of createForm.fields) {
      const raw = formValues[f.name];
      let val: unknown = raw;
      
      if (typeof f.parse === "function") {
        val = f.parse(raw as string | boolean);
      } else {
        switch (f.inputType) {
          case "number":
            val = raw === "" || raw === undefined ? null : Number(raw);
            break;
          case "checkbox":
            val = Boolean(raw);
            break;
          case "select":
          case "text":
          case "textarea":
          case "date":
          default:
            val = raw as string;
        }
      }
      payload[f.name] = val;
    }
    
    const typed = payload as TData;
    try {
      await createForm.onSubmit(typed);
      
      const createMsg =
        typeof createForm.successMessage === "function"
          ? createForm.successMessage(typed)
          : createForm.successMessage ?? "Creado exitosamente";
      toast.success(createMsg);
      setOpenCreate(false);
    } catch (error) {
      // Si hay un error, no cerrar el diálogo y no mostrar toast de éxito
      // El error ya fue manejado en el handler (onSubmit)
      // No hacer nada aquí, solo dejar que el error se propague
    }
  };

  const requestDelete = (
    row: TData,
    deleteConfirm: DeleteConfirmConfig<TData> | undefined,
    onRowDelete: ((row: TData) => Promise<void> | void) | undefined,
    setRowPendingDelete: React.Dispatch<React.SetStateAction<TData | null>>,
    setOpenDelete: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (deleteConfirm) {
      setRowPendingDelete(row);
      setOpenDelete(true);
      return;
    }
    onRowDelete?.(row);
  };

  const requestSave = async (
    row: TData,
    onRowSave: ((row: TData) => Promise<void> | void) | undefined,
    updateSuccessMessage: string | ((row: TData) => string) | undefined
  ) => {
    await onRowSave?.(row);
    const msg =
      typeof updateSuccessMessage === "function"
        ? updateSuccessMessage(row)
        : updateSuccessMessage ?? "Actualizado exitosamente";
    toast.success(msg);
  };

  const handleDeleteConfirm = async (
    rowPendingDelete: TData | null,
    onRowDelete: ((row: TData) => Promise<void> | void) | undefined,
    deleteConfirm: DeleteConfirmConfig<TData> | undefined,
    setOpenDelete: React.Dispatch<React.SetStateAction<boolean>>,
    setRowPendingDelete: React.Dispatch<React.SetStateAction<TData | null>>
  ) => {
    if (rowPendingDelete && onRowDelete) {
      await onRowDelete(rowPendingDelete);
      const delMsg =
        typeof deleteConfirm?.successMessage === "function"
          ? deleteConfirm.successMessage(rowPendingDelete)
          : deleteConfirm?.successMessage ?? "Eliminado exitosamente";
      toast.success(delMsg);
    }
    setOpenDelete(false);
    setRowPendingDelete(null);
  };

  return {
    setFieldValue,
    handleOpenCreate,
    submitCreate,
    requestDelete,
    requestSave,
    handleDeleteConfirm,
  };
}
