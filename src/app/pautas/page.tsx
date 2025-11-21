import { PMList } from "@/components/(views)";

export default function PautasPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Mantención de Pautas</h1>
        <p className="text-muted-foreground">
          Gestión y mantención de pautas del sistema
        </p>
      </div>
      <PMList />
    </div>
  );
}

