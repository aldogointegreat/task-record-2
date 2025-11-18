'use client';

import { useState, useEffect } from 'react';
import { TankTable, type LoadingStates } from '@/lib/utils/tanktable-enhanted';
import { 
  getAllUsuarios, 
  createUsuario, 
  updateUsuario, 
  deleteUsuario,
  getAllRoles,
  getAllDisciplinas
} from '@/lib/api';
import type { Usuario, CreateUsuarioDTO, UpdateUsuarioDTO, Rol, Disciplina } from '@/models';
import { createUsuarioColumns } from './usuario-columns';
import { toast } from 'sonner';

export function UsuarioList() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
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
      const [usuariosResult, rolesResult, disciplinasResult] = await Promise.all([
        getAllUsuarios(),
        getAllRoles(),
        getAllDisciplinas(),
      ]);

      if (usuariosResult.success && usuariosResult.data) {
        setUsuarios(usuariosResult.data);
      }
      if (rolesResult.success && rolesResult.data) {
        setRoles(rolesResult.data);
      }
      if (disciplinasResult.success && disciplinasResult.data) {
        setDisciplinas(disciplinasResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: Usuario) => {
    try {
      setCreating(true);
      const createData: CreateUsuarioDTO = {
        NOMBRE: data.NOMBRE,
        USUARIO: data.USUARIO,
        CONTRASENA: data.CONTRASENA,
        ID_ROL: data.ID_ROL ?? null,
        ID_DIS: data.ID_DIS ?? null,
      };

      const result = await createUsuario(createData);
      if (result.success && result.data) {
        // Actualizar estado local sin recargar toda la tabla
        setUsuarios((prev) => [...prev, result.data!]);
        // El toast se muestra automáticamente desde use-form-handlers
      } else {
        // Lanzar error para que el formulario no se cierre y se muestre el mensaje
        const errorMessage = result.message || 'Error al crear usuario';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating usuario:', error);
      // Si el error no tiene mensaje, mostrar uno genérico
      if (!(error instanceof Error && error.message)) {
        toast.error('Error al crear usuario');
      }
      // Re-lanzar el error para que el formulario no se cierre
      throw error;
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (data: Usuario) => {
    try {
      setUpdatingIds((prev) => new Set(prev).add(data.ID_USR));
      const updateData: UpdateUsuarioDTO = {
        NOMBRE: data.NOMBRE,
        USUARIO: data.USUARIO,
        CONTRASENA: data.CONTRASENA,
        ID_ROL: data.ID_ROL ?? null,
        ID_DIS: data.ID_DIS ?? null,
      };

      const result = await updateUsuario(data.ID_USR, updateData);
      if (result.success && result.data) {
        // Actualizar estado local sin recargar toda la tabla
        setUsuarios((prev) =>
          prev.map((usuario) =>
            usuario.ID_USR === data.ID_USR ? result.data! : usuario
          )
        );
        // El toast se muestra automáticamente desde use-form-handlers
      } else {
        toast.error(result.message || 'Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error updating usuario:', error);
      toast.error('Error al actualizar usuario');
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(data.ID_USR);
        return next;
      });
    }
  };

  const handleDelete = async (data: Usuario) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(data.ID_USR));
      const result = await deleteUsuario(data.ID_USR);
      if (result.success) {
        // Actualizar estado local sin recargar toda la tabla
        setUsuarios((prev) =>
          prev.filter((usuario) => usuario.ID_USR !== data.ID_USR)
        );
        // El toast se muestra automáticamente desde use-form-handlers
      } else {
        toast.error(result.message || 'Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error deleting usuario:', error);
      toast.error('Error al eliminar usuario');
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(data.ID_USR);
        return next;
      });
    }
  };

  const loadingStates: LoadingStates = {
    loading,
    loadingRows: 8,
  };

  const columns = createUsuarioColumns({ 
    roles, 
    disciplinas,
    updatingIds,
    deletingIds,
  });

  return (
    <div className="space-y-4">
      <TankTable
        data={usuarios}
        columns={columns}
        showPagination={true}
        showAdd={true}
        addButtonLabel="Agregar Usuario"
        loadingStates={loadingStates}
        exportOptions={{
          formats: ['csv', 'json'],
          filename: 'usuarios',
        }}
        onRowSave={handleUpdate}
        onRowDelete={handleDelete}
        createForm={{
          title: 'Agregar Nuevo Usuario',
          submitLabel: creating ? 'Creando...' : 'Crear',
          cancelLabel: 'Cancelar',
          fields: [
            {
              name: 'NOMBRE',
              label: 'Nombre',
              inputType: 'text',
              required: true,
              placeholder: 'Ingrese el nombre completo',
            },
            {
              name: 'USUARIO',
              label: 'Usuario',
              inputType: 'text',
              required: true,
              placeholder: 'Ingrese el nombre de usuario',
            },
            {
              name: 'CONTRASENA',
              label: 'Contraseña',
              inputType: 'text',
              required: true,
              placeholder: 'Ingrese la contraseña',
            },
            {
              name: 'ID_ROL',
              label: 'Rol',
              inputType: 'select',
              options: [
                { value: null, label: 'Sin rol' },
                ...roles.map((rol) => ({
                  value: rol.ID_ROL,
                  label: rol.NOMBRE,
                })),
              ],
              encode: (v) => (v === null || v === undefined ? '__null__' : String(v)),
              decode: (s) => (s === '__null__' ? null : Number(s)),
            },
            {
              name: 'ID_DIS',
              label: 'Disciplina',
              inputType: 'select',
              options: [
                { value: null, label: 'Sin disciplina' },
                ...disciplinas.map((dis) => ({
                  value: dis.ID_DIS,
                  label: dis.NOMBRE,
                })),
              ],
              encode: (v) => (v === null || v === undefined ? '__null__' : String(v)),
              decode: (s) => (s === '__null__' ? null : Number(s)),
            },
          ],
          onSubmit: handleCreate,
          successMessage: 'Usuario creado exitosamente',
        }}
        deleteConfirm={{
          title: 'Eliminar Usuario',
          description: (row) =>
            `¿Está seguro de que desea eliminar al usuario "${row?.NOMBRE}"? Esta acción no se puede deshacer.`,
          confirmLabel: 'Eliminar',
          cancelLabel: 'Cancelar',
          successMessage: 'Usuario eliminado exitosamente',
        }}
        updateSuccessMessage="Usuario actualizado exitosamente"
      />
    </div>
  );
}

