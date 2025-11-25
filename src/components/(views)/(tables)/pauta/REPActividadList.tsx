'use client';

import { useState, useEffect } from 'react';
import { TankTable, type LoadingStates } from '@/lib/utils/tanktable-enhanted';
import { 
  getAllREPActividad, 
  updateREPActividad, 
  deleteREPActividad,
  getAllREPNivel
} from '@/lib/api';
import type { REPActividad, UpdateREPActividadDTO, REPNivel } from '@/models';
import { createREPActividadColumns } from './rep-actividad-columns';
import { toast } from 'sonner';

export function REPActividadList() {
  const [repActividades, setREPActividades] = useState<REPActividad[]>([]);
  const [repNiveles, setREPNiveles] = useState<REPNivel[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [repActividadResult, repNivelResult] = await Promise.all([
        getAllREPActividad(),
        getAllREPNivel(),
      ]);

      if (repActividadResult.success && repActividadResult.data) {
        setREPActividades(repActividadResult.data);
      }
      if (repNivelResult.success && repNivelResult.data) {
        setREPNiveles(repNivelResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: REPActividad) => {
    try {
      setUpdatingIds((prev) => new Set(prev).add(data.IDRA));
      
      const updateData: UpdateREPActividadDTO = {
        IDRN: data.IDRN,
        ORDEN: data.ORDEN,
        DESCRIPCION: data.DESCRIPCION,
        REFERENCIA: data.REFERENCIA,
        DURACION: data.DURACION,
      };

      const result = await updateREPActividad(data.IDRA, updateData);
      if (result.success && result.data) {
        setREPActividades((prev) =>
          prev.map((item) => (item.IDRA === data.IDRA ? result.data! : item))
        );
      } else {
        const errorMessage = result.message || 'Error al actualizar registro REP_ACTIVIDAD';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error updating REP_ACTIVIDAD:', error);
      if (!(error instanceof Error && error.message)) {
        toast.error('Error al actualizar registro REP_ACTIVIDAD');
      }
      throw error;
    } finally {
      setUpdatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.IDRA);
        return newSet;
      });
    }
  };

  const handleDelete = async (data: REPActividad) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(data.IDRA));
      
      const result = await deleteREPActividad(data.IDRA);
      if (result.success) {
        setREPActividades((prev) => prev.filter((item) => item.IDRA !== data.IDRA));
      } else {
        const errorMessage = result.message || 'Error al eliminar registro REP_ACTIVIDAD';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error deleting REP_ACTIVIDAD:', error);
      if (!(error instanceof Error && error.message)) {
        toast.error('Error al eliminar registro REP_ACTIVIDAD');
      }
      throw error;
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.IDRA);
        return newSet;
      });
    }
  };

  const loadingStates: LoadingStates = {
    loading,
    loadingRows: 8,
  };

  const columns = createREPActividadColumns({ 
    repNiveles,
    updatingIds,
    deletingIds,
  });

  return (
    <div className="space-y-4">
      <TankTable
        data={repActividades}
        columns={columns}
        showPagination={true}
        showAdd={false}
        loadingStates={loadingStates}
        exportOptions={{
          formats: ['csv', 'json'],
          filename: 'rep-actividad',
        }}
        onRowSave={handleUpdate}
        onRowDelete={handleDelete}
        deleteConfirm={{
          title: 'Eliminar Registro REP_ACTIVIDAD',
          description: (row) =>
            `¿Está seguro de que desea eliminar el registro REP_ACTIVIDAD ID ${row?.IDRA}? Esta acción no se puede deshacer.`,
          confirmLabel: 'Eliminar',
          cancelLabel: 'Cancelar',
          successMessage: 'Registro REP_ACTIVIDAD eliminado exitosamente',
        }}
        updateSuccessMessage="Registro REP_ACTIVIDAD actualizado exitosamente"
      />
    </div>
  );
}

