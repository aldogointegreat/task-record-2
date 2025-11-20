import { ColumnDef } from "@tanstack/react-table";
import type { AtributoValor, ActividadNivel } from "@/models";
import { ActionsCell, EditableCell } from "@/lib/utils/tanktable-enhanted/component/actions-cell";
import { Loader2 } from "lucide-react";

interface AtributoValorColumnsProps {
  actividadesNivel?: ActividadNivel[];
  updatingIds?: Set<number>;
  deletingIds?: Set<number>;
}

export const createAtributoValorColumns = (props?: AtributoValorColumnsProps): ColumnDef<AtributoValor>[] => {
  const { 
    actividadesNivel = [],
    updatingIds = new Set(), 
    deletingIds = new Set() 
  } = props || {};

  return [
    {
      accessorKey: "IDAV",
      header: "ID",
      cell: ({ getValue }) => {
        const value = getValue<number>();
        return <span className="font-mono text-sm">{value}</span>;
      },
    },
    {
      accessorKey: "IDA",
      header: "Actividad",
      cell: ({ row }) => (
        <EditableCell<AtributoValor, "IDA">
          row={row}
          field="IDA"
          inputType="select"
          meta={{
            options: actividadesNivel.map((actividad) => ({
              value: actividad.IDA,
              label: `${actividad.DESCRIPCION} (ID: ${actividad.IDA})`,
            })),
            encode: (v: unknown) => String(v),
            decode: (s: string) => Number(s),
          }}
        />
      ),
    },
    {
      accessorKey: "VALOR",
      header: "Valor",
      cell: ({ row }) => {
        const isUpdating = updatingIds.has(row.original.IDAV);
        return (
          <div className="flex items-center gap-2">
            <EditableCell<AtributoValor, "VALOR">
              row={row}
              field="VALOR"
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
      id: "actions",
      header: "Acciones",
      cell: ({ row, table }) => {
        const meta = table.options.meta;
        const isUpdating = updatingIds.has(row.original.IDAV);
        const isDeleting = deletingIds.has(row.original.IDAV);
        
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
export const atributoValorColumns = createAtributoValorColumns();

