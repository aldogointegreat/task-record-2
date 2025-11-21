'use client';

import { useState, useEffect } from 'react';
import { TankTable, type LoadingStates } from '@/lib/utils/tanktable-enhanted';
import { 
  getAllCondicionesAcceso, 
  createCondicionAcceso, 
  updateCondicionAcceso, 
  deleteCondicionAcceso
} from '@/lib/api';
import type { CondicionAcceso, CreateCondicionAccesoDTO, UpdateCondicionAccesoDTO } from '@/models';
import { createCondicionAccesoColumns } from './condicion-acceso-columns';
import { toast } from 'sonner';

export function CondicionAccesoList() {
  const [data, setData] = useState<CondicionAcceso[]>([]);
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
      const result = await getAllCondicionesAcceso();
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

  const handleCreate = async (item: CondicionAcceso) => {
    try {
      setCreating(true);
      const createData: CreateCondicionAccesoDTO = {
        CODIGO: item.CODIGO,
        NOMBRE: item.NOMBRE,
      };

      const result = await createCondicionAcceso(createData);
      if (result.success && result.data) {
        setData((prev) => [...prev, result.data!]);
      } else {
        const errorMessage = result.message || 'Error al crear condición de acceso';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating:', error);
      if (!(error instanceof Error && error.message)) {
        toast.error('Error al crear condición de acceso');
      }
      throw error;
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (item: CondicionAcceso) => {
    try {
      setUpdatingIds((prev) => new Set(prev).add(item.ID_CONDICION));
      const updateData: UpdateCondicionAccesoDTO = {
        CODIGO: item.CODIGO,
        NOMBRE: item.NOMBRE,
      };

      const result = await updateCondicionAcceso(item.ID_CONDICION, updateData);
      if (result.success && result.data) {
        setData((prev) =>
          prev.map((d) =>
            d.ID_CONDICION === item.ID_CONDICION ? result.data! : d
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
        next.delete(item.ID_CONDICION);
        return next;
      });
    }
  };

  const handleDelete = async (item: CondicionAcceso) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(item.ID_CONDICION));
      const result = await deleteCondicionAcceso(item.ID_CONDICION);
      if (result.success) {
        setData((prev) =>
          prev.filter((d) => d.ID_CONDICION !== item.ID_CONDICION)
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
        next.delete(item.ID_CONDICION);
        return next;
      });
    }
  };

  const loadingStates: LoadingStates = {
    loading,
    loadingRows: 8,
  };

  const columns = createCondicionAccesoColumns({ 
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
        addButtonLabel="Agregar Condición de Acceso"
        loadingStates={loadingStates}
        exportOptions={{
          formats: ['csv', 'json'],
          filename: 'condiciones-acceso',
        }}
        onRowSave={handleUpdate}
        onRowDelete={handleDelete}
        createForm={{
          title: 'Agregar Nueva Condición de Acceso',
          submitLabel: creating ? 'Creando...' : 'Crear',
          cancelLabel: 'Cancelar',
          fields: [
            {
              name: 'CODIGO',
              label: 'Código',
              inputType: 'text',
              required: true,
              placeholder: 'Ej: ED, EF',
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
          successMessage: 'Condición de acceso creada exitosamente',
        }}
        deleteConfirm={{
          title: 'Eliminar Condición de Acceso',
          description: (row) =>
            `¿Está seguro de que desea eliminar "${row.CODIGO} - ${row.NOMBRE}"? Esta acción no se puede deshacer.`,
          confirmLabel: 'Eliminar',
          cancelLabel: 'Cancelar',
          successMessage: 'Condición de acceso eliminada exitosamente',
        }}
        updateSuccessMessage="Condición de acceso actualizada exitosamente"
      />
    </div>
  );
}

