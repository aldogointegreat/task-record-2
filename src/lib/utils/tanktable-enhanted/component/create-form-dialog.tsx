import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import type { CreateFormConfig, FormField } from "../types/tank-table.types";

interface CreateFormDialogProps<TData extends object> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  createForm: CreateFormConfig<TData>;
  formValues: Record<string, unknown>;
  setFieldValue: (
    formValues: Record<string, unknown>,
    setFormValues: React.Dispatch<React.SetStateAction<Record<string, unknown>>>,
    name: string,
    value: unknown
  ) => void;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  onSubmit: (e: React.FormEvent) => void;
  initialLoading: boolean;
}

function FormFieldRenderer<TData extends object>({
  field,
  value,
  setFieldValue,
  formValues,
  setFormValues,
}: {
  field: FormField<TData>;
  value: unknown;
  setFieldValue: (
    formValues: Record<string, unknown>,
    setFormValues: React.Dispatch<React.SetStateAction<Record<string, unknown>>>,
    name: string,
    value: unknown
  ) => void;
  formValues: Record<string, unknown>;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
}) {
  const common = { id: field.name, name: field.name, required: field.required } as const;

  switch (field.inputType) {
    case "textarea":
      return (
        <div className="space-y-2" key={field.name}>
          <Label htmlFor={field.name}>{field.label}</Label>
          <Textarea
            {...common}
            rows={3}
            value={String(value ?? "")}
            placeholder={field.placeholder}
            className={field.className}
            onChange={(e) => setFieldValue(formValues, setFormValues, field.name, e.target.value)}
          />
        </div>
      );
    case "number":
      return (
        <div className="space-y-2" key={field.name}>
          <Label htmlFor={field.name}>{field.label}</Label>
          <Input
            type="number"
            step={field.step}
            {...common}
            value={String(value ?? "")}
            placeholder={field.placeholder}
            className={field.className}
            onChange={(e) => setFieldValue(formValues, setFormValues, field.name, e.target.value)}
          />
        </div>
      );
    case "checkbox":
      return (
        <div className="flex items-center space-x-2" key={field.name}>
          <Checkbox
            id={field.name}
            checked={Boolean(value)}
            onCheckedChange={(checked) => setFieldValue(formValues, setFormValues, field.name, !!checked)}
          />
          <Label htmlFor={field.name}>{field.label}</Label>
        </div>
      );
    case "select":
      return (
        <div className="space-y-2" key={field.name}>
          <Label htmlFor={field.name}>{field.label}</Label>
          <Select
            value={(field.encode?.(value as unknown) ?? String(value ?? ""))}
            onValueChange={(val) =>
              setFieldValue(
                formValues,
                setFormValues,
                field.name,
                (field.decode ? field.decode(val) : val) as unknown
              )
            }
          >
            <SelectTrigger id={field.name}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {(field.options ?? []).map((opt) => (
                <SelectItem
                  key={(field.encode ? field.encode(opt.value) : String(opt.value))}
                  value={(field.encode ? field.encode(opt.value) : String(opt.value))}
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    case "date":
    case "text":
    default:
      return (
        <div className="space-y-2" key={field.name}>
          <Label htmlFor={field.name}>{field.label}</Label>
          <Input
            type={field.inputType === "date" ? "date" : "text"}
            {...common}
            readOnly={field.readOnly}
            value={String(value ?? "")}
            placeholder={field.placeholder}
            className={field.className}
            onChange={(e) => setFieldValue(formValues, setFormValues, field.name, e.target.value)}
          />
        </div>
      );
  }
}

export function CreateFormDialog<TData extends object>({
  open,
  onOpenChange,
  createForm,
  formValues,
  setFieldValue,
  setFormValues,
  onSubmit,
  initialLoading,
}: CreateFormDialogProps<TData>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{createForm.title ?? "Create"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
            {createForm.fields.map((field) => {
              // Campos de textarea y algunos campos importantes ocupan todo el ancho
              const fullWidth = field.inputType === "textarea" || 
                               field.name === "DESCRIPCION" || 
                               field.name === "ESPECIFICACION";
              
              return (
                <div
                  key={field.name}
                  className={fullWidth ? "md:col-span-2" : ""}
                >
                  <FormFieldRenderer
                    field={field}
                    value={formValues[field.name]}
                    setFieldValue={setFieldValue}
                    formValues={formValues}
                    setFormValues={setFormValues}
                  />
                </div>
              );
            })}
          </div>

          <DialogFooter className="pt-4 mt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {createForm.cancelLabel ?? "Cancel"}
            </Button>
            <Button type="submit" disabled={initialLoading}>
              {createForm.submitLabel ?? "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
