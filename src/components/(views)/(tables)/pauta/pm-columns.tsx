import { ColumnDef } from "@tanstack/react-table";
import type { PM, Nivel } from "@/models";
import { ActionsCell, EditableCell } from "@/lib/utils/tanktable-enhanted/component/actions-cell";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface PMColumnsProps {
  niveles?: Nivel[];
  updatingIds?: Set<number>;
  deletingIds?: Set<number>;
}

export const createPMColumns = (props?: PMColumnsProps): ColumnDef<PM>[] => {
  const { niveles = [], updatingIds = new Set(), deletingIds = new Set() } = props || {};

  return [
    {
      accessorKey: "IDPM",
      header: "IDPM",
      cell: ({ getValue }) => {
        const value = getValue<number>();
        return <span className="font-mono text-sm">{value}</span>;
      },
    },
    {
      accessorKey: "IDN",
      header: "IDN",
      cell: ({ row }) => (
        <EditableCell<PM, "IDN">
          row={row}
          field="IDN"
          inputType="select"
          meta={{
            options: [
              ...niveles.map((nivel) => ({
                value: nivel.IDN,
                label: `${nivel.IDN} - ${nivel.NOMBRE}`,
              })),
            ],
            encode: (v: unknown) => String(v),
            decode: (s: string) => Number(s),
          }}
        />
      ),
    },
    {
      accessorKey: "NRO",
      header: "NRO",
      cell: ({ row }) => (
        <EditableCell<PM, "NRO">
          row={row}
          field="NRO"
          inputType="number"
        />
      ),
    },
    {
      accessorKey: "CONJUNTO",
      header: "CONJUNTO",
      cell: ({ row }) => (
        <EditableCell<PM, "CONJUNTO">
          row={row}
          field="CONJUNTO"
          inputType="number"
        />
      ),
    },
    {
      accessorKey: "PROGRAMACION",
      header: "PROGRAMACION",
      cell: ({ row }) => {
        return (
          <EditableCell<PM, "PROGRAMACION">
            row={row}
            field="PROGRAMACION"
            inputType="date"
            meta={{
              format: (v: unknown) => {
                if (!v) return '';
                if (v instanceof Date) return format(v, "yyyy-MM-dd");
                if (typeof v === 'string') {
                  // Manejar diferentes formatos de fecha
                  const dateStr = v.split('T')[0].split(' ')[0];
                  return dateStr;
                }
                return '';
              },
            }}
          />
        );
      },
    },
    {
      accessorKey: "ESTADO",
      header: "ESTADO",
      cell: ({ row }) => (
        <EditableCell<PM, "ESTADO">
          row={row}
          field="ESTADO"
          inputType="select"
          meta={{
            options: [
              { value: 'COMPLETADO', label: 'COMPLETADO' },
              { value: 'PENDIENTE', label: 'PENDIENTE' },
            ],
            encode: (v: unknown) => String(v),
            decode: (s: string) => s,
          }}
        />
      ),
    },
    {
      accessorKey: "HOROMETRO",
      header: "HOROMETRO",
      cell: ({ row }) => (
        <EditableCell<PM, "HOROMETRO">
          row={row}
          field="HOROMETRO"
          inputType="number"
        />
      ),
    },
    {
      accessorKey: "INICIO",
      header: "INICIO",
      cell: ({ row }) => {
        return (
          <EditableCell<PM, "INICIO">
            row={row}
            field="INICIO"
            inputType="date"
            meta={{
              format: (v: unknown) => {
                if (!v) return '';
                if (v instanceof Date) return format(v, "yyyy-MM-dd");
                if (typeof v === 'string') {
                  const dateStr = v.split('T')[0].split(' ')[0];
                  return dateStr;
                }
                return '';
              },
            }}
          />
        );
      },
    },
    {
      accessorKey: "FIN",
      header: "FIN",
      cell: ({ row }) => {
        return (
          <EditableCell<PM, "FIN">
            row={row}
            field="FIN"
            inputType="date"
            meta={{
              format: (v: unknown) => {
                if (!v) return '';
                if (v instanceof Date) return format(v, "yyyy-MM-dd");
                if (typeof v === 'string') {
                  const dateStr = v.split('T')[0].split(' ')[0];
                  return dateStr;
                }
                return '';
              },
            }}
          />
        );
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row, table }) => {
        const meta = table.options.meta;
        const isUpdating = updatingIds.has(row.original.IDPM);
        const isDeleting = deletingIds.has(row.original.IDPM);
        
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

// Export default columns for backward compatibility
export const pmColumns = createPMColumns();

