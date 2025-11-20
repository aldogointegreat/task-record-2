'use client';

import { useState, useEffect } from 'react';
import { TankTable, type LoadingStates } from '@/lib/utils/tanktable-enhanted';
import { 
  getAllNiveles, 
  createNivel, 
  updateNivel, 
  deleteNivel,
  getAllJerarquias
} from '@/lib/api';
import type { Nivel, CreateNivelDTO, UpdateNivelDTO, Jerarquia } from '@/models';
import { createNivelColumns } from './nivel-columns';
import { toast } from 'sonner';

export function NivelList() {
  const [niveles, setNiveles] = useState<Nivel[]>([]);
  const [jerarquias, setJerarquias] = useState<Jerarquia[]>([]);
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
      const [nivelesResult, jerarquiasResult] = await Promise.all([
        getAllNiveles(),
        getAllJerarquias(),
      ]);

      if (nivelesResult.success && nivelesResult.data) {
        setNiveles(nivelesResult.data);
      }
      if (jerarquiasResult.success && jerarquiasResult.data) {
        setJerarquias(jerarquiasResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: Nivel) => {
    try {
      setCreating(true);
      const createData: CreateNivelDTO = {
        IDJ: data.IDJ,
        IDNP: data.IDNP ?? null,
        NOMBRE: data.NOMBRE,
        PLANTILLA: data.PLANTILLA ?? false,
        NROPM: data.NROPM ?? 0,
        ICONO: data.ICONO,
        GENERADO: data.GENERADO ?? false,
        COMENTARIO: data.COMENTARIO,
        ID_USR: data.ID_USR,
        // FECHA_CREACION usually auto-generated
      };

      const result = await createNivel(createData);
      if (result.success && result.data) {
        setNiveles((prev) => [...prev, result.data!]);
      } else {
        const errorMessage = result.message || 'Error al crear nivel';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating nivel:', error);
      if (!(error instanceof Error && error.message)) {
        toast.error('Error al crear nivel');
      }
      throw error;
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (data: Nivel) => {
    try {
      setUpdatingIds((prev) => new Set(prev).add(data.IDN));
      const updateData: UpdateNivelDTO = {
        IDJ: data.IDJ,
        IDNP: data.IDNP ?? null,
        NOMBRE: data.NOMBRE,
        PLANTILLA: data.PLANTILLA,
        NROPM: data.NROPM,
        ICONO: data.ICONO,
        GENERADO: data.GENERADO,
        COMENTARIO: data.COMENTARIO,
        ID_USR: data.ID_USR,
      };

      const result = await updateNivel(data.IDN, updateData);
      if (result.success && result.data) {
        setNiveles((prev) =>
          prev.map((nivel) =>
            nivel.IDN === data.IDN ? result.data! : nivel
          )
        );
      } else {
        toast.error(result.message || 'Error al actualizar nivel');
      }
    } catch (error) {
      console.error('Error updating nivel:', error);
      toast.error('Error al actualizar nivel');
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(data.IDN);
        return next;
      });
    }
  };

  const handleDelete = async (data: Nivel) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(data.IDN));
      const result = await deleteNivel(data.IDN);
      if (result.success) {
        setNiveles((prev) =>
          prev.filter((nivel) => nivel.IDN !== data.IDN)
        );
      } else {
        toast.error(result.message || 'Error al eliminar nivel');
      }
    } catch (error) {
      console.error('Error deleting nivel:', error);
      toast.error('Error al eliminar nivel');
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(data.IDN);
        return next;
      });
    }
  };

  const loadingStates: LoadingStates = {
    loading,
    loadingRows: 8,
  };

  const columns = createNivelColumns({ 
    jerarquias,
    niveles,
    updatingIds,
    deletingIds,
  });

  return (
    <div className="space-y-4">
      <TankTable
        data={niveles}
        columns={columns}
        showPagination={true}
        showAdd={true}
        addButtonLabel="Agregar Nivel"
        loadingStates={loadingStates}
        exportOptions={{
          formats: ['csv', 'json'],
          filename: 'niveles',
        }}
        onRowSave={handleUpdate}
        onRowDelete={handleDelete}
        createForm={{
          title: 'Agregar Nuevo Nivel',
          submitLabel: creating ? 'Creando...' : 'Crear',
          cancelLabel: 'Cancelar',
          fields: [
            {
              name: 'NOMBRE',
              label: 'Nombre',
              inputType: 'text',
              required: true,
              placeholder: 'Ingrese el nombre del nivel',
            },
            {
              name: 'IDJ',
              label: 'Jerarquía',
              inputType: 'select',
              required: true,
              options: jerarquias.map((jer) => ({
                value: jer.IDJ,
                label: jer.DESCRIPCION,
              })),
              encode: (v) => String(v),
              decode: (s) => Number(s),
            },
            {
              name: 'IDNP',
              label: 'Nivel Padre',
              inputType: 'select',
              options: [
                { value: null, label: 'Sin nivel padre (Raíz)' },
                ...niveles.map((nivel) => ({
                  value: nivel.IDN,
                  label: `${nivel.NOMBRE} (${nivel.IDN})`,
                })),
              ],
              encode: (v) => (v === null || v === undefined ? '__null__' : String(v)),
              decode: (s) => (s === '__null__' ? null : Number(s)),
            },
            {
              name: 'PLANTILLA',
              label: 'Plantilla',
              inputType: 'checkbox',
            },
            {
              name: 'GENERADO',
              label: 'Generado',
              inputType: 'checkbox',
            },
            {
              name: 'NROPM',
              label: 'Número de PM',
              inputType: 'number',
              placeholder: '0',
            },
            {
              name: 'COMENTARIO',
              label: 'Comentario',
              inputType: 'textarea',
              placeholder: 'Comentario opcional',
            },
            {
              name: 'ID_USR',
              label: 'ID Usuario',
              inputType: 'number',
              placeholder: 'ID de usuario',
            },
            {
              name: 'ICONO',
              label: 'Ícono',
              inputType: 'icon',
              placeholder: 'Seleccionar ícono...',
            },
          ],
          onSubmit: handleCreate,
          successMessage: 'Nivel creado exitosamente',
        }}
        deleteConfirm={{
          title: 'Eliminar Nivel',
          description: (row) =>
            `¿Está seguro de que desea eliminar el nivel "${row.NOMBRE}"? Esta acción no se puede deshacer.`,
          confirmLabel: 'Eliminar',
          cancelLabel: 'Cancelar',
          successMessage: 'Nivel eliminado exitosamente',
        }}
        updateSuccessMessage="Nivel actualizado exitosamente"
      />
    </div>
  );
}
