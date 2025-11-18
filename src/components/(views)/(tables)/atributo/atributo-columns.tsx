import { ColumnDef } from "@tanstack/react-table";
import type { Atributo } from "@/models";

export const atributoColumns: ColumnDef<Atributo>[] = [
  {
    accessorKey: "IDT",
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


