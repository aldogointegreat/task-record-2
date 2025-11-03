import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Trash2, 
  Download, 
  Edit, 
  MoreHorizontal,
  X
} from "lucide-react";
import type { BulkActions } from "../types/tank-table.types";

interface BulkActionsBarProps<TData extends object> {
  selectedCount: number;
  selectedRows: TData[];
  bulkActions: BulkActions<TData>;
  onClearSelection: () => void;
  onExport: (data: TData[]) => void;
}

export function BulkActionsBar<TData extends object>({
  selectedCount,
  selectedRows,
  bulkActions,
  onClearSelection,
  onExport,
}: BulkActionsBarProps<TData>) {
  if (selectedCount === 0) return null;

  const handleBulkDelete = async () => {
    if (bulkActions.onBulkDelete) {
      await bulkActions.onBulkDelete(selectedRows);
      onClearSelection();
    }
  };

  const handleBulkExport = () => {
    if (bulkActions.onBulkExport) {
      bulkActions.onBulkExport(selectedRows);
    } else {
      onExport(selectedRows);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg mb-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <Badge variant="secondary" className="bg-primary/20 text-primary-foreground text-sm">
          {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="text-muted-foreground hover:text-foreground h-8 px-2"
        >
          <X className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Clear</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
        {bulkActions.onBulkDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">{bulkActions.bulkDeleteLabel || "Delete Selected"}</span>
            <span className="sm:hidden">Delete</span>
          </Button>
        )}

        {((bulkActions.onBulkExport && typeof bulkActions.onBulkExport === 'function') || (onExport && typeof onExport === 'function')) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkExport}
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">{bulkActions.bulkExportLabel || "Export Selected"}</span>
            <span className="sm:hidden">Export</span>
          </Button>
        )}

        {bulkActions.onBulkUpdate && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Edit className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">{bulkActions.bulkUpdateLabel || "Bulk Actions"}</span>
                <span className="sm:hidden">Actions</span>
                <MoreHorizontal className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => {
                // This would open a bulk update dialog
                console.log("Bulk update not implemented yet");
              }}>
                Update Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
