import { DisciplinaTareaList } from "@/components/(views)";

export default function DisciplinaTareaPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Disciplinas de Tarea</h1>
        <p className="text-muted-foreground">
          Gestión del catálogo de disciplinas de tarea para actividades de nivel
        </p>
      </div>
      <DisciplinaTareaList />
    </div>
  );
}

