import { ActividadNivelList } from "@/components/(views)";

export default function ActividadNivelPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Actividades de Nivel</h1>
        <p className="text-muted-foreground">
          Gestión de actividades asociadas a niveles jerárquicos
        </p>
      </div>
      <ActividadNivelList />
    </div>
  );
}

