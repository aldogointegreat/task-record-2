'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Folder, Plus, Pencil, Trash2, Download } from 'lucide-react';
import { createNivel, updateNivel, deleteNivel, importarNivel, getNivelById, getAllNiveles } from '@/lib/api';
import type { Nivel, CreateNivelDTO, UpdateNivelDTO, Jerarquia, DisciplinaNivel } from '@/models';
import { toast } from 'sonner';
import { IconPicker } from '@/components/ui/icon-picker';

interface NivelChildrenManagerProps {
  nivelPadreId: number;
  nivelPadre: Nivel;
  niveles: Nivel[];
  jerarquias: Jerarquia[];
  disciplinasNivel?: DisciplinaNivel[];
  onNivelesChange?: () => void;
}

export function NivelChildrenManager({ 
  nivelPadreId,
  nivelPadre,
  niveles, 
  jerarquias,
  disciplinasNivel = [],
  onNivelesChange 
}: NivelChildrenManagerProps) {
  const [localNiveles, setLocalNiveles] = useState<Nivel[]>(niveles);
  
  // Sincronizar localNiveles cuando el prop niveles cambie
  useEffect(() => {
    setLocalNiveles(niveles);
  }, [niveles]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isLoadingComponents, setIsLoadingComponents] = useState(false);
  const [availableComponents, setAvailableComponents] = useState<Nivel[]>([]);
  
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingNivel, setEditingNivel] = useState<Nivel | null>(null);
  const [formData, setFormData] = useState({
    NOMBRE: '',
    IDJ: 0,
    PLANTILLA: false,
    GENERICO: false,
    NROPM: 0,
    COMENTARIO: '',
    ID_USR: undefined as number | undefined,
    ICONO: '',
    ID_DISCIPLINA_NIVEL: null as number | null,
    UNIDAD_MANTENIBLE: false,
  });

  const handleOpenCreate = () => {
    setFormData({
      NOMBRE: '',
      IDJ: jerarquias[0]?.IDJ || 0,
      PLANTILLA: false,
      GENERICO: false,
      NROPM: 0,
      COMENTARIO: '',
      ID_USR: undefined,
      ICONO: '',
      ID_DISCIPLINA_NIVEL: null,
      UNIDAD_MANTENIBLE: false,
    });
    setIsCreating(true);
  };

  const handleOpenImport = async () => {
    if (!nivelPadre.IDNP) return;
    
    setIsLoadingComponents(true);
    setIsImporting(true);
    setAvailableComponents([]);
    
    try {
      // 1. Obtener el padre (el genérico)
      const parentResult = await getNivelById(nivelPadre.IDNP);
      if (!parentResult.success || !parentResult.data) {
        toast.error('No se pudo obtener información del nivel padre');
        setIsImporting(false);
        return;
      }
      
      const abuelo = parentResult.data;
      if (!abuelo.GENERICO) {
        toast.error('El padre de esta plantilla no es un nivel Genérico, no se pueden importar componentes');
        setIsImporting(false);
        return;
      }
      
      // 2. Obtener los hijos del genérico (hermanos de esta plantilla)
      const siblingsResult = await getAllNiveles({ IDNP: abuelo.IDN });
      if (!siblingsResult.success || !siblingsResult.data) {
        toast.error('Error al cargar componentes disponibles');
        return;
      }
      
      // 3. Filtrar:
      // - Excluir plantillas y genéricos
      // - Excluir la propia plantilla actual
      // - Excluir componentes que YA existen en la plantilla actual (por nombre)
      const siblings = siblingsResult.data.filter(n => 
        !n.PLANTILLA && 
        !n.GENERICO && 
        n.IDN !== nivelPadre.IDN
      );
      
      const currentChildrenNames = localNiveles.map(n => n.NOMBRE.toLowerCase());
      
      const available = siblings.filter(s => 
        !currentChildrenNames.includes(s.NOMBRE.toLowerCase())
      );
      
      setAvailableComponents(available);
      
    } catch (error) {
      console.error('Error loading import components:', error);
      toast.error('Error al cargar componentes');
    } finally {
      setIsLoadingComponents(false);
    }
  };

  const handleImport = async (componente: Nivel) => {
    try {
      const result = await importarNivel(componente.IDN, nivelPadre.IDN);
      
      if (result.success) {
        toast.success(`Componente "${componente.NOMBRE}" importado exitosamente`);
        
        // Eliminar de la lista local de disponibles
        setAvailableComponents(prev => prev.filter(n => n.IDN !== componente.IDN));
        
        // Notificar al padre para recargar
        setTimeout(() => {
          onNivelesChange?.();
        }, 100);
      } else {
        toast.error(result.message || 'Error al importar componente');
      }
    } catch (error) {
      console.error('Error importing:', error);
      toast.error('Error al importar componente');
    }
  };

  const handleOpenEdit = (nivel: Nivel) => {
    setEditingNivel(nivel);
    setFormData({
      NOMBRE: nivel.NOMBRE,
      IDJ: nivel.IDJ,
      PLANTILLA: nivel.PLANTILLA || false,
      GENERICO: nivel.GENERICO || false,
      NROPM: nivel.NROPM || 0,
      COMENTARIO: nivel.COMENTARIO || '',
      ID_USR: nivel.ID_USR || undefined,
      ICONO: nivel.ICONO || '',
      ID_DISCIPLINA_NIVEL: nivel.ID_DISCIPLINA_NIVEL ?? null,
      UNIDAD_MANTENIBLE: nivel.UNIDAD_MANTENIBLE ?? false,
    });
    setIsEditing(true);
  };

  const handleCreate = async () => {
    try {
      // Validación: Si es plantilla, no puede ser genérico
      if (formData.PLANTILLA && formData.GENERICO) {
        toast.error('Un nivel plantilla no puede ser genérico');
        return;
      }
      
      // Validación: Si es plantilla, el padre debe ser genérico
      if (formData.PLANTILLA && !nivelPadre.GENERICO) {
        toast.error('Una plantilla solo puede crearse si su padre es genérico');
        return;
      }
      
      // Mensaje informativo si es plantilla
      if (formData.PLANTILLA) {
        toast.info(`Se copiará la estructura de "${nivelPadre.NOMBRE}" excluyendo plantillas y genéricos`);
      }
      
      const createData: CreateNivelDTO = {
        NOMBRE: formData.NOMBRE,
        IDJ: formData.IDJ,
        IDNP: nivelPadreId, // El padre es el nivel actual
        PLANTILLA: formData.PLANTILLA,
        GENERICO: formData.PLANTILLA ? false : formData.GENERICO, // Si es plantilla, forzar a false
        NROPM: formData.NROPM,
        COMENTARIO: formData.COMENTARIO || undefined,
        ID_USR: formData.ID_USR || undefined,
        ICONO: formData.ICONO || undefined,
        ID_DISCIPLINA_NIVEL: formData.ID_DISCIPLINA_NIVEL,
        UNIDAD_MANTENIBLE: formData.UNIDAD_MANTENIBLE,
      };

      const result = await createNivel(createData);
      
      if (result.success && result.data) {
        // Actualizar estado local inmediatamente
        setLocalNiveles(prev => [...prev, result.data!]);
        toast.success('Nivel creado exitosamente');
        setIsCreating(false);
        
        // Notificar al padre después de un pequeño delay para actualización en segundo plano
        setTimeout(() => {
          onNivelesChange?.();
        }, 100);
      } else {
        toast.error(result.message || 'Error al crear nivel');
      }
    } catch (error) {
      console.error('Error creating nivel:', error);
      toast.error('Error al crear nivel');
    }
  };

  const handleUpdate = async () => {
    if (!editingNivel) return;

    try {
      // Validación: Si es plantilla, no puede ser genérico
      if (formData.PLANTILLA && formData.GENERICO) {
        toast.error('Un nivel plantilla no puede ser genérico');
        return;
      }
      
      const updateData: UpdateNivelDTO = {
        NOMBRE: formData.NOMBRE,
        IDJ: formData.IDJ,
        IDNP: nivelPadreId,
        PLANTILLA: formData.PLANTILLA,
        GENERICO: formData.PLANTILLA ? false : formData.GENERICO, // Si es plantilla, forzar a false
        NROPM: formData.NROPM,
        COMENTARIO: formData.COMENTARIO || undefined,
        ID_USR: formData.ID_USR || undefined,
        ICONO: formData.ICONO || undefined,
        ID_DISCIPLINA_NIVEL: formData.ID_DISCIPLINA_NIVEL,
        UNIDAD_MANTENIBLE: formData.UNIDAD_MANTENIBLE,
      };

      const result = await updateNivel(editingNivel.IDN, updateData);
      
      if (result.success && result.data) {
        // Actualizar estado local inmediatamente
        setLocalNiveles(prev => 
          prev.map(n => n.IDN === editingNivel.IDN ? result.data! : n)
        );
        toast.success('Nivel actualizado exitosamente');
        setIsEditing(false);
        setEditingNivel(null);
        
        // Notificar al padre después de un pequeño delay
        setTimeout(() => {
          onNivelesChange?.();
        }, 100);
      } else {
        toast.error(result.message || 'Error al actualizar nivel');
      }
    } catch (error) {
      console.error('Error updating nivel:', error);
      toast.error('Error al actualizar nivel');
    }
  };

  const handleDelete = async (nivelId: number) => {
    try {
      setIsDeleting(true);
      setDeletingId(nivelId);

      const result = await deleteNivel(nivelId);
      
      if (result.success) {
        // Actualizar estado local inmediatamente
        setLocalNiveles(prev => prev.filter(n => n.IDN !== nivelId));
        toast.success('Nivel eliminado exitosamente');
        
        // Notificar al padre después de un pequeño delay
        setTimeout(() => {
          onNivelesChange?.();
        }, 100);
      } else {
        toast.error(result.message || 'Error al eliminar nivel');
      }
    } catch (error) {
      console.error('Error deleting nivel:', error);
      toast.error('Error al eliminar nivel');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const sortedNiveles = [...localNiveles].sort((a, b) => 
    a.NOMBRE.localeCompare(b.NOMBRE)
  );

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Niveles Hijos</span>
          <span className="text-xs text-muted-foreground">({localNiveles.length})</span>
        </div>
        <div className="flex items-center gap-2">
          {nivelPadre.PLANTILLA && (
            <Button size="sm" variant="outline" onClick={handleOpenImport}>
              <Download className="h-3 w-3 mr-1" />
              Importar Componente
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={handleOpenCreate}>
            <Plus className="h-3 w-3 mr-1" />
            Agregar
          </Button>
        </div>
      </div>

      {/* Lista de niveles */}
      {sortedNiveles.length === 0 ? (
        <div className="text-sm text-muted-foreground italic pl-6">
          No hay niveles hijos
        </div>
      ) : (
        <div className="space-y-2 pl-6">
          {sortedNiveles.map((nivel) => {
            const jerarquia = jerarquias.find(j => j.IDJ === nivel.IDJ);
            return (
              <div 
                key={nivel.IDN} 
                className="flex items-center justify-between p-2 rounded-md border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{nivel.NOMBRE}</span>
                    {jerarquia && (
                      <span 
                        className="text-xs px-1.5 py-0.5 rounded-full bg-muted/50"
                        style={jerarquia.COLOR ? {
                          color: jerarquia.COLOR,
                          backgroundColor: `${jerarquia.COLOR}15`,
                        } : undefined}
                      >
                        {jerarquia.DESCRIPCION}
                      </span>
                    )}
                  </div>
                  {nivel.COMENTARIO && (
                    <div className="text-xs text-muted-foreground mt-1 truncate">
                      {nivel.COMENTARIO}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleOpenEdit(nivel)}
                    disabled={isDeleting && deletingId === nivel.IDN}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(nivel.IDN)}
                    disabled={isDeleting && deletingId === nivel.IDN}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog Crear */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar Nivel Hijo</DialogTitle>
            <DialogDescription>
              Crear un nuevo nivel hijo para este nivel
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label htmlFor="nombre" className="mb-2 block">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.NOMBRE}
                onChange={(e) => setFormData({ ...formData, NOMBRE: e.target.value })}
                placeholder="Nombre del nivel"
              />
            </div>

            <div>
              <Label htmlFor="jerarquia" className="mb-2 block">Jerarquía *</Label>
              <Select
                value={formData.IDJ.toString()}
                onValueChange={(value) => setFormData({ ...formData, IDJ: Number(value) })}
              >
                <SelectTrigger id="jerarquia">
                  <SelectValue placeholder="Seleccionar jerarquía" />
                </SelectTrigger>
                <SelectContent>
                  {jerarquias.map((jer) => (
                    <SelectItem key={jer.IDJ} value={jer.IDJ.toString()}>
                      {jer.DESCRIPCION}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="disciplina-nivel" className="mb-2 block">Disciplina</Label>
              <Select
                value={formData.ID_DISCIPLINA_NIVEL !== null ? formData.ID_DISCIPLINA_NIVEL.toString() : '__null__'}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  ID_DISCIPLINA_NIVEL: value === '__null__' ? null : Number(value) 
                })}
              >
                <SelectTrigger id="disciplina-nivel">
                  <SelectValue placeholder="Seleccionar disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__null__">Sin disciplina</SelectItem>
                  {disciplinasNivel.map((disciplina) => (
                    <SelectItem 
                      key={disciplina.ID_DISCIPLINA_NIVEL} 
                      value={disciplina.ID_DISCIPLINA_NIVEL.toString()}
                    >
                      {disciplina.CODIGO} - {disciplina.DESCRIPCION}
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
                value={formData.NROPM}
                onChange={(e) => setFormData({ ...formData, NROPM: Number(e.target.value) })}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="comentario" className="mb-2 block">Comentario</Label>
              <Input
                id="comentario"
                value={formData.COMENTARIO}
                onChange={(e) => setFormData({ ...formData, COMENTARIO: e.target.value })}
                placeholder="Comentario opcional"
              />
            </div>

            <div>
              <Label htmlFor="icono" className="mb-2 block">Ícono</Label>
              <IconPicker
                value={formData.ICONO || undefined}
                onChange={(value) => setFormData({ ...formData, ICONO: value || '' })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="plantilla"
                    checked={formData.PLANTILLA}
                    disabled={formData.GENERICO} // Solo deshabilitar si el hijo es genérico (no pueden ser ambos)
                    onCheckedChange={(checked) => {
                      const isPlantilla = checked === true;
                      setFormData({ 
                        ...formData, 
                        PLANTILLA: isPlantilla,
                        GENERICO: isPlantilla ? false : formData.GENERICO // Si es plantilla, desmarcar genérico
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
                    checked={formData.GENERICO}
                    disabled={formData.PLANTILLA} // Deshabilitar si es plantilla
                    onCheckedChange={(checked) => {
                      const isGenerico = checked === true;
                      setFormData({ 
                        ...formData, 
                        GENERICO: isGenerico,
                        PLANTILLA: isGenerico ? false : formData.PLANTILLA // Si es genérico, desmarcar plantilla
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
                    checked={formData.UNIDAD_MANTENIBLE}
                    onCheckedChange={(checked) => {
                      setFormData({ 
                        ...formData, 
                        UNIDAD_MANTENIBLE: checked === true
                      });
                    }}
                  />
                  <Label htmlFor="unidad-mantenible">
                    Unidad Mantenible
                  </Label>
                </div>
              </div>
              
              {/* Mensaje informativo para plantillas - solo si está marcado como plantilla y el padre NO es genérico */}
              {formData.PLANTILLA && !nivelPadre.GENERICO && (
                <p className="text-xs text-amber-600 dark:text-amber-400 pl-6">
                  ⚠ Una plantilla solo puede crearse si su padre es genérico. Este nivel no se creará.
                </p>
              )}
              
              {/* Mensaje informativo de copia - solo si está marcado como plantilla Y el padre es genérico */}
              {formData.PLANTILLA && nivelPadre.GENERICO && (
                <p className="text-xs text-blue-600 dark:text-blue-400 pl-6">
                  ℹ Se copiará la estructura de &quot;{nivelPadre.NOMBRE}&quot; (excluyendo plantillas y genéricos)
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="id_usr" className="mb-2 block">ID Usuario</Label>
              <Input
                id="id_usr"
                type="number"
                value={formData.ID_USR || ''}
                onChange={(e) => setFormData({ ...formData, ID_USR: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="ID de usuario"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={!formData.NOMBRE || !formData.IDJ}>
              Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Editar */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Nivel</DialogTitle>
            <DialogDescription>
              Modificar la información del nivel
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label htmlFor="edit-nombre" className="mb-2 block">Nombre *</Label>
              <Input
                id="edit-nombre"
                value={formData.NOMBRE}
                onChange={(e) => setFormData({ ...formData, NOMBRE: e.target.value })}
                placeholder="Nombre del nivel"
              />
            </div>

            <div>
              <Label htmlFor="edit-jerarquia" className="mb-2 block">Jerarquía *</Label>
              <Select
                value={formData.IDJ.toString()}
                onValueChange={(value) => setFormData({ ...formData, IDJ: Number(value) })}
              >
                <SelectTrigger id="edit-jerarquia">
                  <SelectValue placeholder="Seleccionar jerarquía" />
                </SelectTrigger>
                <SelectContent>
                  {jerarquias.map((jer) => (
                    <SelectItem key={jer.IDJ} value={jer.IDJ.toString()}>
                      {jer.DESCRIPCION}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-disciplina-nivel" className="mb-2 block">Disciplina</Label>
              <Select
                value={formData.ID_DISCIPLINA_NIVEL !== null ? formData.ID_DISCIPLINA_NIVEL.toString() : '__null__'}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  ID_DISCIPLINA_NIVEL: value === '__null__' ? null : Number(value)
                })}
              >
                <SelectTrigger id="edit-disciplina-nivel">
                  <SelectValue placeholder="Seleccionar disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__null__">Sin disciplina</SelectItem>
                  {disciplinasNivel.map((disciplina) => (
                    <SelectItem 
                      key={disciplina.ID_DISCIPLINA_NIVEL} 
                      value={disciplina.ID_DISCIPLINA_NIVEL.toString()}
                    >
                      {disciplina.CODIGO} - {disciplina.DESCRIPCION}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-nropm" className="mb-2 block">Número de PM</Label>
              <Input
                id="edit-nropm"
                type="number"
                value={formData.NROPM}
                onChange={(e) => setFormData({ ...formData, NROPM: Number(e.target.value) })}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="edit-comentario" className="mb-2 block">Comentario</Label>
              <Input
                id="edit-comentario"
                value={formData.COMENTARIO}
                onChange={(e) => setFormData({ ...formData, COMENTARIO: e.target.value })}
                placeholder="Comentario opcional"
              />
            </div>

            <div>
              <Label htmlFor="edit-icono" className="mb-2 block">Ícono</Label>
              <IconPicker
                value={formData.ICONO || undefined}
                onChange={(value) => setFormData({ ...formData, ICONO: value || '' })}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-plantilla"
                  checked={formData.PLANTILLA}
                  disabled={formData.GENERICO} // Deshabilitar si es genérico
                  onCheckedChange={(checked) => {
                    const isPlantilla = checked === true;
                    setFormData({ 
                      ...formData, 
                      PLANTILLA: isPlantilla,
                      GENERICO: isPlantilla ? false : formData.GENERICO // Si es plantilla, desmarcar genérico
                    });
                  }}
                />
                <Label htmlFor="edit-plantilla" className={`cursor-pointer ${formData.GENERICO ? 'opacity-50' : ''}`}>
                  Plantilla
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-generico"
                  checked={formData.GENERICO}
                  disabled={formData.PLANTILLA} // Deshabilitar si es plantilla
                  onCheckedChange={(checked) => {
                    const isGenerico = checked === true;
                    setFormData({ 
                      ...formData, 
                      GENERICO: isGenerico,
                      PLANTILLA: isGenerico ? false : formData.PLANTILLA // Si es genérico, desmarcar plantilla
                    });
                  }}
                />
                <Label htmlFor="edit-generico" className={`cursor-pointer ${formData.PLANTILLA ? 'opacity-50' : ''}`}>
                  Genérico
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-unidad-mantenible"
                  checked={formData.UNIDAD_MANTENIBLE}
                  onCheckedChange={(checked) => {
                    setFormData({ 
                      ...formData, 
                      UNIDAD_MANTENIBLE: checked === true
                    });
                  }}
                />
                <Label htmlFor="edit-unidad-mantenible">
                  Unidad Mantenible
                </Label>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-id_usr" className="mb-2 block">ID Usuario</Label>
              <Input
                id="edit-id_usr"
                type="number"
                value={formData.ID_USR || ''}
                onChange={(e) => setFormData({ ...formData, ID_USR: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="ID de usuario"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate} disabled={!formData.NOMBRE || !formData.IDJ}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Importar */}
      <Dialog open={isImporting} onOpenChange={setIsImporting}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Importar Componente</DialogTitle>
            <DialogDescription>
              Importar componentes desde el nivel genérico padre
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-2">
            {isLoadingComponents ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Cargando componentes disponibles...
              </div>
            ) : availableComponents.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No hay componentes disponibles para importar.
                <br />
                Todos los componentes del genérico ya están presentes o no existen componentes válidos.
              </div>
            ) : (
              <div className="grid gap-2">
                {availableComponents.map((comp) => (
                  <div 
                    key={comp.IDN} 
                    className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                        <Folder className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{comp.NOMBRE}</div>
                        <div className="text-xs text-muted-foreground">
                          {jerarquias.find(j => j.IDJ === comp.IDJ)?.DESCRIPCION || 'Sin jerarquía'}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleImport(comp)}>
                      Importar
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImporting(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

