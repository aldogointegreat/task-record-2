import type { Nivel, Jerarquia, ActividadNivel, Atributo } from '@/models';
import { Info, FolderTree, Folder, FileText, Hash, CheckSquare, Package, MessageSquare, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { NivelActividadesManager } from './NivelActividadesManager';
import { NivelChildrenManager } from './NivelChildrenManager';
import { getIconComponent } from '@/lib/constants/app-icons';

interface NivelDetailsPanelProps {
  nivel: Nivel;
  jerarquias: Jerarquia[];
  niveles: Nivel[];
  actividadesNivel?: ActividadNivel[];
  atributos?: Atributo[];
  onActividadesChange?: () => void;
  onNivelesChange?: () => void;
}

export function NivelDetailsPanel({ nivel, jerarquias, niveles, actividadesNivel = [], atributos = [], onActividadesChange, onNivelesChange }: NivelDetailsPanelProps) {
  // Buscar la jerarquía correspondiente
  const jerarquia = jerarquias.find(j => j.IDJ === nivel.IDJ);
  
  // Buscar el nivel padre si existe
  const nivelPadre = nivel.IDNP ? niveles.find(n => n.IDN === nivel.IDNP) : null;

  // Obtener el icono del nivel (misma lógica que en build-nivel-tree)
  const hasNivelChildren = niveles.some(n => n.IDNP === nivel.IDN);
  const hasActividades = actividadesNivel.some(a => a.IDN === nivel.IDN);
  const hasAnyChildren = hasNivelChildren || hasActividades;
  
  const CustomIcon = nivel.ICONO ? getIconComponent(nivel.ICONO) : null;
  const DefaultIcon = hasAnyChildren ? Folder : Circle;
  const IconComponent = CustomIcon || DefaultIcon;

  return (
    <div className="space-y-4">
      {/* Header con icono y nombre */}
      <div className="flex items-start gap-3 pb-4 border-b border-border">
        <div className="p-2 rounded-lg bg-primary/10">
          <IconComponent className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{nivel.NOMBRE}</h3>
          <p className="text-sm text-muted-foreground mt-1">Nivel #{nivel.IDN}</p>
        </div>
      </div>

      {/* Información básica - Layout de 2 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Comentario - Ocupa el ancho completo */}
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Comentario</span>
        </div>
        <p className="text-sm text-muted-foreground pl-6">
          {nivel.COMENTARIO ? (
            <span className="text-foreground">{nivel.COMENTARIO}</span>
          ) : (
            <span className="italic">Sin comentario</span>
          )}
        </p>
      </div>

      {/* Gestor de Niveles Hijos */}
      <div className="mt-6 pt-6 border-t border-border">
        <NivelChildrenManager
          nivelPadreId={nivel.IDN}
          niveles={niveles.filter(n => n.IDNP === nivel.IDN)}
          jerarquias={jerarquias}
          onNivelesChange={onNivelesChange || (() => {})}
        />
      </div>

      {/* Gestor de Actividades */}
      <div className="mt-6 pt-6 border-t border-border">
        <NivelActividadesManager
          nivelId={nivel.IDN}
          actividades={actividadesNivel.filter(a => a.IDN === nivel.IDN)}
          atributos={atributos}
          onActividadesChange={onActividadesChange || (() => {})}
        />
      </div>
    </div>
  );
}

