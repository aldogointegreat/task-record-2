import { useState, useEffect } from 'react';
import type { ActividadNivel, Atributo, AtributoValor } from '@/models';
import { Info, ListChecks, Hash, Tag, Plus, Pencil, Trash2 } from 'lucide-react';
import { getAllAtributoValores, createAtributoValor, updateAtributoValor, deleteAtributoValor } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ActividadNivelDetailsPanelProps {
  actividad: ActividadNivel;
  atributos?: Atributo[];
}

export function ActividadNivelDetailsPanel({ actividad, atributos }: ActividadNivelDetailsPanelProps) {
  const [valores, setValores] = useState<AtributoValor[]>([]);
  const [loadingValores, setLoadingValores] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingValor, setEditingValor] = useState<AtributoValor | null>(null);
  const [formValor, setFormValor] = useState('');
  
  const atributo = actividad.IDT ? atributos?.find(a => a.IDT === actividad.IDT) : null;

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

  const handleSave = async () => {
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
            <Button onClick={handleSave} disabled={!formValor}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


