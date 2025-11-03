import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Actividad } from "@/models/actividad.model";

export const actividadColumns: ColumnDef<Actividad>[] = [
  {
    accessorKey: "ID_ACT",
    header: "ID",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">{getValue<number>()}</span>
    ),
  },
  {
    accessorKey: "TITULO",
    header: "Título",
    cell: ({ getValue }) => {
      const titulo = getValue<string>();
      return (
        <div className="max-w-[200px] truncate font-medium" title={titulo || ''}>
          {titulo || 'Sin título'}
        </div>
      );
    },
  },
  {
    accessorKey: "DESCRIPCION",
    header: "Descripción",
    cell: ({ getValue }) => {
      const descripcion = getValue<string>();
      return (
        <div className="max-w-[150px] truncate text-sm text-muted-foreground" title={descripcion || ''}>
          {descripcion || '-'}
        </div>
      );
    },
  },
  {
    accessorKey: "ESPECIFICACION",
    header: "Especificación",
    cell: ({ getValue }) => {
      const especificacion = getValue<string>();
      return (
        <div className="max-w-[120px] truncate text-sm text-muted-foreground" title={especificacion || ''}>
          {especificacion || '-'}
        </div>
      );
    },
  },
  {
    accessorKey: "SUBACTIVIDAD",
    header: "Subactividad",
    cell: ({ getValue }) => {
      const subactividad = getValue<string>();
      return (
        <div className="max-w-[120px] truncate text-sm text-muted-foreground" title={subactividad || ''}>
          {subactividad || '-'}
        </div>
      );
    },
  },
  {
    accessorKey: "HABILITADO",
    header: "Estado",
    cell: ({ getValue }) => {
      const habilitado = getValue<boolean>();
      if (habilitado === null || habilitado === undefined) return null;
      return (
        <Badge
          variant={habilitado ? 'default' : 'secondary'}
          className="text-xs"
        >
          {habilitado ? 'Habilitado' : 'Deshabilitado'}
        </Badge>
      );
    },
  },
  {
    accessorKey: "DURACION",
    header: "Duración",
    cell: ({ getValue }) => {
      const duracion = getValue<number>();
      return (
        <span className="text-sm">
          {duracion !== null && duracion !== undefined ? duracion : '-'}
        </span>
      );
    },
  },
  {
    accessorKey: "REFERENCIA",
    header: "Referencia",
    cell: ({ row }) => {
      const referencia = row.original.REFERENCIA;
      const referenciaUrl = row.original.REFERENCIA_URL;
      
      if (referenciaUrl) {
        return (
          <a
            href={referenciaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline truncate block max-w-[120px]"
            title={referenciaUrl}
          >
            {referencia || referenciaUrl}
          </a>
        );
      }
      
      if (referencia) {
        return (
          <span className="text-sm text-muted-foreground truncate block max-w-[120px]" title={referencia}>
            {referencia}
          </span>
        );
      }
      
      return '-';
    },
  },
  {
    accessorKey: "ID_CON",
    header: "ID_CON",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <span className="font-mono text-xs">{value || '-'}</span>;
    },
  },
  {
    accessorKey: "ID_CLM",
    header: "ID_CLM",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <span className="font-mono text-xs">{value || '-'}</span>;
    },
  },
  {
    accessorKey: "ID_DIS",
    header: "ID_DIS",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <span className="font-mono text-xs">{value !== null && value !== undefined ? value : '-'}</span>;
    },
  },
  {
    accessorKey: "ID_PM",
    header: "ID_PM",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <span className="font-mono text-xs">{value !== null && value !== undefined ? value : '-'}</span>;
    },
  },
  {
    accessorKey: "INICIO",
    header: "Inicio",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <span className="text-sm">{value !== null && value !== undefined ? value : '-'}</span>;
    },
  },
  {
    accessorKey: "FIN",
    header: "Fin",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <span className="text-sm">{value !== null && value !== undefined ? value : '-'}</span>;
    },
  },
];

