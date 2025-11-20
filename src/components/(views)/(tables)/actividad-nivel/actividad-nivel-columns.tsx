import { ColumnDef } from "@tanstack/react-table";
import type { ActividadNivel, Nivel, Atributo } from "@/models";
import { ActionsCell, EditableCell } from "@/lib/utils/tanktable-enhanted/component/actions-cell";
import { Loader2 } from "lucide-react";

interface ActividadNivelColumnsProps {
  niveles?: Nivel[];
  atributos?: Atributo[];
  updatingIds?: Set<number>;
  deletingIds?: Set<number>;
}

export const createActividadNivelColumns = (props?: ActividadNivelColumnsProps): ColumnDef<ActividadNivel>[] => {
  const { 
    niveles = [], 
    atributos = [],
    updatingIds = new Set(), 
    deletingIds = new Set() 
  } = props || {};

  return [
    {
      accessorKey: "IDA",
      header: "ID",
      cell: ({ getValue }) => {
        const value = getValue<number>();
        return <span className="font-mono text-sm">{value}</span>;
      },
    },
    {
      accessorKey: "DESCRIPCION",
      header: "Descripción",
      cell: ({ row }) => {
        const isUpdating = updatingIds.has(row.original.IDA);
        return (
          <div className="flex items-center gap-2">
            <EditableCell<ActividadNivel, "DESCRIPCION">
              row={row}
              field="DESCRIPCION"
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
      accessorKey: "IDN",
      header: "Nivel",
      cell: ({ row }) => (
        <EditableCell<ActividadNivel, "IDN">
          row={row}
          field="IDN"
          inputType="select"
          meta={{
            options: niveles.map((nivel) => ({
              value: nivel.IDN,
              label: `${nivel.NOMBRE} (ID: ${nivel.IDN})`,
            })),
            encode: (v: unknown) => String(v),
            decode: (s: string) => Number(s),
          }}
        />
      ),
    },
    {
      accessorKey: "IDT",
      header: "Atributo",
      cell: ({ row }) => (
        <EditableCell<ActividadNivel, "IDT">
          row={row}
          field="IDT"
          inputType="select"
          meta={{
            options: [
              { value: null, label: 'Sin atributo' },
              ...atributos.map((atributo) => ({
                value: atributo.IDT,
                label: atributo.DESCRIPCION,
              })),
            ],
            encode: (v: unknown) => (v === null || v === undefined ? '__null__' : String(v)),
            decode: (s: string) => (s === '__null__' ? null : Number(s)),
          }}
        />
      ),
    },
    {
      accessorKey: "ORDEN",
      header: "Orden",
      cell: ({ row }) => (
        <EditableCell<ActividadNivel, "ORDEN">
          row={row}
          field="ORDEN"
          inputType="number"
        />
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row, table }) => {
        const meta = table.options.meta;
        const isUpdating = updatingIds.has(row.original.IDA);
        const isDeleting = deletingIds.has(row.original.IDA);
        
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
export const actividadNivelColumns = createActividadNivelColumns();

