import { UsuarioList } from "@/components/(views)";

export default function UsuariosPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Usuarios</h1>
        <p className="text-muted-foreground">
          Gestión de usuarios del sistema
        </p>
      </div>
      <UsuarioList />
    </div>
  );
}

