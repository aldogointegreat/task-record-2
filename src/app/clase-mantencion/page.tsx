import { ClaseMantencionList } from "@/components/(views)";

export default function ClaseMantencionPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Clases de Mantención</h1>
        <p className="text-muted-foreground">
          Gestión del catálogo de clases de mantención para actividades de nivel
        </p>
      </div>
      <ClaseMantencionList />
    </div>
  );
}

