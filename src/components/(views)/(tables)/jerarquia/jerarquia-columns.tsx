import { ColumnDef } from "@tanstack/react-table";
import type { Jerarquia } from "@/models";

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
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <span className="font-medium">{value}</span>;
    },
  },
];


