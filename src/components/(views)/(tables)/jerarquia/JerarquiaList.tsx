'use client';

import { useState, useEffect } from 'react';
import { TankTable, type LoadingStates } from '@/lib/utils/tanktable-enhanted';
import { getAllJerarquias } from '@/lib/api';
import type { Jerarquia } from '@/models';
import { jerarquiaColumns } from './jerarquia-columns';

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
      />
    </div>
  );
}


