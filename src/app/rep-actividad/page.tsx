import { REPActividadList } from "@/components/(views)";

export default function REPActividadPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Repetición de Actividades</h1>
        <p className="text-muted-foreground">
          Gestión de actividades de repetición (REP_ACTIVIDAD)
        </p>
      </div>
      <REPActividadList />
    </div>
  );
}

