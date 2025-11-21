'use client';

import { useState, useEffect } from 'react';
import { TankTable, type LoadingStates } from '@/lib/utils/tanktable-enhanted';
import { 
  getAllDisciplinasTarea, 
  createDisciplinaTarea, 
  updateDisciplinaTarea, 
  deleteDisciplinaTarea
} from '@/lib/api';
import type { DisciplinaTarea, CreateDisciplinaTareaDTO, UpdateDisciplinaTareaDTO } from '@/models';
import { createDisciplinaTareaColumns } from './disciplina-tarea-columns';
import { toast } from 'sonner';

export function DisciplinaTareaList() {
  const [data, setData] = useState<DisciplinaTarea[]>([]);
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
      const result = await getAllDisciplinasTarea();
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

  const handleCreate = async (item: DisciplinaTarea) => {
    try {
      setCreating(true);
      const createData: CreateDisciplinaTareaDTO = {
        CODIGO: item.CODIGO,
        NOMBRE: item.NOMBRE,
      };

      const result = await createDisciplinaTarea(createData);
      if (result.success && result.data) {
        setData((prev) => [...prev, result.data!]);
      } else {
        const errorMessage = result.message || 'Error al crear disciplina de tarea';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating:', error);
      if (!(error instanceof Error && error.message)) {
        toast.error('Error al crear disciplina de tarea');
      }
      throw error;
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (item: DisciplinaTarea) => {
    try {
      setUpdatingIds((prev) => new Set(prev).add(item.ID_DISCIPLINA_TAREA));
      const updateData: UpdateDisciplinaTareaDTO = {
        CODIGO: item.CODIGO,
        NOMBRE: item.NOMBRE,
      };

      const result = await updateDisciplinaTarea(item.ID_DISCIPLINA_TAREA, updateData);
      if (result.success && result.data) {
        setData((prev) =>
          prev.map((d) =>
            d.ID_DISCIPLINA_TAREA === item.ID_DISCIPLINA_TAREA ? result.data! : d
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
        next.delete(item.ID_DISCIPLINA_TAREA);
        return next;
      });
    }
  };

  const handleDelete = async (item: DisciplinaTarea) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(item.ID_DISCIPLINA_TAREA));
      const result = await deleteDisciplinaTarea(item.ID_DISCIPLINA_TAREA);
      if (result.success) {
        setData((prev) =>
          prev.filter((d) => d.ID_DISCIPLINA_TAREA !== item.ID_DISCIPLINA_TAREA)
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
        next.delete(item.ID_DISCIPLINA_TAREA);
        return next;
      });
    }
  };

  const loadingStates: LoadingStates = {
    loading,
    loadingRows: 8,
  };

  const columns = createDisciplinaTareaColumns({ 
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
        addButtonLabel="Agregar Disciplina de Tarea"
        loadingStates={loadingStates}
        exportOptions={{
          formats: ['csv', 'json'],
          filename: 'disciplinas-tarea',
        }}
        onRowSave={handleUpdate}
        onRowDelete={handleDelete}
        createForm={{
          title: 'Agregar Nueva Disciplina de Tarea',
          submitLabel: creating ? 'Creando...' : 'Crear',
          cancelLabel: 'Cancelar',
          fields: [
            {
              name: 'CODIGO',
              label: 'Código',
              inputType: 'text',
              required: true,
              placeholder: 'Ej: MEC_CHANC, ELEC, INST',
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
          successMessage: 'Disciplina de tarea creada exitosamente',
        }}
        deleteConfirm={{
          title: 'Eliminar Disciplina de Tarea',
          description: (row) =>
            `¿Está seguro de que desea eliminar "${row.CODIGO} - ${row.NOMBRE}"? Esta acción no se puede deshacer.`,
          confirmLabel: 'Eliminar',
          cancelLabel: 'Cancelar',
          successMessage: 'Disciplina de tarea eliminada exitosamente',
        }}
        updateSuccessMessage="Disciplina de tarea actualizada exitosamente"
      />
    </div>
  );
}

