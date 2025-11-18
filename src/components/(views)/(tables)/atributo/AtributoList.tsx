'use client';

import { useState, useEffect } from 'react';
import { TankTable, type LoadingStates } from '@/lib/utils/tanktable-enhanted';
import { getAllAtributos } from '@/lib/api';
import type { Atributo } from '@/models';
import { atributoColumns } from './atributo-columns';

export function AtributoList() {
  const [atributos, setAtributos] = useState<Atributo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAtributos();
  }, []);

  const loadAtributos = async () => {
    setLoading(true);
    const result = await getAllAtributos();
    if (result.success && result.data) {
      setAtributos(result.data);
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
        data={atributos}
        columns={atributoColumns}
        showPagination={true}
        loadingStates={loadingStates}
        exportOptions={{
          formats: ['csv', 'json'],
          filename: 'atributos',
        }}
      />
    </div>
  );
}


