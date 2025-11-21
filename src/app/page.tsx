'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Users, BookOpen, Shield, Layers, Tag, Package, Network, ListChecks, FolderTree, ClipboardList } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Bienvenido a Task Record</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Sistema de gestión de datos. Selecciona un módulo para comenzar.
            </p>
          </div>

          {/* Jerarquía de Niveles - Destacado */}
          <div className="mb-12">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Jerarquía de Niveles</h3>
              <p className="text-muted-foreground">
                Visualiza y gestiona la estructura jerárquica del sistema
              </p>
            </div>
            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:border-primary/40"
              onClick={() => handleNavigation('/niveles')}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-lg bg-primary/20">
                      <Network className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Mantención de Niveles</CardTitle>
                      <CardDescription className="text-base mt-2">
                        Explora la estructura jerárquica: Área → Proceso → Sistema → Conjunto → Componente
                      </CardDescription>
                    </div>
                  </div>
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Tablas Maestras Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Tablas Maestras</h3>
              <p className="text-muted-foreground">
                Gestión de catálogos y datos maestros del sistema
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: 'Usuarios',
                  description: 'Administración de usuarios y permisos',
                  icon: Users,
                  href: '/usuarios',
                  color: 'bg-green-500/10 text-green-500 border-green-500/20',
                  hoverColor: 'hover:bg-green-500/20',
                },
                {
                  title: 'Niveles',
                  description: 'Gestión de niveles jerárquicos (CRUD)',
                  icon: Network,
                  href: '/niveles-tabla',
                  color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
                  hoverColor: 'hover:bg-purple-500/20',
                },
                {
                  title: 'Disciplinas',
                  description: 'Gestión de disciplinas y especialidades',
                  icon: BookOpen,
                  href: '/disciplinas',
                  color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                  hoverColor: 'hover:bg-blue-500/20',
                },
                {
                  title: 'Roles',
                  description: 'Administración de roles de usuario',
                  icon: Shield,
                  href: '/roles',
                  color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
                  hoverColor: 'hover:bg-indigo-500/20',
                },
                {
                  title: 'Jerarquías',
                  description: 'Gestión de jerarquías del sistema',
                  icon: Layers,
                  href: '/jerarquias',
                  color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
                  hoverColor: 'hover:bg-cyan-500/20',
                },
                {
                  title: 'Atributos',
                  description: 'Catálogo de atributos de actividades',
                  icon: Tag,
                  href: '/atributos',
                  color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                  hoverColor: 'hover:bg-emerald-500/20',
                },
                {
                  title: 'Entregas',
                  description: 'Gestión de entregas ordenadas',
                  icon: Package,
                  href: '/entregas',
                  color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                  hoverColor: 'hover:bg-amber-500/20',
                },
                {
                  title: 'Actividades de Nivel',
                  description: 'Gestión de actividades asociadas a niveles',
                  icon: ListChecks,
                  href: '/actividad-nivel',
                  color: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
                  hoverColor: 'hover:bg-pink-500/20',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.title}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${item.color} ${item.hoverColor}`}
                    onClick={() => handleNavigation(item.href)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${item.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm">
                        {item.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Otras Herramientas */}
          <div className="mb-12">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Otras Herramientas</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20"
                onClick={() => handleNavigation('/niveles')}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <FolderTree className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">Tree View</CardTitle>
                    <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm">
                    Vista jerárquica de niveles con gestión de actividades
                  </CardDescription>
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-teal-500/10 text-teal-500 border-teal-500/20 hover:bg-teal-500/20"
                onClick={() => handleNavigation('/pautas')}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-teal-500/10">
                      <ClipboardList className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">Mantención de Pautas</CardTitle>
                    <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm">
                    Gestión y mantención de pautas del sistema
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
