'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, ArrowRight, LayoutDashboard, Settings, Users, FolderTree } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const menuItems = [
    {
      title: 'Actividades',
      description: 'Gestiona y visualiza todas las actividades del sistema',
      icon: Activity,
      href: '/actividad',
      color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      hoverColor: 'hover:bg-blue-500/20',
    },
    {
      title: 'Tree View',
      description: 'Componente de árbol jerárquico con ejemplos de uso',
      icon: FolderTree,
      href: '/tree-view',
      color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      hoverColor: 'hover:bg-orange-500/20',
    },
    {
      title: 'Dashboard',
      description: 'Vista general y estadísticas del sistema',
      icon: LayoutDashboard,
      href: '/dashboard',
      color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      hoverColor: 'hover:bg-purple-500/20',
      disabled: true,
    },
    {
      title: 'Usuarios',
      description: 'Administra usuarios y permisos',
      icon: Users,
      href: '/usuarios',
      color: 'bg-green-500/10 text-green-500 border-green-500/20',
      hoverColor: 'hover:bg-green-500/20',
      disabled: true,
    },
    {
      title: 'Configuración',
      description: 'Ajustes y preferencias del sistema',
      icon: Settings,
      href: '/configuracion',
      color: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
      hoverColor: 'hover:bg-gray-500/20',
      disabled: true,
    },
  ];

  const handleNavigation = (href: string, disabled?: boolean) => {
    if (disabled) return;
    router.push(href);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">Task Record</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Bienvenido a Task Record</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Sistema de gestión de actividades. Selecciona un módulo para comenzar.
            </p>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className={`cursor-pointer transition-all duration-200 ${
                    item.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:shadow-lg hover:scale-[1.02]'
                  } ${item.color} ${item.hoverColor}`}
                  onClick={() => handleNavigation(item.href, item.disabled)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${item.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                          {item.disabled && (
                            <span className="text-xs text-muted-foreground mt-1 inline-block">
                              Próximamente
                            </span>
                          )}
                        </div>
                      </div>
                      {!item.disabled && (
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Action Button */}
          <div className="mt-12 text-center">
            <Button
              size="lg"
              onClick={() => router.push('/actividad')}
              className="gap-2"
            >
              <Activity className="h-5 w-5" />
              Ir a Actividades
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Task Record © {new Date().getFullYear()} - Sistema de gestión</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
