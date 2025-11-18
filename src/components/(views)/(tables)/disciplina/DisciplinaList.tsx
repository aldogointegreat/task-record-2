'use client';

import { useState, useEffect } from 'react';
import { TankTable, type LoadingStates } from '@/lib/utils/tanktable-enhanted';
import { getAllDisciplinas } from '@/lib/api';
import type { Disciplina } from '@/models';
import { disciplinaColumns } from './disciplina-columns';

export function DisciplinaList() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDisciplinas();
  }, []);

  const loadDisciplinas = async () => {
    setLoading(true);
    const result = await getAllDisciplinas();
    if (result.success && result.data) {
      setDisciplinas(result.data);
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
        data={disciplinas}
        columns={disciplinaColumns}
        showPagination={true}
        loadingStates={loadingStates}
        exportOptions={{
          formats: ['csv', 'json'],
          filename: 'disciplinas',
        }}
      />
    </div>
  );
}


