'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Menu, ChevronDown } from 'lucide-react';
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
];

export function Navbar() {
  const pathname = usePathname();

  // Obtener el título de la página actual
  const currentPage = navSections
    .flatMap((section) => section.items)
    .find((item) => item.href === pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center justify-start px-4">
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
          <DropdownMenuContent align="end" className="w-56">
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
    </header>
  );
}
