'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Activity, Menu, ChevronDown, LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface NavItem {
  title: string;
  href: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Inicio',
    items: [
      { title: 'Inicio', href: '/' },
    ],
  },
  {
    title: 'Mantención de Niveles',
    items: [
      { title: 'Mantención de Niveles', href: '/niveles' },
    ],
  },
  {
    title: 'Tablas Maestras',
    items: [
      { title: 'Usuarios', href: '/usuarios' },
      { title: 'Niveles', href: '/niveles-tabla' },
      { title: 'Disciplinas', href: '/disciplinas' },
      { title: 'Roles', href: '/roles' },
      { title: 'Jerarquías', href: '/jerarquias' },
      { title: 'Atributos', href: '/atributos' },
      { title: 'Atributo Valor', href: '/atributo-valor' },
      { title: 'Entregas', href: '/entregas' },
      { title: 'Actividad Nivel', href: '/actividad-nivel' },
    ],
  },
  {
    title: 'Otras Herramientas',
    items: [
      { title: 'Mantención de Pautas', href: '/pautas' },
    ],
  },
];

interface SessionData {
  userId: number;
  usuario: string;
  nombre: string;
  idRol: number | null;
  idDis: number | null;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener información de la sesión
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSession(data.data);
          }
        }
      } catch (error) {
        console.error('Error al obtener sesión:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Sesión cerrada exitosamente');
        router.push('/login');
        router.refresh();
      } else {
        toast.error('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al conectar con el servidor');
    }
  };

  // No mostrar el navbar en la página de login por seguridad
  if (pathname === '/login') {
    return null;
  }

  // Obtener el título de la página actual
  const currentPage = navSections
    .flatMap((section) => section.items)
    .find((item) => item.href === pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {/* Logo y Título */}
          <div className="flex items-center gap-3 mr-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            {/* <h1 className="text-lg font-bold">Task Record</h1> */}
          </div>

          {/* Menú Desplegable */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Menu className="h-4 w-4" />
                <span>{currentPage?.title || 'Navegación'}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {navSections.map((section, sectionIndex) => (
                <div key={section.title}>
                  {sectionIndex > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuGroup>
                    {/* <DropdownMenuLabel>{section.title}</DropdownMenuLabel> */}
                    {section.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <DropdownMenuItem key={item.href} asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              'cursor-pointer',
                              isActive && 'bg-accent'
                            )}
                          >
                            {item.title}
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuGroup>
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Información del Usuario y Logout */}
        {!isLoading && session && (
          <div className="flex items-center gap-2">
            {/* Información del Usuario */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{session.nombre}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{session.nombre}</p>
                    <p className="text-xs text-muted-foreground">{session.usuario}</p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Botón de Cerrar Sesión */}
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
