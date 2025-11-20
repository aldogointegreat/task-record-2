'use client';

import { useState, useEffect } from 'react';
import { TankTable, type LoadingStates } from '@/lib/utils/tanktable-enhanted';
import { getAllJerarquias, createJerarquia, updateJerarquia, deleteJerarquia } from '@/lib/api';
import type { Jerarquia } from '@/models';
import { jerarquiaColumns } from './jerarquia-columns';
import { toast } from 'sonner';

export function JerarquiaList() {
  const [jerarquias, setJerarquias] = useState<Jerarquia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJerarquias();
  }, []);

  const loadJerarquias = async () => {
    setLoading(true);
    const result = await getAllJerarquias();
    if (result.success && result.data) {
      setJerarquias(result.data);
    }
    setLoading(false);
  };

  const handleCreate = async (data: Record<string, unknown>) => {
    try {
      const result = await createJerarquia({
        DESCRIPCION: data.DESCRIPCION as string,
        COLOR: data.COLOR as string,
      });

      if (result.success) {
        toast.success('Jerarquía creada exitosamente');
        loadJerarquias();
      } else {
        toast.error(result.message || 'Error al crear jerarquía');
      }
    } catch (error) {
      toast.error('Error al crear jerarquía');
    }
  };

  const handleUpdate = async (row: Jerarquia) => {
    try {
      const result = await updateJerarquia(row.IDJ, {
        DESCRIPCION: row.DESCRIPCION,
        COLOR: row.COLOR,
      });

      if (result.success) {
        toast.success('Jerarquía actualizada exitosamente');
        loadJerarquias();
      } else {
        toast.error(result.message || 'Error al actualizar jerarquía');
      }
    } catch (error) {
      toast.error('Error al actualizar jerarquía');
    }
  };

  const handleDelete = async (row: Jerarquia) => {
    try {
      const result = await deleteJerarquia(row.IDJ);
      
      if (result.success) {
        toast.success('Jerarquía eliminada exitosamente');
        loadJerarquias();
      } else {
        toast.error(result.message || 'Error al eliminar jerarquía');
      }
    } catch (error) {
      toast.error('Error al eliminar jerarquía');
    }
  };

  const loadingStates: LoadingStates = {
    loading,
    loadingRows: 8,
  };

  return (
    <div className="space-y-4">
      <TankTable
        data={jerarquias}
        columns={jerarquiaColumns}
        showPagination={true}
        loadingStates={loadingStates}
        exportOptions={{
          formats: ['csv', 'json'],
          filename: 'jerarquias',
        }}
        showAdd={true}
        addButtonLabel="Nueva Jerarquía"
        createForm={{
          title: "Crear Nueva Jerarquía",
          fields: [
            {
              name: "DESCRIPCION",
              label: "Descripción",
              inputType: "text",
              required: true,
              placeholder: "Ej: Planta de Producción"
            },
            {
              name: "COLOR",
              label: "Color Identificador",
              inputType: "color",
              required: false,
              placeholder: "#000000"
            }
          ],
          onSubmit: handleCreate,
        }}
        onRowSave={handleUpdate}
        onRowDelete={handleDelete}
        deleteConfirm={{
          title: "Eliminar Jerarquía",
          description: (row) => `¿Estás seguro de que deseas eliminar la jerarquía "${row?.DESCRIPCION}"? Esta acción no se puede deshacer.`,
          confirmLabel: "Eliminar",
          cancelLabel: "Cancelar",
        }}
      />
    </div>
  );
}


