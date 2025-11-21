import { NivelTreeView } from "@/components/(views)/(use cases)/nivel-tree/NivelTreeView";

export default function NivelesPage() {
  return (
    <div className="container mx-auto py-8 px-2">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Análisis RCM</h1>
      </div>
      <NivelTreeView />
    </div>
  );
}

