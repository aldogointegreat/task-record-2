import { ColumnDef } from "@tanstack/react-table";
import type { Nivel, Jerarquia } from "@/models";
import { ActionsCell, EditableCell } from "@/lib/utils/tanktable-enhanted/component/actions-cell";
import { Loader2 } from "lucide-react";

interface NivelColumnsProps {
  jerarquias?: Jerarquia[];
  niveles?: Nivel[];
  updatingIds?: Set<number>;
  deletingIds?: Set<number>;
}

export const createNivelColumns = (props?: NivelColumnsProps): ColumnDef<Nivel>[] => {
  const { 
    jerarquias = [], 
    niveles = [],
    updatingIds = new Set(), 
    deletingIds = new Set() 
  } = props || {};

  return [
    {
      accessorKey: "IDN",
      header: "ID",
      cell: ({ getValue }) => {
        const value = getValue<number>();
        return <span className="font-mono text-sm">{value}</span>;
      },
    },
    {
      accessorKey: "NOMBRE",
      header: "Nombre",
      cell: ({ row }) => {
        const isUpdating = updatingIds.has(row.original.IDN);
        return (
          <div className="flex items-center gap-2">
            <EditableCell<Nivel, "NOMBRE">
              row={row}
              field="NOMBRE"
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
      accessorKey: "IDJ",
      header: "Jerarquía",
      cell: ({ row }) => (
        <EditableCell<Nivel, "IDJ">
          row={row}
          field="IDJ"
          inputType="select"
          meta={{
            options: jerarquias.map((jer) => ({
              value: jer.IDJ,
              label: jer.DESCRIPCION,
            })),
            encode: (v: unknown) => String(v),
            decode: (s: string) => Number(s),
          }}
        />
      ),
    },
    {
      accessorKey: "IDNP",
      header: "Nivel Padre",
      cell: ({ row }) => (
        <EditableCell<Nivel, "IDNP">
          row={row}
          field="IDNP"
          inputType="select"
          meta={{
            options: [
              { value: null, label: 'Sin nivel padre (Raíz)' },
              ...niveles
                .filter(n => n.IDN !== row.original.IDN) // Excluir el nivel actual
                .map((nivel) => ({
                  value: nivel.IDN,
                  label: `${nivel.NOMBRE} (${nivel.IDN})`,
                })),
            ],
            encode: (v: unknown) => (v === null || v === undefined ? '__null__' : String(v)),
            decode: (s: string) => (s === '__null__' ? null : Number(s)),
          }}
        />
      ),
    },
    {
      accessorKey: "PLANTILLA",
      header: "Plantilla",
      cell: ({ row }) => (
        <EditableCell<Nivel, "PLANTILLA">
          row={row}
          field="PLANTILLA"
          inputType="checkbox"
        />
      ),
    },
    {
      accessorKey: "NROPM",
      header: "Nro. PM",
      cell: ({ row }) => (
        <EditableCell<Nivel, "NROPM">
          row={row}
          field="NROPM"
          inputType="number"
        />
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row, table }) => {
        const meta = table.options.meta;
        const isUpdating = updatingIds.has(row.original.IDN);
        const isDeleting = deletingIds.has(row.original.IDN);
        
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

// Export default columns para compatibilidad
export const nivelColumns = createNivelColumns();


