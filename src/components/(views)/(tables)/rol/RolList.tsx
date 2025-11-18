'use client';

import { useState, useEffect } from 'react';
import { TankTable, type LoadingStates } from '@/lib/utils/tanktable-enhanted';
import { getAllRoles } from '@/lib/api';
import type { Rol } from '@/models';
import { rolColumns } from './rol-columns';

export function RolList() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    const result = await getAllRoles();
    if (result.success && result.data) {
      setRoles(result.data);
    }
    setLoading(false);
  };

  const loadingStates: LoadingStates = {
    loading,
    loadingRows: 8,
  };

  return (
    <div className="space-y-4">
      <TankTable
        data={roles}
        columns={rolColumns}
        showPagination={true}
        loadingStates={loadingStates}
        exportOptions={{
          formats: ['csv', 'json'],
          filename: 'roles',
        }}
      />
    </div>
  );
}


