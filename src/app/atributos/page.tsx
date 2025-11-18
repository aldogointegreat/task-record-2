import { AtributoList } from "@/components/(views)";

export default function AtributosPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Atributos</h1>
        <p className="text-muted-foreground">
          Gestión de atributos de actividades
        </p>
      </div>
      <AtributoList />
    </div>
  );
}


