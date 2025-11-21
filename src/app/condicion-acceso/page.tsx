import { CondicionAccesoList } from "@/components/(views)";

export default function CondicionAccesoPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Condiciones de Acceso</h1>
        <p className="text-muted-foreground">
          Gestión del catálogo de condiciones de acceso para actividades de nivel
        </p>
      </div>
      <CondicionAccesoList />
    </div>
  );
}

