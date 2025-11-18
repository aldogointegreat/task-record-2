'use client';

import { useState, useEffect } from 'react';
import { TankTable, type LoadingStates } from '@/lib/utils/tanktable-enhanted';
import { getAllEntregas } from '@/lib/api';
import type { Entrega } from '@/models';
import { entregaColumns } from './entrega-columns';

export function EntregaList() {
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntregas();
  }, []);

  const loadEntregas = async () => {
    setLoading(true);
    const result = await getAllEntregas();
    if (result.success && result.data) {
      setEntregas(result.data);
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
        data={entregas}
        columns={entregaColumns}
        showPagination={true}
        loadingStates={loadingStates}
        exportOptions={{
          formats: ['csv', 'json'],
          filename: 'entregas',
        }}
      />
    </div>
  );
}


