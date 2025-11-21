import { useState } from 'react';
import type { Nivel, Jerarquia, ActividadNivel, Atributo, UpdateNivelDTO, DisciplinaNivel } from '@/models';
import { FolderTree, Folder, CheckSquare, Package, MessageSquare, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { IconPicker } from '@/components/ui/icon-picker';
import { NivelActividadesManager } from './NivelActividadesManager';
import { NivelChildrenManager } from './NivelChildrenManager';
import { getIconComponent } from '@/lib/constants/app-icons';
import { updateNivel } from '@/lib/api';
import { toast } from 'sonner';

interface NivelDetailsPanelProps {
  nivel: Nivel;
  jerarquias: Jerarquia[];
  niveles: Nivel[];
  actividadesNivel?: ActividadNivel[];
  atributos?: Atributo[];
  disciplinasNivel?: DisciplinaNivel[];
  onActividadesChange?: () => void;
  onNivelesChange?: () => void;
}

export function NivelDetailsPanel({ nivel, jerarquias, niveles, actividadesNivel = [], atributos = [], disciplinasNivel = [], onActividadesChange, onNivelesChange }: NivelDetailsPanelProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<UpdateNivelDTO>({
    NOMBRE: nivel.NOMBRE,
    ICONO: nivel.ICONO || '',
    COMENTARIO: nivel.COMENTARIO || '',
    PLANTILLA: nivel.PLANTILLA,
    GENERICO: nivel.GENERICO || false,
    NROPM: nivel.NROPM,
    IDJ: nivel.IDJ,
    IDNP: nivel.IDNP,
    ID_DISCIPLINA_NIVEL: nivel.ID_DISCIPLINA_NIVEL ?? null,
    UNIDAD_MANTENIBLE: nivel.UNIDAD_MANTENIBLE ?? false,
  });

  // Buscar la jerarquía correspondiente
  const jerarquia = jerarquias.find(j => j.IDJ === nivel.IDJ);
  
  // Buscar el nivel padre si existe
  const nivelPadre = nivel.IDNP ? niveles.find(n => n.IDN === nivel.IDNP) : null;

  const disciplinaNivelSeleccionada = nivel.ID_DISCIPLINA_NIVEL
    ? disciplinasNivel.find(d => d.ID_DISCIPLINA_NIVEL === nivel.ID_DISCIPLINA_NIVEL)
    : null;

  // Obtener el icono del nivel (misma lógica que en build-nivel-tree)
  const CustomIcon = nivel.ICONO ? getIconComponent(nivel.ICONO) : null;
  const DefaultIcon = Folder; // Usar Folder como icono por defecto, igual que en el tree view
  const IconComponent = CustomIcon || DefaultIcon;

  const handleOpenEdit = () => {
    setFormData({
      NOMBRE: nivel.NOMBRE,
      ICONO: nivel.ICONO || '',
      COMENTARIO: nivel.COMENTARIO || '',
      PLANTILLA: nivel.PLANTILLA,
      GENERICO: nivel.GENERICO || false,
      NROPM: nivel.NROPM,
      IDJ: nivel.IDJ,
      IDNP: nivel.IDNP,
      ID_DISCIPLINA_NIVEL: nivel.ID_DISCIPLINA_NIVEL ?? null,
      UNIDAD_MANTENIBLE: nivel.UNIDAD_MANTENIBLE ?? false,
    });
    setIsEditDialogOpen(true);
  };

  const handleSave = async () => {
    // Validación: Si es plantilla, no puede ser genérico
    if (formData.PLANTILLA && formData.GENERICO) {
      toast.error('Un nivel plantilla no puede ser genérico');
      return;
    }
    
    // Asegurar que si es plantilla, GENERICO sea false
    const updateData: UpdateNivelDTO = {
      ...formData,
      GENERICO: formData.PLANTILLA ? false : formData.GENERICO,
    };
    
    const result = await updateNivel(nivel.IDN, updateData);
    if (result.success && result.data) {
      toast.success('Nivel actualizado correctamente');
      setIsEditDialogOpen(false);
      onNivelesChange?.();
    } else {
      toast.error(result.message || 'Error al actualizar nivel');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header con icono y nombre */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-2 rounded-lg bg-primary/10">
          <IconComponent className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{nivel.NOMBRE}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleOpenEdit}
          title="Editar nivel"
        >
          <Pencil className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      {/* Información básica - Layout de 2 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Disciplina */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="h-5 flex items-center justify-center px-2 py-1 text-xs bg-primary/10 text-primary">
              DISC
            </Badge>
            <span className="text-sm font-medium">Disciplina</span>
          </div>
          <p className="text-sm text-muted-foreground pl-6">
            {disciplinaNivelSeleccionada ? (
              <span className="font-medium text-foreground">
                {disciplinaNivelSeleccionada.CODIGO} - {disciplinaNivelSeleccionada.DESCRIPCION}
              </span>
            ) : (
              <span className="italic">Sin disciplina asignada</span>
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
                {nivelPadre.NOMBRE}
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

        {/* Unidad Mantenible */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Unidad Mantenible</span>
          </div>
          <div className="pl-6">
            {nivel.UNIDAD_MANTENIBLE ? (
              <Badge variant="default" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
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
          nivelPadre={nivel}
          niveles={niveles.filter(n => n.IDNP === nivel.IDN)}
          jerarquias={jerarquias}
          disciplinasNivel={disciplinasNivel}
          onNivelesChange={onNivelesChange || (() => {})}
        />
      </div>

      {/* Gestor de Actividades */}
      <div className="mt-6 pt-6 border-t border-border">
        <NivelActividadesManager
          nivelId={nivel.IDN}
          actividades={actividadesNivel.filter(a => a.IDN === nivel.IDN)}
          atributos={atributos}
          niveles={niveles}
          onActividadesChange={onActividadesChange || (() => {})}
        />
      </div>

      {/* Diálogo de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Nivel</DialogTitle>
            <DialogDescription>
              Modifica la información del nivel
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="nombre" className="mb-2 block">Nombre</Label>
              <Input
                id="nombre"
                value={formData.NOMBRE || ''}
                onChange={(e) => setFormData({ ...formData, NOMBRE: e.target.value })}
                placeholder="Nombre del nivel"
              />
            </div>

            <div>
              <Label htmlFor="icono" className="mb-2 block">Ícono</Label>
              <IconPicker
                value={formData.ICONO || undefined}
                onChange={(value) => setFormData({ ...formData, ICONO: value || '' })}
              />
            </div>

            <div>
              <Label htmlFor="jerarquia" className="mb-2 block">Jerarquía</Label>
              <Select
                value={formData.IDJ?.toString() || ''}
                onValueChange={(value) => setFormData({ ...formData, IDJ: parseInt(value) })}
              >
                <SelectTrigger id="jerarquia">
                  <SelectValue placeholder="Seleccionar jerarquía" />
                </SelectTrigger>
                <SelectContent>
                  {jerarquias.map((j) => (
                    <SelectItem key={j.IDJ} value={j.IDJ.toString()}>
                      {j.DESCRIPCION}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="disciplina-nivel" className="mb-2 block">Disciplina</Label>
              <Select
                value={formData.ID_DISCIPLINA_NIVEL !== null && formData.ID_DISCIPLINA_NIVEL !== undefined ? formData.ID_DISCIPLINA_NIVEL.toString() : '__null__'}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  ID_DISCIPLINA_NIVEL: value === '__null__' ? null : parseInt(value)
                })}
              >
                <SelectTrigger id="disciplina-nivel">
                  <SelectValue placeholder="Sin disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__null__">Sin disciplina</SelectItem>
                  {disciplinasNivel.map((disc) => (
                    <SelectItem key={disc.ID_DISCIPLINA_NIVEL} value={disc.ID_DISCIPLINA_NIVEL.toString()}>
                      {disc.CODIGO} - {disc.DESCRIPCION}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="nivelPadre" className="mb-2 block">Nivel Superior</Label>
              <Select
                value={formData.IDNP?.toString() || 'null'}
                onValueChange={(value) => setFormData({ ...formData, IDNP: value === 'null' ? null : parseInt(value) })}
              >
                <SelectTrigger id="nivelPadre">
                  <SelectValue placeholder="Sin nivel superior (raíz)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">Sin nivel superior (raíz)</SelectItem>
                  {niveles
                    .filter(n => n.IDN !== nivel.IDN) // Excluir el nivel actual
                    .map((n) => (
                      <SelectItem key={n.IDN} value={n.IDN.toString()}>
                        {n.NOMBRE}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="nropm" className="mb-2 block">Número de PM</Label>
              <Input
                id="nropm"
                type="number"
                value={formData.NROPM || 0}
                onChange={(e) => setFormData({ ...formData, NROPM: parseInt(e.target.value) || 0 })}
                placeholder="Número de PM"
              />
            </div>

            <div>
              <Label htmlFor="comentario" className="mb-2 block">Comentario</Label>
              <Textarea
                id="comentario"
                value={formData.COMENTARIO || ''}
                onChange={(e) => setFormData({ ...formData, COMENTARIO: e.target.value })}
                placeholder="Comentario opcional"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="plantilla"
                  checked={formData.PLANTILLA || false}
                  disabled={formData.GENERICO || false} // Deshabilitar si es genérico
                  onCheckedChange={(checked) => {
                    const isPlantilla = checked === true;
                    setFormData({ 
                      ...formData, 
                      PLANTILLA: isPlantilla,
                      GENERICO: isPlantilla ? false : (formData.GENERICO || false) // Si es plantilla, desmarcar genérico
                    });
                  }}
                />
                <Label htmlFor="plantilla" className={`cursor-pointer ${formData.GENERICO ? 'opacity-50' : ''}`}>
                  Plantilla
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="generico"
                  checked={formData.GENERICO || false}
                  disabled={formData.PLANTILLA || false} // Deshabilitar si es plantilla
                  onCheckedChange={(checked) => {
                    const isGenerico = checked === true;
                    setFormData({ 
                      ...formData, 
                      GENERICO: isGenerico,
                      PLANTILLA: isGenerico ? false : (formData.PLANTILLA || false) // Si es genérico, desmarcar plantilla
                    });
                  }}
                />
                <Label htmlFor="generico" className={`cursor-pointer ${formData.PLANTILLA ? 'opacity-50' : ''}`}>
                  Genérico
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="unidad-mantenible"
                  checked={formData.UNIDAD_MANTENIBLE || false}
                  onCheckedChange={(checked) => {
                    setFormData({
                      ...formData,
                      UNIDAD_MANTENIBLE: checked === true,
                    });
                  }}
                />
                <Label htmlFor="unidad-mantenible">
                  Unidad Mantenible
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!formData.NOMBRE}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

