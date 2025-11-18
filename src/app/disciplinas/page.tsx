import { DisciplinaList } from "@/components/(views)";

export default function DisciplinasPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Disciplinas</h1>
        <p className="text-muted-foreground">
          Gestión de disciplinas y especialidades del sistema
        </p>
      </div>
      <DisciplinaList />
    </div>
  );
}


