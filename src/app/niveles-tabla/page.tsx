import { NivelList } from "@/components/(views)/(tables)/nivel/NivelList";

export default function NivelesTablaPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Niveles</h1>
        <p className="text-muted-foreground">
          Gestión de niveles del sistema con CRUD completo
        </p>
      </div>
      <NivelList />
    </div>
  );
}


