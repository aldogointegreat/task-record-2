import type { Nivel, Jerarquia } from '@/models';
import { Info, FolderTree, Folder, FileText, Hash, CheckSquare, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NivelDetailsPanelProps {
  nivel: Nivel;
  jerarquias: Jerarquia[];
  niveles: Nivel[];
}

export function NivelDetailsPanel({ nivel, jerarquias, niveles }: NivelDetailsPanelProps) {
  // Buscar la jerarquía correspondiente
  const jerarquia = jerarquias.find(j => j.IDJ === nivel.IDJ);
  
  // Buscar el nivel padre si existe
  const nivelPadre = nivel.IDNP ? niveles.find(n => n.IDN === nivel.IDNP) : null;

  return (
    <div className="space-y-4">
      {/* Header con icono y nombre */}
      <div className="flex items-start gap-3 pb-4 border-b border-border">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{nivel.NOMBRE}</h3>
          <p className="text-sm text-muted-foreground mt-1">Nivel #{nivel.IDN}</p>
        </div>
      </div>

      {/* Información básica */}
      <div className="space-y-3">
        {/* Código */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Código</span>
          </div>
          <p className="text-sm text-muted-foreground pl-6">
            <span className="font-mono font-medium text-foreground">{nivel.IDN}</span>
          </p>
        </div>

        {/* Jerarquía */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FolderTree className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Jerarquía</span>
          </div>
          <p className="text-sm text-muted-foreground pl-6">
            {jerarquia ? (
              <span className="font-medium text-foreground">{jerarquia.DESCRIPCION}</span>
            ) : (
              <span className="italic">No encontrada</span>
            )}
          </p>
        </div>

        {/* Nivel Superior (Padre) */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Folder className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Nivel Superior</span>
          </div>
          <p className="text-sm text-muted-foreground pl-6">
            {nivelPadre ? (
              <span className="font-medium text-foreground">
                {nivelPadre.NOMBRE} <span className="font-mono text-xs">#{nivelPadre.IDN}</span>
              </span>
            ) : (
              <span className="italic">Nivel raíz</span>
            )}
          </p>
        </div>

        {/* Plantilla */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Plantilla</span>
          </div>
          <div className="pl-6">
            {nivel.PLANTILLA ? (
              <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
                Sí
              </Badge>
            ) : (
              <Badge variant="secondary">
                No
              </Badge>
            )}
          </div>
        </div>

        {/* Número de PM */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Número de PM</span>
          </div>
          <p className="text-sm text-muted-foreground pl-6">
            <span className="font-mono font-medium text-foreground">{nivel.NROPM}</span>
          </p>
        </div>

        {/* Información de hijos */}
        {(() => {
          const hijosCount = niveles.filter(n => n.IDNP === nivel.IDN).length;
          if (hijosCount > 0) {
            return (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Folder className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Niveles Hijos</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {hijosCount} {hijosCount === 1 ? 'nivel hijo' : 'niveles hijos'}
                </p>
              </div>
            );
          }
          return null;
        })()}
      </div>
    </div>
  );
}

