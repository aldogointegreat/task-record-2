'use client';

import { useState, useEffect } from 'react';
import { TankTable, type LoadingStates } from '@/lib/utils/tanktable-enhanted';
import { 
  getAllClasesMantencion, 
  createClaseMantencion, 
  updateClaseMantencion, 
  deleteClaseMantencion
} from '@/lib/api';
import type { ClaseMantencion, CreateClaseMantencionDTO, UpdateClaseMantencionDTO } from '@/models';
import { createClaseMantencionColumns } from './clase-mantencion-columns';
import { toast } from 'sonner';

export function ClaseMantencionList() {
  const [data, setData] = useState<ClaseMantencion[]>([]);
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
      const result = await getAllClasesMantencion();
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

  const handleCreate = async (item: ClaseMantencion) => {
    try {
      setCreating(true);
      const createData: CreateClaseMantencionDTO = {
        CODIGO: item.CODIGO,
        NOMBRE: item.NOMBRE,
      };

      const result = await createClaseMantencion(createData);
      if (result.success && result.data) {
        setData((prev) => [...prev, result.data!]);
      } else {
        const errorMessage = result.message || 'Error al crear clase de mantención';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating:', error);
      if (!(error instanceof Error && error.message)) {
        toast.error('Error al crear clase de mantención');
      }
      throw error;
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (item: ClaseMantencion) => {
    try {
      setUpdatingIds((prev) => new Set(prev).add(item.ID_CLASE));
      const updateData: UpdateClaseMantencionDTO = {
        CODIGO: item.CODIGO,
        NOMBRE: item.NOMBRE,
      };

      const result = await updateClaseMantencion(item.ID_CLASE, updateData);
      if (result.success && result.data) {
        setData((prev) =>
          prev.map((d) =>
            d.ID_CLASE === item.ID_CLASE ? result.data! : d
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
        next.delete(item.ID_CLASE);
        return next;
      });
    }
  };

  const handleDelete = async (item: ClaseMantencion) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(item.ID_CLASE));
      const result = await deleteClaseMantencion(item.ID_CLASE);
      if (result.success) {
        setData((prev) =>
          prev.filter((d) => d.ID_CLASE !== item.ID_CLASE)
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
        next.delete(item.ID_CLASE);
        return next;
      });
    }
  };

  const loadingStates: LoadingStates = {
    loading,
    loadingRows: 8,
  };

  const columns = createClaseMantencionColumns({ 
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
        addButtonLabel="Agregar Clase de Mantención"
        loadingStates={loadingStates}
        exportOptions={{
          formats: ['csv', 'json'],
          filename: 'clases-mantencion',
        }}
        onRowSave={handleUpdate}
        onRowDelete={handleDelete}
        createForm={{
          title: 'Agregar Nueva Clase de Mantención',
          submitLabel: creating ? 'Creando...' : 'Crear',
          cancelLabel: 'Cancelar',
          fields: [
            {
              name: 'CODIGO',
              label: 'Código',
              inputType: 'text',
              required: true,
              placeholder: 'Ej: OHF, PDM, REEM, REST, TAREA',
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
          successMessage: 'Clase de mantención creada exitosamente',
        }}
        deleteConfirm={{
          title: 'Eliminar Clase de Mantención',
          description: (row) =>
            `¿Está seguro de que desea eliminar "${row.CODIGO} - ${row.NOMBRE}"? Esta acción no se puede deshacer.`,
          confirmLabel: 'Eliminar',
          cancelLabel: 'Cancelar',
          successMessage: 'Clase de mantención eliminada exitosamente',
        }}
        updateSuccessMessage="Clase de mantención actualizada exitosamente"
      />
    </div>
  );
}

