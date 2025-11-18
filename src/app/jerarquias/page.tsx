import { JerarquiaList } from "@/components/(views)";

export default function JerarquiasPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Jerarquías</h1>
        <p className="text-muted-foreground">
          Gestión de jerarquías del sistema
        </p>
      </div>
      <JerarquiaList />
    </div>
  );
}


