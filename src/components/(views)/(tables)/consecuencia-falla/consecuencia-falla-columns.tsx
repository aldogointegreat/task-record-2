import { ColumnDef } from "@tanstack/react-table";
import type { ConsecuenciaFalla } from "@/models";
import { ActionsCell, EditableCell } from "@/lib/utils/tanktable-enhanted/component/actions-cell";
import { Loader2 } from "lucide-react";

interface ConsecuenciaFallaColumnsProps {
  updatingIds?: Set<number>;
  deletingIds?: Set<number>;
}

export const createConsecuenciaFallaColumns = (props?: ConsecuenciaFallaColumnsProps): ColumnDef<ConsecuenciaFalla>[] => {
  const { 
    updatingIds = new Set(), 
    deletingIds = new Set() 
  } = props || {};

  return [
    {
      accessorKey: "ID_CONSECUENCIA",
      header: "ID",
      cell: ({ getValue }) => {
        const value = getValue<number>();
        return <span className="font-mono text-sm">{value}</span>;
      },
    },
    {
      accessorKey: "CODIGO",
      header: "Código",
      cell: ({ row }) => {
        const isUpdating = updatingIds.has(row.original.ID_CONSECUENCIA);
        return (
          <div className="flex items-center gap-2">
            <EditableCell<ConsecuenciaFalla, "CODIGO">
              row={row}
              field="CODIGO"
              inputType="text"
            />
            {isUpdating && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "NOMBRE",
      header: "Nombre",
      cell: ({ row }) => (
        <EditableCell<ConsecuenciaFalla, "NOMBRE">
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
        const isUpdating = updatingIds.has(row.original.ID_CONSECUENCIA);
        const isDeleting = deletingIds.has(row.original.ID_CONSECUENCIA);
        
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

export const consecuenciaFallaColumns = createConsecuenciaFallaColumns();

