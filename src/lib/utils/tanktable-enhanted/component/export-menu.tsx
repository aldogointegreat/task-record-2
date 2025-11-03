import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Table, Database } from "lucide-react";
import type { ExportFormat, ExportOptions } from "../types/tank-table.types";

interface ExportMenuProps<TData extends object> {
  data: TData[];
  exportOptions?: ExportOptions;
  onExport: (data: TData[], format: ExportFormat, filename?: string) => void;
  disabled?: boolean;
}

const formatIcons = {
  csv: FileText,
  json: Database,
};

const formatLabels = {
  csv: "Export as CSV",
  json: "Export as JSON",
};

export function ExportMenu<TData extends object>({
  data,
  exportOptions,
  onExport,
  disabled = false,
}: ExportMenuProps<TData>) {
  if (!exportOptions || exportOptions.formats.length === 0) return null;

  const handleExport = (format: ExportFormat) => {
    const filename = exportOptions.filename 
      ? `${exportOptions.filename}.${format}`
      : `export.${format}`;
    
    onExport(data, format, filename);
  };

  if (exportOptions.formats.length === 1) {
    const format = exportOptions.formats[0];
    const Icon = formatIcons[format];
    
    return (
      <Button
        variant="outline"
        size="sm"
        className="h-10 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
        onClick={() => handleExport(format)}
        disabled={disabled || data.length === 0}
      >
        <Icon className="h-4 w-4 mr-1" />
        {formatLabels[format]}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-10 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
          disabled={disabled || data.length === 0}
        >
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {exportOptions.formats.map((format, index) => {
          const Icon = formatIcons[format];
          return (
            <React.Fragment key={format}>
              <DropdownMenuItem onClick={() => handleExport(format)}>
                <Icon className="h-4 w-4 mr-2" />
                {formatLabels[format]}
              </DropdownMenuItem>
              {index < exportOptions.formats.length - 1 && <DropdownMenuSeparator />}
            </React.Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
