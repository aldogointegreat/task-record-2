'use client';

import { useState, useEffect } from 'react';
import { TankTable, type LoadingStates } from '@/lib/utils/tanktable-enhanted';
import { 
  getAllREPNivel, 
  updateREPNivel, 
  deleteREPNivel,
  getAllPM,
  getAllNiveles
} from '@/lib/api';
import type { REPNivel, UpdateREPNivelDTO, PM, Nivel } from '@/models';
import { createREPNivelColumns } from './rep-nivel-columns';
import { toast } from 'sonner';

export function REPNivelList() {
  const [repNiveles, setREPNiveles] = useState<REPNivel[]>([]);
  const [pms, setPMs] = useState<PM[]>([]);
  const [niveles, setNiveles] = useState<Nivel[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [repNivelResult, pmResult, nivelesResult] = await Promise.all([
        getAllREPNivel(),
        getAllPM(),
        getAllNiveles(),
      ]);

      if (repNivelResult.success && repNivelResult.data) {
        setREPNiveles(repNivelResult.data);
      }
      if (pmResult.success && pmResult.data) {
        setPMs(pmResult.data);
      }
      if (nivelesResult.success && nivelesResult.data) {
        setNiveles(nivelesResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: REPNivel) => {
    try {
      setUpdatingIds((prev) => new Set(prev).add(data.IDRN));
      
      const updateData: UpdateREPNivelDTO = {
        IDPM: data.IDPM,
        IDN: data.IDN,
        IDJ: data.IDJ,
        IDNP: data.IDNP ?? null,
        DESCRIPCION: data.DESCRIPCION,
      };

      const result = await updateREPNivel(data.IDRN, updateData);
      if (result.success && result.data) {
        setREPNiveles((prev) =>
          prev.map((item) => (item.IDRN === data.IDRN ? result.data! : item))
        );
      } else {
        const errorMessage = result.message || 'Error al actualizar registro REP_NIVEL';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error updating REP_NIVEL:', error);
      if (!(error instanceof Error && error.message)) {
        toast.error('Error al actualizar registro REP_NIVEL');
      }
      throw error;
    } finally {
      setUpdatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.IDRN);
        return newSet;
      });
    }
  };

  const handleDelete = async (data: REPNivel) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(data.IDRN));
      
      const result = await deleteREPNivel(data.IDRN);
      if (result.success) {
        setREPNiveles((prev) => prev.filter((item) => item.IDRN !== data.IDRN));
      } else {
        const errorMessage = result.message || 'Error al eliminar registro REP_NIVEL';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error deleting REP_NIVEL:', error);
      if (!(error instanceof Error && error.message)) {
        toast.error('Error al eliminar registro REP_NIVEL');
      }
      throw error;
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.IDRN);
        return newSet;
      });
    }
  };

  const loadingStates: LoadingStates = {
    loading,
    loadingRows: 8,
  };

  const columns = createREPNivelColumns({ 
    pms,
    niveles,
    updatingIds,
    deletingIds,
  });

  return (
    <div className="space-y-4">
      <TankTable
        data={repNiveles}
        columns={columns}
        showPagination={true}
        showAdd={false}
        loadingStates={loadingStates}
        exportOptions={{
          formats: ['csv', 'json'],
          filename: 'rep-nivel',
        }}
        onRowSave={handleUpdate}
        onRowDelete={handleDelete}
        deleteConfirm={{
          title: 'Eliminar Registro REP_NIVEL',
          description: (row) =>
            `¿Está seguro de que desea eliminar el registro REP_NIVEL ID ${row?.IDRN}? Esta acción no se puede deshacer.`,
          confirmLabel: 'Eliminar',
          cancelLabel: 'Cancelar',
          successMessage: 'Registro REP_NIVEL eliminado exitosamente',
        }}
        updateSuccessMessage="Registro REP_NIVEL actualizado exitosamente"
      />
    </div>
  );
}

