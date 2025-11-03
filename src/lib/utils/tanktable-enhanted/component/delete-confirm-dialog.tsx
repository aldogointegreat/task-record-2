import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { DeleteConfirmConfig } from "../types/tank-table.types";

interface DeleteConfirmDialogProps<TData extends object> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deleteConfirm: DeleteConfirmConfig<TData>;
  rowPendingDelete: TData | null;
  onConfirm: () => void;
}

export function DeleteConfirmDialog<TData extends object>({
  open,
  onOpenChange,
  deleteConfirm,
  rowPendingDelete,
  onConfirm,
}: DeleteConfirmDialogProps<TData>) {
  const getDescription = () => {
    const fallback =
      "Are you sure you want to delete this item? This action cannot be undone.";
    if (!deleteConfirm.description) return fallback;
    if (typeof deleteConfirm.description === "function") {
      try {
        return deleteConfirm.description(rowPendingDelete);
      } catch {
        return fallback;
      }
    }
    return deleteConfirm.description;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{deleteConfirm.title ?? "Confirm delete"}</DialogTitle>
        </DialogHeader>

        <div className="text-sm text-muted-foreground">
          {getDescription()}
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {deleteConfirm.cancelLabel ?? "Cancel"}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
          >
            {deleteConfirm.confirmLabel ?? "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
