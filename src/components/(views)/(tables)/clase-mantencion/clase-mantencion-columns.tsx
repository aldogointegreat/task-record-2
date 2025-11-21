import { ColumnDef } from "@tanstack/react-table";
import type { ClaseMantencion } from "@/models";
import { ActionsCell, EditableCell } from "@/lib/utils/tanktable-enhanted/component/actions-cell";
import { Loader2 } from "lucide-react";

interface ClaseMantencionColumnsProps {
  updatingIds?: Set<number>;
  deletingIds?: Set<number>;
}

export const createClaseMantencionColumns = (props?: ClaseMantencionColumnsProps): ColumnDef<ClaseMantencion>[] => {
  const { 
    updatingIds = new Set(), 
    deletingIds = new Set() 
  } = props || {};

  return [
    {
      accessorKey: "ID_CLASE",
      header: "ID",
      cell: ({ getValue }) => <span className="font-mono text-sm">{getValue<number>()}</span>,
    },
    {
      accessorKey: "CODIGO",
      header: "Código",
      cell: ({ row }) => {
        const isUpdating = updatingIds.has(row.original.ID_CLASE);
        return (
          <div className="flex items-center gap-2">
            <EditableCell<ClaseMantencion, "CODIGO">
              row={row}
              field="CODIGO"
              inputType="text"
            />
            {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
        );
      },
    },
    {
      accessorKey: "NOMBRE",
      header: "Nombre",
      cell: ({ row }) => (
        <EditableCell<ClaseMantencion, "NOMBRE">
          row={row}
          field="NOMBRE"
          inputType="text"
        />
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row, table }) => {
        const meta = table.options.meta;
        const isUpdating = updatingIds.has(row.original.ID_CLASE);
        const isDeleting = deletingIds.has(row.original.ID_CLASE);
        
        if (isUpdating || isDeleting) {
          return (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {isUpdating ? 'Guardando...' : 'Eliminando...'}
              </span>
            </div>
          );
        }
        
        return (
          <ActionsCell
            row={row}
            onRowSave={meta?.onRowSave}
            onRowDelete={meta?.onRowDelete}
          />
        );
      },
    },
  ];
};

export const claseMantencionColumns = createClaseMantencionColumns();

