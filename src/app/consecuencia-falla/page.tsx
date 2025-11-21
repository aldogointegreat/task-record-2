import { ConsecuenciaFallaList } from "@/components/(views)";

export default function ConsecuenciaFallaPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Consecuencias de Falla</h1>
        <p className="text-muted-foreground">
          Gestión del catálogo de consecuencias de falla para actividades de nivel
        </p>
      </div>
      <ConsecuenciaFallaList />
    </div>
  );
}

