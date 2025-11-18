import { RolList } from "@/components/(views)";

export default function RolesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Roles</h1>
        <p className="text-muted-foreground">
          Gestión de roles de usuario y permisos del sistema
        </p>
      </div>
      <RolList />
    </div>
  );
}


