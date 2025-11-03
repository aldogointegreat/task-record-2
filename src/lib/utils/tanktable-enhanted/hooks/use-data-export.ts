import { useCallback } from "react";
import type { ExportFormat, ExportOptions } from "../types/tank-table.types";

export function useDataExport<TData extends object>() {
  const exportToCSV = useCallback((data: TData[], filename: string = "export.csv") => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0] as Record<string, unknown>);
    const csvContent = [
      headers.join(","),
      ...data.map(row => 
        headers.map(header => {
          const value = (row as Record<string, unknown>)[header];
          // Escape commas and quotes in CSV
          const stringValue = String(value ?? "");
          if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const exportToJSON = useCallback((data: TData[], filename: string = "export.json") => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const exportData = useCallback((
    data: TData[], 
    format: ExportFormat, 
    filename?: string,
    exportOptions?: ExportOptions
  ) => {
    const defaultFilename = exportOptions?.filename || `export.${format}`;
    const finalFilename = filename || defaultFilename;

    switch (format) {
      case "csv":
        exportToCSV(data, finalFilename);
        break;
      case "json":
        exportToJSON(data, finalFilename);
        break;
      default:
        console.warn(`Unsupported export format: ${format}`);
    }

    // Call custom export handler if provided
    exportOptions?.onExport?.(data, format);
  }, [exportToCSV, exportToJSON]);

  return {
    exportData,
    exportToCSV,
    exportToJSON,
  };
}
