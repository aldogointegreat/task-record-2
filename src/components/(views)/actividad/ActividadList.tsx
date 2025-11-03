'use client';

import { useState, useEffect } from 'react';
import { getAllActividades, createActividad } from '@/backend';
import type { DbActionResult } from '@/types/common';
import type { Actividad, CreateActividadDTO } from '@/models/actividad.model';
import { TankTable, type LoadingStates } from '@/lib/utils/tanktable-enhanted';
import { actividadColumns } from './actividad-columns';
import { toast } from 'sonner';

export function ActividadList() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadActividades = async () => {
    setLoading(true);
    setError(null);
    try {
      const result: DbActionResult<Actividad[]> = await getAllActividades();
      if (result.success && result.data) {
        setActividades(result.data);
      } else {
        setError(result.error || 'Error al cargar actividades');
      }
    } catch {
      setError('Error inesperado al cargar actividades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActividades();
  }, []);

  const loadingStates: LoadingStates = {
    loading: loading,
    error: error,
    loadingRows: 8,
    emptyState: (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No se encontraron actividades</p>
      </div>
    ),
  };

  const handleCreateActividad = async (data: Actividad) => {
    try {
      // Convertir Actividad a CreateActividadDTO eliminando nulls y campos no necesarios
      const dto: CreateActividadDTO = {
        ID_CON: data.ID_CON ?? undefined,
        ID_CLM: data.ID_CLM ?? undefined,
        ID_DIS: data.ID_DIS ?? undefined,
        TITULO: data.TITULO ?? undefined,
        ID_UM: data.ID_UM ?? undefined,
        ID_FRC: data.ID_FRC ?? undefined,
        ID_RAN: data.ID_RAN ?? undefined,
        ESPECIFICACION: data.ESPECIFICACION ?? undefined,
        INICIO: data.INICIO ?? undefined,
        FIN: data.FIN ?? undefined,
        REFERENCIA: data.REFERENCIA ?? undefined,
        REFERENCIA_URL: data.REFERENCIA_URL ?? undefined,
        HABILITADO: data.HABILITADO ?? undefined,
        DESCRIPCION: data.DESCRIPCION ?? undefined,
        DURACION: data.DURACION ?? undefined,
        SUBACTIVIDAD: data.SUBACTIVIDAD ?? undefined,
        LOGIN: data.LOGIN ?? undefined,
        ID_PM: data.ID_PM ?? undefined,
        IdMaestro: data.IdMaestro ?? undefined,
      };
      
      const result: DbActionResult<Actividad> = await createActividad(dto);
      
      if (result.success && result.data) {
        // Recargar la lista de actividades
        await loadActividades();
        toast.success(result.message || 'Actividad creada exitosamente');
      } else {
        toast.error(result.error || 'Error al crear la actividad');
      }
    } catch (error) {
      console.error('Error al crear actividad:', error);
      toast.error('Error inesperado al crear la actividad');
    }
  };

  return (
    <TankTable
      data={actividades}
      columns={actividadColumns}
      showPagination={true}
      pageSizeOptions={[10, 20, 50, 100]}
      initialPageSize={20}
      loadingStates={loadingStates}
      showAdd={true}
      addButtonLabel="Agregar Actividad"
      tableMeta={{
        searchTextExtractor: (row: Actividad) => {
          return [
            row.TITULO || '',
            row.DESCRIPCION || '',
            row.ESPECIFICACION || '',
            row.SUBACTIVIDAD || '',
            row.ID_CON || '',
            row.ID_CLM || '',
            String(row.ID_ACT || ''),
          ].join(' ').toLowerCase();
        },
      }}
      columnVisibility={{
        enabled: true,
        storageKey: 'actividad-column-visibility',
        defaultHiddenColumns: ['ID_DIS', 'INICIO', 'FIN'],
      }}
      exportOptions={{
        formats: ['csv', 'json'],
        filename: 'actividades',
        includeHeaders: true,
      }}
      createForm={{
        title: 'Agregar Nueva Actividad',
        submitLabel: 'Crear Actividad',
        cancelLabel: 'Cancelar',
        fields: [
          {
            name: 'TITULO',
            label: 'Título',
            inputType: 'text',
            placeholder: 'Ingrese el título de la actividad',
            required: false,
          },
          {
            name: 'DESCRIPCION',
            label: 'Descripción',
            inputType: 'textarea',
            placeholder: 'Ingrese una descripción',
            required: false,
          },
          {
            name: 'ESPECIFICACION',
            label: 'Especificación',
            inputType: 'text',
            placeholder: 'Ingrese la especificación',
            required: false,
          },
          {
            name: 'SUBACTIVIDAD',
            label: 'Subactividad',
            inputType: 'text',
            placeholder: 'Ingrese la subactividad',
            required: false,
          },
          {
            name: 'DURACION',
            label: 'Duración',
            inputType: 'number',
            placeholder: '0.00',
            step: '0.01',
            required: false,
            parse: (raw) => raw === '' || raw === undefined ? null : Number(raw),
          },
          {
            name: 'HABILITADO',
            label: 'Habilitado',
            inputType: 'checkbox',
            required: false,
          },
          {
            name: 'ID_CON',
            label: 'ID_CON',
            inputType: 'text',
            placeholder: 'Ingrese ID_CON',
            required: false,
          },
          {
            name: 'ID_CLM',
            label: 'ID_CLM',
            inputType: 'text',
            placeholder: 'Ingrese ID_CLM',
            required: false,
          },
          {
            name: 'ID_DIS',
            label: 'ID_DIS',
            inputType: 'number',
            placeholder: 'Ingrese ID_DIS',
            required: false,
            parse: (raw) => raw === '' || raw === undefined ? null : Number(raw),
          },
          {
            name: 'ID_PM',
            label: 'ID_PM',
            inputType: 'number',
            placeholder: 'Ingrese ID_PM',
            required: false,
            parse: (raw) => raw === '' || raw === undefined ? null : Number(raw),
          },
          {
            name: 'INICIO',
            label: 'Inicio',
            inputType: 'number',
            placeholder: 'Ingrese valor de inicio',
            step: '0.01',
            required: false,
            parse: (raw) => raw === '' || raw === undefined ? null : Number(raw),
          },
          {
            name: 'FIN',
            label: 'Fin',
            inputType: 'number',
            placeholder: 'Ingrese valor de fin',
            step: '0.01',
            required: false,
            parse: (raw) => raw === '' || raw === undefined ? null : Number(raw),
          },
          {
            name: 'REFERENCIA',
            label: 'Referencia',
            inputType: 'text',
            placeholder: 'Ingrese la referencia',
            required: false,
          },
          {
            name: 'REFERENCIA_URL',
            label: 'URL de Referencia',
            inputType: 'text',
            placeholder: 'https://ejemplo.com',
            required: false,
          },
        ],
        onSubmit: handleCreateActividad,
        successMessage: (data) => {
          const titulo = data.TITULO ? `"${data.TITULO}"` : 'la actividad';
          return `Actividad ${titulo} creada exitosamente`;
        },
      }}
    />
  );
}
