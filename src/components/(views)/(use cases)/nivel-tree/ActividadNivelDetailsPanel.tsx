import type { ActividadNivel, Atributo } from '@/models';
import { Info, ListChecks, Hash, FileText } from 'lucide-react';

interface ActividadNivelDetailsPanelProps {
  actividad: ActividadNivel;
  atributos?: Atributo[];
}

export function ActividadNivelDetailsPanel({ actividad, atributos }: ActividadNivelDetailsPanelProps) {
  const atributo = actividad.IDT ? atributos?.find(a => a.IDT === actividad.IDT) : null;

  return (
    <div className="space-y-4">
      {/* Header con icono y nombre */}
      <div className="flex items-start gap-3 pb-4 border-b border-border">
        <div className="p-2 rounded-lg bg-primary/10">
          <ListChecks className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{actividad.DESCRIPCION}</h3>
          <p className="text-sm text-muted-foreground mt-1">Actividad #{actividad.IDA}</p>
        </div>
      </div>

      {/* Información básica */}
      <div className="space-y-3">
        {/* ID */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">ID</span>
          </div>
          <p className="text-sm text-muted-foreground pl-6">
            <span className="font-mono font-medium text-foreground">{actividad.IDA}</span>
          </p>
        </div>

        {/* Orden */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Orden</span>
          </div>
          <p className="text-sm text-muted-foreground pl-6">
            <span className="font-mono font-medium text-foreground">{actividad.ORDEN}</span>
          </p>
        </div>

        {/* Nivel */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Nivel ID</span>
          </div>
          <p className="text-sm text-muted-foreground pl-6">
            <span className="font-mono font-medium text-foreground">{actividad.IDN}</span>
          </p>
        </div>

        {/* Atributo */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Atributo</span>
          </div>
          <p className="text-sm text-muted-foreground pl-6">
            {atributo ? (
              <span className="font-medium text-foreground">{atributo.DESCRIPCION}</span>
            ) : actividad.IDT ? (
              <span className="italic">ID: {actividad.IDT} (no encontrado)</span>
            ) : (
              <span className="italic">Sin atributo</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}


