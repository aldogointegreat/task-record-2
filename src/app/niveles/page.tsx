import { NivelTreeView } from "@/components/(views)/(use cases)/nivel-tree/NivelTreeView";

export default function NivelesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Mantención de Niveles</h1>
        <p className="text-muted-foreground">
          Visualiza y gestiona la estructura jerárquica de niveles del sistema
        </p>
      </div>
      <NivelTreeView />
    </div>
  );
}

