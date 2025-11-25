import React, { useEffect } from "react";
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
import { IconPicker } from "@/components/ui/icon-picker";

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
            readOnly={field.readOnly}
            disabled={field.readOnly}
            onChange={(e) => {
              if (!field.readOnly) {
                setFieldValue(formValues, setFormValues, field.name, e.target.value);
              }
            }}
          />
        </div>
      );
    case "checkbox": {
      // Lógica especial para PLANTILLA y GENERICO: se deshabilitan mutuamente
      const isPlantilla = field.name === "PLANTILLA";
      const isGenerico = field.name === "GENERICO";
      const otherFieldName = isPlantilla ? "GENERICO" : isGenerico ? "PLANTILLA" : null;
      const otherFieldValue = otherFieldName ? Boolean(formValues[otherFieldName]) : false;
      const isDisabled = (isPlantilla || isGenerico) && otherFieldValue;
      
      return (
        <div className="flex items-center space-x-2" key={field.name}>
          <Checkbox
            id={field.name}
            checked={Boolean(value)}
            disabled={isDisabled}
            onCheckedChange={(checked) => {
              const newValue = !!checked;
              setFormValues((prev) => {
                const updated = { ...prev, [field.name]: newValue };
                // Si se marca uno, desmarcar el otro automáticamente
                if ((isPlantilla || isGenerico) && newValue && otherFieldName) {
                  updated[otherFieldName] = false;
                }
                return updated;
              });
            }}
          />
          <Label 
            htmlFor={field.name}
            className={isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          >
            {field.label}
          </Label>
        </div>
      );
    }
    case "select": {
      const selectOptions = typeof field.options === 'function' 
        ? field.options(formValues) 
        : (field.options ?? []);
      const isDisabled = typeof field.disabled === 'function'
        ? field.disabled(formValues)
        : (field.disabled ?? false);
      
      return (
        <div className="space-y-2" key={field.name}>
          <Label htmlFor={field.name}>{field.label}</Label>
          <Select
            value={(field.encode?.(value as unknown) ?? String(value ?? ""))}
            onValueChange={(val) => {
              const decodedValue = field.decode ? field.decode(val) : val;
              setFieldValue(
                formValues,
                setFormValues,
                field.name,
                decodedValue as unknown
              );
              // Ejecutar onChange personalizado si existe
              if (field.onChange) {
                field.onChange(decodedValue, formValues, setFormValues, setFieldValue);
              }
            }}
            disabled={isDisabled}
          >
            <SelectTrigger id={field.name} disabled={isDisabled}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map((opt) => (
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
    }
    case "icon":
      return (
        <div className="space-y-2" key={field.name}>
          <Label htmlFor={field.name}>{field.label}</Label>
          <IconPicker
            value={String(value ?? "")}
            onChange={(val) => setFieldValue(formValues, setFormValues, field.name, val)}
            placeholder={field.placeholder}
          />
        </div>
      );
    case "date":
    case "color":
    case "text":
    default:
      return (
        <div className="space-y-2" key={field.name}>
          <Label htmlFor={field.name}>{field.label}</Label>
          <div className={field.inputType === "color" ? "flex gap-2 items-center" : ""}>
            <Input
              type={field.inputType === "date" ? "date" : field.inputType === "color" ? "color" : "text"}
              {...common}
              readOnly={field.readOnly}
              value={String(value ?? "")}
              placeholder={field.placeholder}
              className={field.className}
              onChange={(e) => setFieldValue(formValues, setFormValues, field.name, e.target.value)}
              style={field.inputType === "color" ? { width: '60px', padding: '2px' } : undefined}
            />
             {field.inputType === "color" && (
                <span className="text-sm text-muted-foreground font-mono">
                  {String(value ?? "")}
                </span>
              )}
          </div>
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
