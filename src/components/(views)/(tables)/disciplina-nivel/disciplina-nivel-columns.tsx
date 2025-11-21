import { ColumnDef } from "@tanstack/react-table";
import type { DisciplinaNivel } from "@/models";
import { EditableCell, ActionsCell } from "@/lib/utils/tanktable-enhanted/component/actions-cell";
import { Loader2 } from "lucide-react";

interface DisciplinaNivelColumnsProps {
  updatingIds?: Set<number>;
  deletingIds?: Set<number>;
}

export const createDisciplinaNivelColumns = (props?: DisciplinaNivelColumnsProps): ColumnDef<DisciplinaNivel>[] => {
  const { updatingIds = new Set(), deletingIds = new Set() } = props || {};

  return [
    {
      accessorKey: "ID_DISCIPLINA_NIVEL",
      header: "ID",
      cell: ({ getValue }) => {
        const value = getValue<number>();
        return <span className="font-mono text-sm">{value}</span>;
      },
    },
    {
      accessorKey: "CODIGO",
      header: "Código",
      cell: ({ row }) => (
        <EditableCell<DisciplinaNivel, "CODIGO">
          row={row}
          field="CODIGO"
          inputType="text"
        />
      ),
    },
    {
      accessorKey: "DESCRIPCION",
      header: "Descripción",
      cell: ({ row }) => (
        <EditableCell<DisciplinaNivel, "DESCRIPCION">
          row={row}
          field="DESCRIPCION"
          inputType="text"
        />
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row, table }) => {
        const meta = table.options.meta;
        const id = row.original.ID_DISCIPLINA_NIVEL;
        const isUpdating = updatingIds.has(id);
        const isDeleting = deletingIds.has(id);

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

export const disciplinaNivelColumns = createDisciplinaNivelColumns();


