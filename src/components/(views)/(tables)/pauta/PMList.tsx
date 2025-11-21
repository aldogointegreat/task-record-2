'use client';

import { useState, useEffect } from 'react';
import { TankTable, type LoadingStates } from '@/lib/utils/tanktable-enhanted';
import { 
  getAllPM, 
  createPM, 
  updatePM, 
  deletePM,
  getAllNiveles
} from '@/lib/api';
import type { PM, CreatePMDTO, UpdatePMDTO, Nivel } from '@/models';
import { createPMColumns } from './pm-columns';
import { toast } from 'sonner';

export function PMList() {
  const [pms, setPMs] = useState<PM[]>([]);
  const [niveles, setNiveles] = useState<Nivel[]>([]);
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
      const [pmResult, nivelesResult] = await Promise.all([
        getAllPM(),
        getAllNiveles(),
      ]);

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

  const handleCreate = async (data: PM) => {
    try {
      setCreating(true);
      
      // Formatear fechas correctamente para SQL Server
      const formatDate = (date: Date | string | undefined): string => {
        if (!date) return '';
        if (date instanceof Date) {
          return date.toISOString();
        }
        if (typeof date === 'string') {
          // Si ya es una fecha ISO, devolverla
          if (date.includes('T')) return date;
          // Si es solo fecha (yyyy-MM-dd), agregar hora
          if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return `${date}T00:00:00`;
          }
          return date;
        }
        return '';
      };

      const createData: CreatePMDTO = {
        IDN: data.IDN,
        NRO: data.NRO,
        CONJUNTO: data.CONJUNTO,
        PROGRAMACION: formatDate(data.PROGRAMACION),
        ESTADO: data.ESTADO,
        HOROMETRO: data.HOROMETRO ?? 0,
        INICIO: formatDate(data.INICIO),
        FIN: formatDate(data.FIN),
      };

      const result = await createPM(createData);
      if (result.success && result.data) {
        setPMs((prev) => [...prev, result.data!]);
      } else {
        const errorMessage = result.message || 'Error al crear registro PM';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating PM:', error);
      if (!(error instanceof Error && error.message)) {
        toast.error('Error al crear registro PM');
      }
      throw error;
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (data: PM) => {
    try {
      setUpdatingIds((prev) => new Set(prev).add(data.IDPM));
      
      // Formatear fechas correctamente para SQL Server
      const formatDate = (date: Date | string | undefined): string => {
        if (!date) return '';
        if (date instanceof Date) {
          return date.toISOString();
        }
        if (typeof date === 'string') {
          // Si ya es una fecha ISO, devolverla
          if (date.includes('T')) return date;
          // Si es solo fecha (yyyy-MM-dd), agregar hora
          if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return `${date}T00:00:00`;
          }
          return date;
        }
        return '';
      };

      const updateData: UpdatePMDTO = {
        IDN: data.IDN,
        NRO: data.NRO,
        CONJUNTO: data.CONJUNTO,
        PROGRAMACION: formatDate(data.PROGRAMACION),
        ESTADO: data.ESTADO,
        HOROMETRO: data.HOROMETRO,
        INICIO: formatDate(data.INICIO),
        FIN: formatDate(data.FIN),
      };

      const result = await updatePM(data.IDPM, updateData);
      if (result.success && result.data) {
        setPMs((prev) =>
          prev.map((pm) =>
            pm.IDPM === data.IDPM ? result.data! : pm
          )
        );
      } else {
        toast.error(result.message || 'Error al actualizar registro PM');
      }
    } catch (error) {
      console.error('Error updating PM:', error);
      toast.error('Error al actualizar registro PM');
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(data.IDPM);
        return next;
      });
    }
  };

  const handleDelete = async (data: PM) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(data.IDPM));
      const result = await deletePM(data.IDPM);
      if (result.success) {
        setPMs((prev) =>
          prev.filter((pm) => pm.IDPM !== data.IDPM)
        );
      } else {
        toast.error(result.message || 'Error al eliminar registro PM');
      }
    } catch (error) {
      console.error('Error deleting PM:', error);
      toast.error('Error al eliminar registro PM');
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(data.IDPM);
        return next;
      });
    }
  };

  const loadingStates: LoadingStates = {
    loading,
    loadingRows: 8,
  };

  const columns = createPMColumns({ 
    niveles,
    updatingIds,
    deletingIds,
  });

  return (
    <div className="space-y-4">
      <TankTable
        data={pms}
        columns={columns}
        showPagination={true}
        showAdd={true}
        addButtonLabel="Agregar PM"
        loadingStates={loadingStates}
        exportOptions={{
          formats: ['csv', 'json'],
          filename: 'pm',
        }}
        onRowSave={handleUpdate}
        onRowDelete={handleDelete}
        createForm={{
          title: 'Agregar Nuevo Registro PM',
          submitLabel: creating ? 'Creando...' : 'Crear',
          cancelLabel: 'Cancelar',
          fields: [
            {
              name: 'IDN',
              label: 'IDN',
              inputType: 'select',
              required: true,
              options: niveles.map((nivel) => ({
                value: nivel.IDN,
                label: `${nivel.IDN} - ${nivel.NOMBRE}`,
              })),
              encode: (v) => String(v),
              decode: (s) => Number(s),
            },
            {
              name: 'NRO',
              label: 'NRO',
              inputType: 'number',
              required: true,
              placeholder: 'Ingrese el número',
            },
            {
              name: 'CONJUNTO',
              label: 'CONJUNTO',
              inputType: 'number',
              required: true,
              placeholder: 'Ingrese el conjunto',
            },
            {
              name: 'PROGRAMACION',
              label: 'PROGRAMACION',
              inputType: 'date',
              required: true,
            },
            {
              name: 'ESTADO',
              label: 'ESTADO',
              inputType: 'select',
              required: true,
              options: [
                { value: 'COMPLETADO', label: 'COMPLETADO' },
                { value: 'PENDIENTE', label: 'PENDIENTE' },
              ],
              encode: (v) => String(v),
              decode: (s) => s,
            },
            {
              name: 'HOROMETRO',
              label: 'HOROMETRO',
              inputType: 'number',
              required: false,
              placeholder: 'Ingrese el horómetro (default: 0)',
            },
            {
              name: 'INICIO',
              label: 'INICIO',
              inputType: 'date',
              required: true,
            },
            {
              name: 'FIN',
              label: 'FIN',
              inputType: 'date',
              required: true,
            },
          ],
          onSubmit: handleCreate,
          successMessage: 'Registro PM creado exitosamente',
        }}
        deleteConfirm={{
          title: 'Eliminar Registro PM',
          description: (row) =>
            `¿Está seguro de que desea eliminar el registro PM ID ${row?.IDPM}? Esta acción no se puede deshacer.`,
          confirmLabel: 'Eliminar',
          cancelLabel: 'Cancelar',
          successMessage: 'Registro PM eliminado exitosamente',
        }}
        updateSuccessMessage="Registro PM actualizado exitosamente"
      />
    </div>
  );
}

