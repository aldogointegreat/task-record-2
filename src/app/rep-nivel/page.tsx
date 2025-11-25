import { REPNivelList } from "@/components/(views)";

export default function REPNivelPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Repetición de Niveles</h1>
        <p className="text-muted-foreground">
          Gestión de niveles de repetición (REP_NIVEL)
        </p>
      </div>
      <REPNivelList />
    </div>
  );
}

