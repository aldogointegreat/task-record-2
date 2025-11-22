'use client';

import { useState, useEffect } from 'react';
import { TankTable, type LoadingStates } from '@/lib/utils/tanktable-enhanted';
import { 
  getAllDisciplinasNivel, 
  createDisciplinaNivel, 
  updateDisciplinaNivel, 
  deleteDisciplinaNivel 
} from '@/lib/api';
import type { DisciplinaNivel, CreateDisciplinaNivelDTO, UpdateDisciplinaNivelDTO } from '@/models';
import { createDisciplinaNivelColumns } from './disciplina-nivel-columns';
import { toast } from 'sonner';

export function DisciplinaNivelList() {
  const [data, setData] = useState<DisciplinaNivel[]>([]);
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
      const result = await getAllDisciplinasNivel();
      if (result.success && result.data) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error loading disciplinas nivel:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (item: DisciplinaNivel) => {
    try {
      setCreating(true);
      const createData: CreateDisciplinaNivelDTO = {
        CODIGO: item.CODIGO,
        DESCRIPCION: item.DESCRIPCION,
      };

      const result = await createDisciplinaNivel(createData);
      if (result.success && result.data) {
        setData((prev) => [...prev, result.data!]);
      } else {
        const errorMessage = result.message || 'Error al crear disciplina de nivel';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating disciplina nivel:', error);
      if (!(error instanceof Error && error.message)) {
        toast.error('Error al crear disciplina de nivel');
      }
      throw error;
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (item: DisciplinaNivel) => {
    try {
      setUpdatingIds((prev) => new Set(prev).add(item.ID_DISCIPLINA_NIVEL));
      const updateData: UpdateDisciplinaNivelDTO = {
        CODIGO: item.CODIGO,
        DESCRIPCION: item.DESCRIPCION,
      };

      const result = await updateDisciplinaNivel(item.ID_DISCIPLINA_NIVEL, updateData);
      if (result.success && result.data) {
        setData((prev) =>
          prev.map((d) =>
            d.ID_DISCIPLINA_NIVEL === item.ID_DISCIPLINA_NIVEL ? result.data! : d
          )
        );
      } else {
        toast.error(result.message || 'Error al actualizar');
      }
    } catch (error) {
      console.error('Error updating disciplina nivel:', error);
      toast.error('Error al actualizar');
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(item.ID_DISCIPLINA_NIVEL);
        return next;
      });
    }
  };

  const handleDelete = async (item: DisciplinaNivel) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(item.ID_DISCIPLINA_NIVEL));
      const result = await deleteDisciplinaNivel(item.ID_DISCIPLINA_NIVEL);
      if (result.success) {
        setData((prev) =>
          prev.filter((d) => d.ID_DISCIPLINA_NIVEL !== item.ID_DISCIPLINA_NIVEL)
        );
      } else {
        toast.error(result.message || 'Error al eliminar');
      }
    } catch (error) {
      console.error('Error deleting disciplina nivel:', error);
      toast.error('Error al eliminar');
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(item.ID_DISCIPLINA_NIVEL);
        return next;
      });
    }
  };

  const loadingStates: LoadingStates = {
    loading,
    loadingRows: 8,
  };

  const columns = createDisciplinaNivelColumns({
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
        addButtonLabel="Agregar Disciplina de Nivel"
        loadingStates={loadingStates}
        exportOptions={{
          formats: ['csv', 'json'],
          filename: 'disciplinas-nivel',
        }}
        onRowSave={handleUpdate}
        onRowDelete={handleDelete}
        createForm={{
          title: 'Agregar Nueva Disciplina de Nivel',
          submitLabel: creating ? 'Creando...' : 'Crear',
          cancelLabel: 'Cancelar',
          fields: [
            {
              name: 'CODIGO',
              label: 'Código',
              inputType: 'text',
              required: true,
              placeholder: 'Ej: E, G, I, M',
            },
            {
              name: 'DESCRIPCION',
              label: 'Descripción',
              inputType: 'text',
              required: true,
              placeholder: 'Nombre descriptivo',
            },
          ],
          onSubmit: handleCreate,
          successMessage: 'Disciplina de nivel creada exitosamente',
        }}
        deleteConfirm={{
          title: 'Eliminar Disciplina de Nivel',
          description: (row) =>
            row ? `¿Está seguro de que desea eliminar "${row.CODIGO} - ${row.DESCRIPCION}"? Esta acción no se puede deshacer.` : '¿Está seguro de que desea eliminar este registro? Esta acción no se puede deshacer.',
          confirmLabel: 'Eliminar',
          cancelLabel: 'Cancelar',
          successMessage: 'Disciplina de nivel eliminada exitosamente',
        }}
        updateSuccessMessage="Disciplina de nivel actualizada exitosamente"
      />
    </div>
  );
}


