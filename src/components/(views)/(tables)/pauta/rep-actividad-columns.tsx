import { ColumnDef } from "@tanstack/react-table";
import type { REPActividad, REPNivel } from "@/models";
import { ActionsCell, EditableCell } from "@/lib/utils/tanktable-enhanted/component/actions-cell";
import { Loader2 } from "lucide-react";

interface REPActividadColumnsProps {
  repNiveles?: REPNivel[];
  updatingIds?: Set<number>;
  deletingIds?: Set<number>;
}

export const createREPActividadColumns = (props?: REPActividadColumnsProps): ColumnDef<REPActividad>[] => {
  const { repNiveles = [], updatingIds = new Set(), deletingIds = new Set() } = props || {};

  return [
    {
      accessorKey: "IDRA",
      header: "IDRA",
      cell: ({ getValue }) => {
        const value = getValue<number>();
        return <span className="font-mono text-sm">{value}</span>;
      },
    },
    {
      accessorKey: "IDRN",
      header: "IDRN",
      cell: ({ row }) => {
        return (
          <EditableCell<REPActividad, "IDRN">
            row={row}
            field="IDRN"
            inputType="select"
            meta={{
              options: repNiveles.map((rn) => ({
                value: rn.IDRN,
                label: `IDRN ${rn.IDRN} - ${rn.DESCRIPCION}`,
              })),
              encode: (v: unknown) => String(v),
              decode: (s: string) => Number(s),
            }}
          />
        );
      },
    },
    {
      accessorKey: "ORDEN",
      header: "ORDEN",
      cell: ({ row }) => (
        <EditableCell<REPActividad, "ORDEN">
          row={row}
          field="ORDEN"
          inputType="number"
        />
      ),
    },
    {
      accessorKey: "DESCRIPCION",
      header: "DESCRIPCION",
      cell: ({ row }) => (
        <EditableCell<REPActividad, "DESCRIPCION">
          row={row}
          field="DESCRIPCION"
          inputType="text"
        />
      ),
    },
    {
      accessorKey: "REFERENCIA",
      header: "REFERENCIA",
      cell: ({ row }) => (
        <EditableCell<REPActividad, "REFERENCIA">
          row={row}
          field="REFERENCIA"
          inputType="text"
        />
      ),
    },
    {
      accessorKey: "DURACION",
      header: "DURACION",
      cell: ({ row }) => (
        <EditableCell<REPActividad, "DURACION">
          row={row}
          field="DURACION"
          inputType="number"
        />
      ),
    },
    {
      id: "actions",
      header: "ACCIONES",
      cell: ({ row, table }) => {
        const meta = table.options.meta;
        const isUpdating = updatingIds.has(row.original.IDRA);
        const isDeleting = deletingIds.has(row.original.IDRA);
        
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

