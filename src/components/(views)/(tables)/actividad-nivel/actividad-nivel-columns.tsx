import { ColumnDef } from "@tanstack/react-table";
import type { 
  ActividadNivel, 
  Nivel, 
  Atributo,
  ConsecuenciaFalla,
  ClaseMantencion,
  CondicionAcceso,
  DisciplinaTarea
} from "@/models";
import { ActionsCell, EditableCell } from "@/lib/utils/tanktable-enhanted/component/actions-cell";
import { Loader2 } from "lucide-react";

interface ActividadNivelColumnsProps {
  niveles?: Nivel[];
  atributos?: Atributo[];
  consecuenciasFalla?: ConsecuenciaFalla[];
  clasesMantencion?: ClaseMantencion[];
  condicionesAcceso?: CondicionAcceso[];
  disciplinasTarea?: DisciplinaTarea[];
  updatingIds?: Set<number>;
  deletingIds?: Set<number>;
}

const UNIDADES_TIEMPO = [
  { value: null, label: 'N/A' },
  { value: 'Segundos', label: 'Segundos' },
  { value: 'Minutos', label: 'Minutos' },
  { value: 'Horas', label: 'Horas' },
  { value: 'Días', label: 'Días' },
  { value: 'Semanas', label: 'Semanas' },
  { value: 'Meses', label: 'Meses' },
  { value: 'Años', label: 'Años' },
];

export const createActividadNivelColumns = (props?: ActividadNivelColumnsProps): ColumnDef<ActividadNivel>[] => {
  const { 
    niveles = [], 
    atributos = [],
    consecuenciasFalla = [],
    clasesMantencion = [],
    condicionesAcceso = [],
    disciplinasTarea = [],
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
      accessorKey: "ID_CONSECUENCIA_FALLA",
      header: "Consecuencia",
      cell: ({ row }) => (
        <EditableCell<ActividadNivel, "ID_CONSECUENCIA_FALLA">
          row={row}
          field="ID_CONSECUENCIA_FALLA"
          inputType="select"
          meta={{
            options: [
              { value: null, label: 'N/A' },
              ...consecuenciasFalla.map((c) => ({
                value: c.ID_CONSECUENCIA,
                label: c.CODIGO,
              })),
            ],
            encode: (v: unknown) => (v === null || v === undefined ? '__null__' : String(v)),
            decode: (s: string) => (s === '__null__' ? null : Number(s)),
          }}
        />
      ),
    },
    {
      accessorKey: "ID_CLASE_MANTENCION",
      header: "Clase Mantención",
      cell: ({ row }) => (
        <EditableCell<ActividadNivel, "ID_CLASE_MANTENCION">
          row={row}
          field="ID_CLASE_MANTENCION"
          inputType="select"
          meta={{
            options: [
              { value: null, label: 'N/A' },
              ...clasesMantencion.map((c) => ({
                value: c.ID_CLASE,
                label: c.CODIGO,
              })),
            ],
            encode: (v: unknown) => (v === null || v === undefined ? '__null__' : String(v)),
            decode: (s: string) => (s === '__null__' ? null : Number(s)),
          }}
        />
      ),
    },
    {
      accessorKey: "FRECUENCIA_TAREA",
      header: "Frecuencia",
      cell: ({ row }) => (
        <EditableCell<ActividadNivel, "FRECUENCIA_TAREA">
          row={row}
          field="FRECUENCIA_TAREA"
          inputType="number"
        />
      ),
    },
    {
      accessorKey: "UNIDAD_FRECUENCIA",
      header: "Unidad Frecuencia",
      cell: ({ row }) => (
        <EditableCell<ActividadNivel, "UNIDAD_FRECUENCIA">
          row={row}
          field="UNIDAD_FRECUENCIA"
          inputType="select"
          meta={{
            options: UNIDADES_TIEMPO,
            encode: (v: unknown) => (v === null || v === undefined ? '__null__' : String(v)),
            decode: (s: string) => (s === '__null__' ? null : s),
          }}
        />
      ),
    },
    {
      accessorKey: "DURACION_TAREA",
      header: "Duración (min)",
      cell: ({ row }) => (
        <EditableCell<ActividadNivel, "DURACION_TAREA">
          row={row}
          field="DURACION_TAREA"
          inputType="number"
        />
      ),
    },
    {
      accessorKey: "ID_CONDICION_ACCESO",
      header: "Condición Acceso",
      cell: ({ row }) => (
        <EditableCell<ActividadNivel, "ID_CONDICION_ACCESO">
          row={row}
          field="ID_CONDICION_ACCESO"
          inputType="select"
          meta={{
            options: [
              { value: null, label: 'N/A' },
              ...condicionesAcceso.map((c) => ({
                value: c.ID_CONDICION,
                label: c.CODIGO,
              })),
            ],
            encode: (v: unknown) => (v === null || v === undefined ? '__null__' : String(v)),
            decode: (s: string) => (s === '__null__' ? null : Number(s)),
          }}
        />
      ),
    },
    {
      accessorKey: "ID_DISCIPLINA_TAREA",
      header: "Disciplina",
      cell: ({ row }) => (
        <EditableCell<ActividadNivel, "ID_DISCIPLINA_TAREA">
          row={row}
          field="ID_DISCIPLINA_TAREA"
          inputType="select"
          meta={{
            options: [
              { value: null, label: 'N/A' },
              ...disciplinasTarea.map((d) => ({
                value: d.ID_DISCIPLINA_TAREA,
                label: d.CODIGO,
              })),
            ],
            encode: (v: unknown) => (v === null || v === undefined ? '__null__' : String(v)),
            decode: (s: string) => (s === '__null__' ? null : Number(s)),
          }}
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

