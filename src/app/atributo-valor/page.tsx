import { AtributoValorList } from "@/components/(views)";

export default function AtributoValorPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Valores de Atributos</h1>
        <p className="text-muted-foreground">
          Gestión de valores asociados a atributos de actividades
        </p>
      </div>
      <AtributoValorList />
    </div>
  );
}

