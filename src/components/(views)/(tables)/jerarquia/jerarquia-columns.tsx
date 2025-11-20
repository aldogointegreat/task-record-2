import { ColumnDef } from "@tanstack/react-table";
import type { Jerarquia } from "@/models";
import { EditableCell, ActionsCell } from "@/lib/utils/tanktable-enhanted/component/actions-cell";

export const jerarquiaColumns: ColumnDef<Jerarquia>[] = [
  {
    accessorKey: "IDJ",
    header: "ID",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <span className="font-mono text-sm">{value}</span>;
    },
  },
  {
    accessorKey: "DESCRIPCION",
    header: "Descripción",
    cell: ({ row }) => (
      <EditableCell 
        row={row} 
        field="DESCRIPCION" 
        inputType="text" 
        className="font-medium"
      />
    ),
  },
  {
    accessorKey: "COLOR",
    header: "Color",
    cell: ({ row }) => (
      <EditableCell 
        row={row} 
        field="COLOR" 
        inputType="color" 
      />
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row, table }) => (
      <ActionsCell 
        row={row} 
        onRowSave={table.options.meta?.onRowSave}
        onRowDelete={table.options.meta?.onRowDelete}
      />
    ),
  },
];


