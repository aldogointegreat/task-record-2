import { ColumnDef } from "@tanstack/react-table";
import type { Rol } from "@/models";
import { Badge } from "@/components/ui/badge";

export const rolColumns: ColumnDef<Rol>[] = [
  {
    accessorKey: "ID_ROL",
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
  {
    accessorKey: "ADMINISTRADOR",
    header: "Administrador",
    cell: ({ getValue }) => {
      const value = getValue<boolean>();
      return (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Sí" : "No"}
        </Badge>
      );
    },
  },
];


