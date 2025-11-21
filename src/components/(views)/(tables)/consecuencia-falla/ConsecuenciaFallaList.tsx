'use client';

import { useState, useEffect } from 'react';
import { TankTable, type LoadingStates } from '@/lib/utils/tanktable-enhanted';
import { 
  getAllConsecuenciasFalla, 
  createConsecuenciaFalla, 
  updateConsecuenciaFalla, 
  deleteConsecuenciaFalla
} from '@/lib/api';
import type { ConsecuenciaFalla, CreateConsecuenciaFallaDTO, UpdateConsecuenciaFallaDTO } from '@/models';
import { createConsecuenciaFallaColumns } from './consecuencia-falla-columns';
import { toast } from 'sonner';

export function ConsecuenciaFallaList() {
  const [data, setData] = useState<ConsecuenciaFalla[]>([]);
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
      const result = await getAllConsecuenciasFalla();
      if (result.success && result.data) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (item: ConsecuenciaFalla) => {
    try {
      setCreating(true);
      const createData: CreateConsecuenciaFallaDTO = {
        CODIGO: item.CODIGO,
        NOMBRE: item.NOMBRE,
      };

      const result = await createConsecuenciaFalla(createData);
      if (result.success && result.data) {
        setData((prev) => [...prev, result.data!]);
      } else {
        const errorMessage = result.message || 'Error al crear consecuencia de falla';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating:', error);
      if (!(error instanceof Error && error.message)) {
        toast.error('Error al crear consecuencia de falla');
      }
      throw error;
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (item: ConsecuenciaFalla) => {
    try {
      setUpdatingIds((prev) => new Set(prev).add(item.ID_CONSECUENCIA));
      const updateData: UpdateConsecuenciaFallaDTO = {
        CODIGO: item.CODIGO,
        NOMBRE: item.NOMBRE,
      };

      const result = await updateConsecuenciaFalla(item.ID_CONSECUENCIA, updateData);
      if (result.success && result.data) {
        setData((prev) =>
          prev.map((d) =>
            d.ID_CONSECUENCIA === item.ID_CONSECUENCIA ? result.data! : d
          )
        );
      } else {
        toast.error(result.message || 'Error al actualizar');
      }
    } catch (error) {
      console.error('Error updating:', error);
      toast.error('Error al actualizar');
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(item.ID_CONSECUENCIA);
        return next;
      });
    }
  };

  const handleDelete = async (item: ConsecuenciaFalla) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(item.ID_CONSECUENCIA));
      const result = await deleteConsecuenciaFalla(item.ID_CONSECUENCIA);
      if (result.success) {
        setData((prev) =>
          prev.filter((d) => d.ID_CONSECUENCIA !== item.ID_CONSECUENCIA)
        );
      } else {
        toast.error(result.message || 'Error al eliminar');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Error al eliminar');
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(item.ID_CONSECUENCIA);
        return next;
      });
    }
  };

  const loadingStates: LoadingStates = {
    loading,
    loadingRows: 8,
  };

  const columns = createConsecuenciaFallaColumns({ 
    updatingIds,
    deletingIds,
  });

  return (
    <div className="space-y-4">
      <TankTable
        data={data}
        columns={columns}
        showPagination={true}
        showAdd={true}
        addButtonLabel="Agregar Consecuencia de Falla"
        loadingStates={loadingStates}
        exportOptions={{
          formats: ['csv', 'json'],
          filename: 'consecuencias-falla',
        }}
        onRowSave={handleUpdate}
        onRowDelete={handleDelete}
        createForm={{
          title: 'Agregar Nueva Consecuencia de Falla',
          submitLabel: creating ? 'Creando...' : 'Crear',
          cancelLabel: 'Cancelar',
          fields: [
            {
              name: 'CODIGO',
              label: 'Código',
              inputType: 'text',
              required: true,
              placeholder: 'Ej: O, E, H, N, S',
            },
            {
              name: 'NOMBRE',
              label: 'Nombre',
              inputType: 'text',
              required: true,
              placeholder: 'Nombre descriptivo',
            },
          ],
          onSubmit: handleCreate,
          successMessage: 'Consecuencia de falla creada exitosamente',
        }}
        deleteConfirm={{
          title: 'Eliminar Consecuencia de Falla',
          description: (row) =>
            `¿Está seguro de que desea eliminar "${row.CODIGO} - ${row.NOMBRE}"? Esta acción no se puede deshacer.`,
          confirmLabel: 'Eliminar',
          cancelLabel: 'Cancelar',
          successMessage: 'Consecuencia de falla eliminada exitosamente',
        }}
        updateSuccessMessage="Consecuencia de falla actualizada exitosamente"
      />
    </div>
  );
}

