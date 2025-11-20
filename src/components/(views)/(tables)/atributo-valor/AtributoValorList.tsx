'use client';

import { useState, useEffect } from 'react';
import { TankTable, type LoadingStates } from '@/lib/utils/tanktable-enhanted';
import { 
  getAllAtributoValores, 
  createAtributoValor, 
  updateAtributoValor, 
  deleteAtributoValor,
  getAllActividadNiveles
} from '@/lib/api';
import type { AtributoValor, CreateAtributoValorDTO, UpdateAtributoValorDTO, ActividadNivel } from '@/models';
import { createAtributoValorColumns } from './atributo-valor-columns';
import { toast } from 'sonner';

export function AtributoValorList() {
  const [atributoValores, setAtributoValores] = useState<AtributoValor[]>([]);
  const [actividadesNivel, setActividadesNivel] = useState<ActividadNivel[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [valoresResult, actividadesResult] = await Promise.all([
        getAllAtributoValores(),
        getAllActividadNiveles(),
      ]);

      if (valoresResult.success && valoresResult.data) {
        setAtributoValores(valoresResult.data);
      }
      if (actividadesResult.success && actividadesResult.data) {
        setActividadesNivel(actividadesResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: AtributoValor) => {
    try {
      setCreating(true);
      const createData: CreateAtributoValorDTO = {
        IDA: data.IDA,
        VALOR: data.VALOR,
      };

      const result = await createAtributoValor(createData);
      if (result.success && result.data) {
        setAtributoValores((prev) => [...prev, result.data!]);
      } else {
        const errorMessage = result.message || 'Error al crear valor de atributo';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating atributo valor:', error);
      if (!(error instanceof Error && error.message)) {
        toast.error('Error al crear valor de atributo');
      }
      throw error;
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (data: AtributoValor) => {
    try {
      setUpdatingIds((prev) => new Set(prev).add(data.IDAV));
      const updateData: UpdateAtributoValorDTO = {
        IDA: data.IDA,
        VALOR: data.VALOR,
      };

      const result = await updateAtributoValor(data.IDAV, updateData);
      if (result.success && result.data) {
        setAtributoValores((prev) =>
          prev.map((valor) =>
            valor.IDAV === data.IDAV ? result.data! : valor
          )
        );
      } else {
        toast.error(result.message || 'Error al actualizar valor de atributo');
      }
    } catch (error) {
      console.error('Error updating atributo valor:', error);
      toast.error('Error al actualizar valor de atributo');
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(data.IDAV);
        return next;
      });
    }
  };

  const handleDelete = async (data: AtributoValor) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(data.IDAV));
      const result = await deleteAtributoValor(data.IDAV);
      if (result.success) {
        setAtributoValores((prev) =>
          prev.filter((valor) => valor.IDAV !== data.IDAV)
        );
      } else {
        toast.error(result.message || 'Error al eliminar valor de atributo');
      }
    } catch (error) {
      console.error('Error deleting atributo valor:', error);
      toast.error('Error al eliminar valor de atributo');
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(data.IDAV);
        return next;
      });
    }
  };

  const loadingStates: LoadingStates = {
    loading,
    loadingRows: 8,
  };

  const columns = createAtributoValorColumns({ 
    actividadesNivel,
    updatingIds,
    deletingIds,
  });

  return (
    <div className="space-y-4">
      <TankTable
        data={atributoValores}
        columns={columns}
        showPagination={true}
        showAdd={true}
        addButtonLabel="Agregar Valor de Atributo"
        loadingStates={loadingStates}
        exportOptions={{
          formats: ['csv', 'json'],
          filename: 'atributo-valores',
        }}
        onRowSave={handleUpdate}
        onRowDelete={handleDelete}
        createForm={{
          title: 'Agregar Nuevo Valor de Atributo',
          submitLabel: creating ? 'Creando...' : 'Crear',
          cancelLabel: 'Cancelar',
          fields: [
            {
              name: 'IDA',
              label: 'Actividad de Nivel',
              inputType: 'select',
              required: true,
              options: actividadesNivel.map((actividad) => ({
                value: actividad.IDA,
                label: `${actividad.DESCRIPCION} (ID: ${actividad.IDA})`,
              })),
              encode: (v) => String(v),
              decode: (s) => Number(s),
            },
            {
              name: 'VALOR',
              label: 'Valor',
              inputType: 'text',
              required: true,
              placeholder: 'Ingrese el valor',
            },
          ],
          onSubmit: handleCreate,
          successMessage: 'Valor de atributo creado exitosamente',
        }}
        deleteConfirm={{
          title: 'Eliminar Valor de Atributo',
          description: (row) =>
            `¿Está seguro de que desea eliminar el valor "${row.VALOR}"? Esta acción no se puede deshacer.`,
          confirmLabel: 'Eliminar',
          cancelLabel: 'Cancelar',
          successMessage: 'Valor de atributo eliminado exitosamente',
        }}
        updateSuccessMessage="Valor de atributo actualizado exitosamente"
      />
    </div>
  );
}

