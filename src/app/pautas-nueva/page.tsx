"use client";

import { useState } from "react";
import { PMList } from "@/components/(views)/(tables)/pauta/PMList";
import { PMCreacionForm } from "@/components/(views)/(use cases)/pm-creation/PMCreacionForm";

export default function PautasNuevaPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePMCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Creación de Pautas de Mantenimiento
          </h1>
          <p className="text-muted-foreground mt-2">
            Cree nuevas PMs seleccionando actividades manualmente con filtros
            avanzados
          </p>
        </div>
        <PMCreacionForm onSuccess={handlePMCreated} />
      </div>

      {/* Componente existente de lista de PMs */}
      <PMList key={refreshKey} />
    </div>
  );
}
