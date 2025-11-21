import { DisciplinaNivelList } from "@/components/(views)";

export default function DisciplinaNivelPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Disciplinas de Nivel</h1>
        <p className="text-muted-foreground">
          Catálogo de disciplinas asociadas a los niveles jerárquicos
        </p>
      </div>
      <DisciplinaNivelList />
    </div>
  );
}


