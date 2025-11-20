'use client';

import { useState, useEffect } from 'react';
import { TankTable, type LoadingStates } from '@/lib/utils/tanktable-enhanted';
import { 
  getAllActividadNiveles, 
  createActividadNivel, 
  updateActividadNivel, 
  deleteActividadNivel,
  getAllNiveles,
  getAllAtributos
} from '@/lib/api';
import type { ActividadNivel, CreateActividadNivelDTO, UpdateActividadNivelDTO, Nivel, Atributo } from '@/models';
import { createActividadNivelColumns } from './actividad-nivel-columns';
import { toast } from 'sonner';

export function ActividadNivelList() {
  const [actividadesNivel, setActividadesNivel] = useState<ActividadNivel[]>([]);
  const [niveles, setNiveles] = useState<Nivel[]>([]);
  const [atributos, setAtributos] = useState<Atributo[]>([]);
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
      const [actividadesResult, nivelesResult, atributosResult] = await Promise.all([
        getAllActividadNiveles(),
        getAllNiveles(),
        getAllAtributos(),
      ]);

      if (actividadesResult.success && actividadesResult.data) {
        setActividadesNivel(actividadesResult.data);
      }
      if (nivelesResult.success && nivelesResult.data) {
        setNiveles(nivelesResult.data);
      }
      if (atributosResult.success && atributosResult.data) {
        setAtributos(atributosResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: ActividadNivel) => {
    try {
      setCreating(true);
      const createData: CreateActividadNivelDTO = {
        IDN: data.IDN,
        IDT: data.IDT ?? null,
        ORDEN: data.ORDEN,
        DESCRIPCION: data.DESCRIPCION,
      };

      const result = await createActividadNivel(createData);
      if (result.success && result.data) {
        setActividadesNivel((prev) => [...prev, result.data!]);
      } else {
        const errorMessage = result.message || 'Error al crear actividad de nivel';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating actividad de nivel:', error);
      if (!(error instanceof Error && error.message)) {
        toast.error('Error al crear actividad de nivel');
      }
      throw error;
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (data: ActividadNivel) => {
    try {
      setUpdatingIds((prev) => new Set(prev).add(data.IDA));
      const updateData: UpdateActividadNivelDTO = {
        IDN: data.IDN,
        IDT: data.IDT ?? null,
        ORDEN: data.ORDEN,
        DESCRIPCION: data.DESCRIPCION,
      };

      const result = await updateActividadNivel(data.IDA, updateData);
      if (result.success && result.data) {
        setActividadesNivel((prev) =>
          prev.map((actividad) =>
            actividad.IDA === data.IDA ? result.data! : actividad
          )
        );
      } else {
        toast.error(result.message || 'Error al actualizar actividad de nivel');
      }
    } catch (error) {
      console.error('Error updating actividad de nivel:', error);
      toast.error('Error al actualizar actividad de nivel');
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(data.IDA);
        return next;
      });
    }
  };

  const handleDelete = async (data: ActividadNivel) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(data.IDA));
      const result = await deleteActividadNivel(data.IDA);
      if (result.success) {
        setActividadesNivel((prev) =>
          prev.filter((actividad) => actividad.IDA !== data.IDA)
        );
      } else {
        toast.error(result.message || 'Error al eliminar actividad de nivel');
      }
    } catch (error) {
      console.error('Error deleting actividad de nivel:', error);
      toast.error('Error al eliminar actividad de nivel');
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(data.IDA);
        return next;
      });
    }
  };

  const loadingStates: LoadingStates = {
    loading,
    loadingRows: 8,
  };

  const columns = createActividadNivelColumns({ 
    niveles,
    atributos,
    updatingIds,
    deletingIds,
  });

  return (
    <div className="space-y-4">
      <TankTable
        data={actividadesNivel}
        columns={columns}
        showPagination={true}
        showAdd={true}
        addButtonLabel="Agregar Actividad de Nivel"
        loadingStates={loadingStates}
        exportOptions={{
          formats: ['csv', 'json'],
          filename: 'actividades-nivel',
        }}
        onRowSave={handleUpdate}
        onRowDelete={handleDelete}
        createForm={{
          title: 'Agregar Nueva Actividad de Nivel',
          submitLabel: creating ? 'Creando...' : 'Crear',
          cancelLabel: 'Cancelar',
          fields: [
            {
              name: 'DESCRIPCION',
              label: 'Descripción',
              inputType: 'text',
              required: true,
              placeholder: 'Ingrese la descripción de la actividad',
            },
            {
              name: 'IDN',
              label: 'Nivel',
              inputType: 'select',
              required: true,
              options: niveles.map((nivel) => ({
                value: nivel.IDN,
                label: `${nivel.NOMBRE} (ID: ${nivel.IDN})`,
              })),
              encode: (v) => String(v),
              decode: (s) => Number(s),
            },
            {
              name: 'IDT',
              label: 'Atributo',
              inputType: 'select',
              options: [
                { value: null, label: 'Sin atributo' },
                ...atributos.map((atributo) => ({
                  value: atributo.IDT,
                  label: atributo.DESCRIPCION,
                })),
              ],
              encode: (v) => (v === null || v === undefined ? '__null__' : String(v)),
              decode: (s) => (s === '__null__' ? null : Number(s)),
            },
            {
              name: 'ORDEN',
              label: 'Orden',
              inputType: 'number',
              required: true,
              placeholder: '1',
            },
          ],
          onSubmit: handleCreate,
          successMessage: 'Actividad de nivel creada exitosamente',
        }}
        deleteConfirm={{
          title: 'Eliminar Actividad de Nivel',
          description: (row) =>
            `¿Está seguro de que desea eliminar la actividad "${row.DESCRIPCION}"? Esta acción no se puede deshacer.`,
          confirmLabel: 'Eliminar',
          cancelLabel: 'Cancelar',
          successMessage: 'Actividad de nivel eliminada exitosamente',
        }}
        updateSuccessMessage="Actividad de nivel actualizada exitosamente"
      />
    </div>
  );
}

