import { ColumnDef } from "@tanstack/react-table";
import type { Nivel, Jerarquia, DisciplinaNivel } from "@/models";
import { ActionsCell, EditableCell } from "@/lib/utils/tanktable-enhanted/component/actions-cell";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface NivelColumnsProps {
  jerarquias?: Jerarquia[];
  niveles?: Nivel[];
  disciplinasNivel?: DisciplinaNivel[];
  updatingIds?: Set<number>;
  deletingIds?: Set<number>;
}

export const createNivelColumns = (props?: NivelColumnsProps): ColumnDef<Nivel>[] => {
  const { 
    jerarquias = [], 
    niveles = [],
    disciplinasNivel = [],
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
      accessorKey: "ID_DISCIPLINA_NIVEL",
      header: "Disciplina",
      cell: ({ row }) => (
        <EditableCell<Nivel, "ID_DISCIPLINA_NIVEL">
          row={row}
          field="ID_DISCIPLINA_NIVEL"
          inputType="select"
          meta={{
            options: [
              { value: null, label: 'Sin disciplina' },
              ...disciplinasNivel.map((disc) => ({
                value: disc.ID_DISCIPLINA_NIVEL,
                label: `${disc.CODIGO} - ${disc.DESCRIPCION}`,
              })),
            ],
            encode: (v: unknown) => (v === null || v === undefined ? '__null__' : String(v)),
            decode: (s: string) => (s === '__null__' ? null : Number(s)),
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
      accessorKey: "GENERICO",
      header: "Genérico",
      cell: ({ row }) => (
        <EditableCell<Nivel, "GENERICO">
          row={row}
          field="GENERICO"
          inputType="checkbox"
        />
      ),
    },
    {
      accessorKey: "UNIDAD_MANTENIBLE",
      header: "Unidad Mantenible",
      cell: ({ row }) => (
        <EditableCell<Nivel, "UNIDAD_MANTENIBLE">
          row={row}
          field="UNIDAD_MANTENIBLE"
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
      accessorKey: "COMENTARIO",
      header: "Comentario",
      cell: ({ row }) => (
        <EditableCell<Nivel, "COMENTARIO">
          row={row}
          field="COMENTARIO"
          inputType="text"
        />
      ),
    },
    {
      accessorKey: "ID_USR",
      header: "ID Usuario",
      cell: ({ row }) => (
        <EditableCell<Nivel, "ID_USR">
          row={row}
          field="ID_USR"
          inputType="number"
        />
      ),
    },
    {
      accessorKey: "FECHA_CREACION",
      header: "Fecha Creación",
      cell: ({ getValue }) => {
        const value = getValue<string | Date | null>();
        if (!value) return <span className="text-muted-foreground">-</span>;
        return <span>{format(new Date(value), "dd/MM/yyyy")}</span>;
      },
    },
    {
      accessorKey: "ICONO",
      header: "Ícono",
      cell: ({ row }) => (
        <EditableCell<Nivel, "ICONO">
          row={row}
          field="ICONO"
          inputType="icon"
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
