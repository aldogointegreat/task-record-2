'use client';

import { useState, useEffect } from 'react';
import { TankTable, type LoadingStates } from '@/lib/utils/tanktable-enhanted';
import { 
  getAllActividadNiveles, 
  createActividadNivel, 
  updateActividadNivel, 
  deleteActividadNivel,
  getAllNiveles,
  getAllAtributos,
  getAllConsecuenciasFalla,
  getAllClasesMantencion,
  getAllCondicionesAcceso,
  getAllDisciplinasTarea
} from '@/lib/api';
import type { 
  ActividadNivel, 
  CreateActividadNivelDTO, 
  UpdateActividadNivelDTO, 
  Nivel, 
  Atributo,
  ConsecuenciaFalla,
  ClaseMantencion,
  CondicionAcceso,
  DisciplinaTarea
} from '@/models';
import { createActividadNivelColumns } from './actividad-nivel-columns';
import { toast } from 'sonner';

export function ActividadNivelList() {
  const [actividadesNivel, setActividadesNivel] = useState<ActividadNivel[]>([]);
  const [niveles, setNiveles] = useState<Nivel[]>([]);
  const [atributos, setAtributos] = useState<Atributo[]>([]);
  const [consecuenciasFalla, setConsecuenciasFalla] = useState<ConsecuenciaFalla[]>([]);
  const [clasesMantencion, setClasesMantencion] = useState<ClaseMantencion[]>([]);
  const [condicionesAcceso, setCondicionesAcceso] = useState<CondicionAcceso[]>([]);
  const [disciplinasTarea, setDisciplinasTarea] = useState<DisciplinaTarea[]>([]);
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
      const [
        actividadesResult, 
        nivelesResult, 
        atributosResult,
        consecuenciasResult,
        clasesResult,
        condicionesResult,
        disciplinasResult
      ] = await Promise.all([
        getAllActividadNiveles(),
        getAllNiveles(),
        getAllAtributos(),
        getAllConsecuenciasFalla(),
        getAllClasesMantencion(),
        getAllCondicionesAcceso(),
        getAllDisciplinasTarea(),
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
      if (consecuenciasResult.success && consecuenciasResult.data) {
        setConsecuenciasFalla(consecuenciasResult.data);
      }
      if (clasesResult.success && clasesResult.data) {
        setClasesMantencion(clasesResult.data);
      }
      if (condicionesResult.success && condicionesResult.data) {
        setCondicionesAcceso(condicionesResult.data);
      }
      if (disciplinasResult.success && disciplinasResult.data) {
        setDisciplinasTarea(disciplinasResult.data);
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
        FUNCIONALIDAD: data.FUNCIONALIDAD ?? null,
        MODO_FALLA: data.MODO_FALLA ?? null,
        EFECTO_FALLA: data.EFECTO_FALLA ?? null,
        TIEMPO_PROMEDIO_FALLA: data.TIEMPO_PROMEDIO_FALLA ?? null,
        UNIDAD_TIEMPO_FALLA: data.UNIDAD_TIEMPO_FALLA ?? null,
        ID_CONSECUENCIA_FALLA: data.ID_CONSECUENCIA_FALLA ?? null,
        ID_CLASE_MANTENCION: data.ID_CLASE_MANTENCION ?? null,
        TAREA_MANTENCION: data.TAREA_MANTENCION ?? null,
        FRECUENCIA_TAREA: data.FRECUENCIA_TAREA ?? null,
        UNIDAD_FRECUENCIA: data.UNIDAD_FRECUENCIA ?? null,
        DURACION_TAREA: data.DURACION_TAREA ?? null,
        CANTIDAD_RECURSOS: data.CANTIDAD_RECURSOS ?? null,
        ID_CONDICION_ACCESO: data.ID_CONDICION_ACCESO ?? null,
        ID_DISCIPLINA_TAREA: data.ID_DISCIPLINA_TAREA ?? null,
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
        FUNCIONALIDAD: data.FUNCIONALIDAD ?? null,
        MODO_FALLA: data.MODO_FALLA ?? null,
        EFECTO_FALLA: data.EFECTO_FALLA ?? null,
        TIEMPO_PROMEDIO_FALLA: data.TIEMPO_PROMEDIO_FALLA ?? null,
        UNIDAD_TIEMPO_FALLA: data.UNIDAD_TIEMPO_FALLA ?? null,
        ID_CONSECUENCIA_FALLA: data.ID_CONSECUENCIA_FALLA ?? null,
        ID_CLASE_MANTENCION: data.ID_CLASE_MANTENCION ?? null,
        TAREA_MANTENCION: data.TAREA_MANTENCION ?? null,
        FRECUENCIA_TAREA: data.FRECUENCIA_TAREA ?? null,
        UNIDAD_FRECUENCIA: data.UNIDAD_FRECUENCIA ?? null,
        DURACION_TAREA: data.DURACION_TAREA ?? null,
        CANTIDAD_RECURSOS: data.CANTIDAD_RECURSOS ?? null,
        ID_CONDICION_ACCESO: data.ID_CONDICION_ACCESO ?? null,
        ID_DISCIPLINA_TAREA: data.ID_DISCIPLINA_TAREA ?? null,
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
    consecuenciasFalla,
    clasesMantencion,
    condicionesAcceso,
    disciplinasTarea,
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
            {
              name: 'FUNCIONALIDAD',
              label: 'Funcionalidad',
              inputType: 'textarea',
              placeholder: 'Describir la función principal del componente',
            },
            {
              name: 'MODO_FALLA',
              label: 'Modo de Falla',
              inputType: 'textarea',
              placeholder: 'Describir los modos de falla posibles',
            },
            {
              name: 'EFECTO_FALLA',
              label: 'Efecto de la Falla',
              inputType: 'textarea',
              placeholder: 'Describir los efectos típicos de la falla',
            },
            {
              name: 'TIEMPO_PROMEDIO_FALLA',
              label: 'Tiempo Promedio entre Falla',
              inputType: 'number',
              placeholder: '10',
            },
            {
              name: 'UNIDAD_TIEMPO_FALLA',
              label: 'Unidad de Tiempo (Falla)',
              inputType: 'select',
              options: [
                { value: null, label: 'Sin especificar' },
                { value: 'Segundos', label: 'Segundos' },
                { value: 'Minutos', label: 'Minutos' },
                { value: 'Horas', label: 'Horas' },
                { value: 'Días', label: 'Días' },
                { value: 'Semanas', label: 'Semanas' },
                { value: 'Meses', label: 'Meses' },
                { value: 'Años', label: 'Años' },
              ],
              encode: (v) => (v === null || v === undefined ? '__null__' : String(v)),
              decode: (s) => (s === '__null__' ? null : s),
            },
            {
              name: 'ID_CONSECUENCIA_FALLA',
              label: 'Consecuencia de Falla',
              inputType: 'select',
              options: [
                { value: null, label: 'Sin especificar' },
                ...consecuenciasFalla.map((c) => ({
                  value: c.ID_CONSECUENCIA,
                  label: `${c.CODIGO} - ${c.NOMBRE}`,
                })),
              ],
              encode: (v) => (v === null || v === undefined ? '__null__' : String(v)),
              decode: (s) => (s === '__null__' ? null : Number(s)),
            },
            {
              name: 'ID_CLASE_MANTENCION',
              label: 'Clase de Mantención',
              inputType: 'select',
              options: [
                { value: null, label: 'Sin especificar' },
                ...clasesMantencion.map((c) => ({
                  value: c.ID_CLASE,
                  label: `${c.CODIGO} - ${c.NOMBRE}`,
                })),
              ],
              encode: (v) => (v === null || v === undefined ? '__null__' : String(v)),
              decode: (s) => (s === '__null__' ? null : Number(s)),
            },
            {
              name: 'TAREA_MANTENCION',
              label: 'Tarea de Mantención',
              inputType: 'textarea',
              placeholder: 'Describir la tarea de mantención a realizar',
            },
            {
              name: 'FRECUENCIA_TAREA',
              label: 'Frecuencia de la Tarea',
              inputType: 'number',
              placeholder: '1',
            },
            {
              name: 'UNIDAD_FRECUENCIA',
              label: 'Unidad de Frecuencia',
              inputType: 'select',
              options: [
                { value: null, label: 'Sin especificar' },
                { value: 'Segundos', label: 'Segundos' },
                { value: 'Minutos', label: 'Minutos' },
                { value: 'Horas', label: 'Horas' },
                { value: 'Días', label: 'Días' },
                { value: 'Semanas', label: 'Semanas' },
                { value: 'Meses', label: 'Meses' },
                { value: 'Años', label: 'Años' },
              ],
              encode: (v) => (v === null || v === undefined ? '__null__' : String(v)),
              decode: (s) => (s === '__null__' ? null : s),
            },
            {
              name: 'DURACION_TAREA',
              label: 'Duración de la Tarea (minutos)',
              inputType: 'number',
              placeholder: '5',
            },
            {
              name: 'CANTIDAD_RECURSOS',
              label: 'Cantidad de Recursos',
              inputType: 'number',
              placeholder: '1',
            },
            {
              name: 'ID_CONDICION_ACCESO',
              label: 'Condición de Acceso',
              inputType: 'select',
              options: [
                { value: null, label: 'Sin especificar' },
                ...condicionesAcceso.map((c) => ({
                  value: c.ID_CONDICION,
                  label: `${c.CODIGO} - ${c.NOMBRE}`,
                })),
              ],
              encode: (v) => (v === null || v === undefined ? '__null__' : String(v)),
              decode: (s) => (s === '__null__' ? null : Number(s)),
            },
            {
              name: 'ID_DISCIPLINA_TAREA',
              label: 'Disciplina de la Tarea',
              inputType: 'select',
              options: [
                { value: null, label: 'Sin especificar' },
                ...disciplinasTarea.map((d) => ({
                  value: d.ID_DISCIPLINA_TAREA,
                  label: `${d.CODIGO} - ${d.NOMBRE}`,
                })),
              ],
              encode: (v) => (v === null || v === undefined ? '__null__' : String(v)),
              decode: (s) => (s === '__null__' ? null : Number(s)),
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

