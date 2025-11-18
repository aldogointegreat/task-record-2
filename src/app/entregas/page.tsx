import { EntregaList } from "@/components/(views)";

export default function EntregasPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Entregas</h1>
        <p className="text-muted-foreground">
          Gestión de entregas ordenadas del sistema
        </p>
      </div>
      <EntregaList />
    </div>
  );
}


