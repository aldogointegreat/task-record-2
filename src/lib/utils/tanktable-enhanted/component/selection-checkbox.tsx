import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import type { Row } from "@tanstack/react-table";

interface SelectionCheckboxProps<TData extends object> {
  row?: Row<TData>;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  indeterminate?: boolean;
  isHeader?: boolean;
}

export function SelectionCheckbox<TData extends object>({
  row,
  checked,
  onCheckedChange,
  indeterminate = false,
  isHeader = false,
}: SelectionCheckboxProps<TData>) {
  if (isHeader) {
    return (
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        ref={(el) => {
          if (el && 'indeterminate' in el) {
            (el as { indeterminate?: boolean }).indeterminate = indeterminate;
          }
        }}
        aria-label="Select all rows"
        className="data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground"
      />
    );
  }

  return (
    <Checkbox
      checked={checked}
      onCheckedChange={onCheckedChange}
      aria-label={`Select row ${row?.id}`}
    />
  );
}
