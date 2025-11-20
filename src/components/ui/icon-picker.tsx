import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { APP_ICONS, getIconList } from "@/lib/constants/app-icons";

interface IconPickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function IconPicker({
  value,
  onChange,
  placeholder = "Seleccionar ícono...",
  className,
}: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const allIcons = getIconList();
  const selectedIcon = value ? APP_ICONS[value] : null;

  // Filtrar íconos basado en la búsqueda
  const icons = allIcons.filter((icon) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      icon.name.toLowerCase().includes(searchLower) ||
      icon.label.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Popover 
      open={open} 
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          setSearch(""); // Resetear búsqueda al cerrar
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedIcon ? (
            <div className="flex items-center gap-2">
              <selectedIcon.component className="h-4 w-4" />
              <span>{selectedIcon.label}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[300px] p-0 z-[100]" 
        align="start"
      >
        <Command shouldFilter={false} className="overflow-hidden">
          <CommandInput 
            placeholder="Buscar ícono..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandList 
            className="max-h-[300px] overflow-y-auto overflow-x-hidden"
            onWheel={(e) => {
              // Asegurar que el scroll del CommandList no se propague
              e.stopPropagation();
            }}
          >
            {icons.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No se encontraron íconos.
              </div>
            ) : (
              <CommandGroup>
                <div className="grid grid-cols-4 gap-2 p-2">
                  {icons.map((icon) => (
                  <div
                    key={icon.name}
                    onClick={() => {
                      onChange(icon.name);
                      setOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onChange(icon.name);
                        setOpen(false);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={cn(
                      "relative flex flex-col items-center justify-center gap-1 p-2 rounded-md cursor-pointer h-auto transition-colors hover:bg-accent hover:text-accent-foreground",
                      value === icon.name ? "bg-accent text-accent-foreground" : ""
                    )}
                  >
                    <icon.component className="h-6 w-6" />
                    <span className="text-[10px] text-center leading-tight w-full truncate">
                      {icon.label}
                    </span>
                    {value === icon.name && (
                      <div className="absolute top-1 right-1">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  ))}
                </div>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}


