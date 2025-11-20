'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Folder, Plus, Pencil, Trash2 } from 'lucide-react';
import { createNivel, updateNivel, deleteNivel } from '@/lib/api';
import type { Nivel, CreateNivelDTO, UpdateNivelDTO, Jerarquia } from '@/models';
import { toast } from 'sonner';
import { IconPicker } from '@/components/ui/icon-picker';

interface NivelChildrenManagerProps {
  nivelPadreId: number;
  niveles: Nivel[];
  jerarquias: Jerarquia[];
  onNivelesChange?: () => void;
}

export function NivelChildrenManager({ 
  nivelPadreId, 
  niveles, 
  jerarquias,
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
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingNivel, setEditingNivel] = useState<Nivel | null>(null);
  const [formData, setFormData] = useState({
    NOMBRE: '',
    IDJ: 0,
    PLANTILLA: false,
    GENERADO: false,
    NROPM: 0,
    COMENTARIO: '',
    ID_USR: undefined as number | undefined,
    ICONO: '',
  });

  const handleOpenCreate = () => {
    setFormData({
      NOMBRE: '',
      IDJ: jerarquias[0]?.IDJ || 0,
      PLANTILLA: false,
      GENERADO: false,
      NROPM: 0,
      COMENTARIO: '',
      ID_USR: undefined,
      ICONO: '',
    });
    setIsCreating(true);
  };

  const handleOpenEdit = (nivel: Nivel) => {
    setEditingNivel(nivel);
    setFormData({
      NOMBRE: nivel.NOMBRE,
      IDJ: nivel.IDJ,
      PLANTILLA: nivel.PLANTILLA || false,
      GENERADO: nivel.GENERADO || false,
      NROPM: nivel.NROPM || 0,
      COMENTARIO: nivel.COMENTARIO || '',
      ID_USR: nivel.ID_USR || undefined,
      ICONO: nivel.ICONO || '',
    });
    setIsEditing(true);
  };

  const handleCreate = async () => {
    try {
      const createData: CreateNivelDTO = {
        NOMBRE: formData.NOMBRE,
        IDJ: formData.IDJ,
        IDNP: nivelPadreId, // El padre es el nivel actual
        PLANTILLA: formData.PLANTILLA,
        GENERADO: formData.GENERADO,
        NROPM: formData.NROPM,
        COMENTARIO: formData.COMENTARIO || undefined,
        ID_USR: formData.ID_USR || undefined,
        ICONO: formData.ICONO || undefined,
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
      const updateData: UpdateNivelDTO = {
        NOMBRE: formData.NOMBRE,
        IDJ: formData.IDJ,
        IDNP: nivelPadreId,
        PLANTILLA: formData.PLANTILLA,
        GENERADO: formData.GENERADO,
        NROPM: formData.NROPM,
        COMENTARIO: formData.COMENTARIO || undefined,
        ID_USR: formData.ID_USR || undefined,
        ICONO: formData.ICONO || undefined,
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
        <Button size="sm" variant="outline" onClick={handleOpenCreate}>
          <Plus className="h-3 w-3 mr-1" />
          Agregar
        </Button>
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
                value={formData.ICONO}
                onChange={(value) => setFormData({ ...formData, ICONO: value })}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="plantilla"
                  checked={formData.PLANTILLA}
                  onCheckedChange={(checked) => setFormData({ ...formData, PLANTILLA: checked === true })}
                />
                <Label htmlFor="plantilla" className="cursor-pointer">
                  Plantilla
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="generado"
                  checked={formData.GENERADO}
                  onCheckedChange={(checked) => setFormData({ ...formData, GENERADO: checked === true })}
                />
                <Label htmlFor="generado" className="cursor-pointer">
                  Generado
                </Label>
              </div>
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
                value={formData.ICONO}
                onChange={(value) => setFormData({ ...formData, ICONO: value })}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-plantilla"
                  checked={formData.PLANTILLA}
                  onCheckedChange={(checked) => setFormData({ ...formData, PLANTILLA: checked === true })}
                />
                <Label htmlFor="edit-plantilla" className="cursor-pointer">
                  Plantilla
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-generado"
                  checked={formData.GENERADO}
                  onCheckedChange={(checked) => setFormData({ ...formData, GENERADO: checked === true })}
                />
                <Label htmlFor="edit-generado" className="cursor-pointer">
                  Generado
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
    </div>
  );
}

