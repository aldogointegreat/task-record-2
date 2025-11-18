import { ColumnDef } from "@tanstack/react-table";
import type { Usuario, Rol, Disciplina } from "@/models";
import { ActionsCell, EditableCell } from "@/lib/utils/tanktable-enhanted/component/actions-cell";
import { Loader2 } from "lucide-react";

interface UsuarioColumnsProps {
  roles?: Rol[];
  disciplinas?: Disciplina[];
  updatingIds?: Set<number>;
  deletingIds?: Set<number>;
}

export const createUsuarioColumns = (props?: UsuarioColumnsProps): ColumnDef<Usuario>[] => {
  const { roles = [], disciplinas = [], updatingIds = new Set(), deletingIds = new Set() } = props || {};

  return [
    {
      accessorKey: "ID_USR",
      header: "ID",
      cell: ({ getValue }) => {
        const value = getValue<number>();
        return <span className="font-mono text-sm">{value}</span>;
      },
    },
    {
      accessorKey: "NOMBRE",
      header: "Nombre",
      cell: ({ row }) => (
        <EditableCell<Usuario, "NOMBRE">
          row={row}
          field="NOMBRE"
          inputType="text"
        />
      ),
    },
    {
      accessorKey: "USUARIO",
      header: "Usuario",
      cell: ({ row }) => {
        const isUpdating = updatingIds.has(row.original.ID_USR);
        return (
          <div className="flex items-center gap-2">
            <EditableCell<Usuario, "USUARIO">
              row={row}
              field="USUARIO"
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
      accessorKey: "ID_ROL",
      header: "Rol",
      cell: ({ row }) => (
        <EditableCell<Usuario, "ID_ROL">
          row={row}
          field="ID_ROL"
          inputType="select"
          meta={{
            options: [
              { value: null, label: 'Sin rol' },
              ...roles.map((rol) => ({
                value: rol.ID_ROL,
                label: rol.NOMBRE,
              })),
            ],
            encode: (v: unknown) => (v === null || v === undefined ? '__null__' : String(v)),
            decode: (s: string) => (s === '__null__' ? null : Number(s)),
          }}
        />
      ),
    },
    {
      accessorKey: "ID_DIS",
      header: "Disciplina",
      cell: ({ row }) => (
        <EditableCell<Usuario, "ID_DIS">
          row={row}
          field="ID_DIS"
          inputType="select"
          meta={{
            options: [
              { value: null, label: 'Sin disciplina' },
              ...disciplinas.map((dis) => ({
                value: dis.ID_DIS,
                label: dis.NOMBRE,
              })),
            ],
            encode: (v: unknown) => (v === null || v === undefined ? '__null__' : String(v)),
            decode: (s: string) => (s === '__null__' ? null : Number(s)),
          }}
        />
      ),
    },
    {
      accessorKey: "CONTRASENA",
      header: "Contraseña",
      cell: ({ row }) => (
        <EditableCell<Usuario, "CONTRASENA">
          row={row}
          field="CONTRASENA"
          inputType="text"
        />
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row, table }) => {
        const meta = table.options.meta;
        const isUpdating = updatingIds.has(row.original.ID_USR);
        const isDeleting = deletingIds.has(row.original.ID_USR);
        
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
export const usuarioColumns = createUsuarioColumns();

