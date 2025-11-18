import { ColumnDef } from "@tanstack/react-table";
import type { Entrega } from "@/models";
import { Badge } from "@/components/ui/badge";

export const entregaColumns: ColumnDef<Entrega>[] = [
  {
    accessorKey: "IDE",
    header: "ID",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <span className="font-mono text-sm">{value}</span>;
    },
  },
  {
    accessorKey: "ORDEN",
    header: "Orden",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return (
        <Badge variant="outline" className="font-mono">
          #{value}
        </Badge>
      );
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


