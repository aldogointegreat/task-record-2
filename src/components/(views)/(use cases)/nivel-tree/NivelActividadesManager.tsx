'use client';

import { useState, useEffect } from 'react';
import type { ActividadNivel, Atributo, CreateActividadNivelDTO, UpdateActividadNivelDTO } from '@/models';
import { createActividadNivel, updateActividadNivel, deleteActividadNivel } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, ListChecks } from 'lucide-react';
import { toast } from 'sonner';

interface NivelActividadesManagerProps {
  nivelId: number;
  actividades: ActividadNivel[];
  atributos: Atributo[];
  onActividadesChange: () => void;
}

export function NivelActividadesManager({ 
  nivelId, 
  actividades, 
  atributos,
  onActividadesChange 
}: NivelActividadesManagerProps) {
  const [localActividades, setLocalActividades] = useState<ActividadNivel[]>(actividades);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingActividad, setEditingActividad] = useState<ActividadNivel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Actualizar estado local cuando cambien las actividades del padre
  useEffect(() => {
    setLocalActividades(actividades);
  }, [actividades]);
  
  const [formData, setFormData] = useState({
    DESCRIPCION: '',
    ORDEN: 1,
    IDT: null as number | null,
  });

  const handleOpenCreate = () => {
    setFormData({
      DESCRIPCION: '',
      ORDEN: (localActividades.length > 0 ? Math.max(...localActividades.map(a => a.ORDEN)) + 1 : 1),
      IDT: null,
    });
    setIsCreating(true);
  };

  const handleOpenEdit = (actividad: ActividadNivel) => {
    setEditingActividad(actividad);
    setFormData({
      DESCRIPCION: actividad.DESCRIPCION,
      ORDEN: actividad.ORDEN,
      IDT: actividad.IDT,
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
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 ml-2">
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
        <DialogContent>
          <DialogHeader >
            <DialogTitle>Agregar Actividad</DialogTitle>
            <DialogDescription>
              Crear una nueva actividad para este nivel
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label htmlFor="descripcion" className="pb-3">Descripción *</Label>
              <Input
                id="descripcion"
                value={formData.DESCRIPCION}
                onChange={(e) => setFormData({ ...formData, DESCRIPCION: e.target.value })}
                placeholder="Descripción de la actividad"
              />
            </div>
            <div>
              <Label htmlFor="orden" className="pb-3">Orden *</Label>
              <Input
                id="orden"
                type="number"
                value={formData.ORDEN}
                onChange={(e) => setFormData({ ...formData, ORDEN: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <Label htmlFor="atributo" className="pb-3">Atributo (Opcional)</Label>
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
        <DialogContent>
          <DialogHeader className="pb-4">
            <DialogTitle>Editar Actividad</DialogTitle>
            <DialogDescription>
              Modificar la información de la actividad
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label htmlFor="edit-descripcion">Descripción *</Label>
              <Input
                id="edit-descripcion"
                value={formData.DESCRIPCION}
                onChange={(e) => setFormData({ ...formData, DESCRIPCION: e.target.value })}
                placeholder="Descripción de la actividad"
              />
            </div>
            <div>
              <Label htmlFor="edit-orden">Orden *</Label>
              <Input
                id="edit-orden"
                type="number"
                value={formData.ORDEN}
                onChange={(e) => setFormData({ ...formData, ORDEN: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <Label htmlFor="edit-atributo">Atributo (Opcional)</Label>
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
    </div>
  );
}

