import { ColumnDef } from "@tanstack/react-table";
import type { Disciplina } from "@/models";

export const disciplinaColumns: ColumnDef<Disciplina>[] = [
  {
    accessorKey: "ID_DIS",
    header: "ID",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <span className="font-mono text-sm">{value}</span>;
    },
  },
  {
    accessorKey: "NOMBRE",
    header: "Nombre",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <span className="font-medium">{value}</span>;
    },
  },
];


