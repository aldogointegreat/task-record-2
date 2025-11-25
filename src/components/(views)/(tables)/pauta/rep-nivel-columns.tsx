import { ColumnDef } from "@tanstack/react-table";
import type { REPNivel, PM, Nivel } from "@/models";
import { ActionsCell, EditableCell } from "@/lib/utils/tanktable-enhanted/component/actions-cell";
import { Loader2 } from "lucide-react";

interface REPNivelColumnsProps {
  pms?: PM[];
  niveles?: Nivel[];
  updatingIds?: Set<number>;
  deletingIds?: Set<number>;
}

export const createREPNivelColumns = (props?: REPNivelColumnsProps): ColumnDef<REPNivel>[] => {
  const { pms = [], niveles = [], updatingIds = new Set(), deletingIds = new Set() } = props || {};

  return [
    {
      accessorKey: "IDRN",
      header: "IDRN",
      cell: ({ getValue }) => {
        const value = getValue<number>();
        return <span className="font-mono text-sm">{value}</span>;
      },
    },
    {
      accessorKey: "IDPM",
      header: "IDPM",
      cell: ({ row }) => {
        return (
          <EditableCell<REPNivel, "IDPM">
            row={row}
            field="IDPM"
            inputType="select"
            meta={{
              options: pms.map((pm) => ({
                value: pm.IDPM,
                label: `IDPM ${pm.IDPM}`,
              })),
              encode: (v: unknown) => String(v),
              decode: (s: string) => Number(s),
            }}
          />
        );
      },
    },
    {
      accessorKey: "IDN",
      header: "IDN",
      cell: ({ row }) => {
        return (
          <EditableCell<REPNivel, "IDN">
            row={row}
            field="IDN"
            inputType="select"
            meta={{
              options: niveles.map((nivel) => ({
                value: nivel.IDN,
                label: `${nivel.IDN} - ${nivel.NOMBRE}`,
              })),
              encode: (v: unknown) => String(v),
              decode: (s: string) => Number(s),
            }}
          />
        );
      },
    },
    {
      accessorKey: "IDJ",
      header: "IDJ",
      cell: ({ row }) => (
        <EditableCell<REPNivel, "IDJ">
          row={row}
          field="IDJ"
          inputType="number"
        />
      ),
    },
    {
      accessorKey: "IDNP",
      header: "IDNP",
      cell: ({ row }) => {
        return (
          <EditableCell<REPNivel, "IDNP">
            row={row}
            field="IDNP"
            inputType="select"
            meta={{
              options: [
                { value: null, label: 'Sin IDNP' },
                ...niveles.map((nivel) => ({
                  value: nivel.IDN,
                  label: `${nivel.IDN} - ${nivel.NOMBRE}`,
                })),
              ],
              encode: (v: unknown) => v === null || v === undefined ? '__null__' : String(v),
              decode: (s: string) => s === '__null__' ? null : Number(s),
            }}
          />
        );
      },
    },
    {
      accessorKey: "DESCRIPCION",
      header: "DESCRIPCION",
      cell: ({ row }) => (
        <EditableCell<REPNivel, "DESCRIPCION">
          row={row}
          field="DESCRIPCION"
          inputType="text"
        />
      ),
    },
    {
      id: "actions",
      header: "ACCIONES",
      cell: ({ row, table }) => {
        const meta = table.options.meta;
        const isUpdating = updatingIds.has(row.original.IDRN);
        const isDeleting = deletingIds.has(row.original.IDRN);
        
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

