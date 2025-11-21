'use client';

import { useState, useEffect } from 'react';
import type { 
  ActividadNivel, 
  Atributo, 
  CreateActividadNivelDTO, 
  UpdateActividadNivelDTO, 
  AtributoValor,
  ConsecuenciaFalla,
  ClaseMantencion,
  CondicionAcceso,
  DisciplinaTarea,
  Nivel
} from '@/models';
import { 
  createActividadNivel, 
  updateActividadNivel, 
  deleteActividadNivel, 
  copyActividadNivel,
  getAllAtributoValores,
  getAllConsecuenciasFalla,
  getAllClasesMantencion,
  getAllCondicionesAcceso,
  getAllDisciplinasTarea
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, ListChecks, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface NivelActividadesManagerProps {
  nivelId: number;
  actividades: ActividadNivel[];
  atributos: Atributo[];
  niveles: Nivel[];
  onActividadesChange: () => void;
}

export function NivelActividadesManager({ 
  nivelId, 
  actividades, 
  atributos,
  niveles,
  onActividadesChange 
}: NivelActividadesManagerProps) {
  const [localActividades, setLocalActividades] = useState<ActividadNivel[]>(actividades);
  const [atributoValores, setAtributoValores] = useState<AtributoValor[]>([]);
  const [consecuenciasFalla, setConsecuenciasFalla] = useState<ConsecuenciaFalla[]>([]);
  const [clasesMantencion, setClasesMantencion] = useState<ClaseMantencion[]>([]);
  const [condicionesAcceso, setCondicionesAcceso] = useState<CondicionAcceso[]>([]);
  const [disciplinasTarea, setDisciplinasTarea] = useState<DisciplinaTarea[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingActividad, setEditingActividad] = useState<ActividadNivel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [targetNivelId, setTargetNivelId] = useState<string>('');
  const [copyingActividad, setCopyingActividad] = useState<ActividadNivel | null>(null);

  // Filtrar niveles que tengan UNIDAD_MANTENIBLE activo
  const nivelesDestino = niveles.filter(n => n.UNIDAD_MANTENIBLE === true);

  // Actualizar estado local cuando cambien las actividades del padre
  useEffect(() => {
    setLocalActividades(actividades);
  }, [actividades]);

  // Cargar catálogos
  useEffect(() => {
    const loadCatalogos = async () => {
      try {
        const [consecuenciasResult, clasesResult, condicionesResult, disciplinasResult] = await Promise.all([
          getAllConsecuenciasFalla(),
          getAllClasesMantencion(),
          getAllCondicionesAcceso(),
          getAllDisciplinasTarea(),
        ]);

        if (consecuenciasResult.success && consecuenciasResult.data) {
          setConsecuenciasFalla(consecuenciasResult.data);
        }
        if (clasesResult.success && clasesResult.data) {
          setClasesMantencion(clasesResult.data);
        }
        if (condicionesResult.success && condicionesResult.data) {
          setCondicionesAcceso(condicionesResult.data);
        }
        if (disciplinasResult.success && disciplinasResult.data) {
          setDisciplinasTarea(disciplinasResult.data);
        }
      } catch (error) {
        console.error('Error loading catalogos:', error);
      }
    };

    loadCatalogos();
  }, []);

  // Cargar valores de atributos
  useEffect(() => {
    const loadAtributoValores = async () => {
      const actividadesConAtributo = actividades.filter(a => a.IDT);
      if (actividadesConAtributo.length === 0) {
        setAtributoValores([]);
        return;
      }

      try {
        const promises = actividadesConAtributo.map(a => 
          getAllAtributoValores({ IDA: a.IDA })
        );
        
        const results = await Promise.all(promises);
        const nuevosValores: AtributoValor[] = [];
        
        results.forEach(result => {
          if (result.success && result.data) {
            nuevosValores.push(...result.data);
          }
        });
        
        setAtributoValores(nuevosValores);
      } catch (error) {
        console.error('Error loading atributo valores:', error);
      }
    };

    loadAtributoValores();
  }, [actividades]);
  
  const [formData, setFormData] = useState({
    DESCRIPCION: '',
    ORDEN: 1,
    IDT: null as number | null,
    FUNCIONALIDAD: '',
    MODO_FALLA: '',
    EFECTO_FALLA: '',
    TIEMPO_PROMEDIO_FALLA: null as number | null,
    UNIDAD_TIEMPO_FALLA: null as string | null,
    ID_CONSECUENCIA_FALLA: null as number | null,
    ID_CLASE_MANTENCION: null as number | null,
    TAREA_MANTENCION: '',
    FRECUENCIA_TAREA: null as number | null,
    UNIDAD_FRECUENCIA: null as string | null,
    DURACION_TAREA: null as number | null,
    CANTIDAD_RECURSOS: null as number | null,
    ID_CONDICION_ACCESO: null as number | null,
    ID_DISCIPLINA_TAREA: null as number | null,
  });

  const handleOpenCreate = () => {
    setFormData({
      DESCRIPCION: '',
      ORDEN: (localActividades.length > 0 ? Math.max(...localActividades.map(a => a.ORDEN)) + 1 : 1),
      IDT: null,
      FUNCIONALIDAD: '',
      MODO_FALLA: '',
      EFECTO_FALLA: '',
      TIEMPO_PROMEDIO_FALLA: null,
      UNIDAD_TIEMPO_FALLA: null,
      ID_CONSECUENCIA_FALLA: null,
      ID_CLASE_MANTENCION: null,
      TAREA_MANTENCION: '',
      FRECUENCIA_TAREA: null,
      UNIDAD_FRECUENCIA: null,
      DURACION_TAREA: null,
      CANTIDAD_RECURSOS: null,
      ID_CONDICION_ACCESO: null,
      ID_DISCIPLINA_TAREA: null,
    });
    setIsCreating(true);
  };

  const handleOpenEdit = (actividad: ActividadNivel) => {
    setEditingActividad(actividad);
    setFormData({
      DESCRIPCION: actividad.DESCRIPCION,
      ORDEN: actividad.ORDEN,
      IDT: actividad.IDT,
      FUNCIONALIDAD: actividad.FUNCIONALIDAD || '',
      MODO_FALLA: actividad.MODO_FALLA || '',
      EFECTO_FALLA: actividad.EFECTO_FALLA || '',
      TIEMPO_PROMEDIO_FALLA: actividad.TIEMPO_PROMEDIO_FALLA,
      UNIDAD_TIEMPO_FALLA: actividad.UNIDAD_TIEMPO_FALLA,
      ID_CONSECUENCIA_FALLA: actividad.ID_CONSECUENCIA_FALLA,
      ID_CLASE_MANTENCION: actividad.ID_CLASE_MANTENCION,
      TAREA_MANTENCION: actividad.TAREA_MANTENCION || '',
      FRECUENCIA_TAREA: actividad.FRECUENCIA_TAREA,
      UNIDAD_FRECUENCIA: actividad.UNIDAD_FRECUENCIA,
      DURACION_TAREA: actividad.DURACION_TAREA,
      CANTIDAD_RECURSOS: actividad.CANTIDAD_RECURSOS,
      ID_CONDICION_ACCESO: actividad.ID_CONDICION_ACCESO,
      ID_DISCIPLINA_TAREA: actividad.ID_DISCIPLINA_TAREA,
    });
    setIsEditing(true);
  };

  const handleCreate = async () => {
    try {
      const createData: CreateActividadNivelDTO = {
        IDN: nivelId,
        DESCRIPCION: formData.DESCRIPCION,
        ORDEN: formData.ORDEN,
        IDT: formData.IDT,
        FUNCIONALIDAD: formData.FUNCIONALIDAD || null,
        MODO_FALLA: formData.MODO_FALLA || null,
        EFECTO_FALLA: formData.EFECTO_FALLA || null,
        TIEMPO_PROMEDIO_FALLA: formData.TIEMPO_PROMEDIO_FALLA,
        UNIDAD_TIEMPO_FALLA: formData.UNIDAD_TIEMPO_FALLA,
        ID_CONSECUENCIA_FALLA: formData.ID_CONSECUENCIA_FALLA,
        ID_CLASE_MANTENCION: formData.ID_CLASE_MANTENCION,
        TAREA_MANTENCION: formData.TAREA_MANTENCION || null,
        FRECUENCIA_TAREA: formData.FRECUENCIA_TAREA,
        UNIDAD_FRECUENCIA: formData.UNIDAD_FRECUENCIA,
        DURACION_TAREA: formData.DURACION_TAREA,
        CANTIDAD_RECURSOS: formData.CANTIDAD_RECURSOS,
        ID_CONDICION_ACCESO: formData.ID_CONDICION_ACCESO,
        ID_DISCIPLINA_TAREA: formData.ID_DISCIPLINA_TAREA,
      };

      const result = await createActividadNivel(createData);
      if (result.success && result.data) {
        // Actualizar estado local inmediatamente
        setLocalActividades(prev => [...prev, result.data!]);
        toast.success('Actividad creada exitosamente');
        setIsCreating(false);
        
        // Actualizar en segundo plano
        setTimeout(() => {
          onActividadesChange();
        }, 100);
      } else {
        toast.error(result.message || 'Error al crear actividad');
      }
    } catch (error) {
      console.error('Error creating actividad:', error);
      toast.error('Error al crear actividad');
    }
  };

  const handleUpdate = async () => {
    if (!editingActividad) return;

    try {
      const updateData: UpdateActividadNivelDTO = {
        DESCRIPCION: formData.DESCRIPCION,
        ORDEN: formData.ORDEN,
        IDT: formData.IDT,
        FUNCIONALIDAD: formData.FUNCIONALIDAD || null,
        MODO_FALLA: formData.MODO_FALLA || null,
        EFECTO_FALLA: formData.EFECTO_FALLA || null,
        TIEMPO_PROMEDIO_FALLA: formData.TIEMPO_PROMEDIO_FALLA,
        UNIDAD_TIEMPO_FALLA: formData.UNIDAD_TIEMPO_FALLA,
        ID_CONSECUENCIA_FALLA: formData.ID_CONSECUENCIA_FALLA,
        ID_CLASE_MANTENCION: formData.ID_CLASE_MANTENCION,
        TAREA_MANTENCION: formData.TAREA_MANTENCION || null,
        FRECUENCIA_TAREA: formData.FRECUENCIA_TAREA,
        UNIDAD_FRECUENCIA: formData.UNIDAD_FRECUENCIA,
        DURACION_TAREA: formData.DURACION_TAREA,
        CANTIDAD_RECURSOS: formData.CANTIDAD_RECURSOS,
        ID_CONDICION_ACCESO: formData.ID_CONDICION_ACCESO,
        ID_DISCIPLINA_TAREA: formData.ID_DISCIPLINA_TAREA,
      };

      const result = await updateActividadNivel(editingActividad.IDA, updateData);
      if (result.success && result.data) {
        // Actualizar estado local inmediatamente
        setLocalActividades(prev => 
          prev.map(act => act.IDA === editingActividad.IDA ? result.data! : act)
        );
        toast.success('Actividad actualizada exitosamente');
        setIsEditing(false);
        setEditingActividad(null);
        
        // Actualizar en segundo plano
        setTimeout(() => {
          onActividadesChange();
        }, 100);
      } else {
        toast.error(result.message || 'Error al actualizar actividad');
      }
    } catch (error) {
      console.error('Error updating actividad:', error);
      toast.error('Error al actualizar actividad');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      setDeletingId(id);
      
      const result = await deleteActividadNivel(id);
      if (result.success) {
        // Actualizar estado local inmediatamente
        setLocalActividades(prev => prev.filter(act => act.IDA !== id));
        toast.success('Actividad eliminada exitosamente');
        
        // Actualizar en segundo plano
        setTimeout(() => {
          onActividadesChange();
        }, 100);
      } else {
        toast.error(result.message || 'Error al eliminar actividad');
      }
    } catch (error) {
      console.error('Error deleting actividad:', error);
      toast.error('Error al eliminar actividad');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const handleOpenCopy = (actividad: ActividadNivel) => {
    setCopyingActividad(actividad);
    setTargetNivelId('');
    setIsCopyDialogOpen(true);
  };

  const handleCopyActividad = async () => {
    if (!targetNivelId || !copyingActividad) return;

    try {
      const result = await copyActividadNivel(copyingActividad.IDA, parseInt(targetNivelId));
      if (result.success) {
        toast.success('Actividad copiada exitosamente');
        setIsCopyDialogOpen(false);
        setCopyingActividad(null);
        // Actualizar el árbol para mostrar la nueva actividad en el nivel destino
        setTimeout(() => {
          onActividadesChange();
        }, 100);
      } else {
        toast.error(result.message || 'Error al copiar actividad');
      }
    } catch (error) {
      console.error('Error copying actividad:', error);
      toast.error('Error al copiar actividad');
    }
  };

  const sortedActividades = [...localActividades].sort((a, b) => a.ORDEN - b.ORDEN);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Actividades</span>
          <span className="text-xs text-muted-foreground">({localActividades.length})</span>
        </div>
        <Button size="sm" variant="outline" onClick={handleOpenCreate}>
          <Plus className="h-3 w-3 mr-1" />
          Agregar
        </Button>
      </div>

      {/* Lista de actividades */}
      {sortedActividades.length === 0 ? (
        <div className="text-sm text-muted-foreground italic pl-6">
          No hay actividades asociadas
        </div>
      ) : (
        <div className="space-y-2 pl-6">
          {sortedActividades.map((actividad) => (
            <div 
              key={actividad.IDA} 
              className="flex items-center justify-between p-2 rounded-md border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">
                    {actividad.ORDEN}.
                  </span>
                  <span className="text-sm truncate">{actividad.DESCRIPCION}</span>
                </div>
                {actividad.IDT && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Atributo: {atributos.find(a => a.IDT === actividad.IDT)?.DESCRIPCION || `ID: ${actividad.IDT}`}
                    {(() => {
                      const valor = atributoValores.find(av => av.IDA === actividad.IDA);
                      return valor ? <span className="ml-1 font-medium text-foreground">({valor.VALOR})</span> : null;
                    })()}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleOpenCopy(actividad)}
                  title="Copiar a otro nivel"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleOpenEdit(actividad)}
                  disabled={isDeleting && deletingId === actividad.IDA}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(actividad.IDA)}
                  disabled={isDeleting && deletingId === actividad.IDA}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog Crear */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar Actividad</DialogTitle>
            <DialogDescription>
              Crear una nueva actividad para este nivel
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {/* Campos Básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="descripcion" className="mb-2 block">Descripción *</Label>
                <Input
                  id="descripcion"
                  value={formData.DESCRIPCION}
                  onChange={(e) => setFormData({ ...formData, DESCRIPCION: e.target.value })}
                  placeholder="Descripción de la actividad"
                />
              </div>
              <div>
                <Label htmlFor="orden" className="mb-2 block">Orden *</Label>
                <Input
                  id="orden"
                  type="number"
                  value={formData.ORDEN}
                  onChange={(e) => setFormData({ ...formData, ORDEN: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="atributo" className="mb-2 block">Atributo (Opcional)</Label>
              <Select
                value={formData.IDT?.toString() || '__null__'}
                onValueChange={(value) => setFormData({ ...formData, IDT: value === '__null__' ? null : parseInt(value) })}
              >
                <SelectTrigger id="atributo">
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
                  <Label htmlFor="funcionalidad" className="mb-2 block">Funcionalidad</Label>
                  <Textarea
                    id="funcionalidad"
                    value={formData.FUNCIONALIDAD}
                    onChange={(e) => setFormData({ ...formData, FUNCIONALIDAD: e.target.value })}
                    placeholder="Describir la función principal del componente"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="modo-falla" className="mb-2 block">Modo de Falla</Label>
                  <Textarea
                    id="modo-falla"
                    value={formData.MODO_FALLA}
                    onChange={(e) => setFormData({ ...formData, MODO_FALLA: e.target.value })}
                    placeholder="Describir los modos de falla posibles"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="efecto-falla" className="mb-2 block">Efecto de la Falla</Label>
                  <Textarea
                    id="efecto-falla"
                    value={formData.EFECTO_FALLA}
                    onChange={(e) => setFormData({ ...formData, EFECTO_FALLA: e.target.value })}
                    placeholder="Describir los efectos típicos de la falla"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tiempo-promedio-falla" className="mb-2 block">Tiempo Promedio entre Falla</Label>
                    <Input
                      id="tiempo-promedio-falla"
                      type="number"
                      step="0.01"
                      value={formData.TIEMPO_PROMEDIO_FALLA || ''}
                      onChange={(e) => setFormData({ ...formData, TIEMPO_PROMEDIO_FALLA: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unidad-tiempo-falla" className="mb-2 block">Unidad de Tiempo (Falla)</Label>
                    <Select
                      value={formData.UNIDAD_TIEMPO_FALLA || '__null__'}
                      onValueChange={(value) => setFormData({ ...formData, UNIDAD_TIEMPO_FALLA: value === '__null__' ? null : value })}
                    >
                      <SelectTrigger id="unidad-tiempo-falla">
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
                  <Label htmlFor="consecuencia-falla" className="mb-2 block">Consecuencia de Falla</Label>
                  <Select
                    value={formData.ID_CONSECUENCIA_FALLA?.toString() || '__null__'}
                    onValueChange={(value) => setFormData({ ...formData, ID_CONSECUENCIA_FALLA: value === '__null__' ? null : parseInt(value) })}
                  >
                    <SelectTrigger id="consecuencia-falla">
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
                  <Label htmlFor="clase-mantencion" className="mb-2 block">Clase de Mantención</Label>
                  <Select
                    value={formData.ID_CLASE_MANTENCION?.toString() || '__null__'}
                    onValueChange={(value) => setFormData({ ...formData, ID_CLASE_MANTENCION: value === '__null__' ? null : parseInt(value) })}
                  >
                    <SelectTrigger id="clase-mantencion">
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
                  <Label htmlFor="tarea-mantencion" className="mb-2 block">Tarea de Mantención</Label>
                  <Textarea
                    id="tarea-mantencion"
                    value={formData.TAREA_MANTENCION}
                    onChange={(e) => setFormData({ ...formData, TAREA_MANTENCION: e.target.value })}
                    placeholder="Describir la tarea de mantención a realizar"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="frecuencia-tarea" className="mb-2 block">Frecuencia de la Tarea</Label>
                    <Input
                      id="frecuencia-tarea"
                      type="number"
                      step="0.01"
                      value={formData.FRECUENCIA_TAREA || ''}
                      onChange={(e) => setFormData({ ...formData, FRECUENCIA_TAREA: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unidad-frecuencia" className="mb-2 block">Unidad de Frecuencia</Label>
                    <Select
                      value={formData.UNIDAD_FRECUENCIA || '__null__'}
                      onValueChange={(value) => setFormData({ ...formData, UNIDAD_FRECUENCIA: value === '__null__' ? null : value })}
                    >
                      <SelectTrigger id="unidad-frecuencia">
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
                    <Label htmlFor="duracion-tarea" className="mb-2 block">Duración de la Tarea (minutos)</Label>
                    <Input
                      id="duracion-tarea"
                      type="number"
                      step="0.01"
                      value={formData.DURACION_TAREA || ''}
                      onChange={(e) => setFormData({ ...formData, DURACION_TAREA: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cantidad-recursos" className="mb-2 block">Cantidad de Recursos</Label>
                    <Input
                      id="cantidad-recursos"
                      type="number"
                      value={formData.CANTIDAD_RECURSOS || ''}
                      onChange={(e) => setFormData({ ...formData, CANTIDAD_RECURSOS: e.target.value ? parseInt(e.target.value) : null })}
                      placeholder="1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="condicion-acceso" className="mb-2 block">Condición de Acceso</Label>
                    <Select
                      value={formData.ID_CONDICION_ACCESO?.toString() || '__null__'}
                      onValueChange={(value) => setFormData({ ...formData, ID_CONDICION_ACCESO: value === '__null__' ? null : parseInt(value) })}
                    >
                      <SelectTrigger id="condicion-acceso">
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
                    <Label htmlFor="disciplina-tarea" className="mb-2 block">Disciplina de la Tarea</Label>
                    <Select
                      value={formData.ID_DISCIPLINA_TAREA?.toString() || '__null__'}
                      onValueChange={(value) => setFormData({ ...formData, ID_DISCIPLINA_TAREA: value === '__null__' ? null : parseInt(value) })}
                    >
                      <SelectTrigger id="disciplina-tarea">
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
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={!formData.DESCRIPCION}>
              Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Editar */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
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
                    value={formData.FUNCIONALIDAD}
                    onChange={(e) => setFormData({ ...formData, FUNCIONALIDAD: e.target.value })}
                    placeholder="Describir la función principal del componente"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-modo-falla" className="mb-2 block">Modo de Falla</Label>
                  <Textarea
                    id="edit-modo-falla"
                    value={formData.MODO_FALLA}
                    onChange={(e) => setFormData({ ...formData, MODO_FALLA: e.target.value })}
                    placeholder="Describir los modos de falla posibles"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-efecto-falla" className="mb-2 block">Efecto de la Falla</Label>
                  <Textarea
                    id="edit-efecto-falla"
                    value={formData.EFECTO_FALLA}
                    onChange={(e) => setFormData({ ...formData, EFECTO_FALLA: e.target.value })}
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
                    value={formData.TAREA_MANTENCION}
                    onChange={(e) => setFormData({ ...formData, TAREA_MANTENCION: e.target.value })}
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
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate} disabled={!formData.DESCRIPCION}>
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
                      No hay niveles con "Unidad Mantenible" activa
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

