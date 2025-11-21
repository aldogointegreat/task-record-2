import { useState, useEffect } from 'react';
import type { 
  ActividadNivel, 
  Atributo, 
  AtributoValor,
  ConsecuenciaFalla,
  ClaseMantencion,
  CondicionAcceso,
  DisciplinaTarea,
  Nivel
} from '@/models';
import { 
  Info, 
  ListChecks, 
  Hash, 
  Tag, 
  Plus, 
  Pencil, 
  Trash2,
  AlertTriangle,
  Wrench,
  Copy
} from 'lucide-react';
import { 
  getAllAtributoValores, 
  createAtributoValor, 
  updateAtributoValor, 
  deleteAtributoValor,
  updateActividadNivel,
  copyActividadNivel
} from '@/lib/api';
import type { UpdateActividadNivelDTO } from '@/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ActividadNivelDetailsPanelProps {
  actividad: ActividadNivel;
  atributos?: Atributo[];
  consecuenciasFalla?: ConsecuenciaFalla[];
  clasesMantencion?: ClaseMantencion[];
  condicionesAcceso?: CondicionAcceso[];
  disciplinasTarea?: DisciplinaTarea[];
  niveles?: Nivel[];
  onActividadChange?: (actividad: ActividadNivel) => void;
  onActividadesChange?: () => void;
}

export function ActividadNivelDetailsPanel({ 
  actividad: actividadProp, 
  atributos = [],
  consecuenciasFalla = [],
  clasesMantencion = [],
  condicionesAcceso = [],
  disciplinasTarea = [],
  niveles = [],
  onActividadChange,
  onActividadesChange
}: ActividadNivelDetailsPanelProps) {
  const [actividad, setActividad] = useState<ActividadNivel>(actividadProp);
  const [valores, setValores] = useState<AtributoValor[]>([]);
  const [loadingValores, setLoadingValores] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingValor, setEditingValor] = useState<AtributoValor | null>(null);
  const [formValor, setFormValor] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [targetNivelId, setTargetNivelId] = useState<string>('');
  
  const [formData, setFormData] = useState<UpdateActividadNivelDTO>({
    DESCRIPCION: actividad.DESCRIPCION,
    ORDEN: actividad.ORDEN,
    IDT: actividad.IDT,
    FUNCIONALIDAD: actividad.FUNCIONALIDAD || null,
    MODO_FALLA: actividad.MODO_FALLA || null,
    EFECTO_FALLA: actividad.EFECTO_FALLA || null,
    TIEMPO_PROMEDIO_FALLA: actividad.TIEMPO_PROMEDIO_FALLA,
    UNIDAD_TIEMPO_FALLA: actividad.UNIDAD_TIEMPO_FALLA,
    ID_CONSECUENCIA_FALLA: actividad.ID_CONSECUENCIA_FALLA,
    ID_CLASE_MANTENCION: actividad.ID_CLASE_MANTENCION,
    TAREA_MANTENCION: actividad.TAREA_MANTENCION || null,
    FRECUENCIA_TAREA: actividad.FRECUENCIA_TAREA,
    UNIDAD_FRECUENCIA: actividad.UNIDAD_FRECUENCIA,
    DURACION_TAREA: actividad.DURACION_TAREA,
    CANTIDAD_RECURSOS: actividad.CANTIDAD_RECURSOS,
    ID_CONDICION_ACCESO: actividad.ID_CONDICION_ACCESO,
    ID_DISCIPLINA_TAREA: actividad.ID_DISCIPLINA_TAREA,
  });

  // Filtrar niveles que tengan UNIDAD_MANTENIBLE activo
  const nivelesDestino = niveles.filter(n => n.UNIDAD_MANTENIBLE === true);

  // Actualizar actividad cuando cambie la prop
  useEffect(() => {
    setActividad(actividadProp);
    setFormData({
      DESCRIPCION: actividadProp.DESCRIPCION,
      ORDEN: actividadProp.ORDEN,
      IDT: actividadProp.IDT,
      FUNCIONALIDAD: actividadProp.FUNCIONALIDAD || null,
      MODO_FALLA: actividadProp.MODO_FALLA || null,
      EFECTO_FALLA: actividadProp.EFECTO_FALLA || null,
      TIEMPO_PROMEDIO_FALLA: actividadProp.TIEMPO_PROMEDIO_FALLA,
      UNIDAD_TIEMPO_FALLA: actividadProp.UNIDAD_TIEMPO_FALLA,
      ID_CONSECUENCIA_FALLA: actividadProp.ID_CONSECUENCIA_FALLA,
      ID_CLASE_MANTENCION: actividadProp.ID_CLASE_MANTENCION,
      TAREA_MANTENCION: actividadProp.TAREA_MANTENCION || null,
      FRECUENCIA_TAREA: actividadProp.FRECUENCIA_TAREA,
      UNIDAD_FRECUENCIA: actividadProp.UNIDAD_FRECUENCIA,
      DURACION_TAREA: actividadProp.DURACION_TAREA,
      CANTIDAD_RECURSOS: actividadProp.CANTIDAD_RECURSOS,
      ID_CONDICION_ACCESO: actividadProp.ID_CONDICION_ACCESO,
      ID_DISCIPLINA_TAREA: actividadProp.ID_DISCIPLINA_TAREA,
    });
  }, [actividadProp]);
  
  const atributo = actividad.IDT ? atributos?.find(a => a.IDT === actividad.IDT) : null;
  const consecuencia = actividad.ID_CONSECUENCIA_FALLA 
    ? consecuenciasFalla.find(c => c.ID_CONSECUENCIA === actividad.ID_CONSECUENCIA_FALLA)
    : null;
  const claseMantencion = actividad.ID_CLASE_MANTENCION
    ? clasesMantencion.find(c => c.ID_CLASE === actividad.ID_CLASE_MANTENCION)
    : null;
  const condicionAcceso = actividad.ID_CONDICION_ACCESO
    ? condicionesAcceso.find(c => c.ID_CONDICION === actividad.ID_CONDICION_ACCESO)
    : null;
  const disciplinaTarea = actividad.ID_DISCIPLINA_TAREA
    ? disciplinasTarea.find(d => d.ID_DISCIPLINA_TAREA === actividad.ID_DISCIPLINA_TAREA)
    : null;

  useEffect(() => {
    const loadValores = async () => {
      setLoadingValores(true);
      try {
        const result = await getAllAtributoValores({ IDA: actividad.IDA });
        if (result.success && result.data) {
          setValores(result.data);
        }
      } catch (error) {
        console.error('Error loading valores:', error);
      } finally {
        setLoadingValores(false);
      }
    };

    loadValores();
  }, [actividad.IDA]);

  const handleOpenCreate = () => {
    setEditingValor(null);
    setFormValor('');
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (valor: AtributoValor) => {
    setEditingValor(valor);
    setFormValor(valor.VALOR);
    setIsDialogOpen(true);
  };

  const handleSaveValor = async () => {
    if (editingValor) {
      // Update
      const result = await updateAtributoValor(editingValor.IDAV, { VALOR: formValor });
      if (result.success && result.data) {
        setValores(prev => prev.map(v => v.IDAV === editingValor.IDAV ? result.data! : v));
        toast.success('Valor actualizado');
        setIsDialogOpen(false);
      } else {
        toast.error('Error al actualizar valor');
      }
    } else {
      // Create
      const result = await createAtributoValor({ IDA: actividad.IDA, VALOR: formValor });
      if (result.success && result.data) {
        setValores(prev => [...prev, result.data!]);
        toast.success('Valor agregado');
        setIsDialogOpen(false);
      } else {
        toast.error('Error al agregar valor');
      }
    }
  };

  const handleDelete = async (id: number) => {
    const result = await deleteAtributoValor(id);
    if (result.success) {
      setValores(prev => prev.filter(v => v.IDAV !== id));
      toast.success('Valor eliminado');
    } else {
      toast.error('Error al eliminar valor');
    }
  };

  const handleOpenEditActividad = () => {
    setFormData({
      DESCRIPCION: actividad.DESCRIPCION,
      ORDEN: actividad.ORDEN,
      IDT: actividad.IDT,
      FUNCIONALIDAD: actividad.FUNCIONALIDAD || null,
      MODO_FALLA: actividad.MODO_FALLA || null,
      EFECTO_FALLA: actividad.EFECTO_FALLA || null,
      TIEMPO_PROMEDIO_FALLA: actividad.TIEMPO_PROMEDIO_FALLA,
      UNIDAD_TIEMPO_FALLA: actividad.UNIDAD_TIEMPO_FALLA,
      ID_CONSECUENCIA_FALLA: actividad.ID_CONSECUENCIA_FALLA,
      ID_CLASE_MANTENCION: actividad.ID_CLASE_MANTENCION,
      TAREA_MANTENCION: actividad.TAREA_MANTENCION || null,
      FRECUENCIA_TAREA: actividad.FRECUENCIA_TAREA,
      UNIDAD_FRECUENCIA: actividad.UNIDAD_FRECUENCIA,
      DURACION_TAREA: actividad.DURACION_TAREA,
      CANTIDAD_RECURSOS: actividad.CANTIDAD_RECURSOS,
      ID_CONDICION_ACCESO: actividad.ID_CONDICION_ACCESO,
      ID_DISCIPLINA_TAREA: actividad.ID_DISCIPLINA_TAREA,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveActividad = async () => {
    try {
      const result = await updateActividadNivel(actividad.IDA, formData);
      if (result.success && result.data) {
        setActividad(result.data);
        // Notificar al componente padre para actualizar sin recargar
        if (onActividadChange) {
          onActividadChange(result.data);
        }
        toast.success('Actividad actualizada exitosamente');
        setIsEditDialogOpen(false);
      } else {
        toast.error(result.message || 'Error al actualizar actividad');
      }
    } catch (error) {
      console.error('Error updating actividad:', error);
      toast.error('Error al actualizar actividad');
    }
  };

  const handleOpenCopy = () => {
    setTargetNivelId('');
    setIsCopyDialogOpen(true);
  };

  const handleCopyActividad = async () => {
    if (!targetNivelId) return;

    try {
      const result = await copyActividadNivel(actividad.IDA, parseInt(targetNivelId));
      if (result.success) {
        toast.success('Actividad copiada exitosamente');
        setIsCopyDialogOpen(false);
        // Actualizar el árbol para mostrar la nueva actividad en el nivel destino
        if (onActividadesChange) {
          setTimeout(() => {
            onActividadesChange();
          }, 100);
        }
      } else {
        toast.error(result.message || 'Error al copiar actividad');
      }
    } catch (error) {
      console.error('Error copying actividad:', error);
      toast.error('Error al copiar actividad');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header con icono y nombre */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-2 rounded-lg bg-primary/10">
          <ListChecks className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{actividad.DESCRIPCION}</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleOpenCopy}
            title="Copiar a otro nivel"
          >
            <Copy className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleOpenEditActividad}
            title="Editar actividad"
          >
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Información básica - Layout de 2 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Valores de Atributo - Ocupa el ancho completo */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Valores</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleOpenCreate} className="h-6 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Agregar
          </Button>
        </div>
        
        {valores.length > 0 ? (
          <div className="pl-6 space-y-2">
            {valores.map((valor) => (
              <div key={valor.IDAV} className="flex items-center justify-between p-2 rounded bg-muted/50 group hover:bg-muted transition-colors">
                <span className="text-sm font-medium">{valor.VALOR}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleOpenEdit(valor)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(valor.IDAV)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground pl-6 italic">No hay valores asignados</p>
        )}
      </div>

      {loadingValores && (
        <div className="text-sm text-muted-foreground pl-6 pt-2">
          Cargando valores...
        </div>
      )}

      {/* Análisis de Falla */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Análisis de Falla</span>
        </div>
        
        <div className="mb-3 pl-6">
          <div className="text-xs font-medium text-muted-foreground mb-1">Funcionalidad</div>
          {actividad.FUNCIONALIDAD ? (
            <p className="text-sm text-foreground whitespace-pre-wrap">{actividad.FUNCIONALIDAD}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">Sin especificar</p>
          )}
        </div>
        
        <div className="mb-3 pl-6">
          <div className="text-xs font-medium text-muted-foreground mb-1">Modo de Falla</div>
          {actividad.MODO_FALLA ? (
            <p className="text-sm text-foreground whitespace-pre-wrap">{actividad.MODO_FALLA}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">Sin especificar</p>
          )}
        </div>
        
        <div className="mb-3 pl-6">
          <div className="text-xs font-medium text-muted-foreground mb-1">Efecto de la Falla</div>
          {actividad.EFECTO_FALLA ? (
            <p className="text-sm text-foreground whitespace-pre-wrap">{actividad.EFECTO_FALLA}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">Sin especificar</p>
          )}
        </div>
      </div>

      {/* Información de Mantención */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center gap-2 mb-3">
          <Wrench className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Información de Mantención</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
          {/* Tiempo Promedio entre Falla */}
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Tiempo Promedio entre Falla</div>
            {(actividad.TIEMPO_PROMEDIO_FALLA !== null && actividad.TIEMPO_PROMEDIO_FALLA !== undefined) ? (
              <p className="text-sm text-foreground">
                <span className="font-mono font-medium">{actividad.TIEMPO_PROMEDIO_FALLA}</span>
                {actividad.UNIDAD_TIEMPO_FALLA && (
                  <span className="ml-1 text-muted-foreground">{actividad.UNIDAD_TIEMPO_FALLA}</span>
                )}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">Sin especificar</p>
            )}
          </div>

          {/* Consecuencia de Falla */}
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Consecuencia de Falla</div>
            {consecuencia ? (
              <Badge variant="outline" className="text-xs">
                {consecuencia.CODIGO} - {consecuencia.NOMBRE}
              </Badge>
            ) : (
              <p className="text-sm text-muted-foreground italic">Sin especificar</p>
            )}
          </div>

          {/* Clase de Mantención */}
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Clase de Mantención</div>
            {claseMantencion ? (
              <Badge variant="outline" className="text-xs">
                {claseMantencion.CODIGO} - {claseMantencion.NOMBRE}
              </Badge>
            ) : (
              <p className="text-sm text-muted-foreground italic">Sin especificar</p>
            )}
          </div>

          {/* Tarea de Mantención */}
          <div className="md:col-span-2">
            <div className="text-xs font-medium text-muted-foreground mb-1">Tarea de Mantención</div>
            {actividad.TAREA_MANTENCION ? (
              <p className="text-sm text-foreground whitespace-pre-wrap">{actividad.TAREA_MANTENCION}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">Sin especificar</p>
            )}
          </div>

          {/* Frecuencia de la Tarea */}
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Frecuencia de la Tarea</div>
            {(actividad.FRECUENCIA_TAREA !== null && actividad.FRECUENCIA_TAREA !== undefined) ? (
              <p className="text-sm text-foreground">
                <span className="font-mono font-medium">{actividad.FRECUENCIA_TAREA}</span>
                {actividad.UNIDAD_FRECUENCIA && (
                  <span className="ml-1 text-muted-foreground">{actividad.UNIDAD_FRECUENCIA}</span>
                )}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">Sin especificar</p>
            )}
          </div>

          {/* Duración de la Tarea */}
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Duración de la Tarea</div>
            {(actividad.DURACION_TAREA !== null && actividad.DURACION_TAREA !== undefined) ? (
              <p className="text-sm text-foreground">
                <span className="font-mono font-medium">{actividad.DURACION_TAREA}</span>
                <span className="ml-1 text-muted-foreground">minutos</span>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">Sin especificar</p>
            )}
          </div>

          {/* Cantidad de Recursos */}
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Cantidad de Recursos</div>
            {(actividad.CANTIDAD_RECURSOS !== null && actividad.CANTIDAD_RECURSOS !== undefined) ? (
              <p className="text-sm text-foreground">
                <span className="font-mono font-medium">{actividad.CANTIDAD_RECURSOS}</span>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">Sin especificar</p>
            )}
          </div>

          {/* Condición de Acceso */}
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Condición de Acceso</div>
            {condicionAcceso ? (
              <Badge variant="outline" className="text-xs">
                {condicionAcceso.CODIGO} - {condicionAcceso.NOMBRE}
              </Badge>
            ) : (
              <p className="text-sm text-muted-foreground italic">Sin especificar</p>
            )}
          </div>

          {/* Disciplina de la Tarea */}
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Disciplina de la Tarea</div>
            {disciplinaTarea ? (
              <Badge variant="outline" className="text-xs">
                {disciplinaTarea.CODIGO} - {disciplinaTarea.NOMBRE}
              </Badge>
            ) : (
              <p className="text-sm text-muted-foreground italic">Sin especificar</p>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingValor ? 'Editar Valor' : 'Agregar Valor'}</DialogTitle>
            <DialogDescription>
              {editingValor ? 'Modifica el valor del atributo para esta actividad' : 'Agrega un nuevo valor para el atributo de esta actividad'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="valor" className="mb-2 block">
              Valor {atributo ? `para ${atributo.DESCRIPCION}` : ''}
            </Label>
            <Input 
              id="valor" 
              value={formValor} 
              onChange={(e) => setFormValor(e.target.value)} 
              placeholder="Ingrese el valor"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveValor} disabled={!formValor}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Editar Actividad */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Actividad</DialogTitle>
            <DialogDescription>
              Modificar la información de la actividad
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {/* Campos Básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-descripcion" className="mb-2 block">Descripción *</Label>
                <Input
                  id="edit-descripcion"
                  value={formData.DESCRIPCION}
                  onChange={(e) => setFormData({ ...formData, DESCRIPCION: e.target.value })}
                  placeholder="Descripción de la actividad"
                />
              </div>
              <div>
                <Label htmlFor="edit-orden" className="mb-2 block">Orden *</Label>
                <Input
                  id="edit-orden"
                  type="number"
                  value={formData.ORDEN}
                  onChange={(e) => setFormData({ ...formData, ORDEN: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-atributo" className="mb-2 block">Atributo (Opcional)</Label>
              <Select
                value={formData.IDT?.toString() || '__null__'}
                onValueChange={(value) => setFormData({ ...formData, IDT: value === '__null__' ? null : parseInt(value) })}
              >
                <SelectTrigger id="edit-atributo">
                  <SelectValue placeholder="Seleccionar atributo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__null__">Sin atributo</SelectItem>
                  {atributos.map((atributo) => (
                    <SelectItem key={atributo.IDT} value={atributo.IDT.toString()}>
                      {atributo.DESCRIPCION}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Análisis de Falla */}
            <div className="pt-2 border-t">
              <h4 className="text-sm font-semibold mb-3">Análisis de Falla</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-funcionalidad" className="mb-2 block">Funcionalidad</Label>
                  <Textarea
                    id="edit-funcionalidad"
                    value={formData.FUNCIONALIDAD || ''}
                    onChange={(e) => setFormData({ ...formData, FUNCIONALIDAD: e.target.value || null })}
                    placeholder="Describir la función principal del componente"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-modo-falla" className="mb-2 block">Modo de Falla</Label>
                  <Textarea
                    id="edit-modo-falla"
                    value={formData.MODO_FALLA || ''}
                    onChange={(e) => setFormData({ ...formData, MODO_FALLA: e.target.value || null })}
                    placeholder="Describir los modos de falla posibles"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-efecto-falla" className="mb-2 block">Efecto de la Falla</Label>
                  <Textarea
                    id="edit-efecto-falla"
                    value={formData.EFECTO_FALLA || ''}
                    onChange={(e) => setFormData({ ...formData, EFECTO_FALLA: e.target.value || null })}
                    placeholder="Describir los efectos típicos de la falla"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-tiempo-promedio-falla" className="mb-2 block">Tiempo Promedio entre Falla</Label>
                    <Input
                      id="edit-tiempo-promedio-falla"
                      type="number"
                      step="0.01"
                      value={formData.TIEMPO_PROMEDIO_FALLA || ''}
                      onChange={(e) => setFormData({ ...formData, TIEMPO_PROMEDIO_FALLA: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-unidad-tiempo-falla" className="mb-2 block">Unidad de Tiempo (Falla)</Label>
                    <Select
                      value={formData.UNIDAD_TIEMPO_FALLA || '__null__'}
                      onValueChange={(value) => setFormData({ ...formData, UNIDAD_TIEMPO_FALLA: value === '__null__' ? null : value })}
                    >
                      <SelectTrigger id="edit-unidad-tiempo-falla">
                        <SelectValue placeholder="Seleccionar unidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__null__">Sin especificar</SelectItem>
                        <SelectItem value="Segundos">Segundos</SelectItem>
                        <SelectItem value="Minutos">Minutos</SelectItem>
                        <SelectItem value="Horas">Horas</SelectItem>
                        <SelectItem value="Días">Días</SelectItem>
                        <SelectItem value="Semanas">Semanas</SelectItem>
                        <SelectItem value="Meses">Meses</SelectItem>
                        <SelectItem value="Años">Años</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-consecuencia-falla" className="mb-2 block">Consecuencia de Falla</Label>
                  <Select
                    value={formData.ID_CONSECUENCIA_FALLA?.toString() || '__null__'}
                    onValueChange={(value) => setFormData({ ...formData, ID_CONSECUENCIA_FALLA: value === '__null__' ? null : parseInt(value) })}
                  >
                    <SelectTrigger id="edit-consecuencia-falla">
                      <SelectValue placeholder="Seleccionar consecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__null__">Sin especificar</SelectItem>
                      {consecuenciasFalla.map((c) => (
                        <SelectItem key={c.ID_CONSECUENCIA} value={c.ID_CONSECUENCIA.toString()}>
                          {c.CODIGO} - {c.NOMBRE}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Información de Mantención */}
            <div className="pt-2 border-t">
              <h4 className="text-sm font-semibold mb-3">Información de Mantención</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-clase-mantencion" className="mb-2 block">Clase de Mantención</Label>
                  <Select
                    value={formData.ID_CLASE_MANTENCION?.toString() || '__null__'}
                    onValueChange={(value) => setFormData({ ...formData, ID_CLASE_MANTENCION: value === '__null__' ? null : parseInt(value) })}
                  >
                    <SelectTrigger id="edit-clase-mantencion">
                      <SelectValue placeholder="Seleccionar clase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__null__">Sin especificar</SelectItem>
                      {clasesMantencion.map((c) => (
                        <SelectItem key={c.ID_CLASE} value={c.ID_CLASE.toString()}>
                          {c.CODIGO} - {c.NOMBRE}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-tarea-mantencion" className="mb-2 block">Tarea de Mantención</Label>
                  <Textarea
                    id="edit-tarea-mantencion"
                    value={formData.TAREA_MANTENCION || ''}
                    onChange={(e) => setFormData({ ...formData, TAREA_MANTENCION: e.target.value || null })}
                    placeholder="Describir la tarea de mantención a realizar"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-frecuencia-tarea" className="mb-2 block">Frecuencia de la Tarea</Label>
                    <Input
                      id="edit-frecuencia-tarea"
                      type="number"
                      step="0.01"
                      value={formData.FRECUENCIA_TAREA || ''}
                      onChange={(e) => setFormData({ ...formData, FRECUENCIA_TAREA: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-unidad-frecuencia" className="mb-2 block">Unidad de Frecuencia</Label>
                    <Select
                      value={formData.UNIDAD_FRECUENCIA || '__null__'}
                      onValueChange={(value) => setFormData({ ...formData, UNIDAD_FRECUENCIA: value === '__null__' ? null : value })}
                    >
                      <SelectTrigger id="edit-unidad-frecuencia">
                        <SelectValue placeholder="Seleccionar unidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__null__">Sin especificar</SelectItem>
                        <SelectItem value="Segundos">Segundos</SelectItem>
                        <SelectItem value="Minutos">Minutos</SelectItem>
                        <SelectItem value="Horas">Horas</SelectItem>
                        <SelectItem value="Días">Días</SelectItem>
                        <SelectItem value="Semanas">Semanas</SelectItem>
                        <SelectItem value="Meses">Meses</SelectItem>
                        <SelectItem value="Años">Años</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-duracion-tarea" className="mb-2 block">Duración de la Tarea (minutos)</Label>
                    <Input
                      id="edit-duracion-tarea"
                      type="number"
                      step="0.01"
                      value={formData.DURACION_TAREA || ''}
                      onChange={(e) => setFormData({ ...formData, DURACION_TAREA: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-cantidad-recursos" className="mb-2 block">Cantidad de Recursos</Label>
                    <Input
                      id="edit-cantidad-recursos"
                      type="number"
                      value={formData.CANTIDAD_RECURSOS || ''}
                      onChange={(e) => setFormData({ ...formData, CANTIDAD_RECURSOS: e.target.value ? parseInt(e.target.value) : null })}
                      placeholder="1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-condicion-acceso" className="mb-2 block">Condición de Acceso</Label>
                    <Select
                      value={formData.ID_CONDICION_ACCESO?.toString() || '__null__'}
                      onValueChange={(value) => setFormData({ ...formData, ID_CONDICION_ACCESO: value === '__null__' ? null : parseInt(value) })}
                    >
                      <SelectTrigger id="edit-condicion-acceso">
                        <SelectValue placeholder="Seleccionar condición" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__null__">Sin especificar</SelectItem>
                        {condicionesAcceso.map((c) => (
                          <SelectItem key={c.ID_CONDICION} value={c.ID_CONDICION.toString()}>
                            {c.CODIGO} - {c.NOMBRE}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-disciplina-tarea" className="mb-2 block">Disciplina de la Tarea</Label>
                    <Select
                      value={formData.ID_DISCIPLINA_TAREA?.toString() || '__null__'}
                      onValueChange={(value) => setFormData({ ...formData, ID_DISCIPLINA_TAREA: value === '__null__' ? null : parseInt(value) })}
                    >
                      <SelectTrigger id="edit-disciplina-tarea">
                        <SelectValue placeholder="Seleccionar disciplina" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__null__">Sin especificar</SelectItem>
                        {disciplinasTarea.map((d) => (
                          <SelectItem key={d.ID_DISCIPLINA_TAREA} value={d.ID_DISCIPLINA_TAREA.toString()}>
                            {d.CODIGO} - {d.NOMBRE}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveActividad} disabled={!formData.DESCRIPCION}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Copiar Actividad */}
      <Dialog open={isCopyDialogOpen} onOpenChange={setIsCopyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copiar Actividad</DialogTitle>
            <DialogDescription>
              Selecciona el nivel destino donde deseas copiar esta actividad.
              Solo se muestran niveles marcados como &quot;Unidad Mantenible&quot;.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="target-nivel" className="mb-2 block">Nivel Destino</Label>
              <Select
                value={targetNivelId}
                onValueChange={setTargetNivelId}
              >
                <SelectTrigger id="target-nivel">
                  <SelectValue placeholder="Seleccionar nivel destino" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {nivelesDestino.length > 0 ? (
                    nivelesDestino.map((nivel) => (
                      <SelectItem key={nivel.IDN} value={nivel.IDN.toString()}>
                        {nivel.NOMBRE}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      No hay niveles con &quot;Unidad Mantenible&quot; activa
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCopyDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCopyActividad} disabled={!targetNivelId}>
              Copiar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
