import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Eye, 
  EyeOff, 
  Columns3,
  Check,
  X
} from "lucide-react";
import type { Table } from "@tanstack/react-table";

interface ColumnVisibilityMenuProps<TData extends Record<string, unknown>> {
  table: Table<TData>;
}

export function ColumnVisibilityMenu<TData extends Record<string, unknown>>({ 
  table 
}: ColumnVisibilityMenuProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  
  const columns = table.getAllColumns();
  const visibleColumns = columns.filter(column => column.getIsVisible());
  const hiddenColumns = columns.filter(column => !column.getIsVisible());
  
  const allVisible = visibleColumns.length === columns.length;

  const toggleAllColumns = () => {
    if (allVisible) {
      // Hide all columns except the first one (usually selection or ID)
      table.setColumnVisibility(
        columns.reduce((acc, column, index) => {
          acc[column.id] = index === 0; // Keep first column visible
          return acc;
        }, {} as Record<string, boolean>)
      );
    } else {
      // Show all columns
      table.setColumnVisibility(
        columns.reduce((acc, column) => {
          acc[column.id] = true;
          return acc;
        }, {} as Record<string, boolean>)
      );
    }
  };

  const toggleColumn = (columnId: string) => {
    const column = table.getColumn(columnId);
    if (column) {
      column.toggleVisibility();
    }
    // Don't close the menu - keep it open for multiple selections
  };

  const resetToDefault = () => {
    table.resetColumnVisibility();
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="h-10 px-3 focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Visibilidad de columnas"
          >
            <Columns3 className="h-4 w-4 mr-2" />
            Columnas
            {hiddenColumns.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {hiddenColumns.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Visibilidad de Columnas</span>
            <div className="flex items-center gap-1">
              {hiddenColumns.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetToDefault}
                  className="h-6 px-2 text-xs"
                >
                  Reset
                  <X className="h-3 w-3 mr-1" />
                </Button>
              )}

            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Toggle All */}
          <DropdownMenuItem
            onClick={toggleAllColumns}
            className="font-medium"
          >
            {allVisible ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Ocultar Todas
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Mostrar Todas
              </>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Column List */}
          <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
            Columnas Individuales
          </DropdownMenuLabel>
          
          {columns
            .filter(column => column.id !== 'select') // Exclude select column
            .map((column) => {
            const isVisible = column.getIsVisible();
            const canHide = columns.length > 1; // Don't allow hiding the last column
            
            return (
              <div
                key={column.id}
                className="flex items-center justify-between px-2 py-1.5 text-sm hover:bg-muted cursor-pointer rounded-sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (canHide) {
                    toggleColumn(column.id);
                  }
                }}
              >
                <div className="flex items-center">
                  <Checkbox
                    checked={isVisible}
                    onCheckedChange={() => {
                      if (canHide) {
                        toggleColumn(column.id);
                      }
                    }}
                    disabled={!canHide && isVisible}
                    className="mr-2"
                  />
                  {isVisible ? (
                    <Eye className="h-3 w-3 mr-2 text-primary" />
                  ) : (
                    <EyeOff className="h-3 w-3 mr-2 text-muted-foreground" />
                  )}
                  <span className="truncate">
                    {typeof column.columnDef.header === 'function' 
                      ? column.id 
                      : (column.columnDef.header as string) || column.id}
                  </span>
                </div>
                {isVisible && (
                  <Check className="h-3 w-3 text-primary" />
                )}
              </div>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
