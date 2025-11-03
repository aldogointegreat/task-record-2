import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Menu, 
  Search, 
  Plus, 
  Download, 
  Filter,
  Settings,
  BarChart3
} from "lucide-react";

interface MobileMenuProps {
  onSearch: () => void;
  onAdd: () => void;
  onExport: () => void;
  onFilters: () => void;
  onSettings: () => void;
  onAnalytics: () => void;
}

export function MobileMenu({
  onSearch,
  onAdd,
  onExport,
  onFilters,
  onSettings,
  onAnalytics,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      icon: Search,
      label: "Buscar Productos",
      action: onSearch,
      description: "Buscar en el inventario"
    },
    {
      icon: Plus,
      label: "Agregar Producto",
      action: onAdd,
      description: "Crear nuevo producto"
    },
    {
      icon: Download,
      label: "Exportar Datos",
      action: onExport,
      description: "Descargar inventario"
    },
    {
      icon: Filter,
      label: "Filtros Avanzados",
      action: onFilters,
      description: "Filtrar por categoría, stock, etc."
    },
    {
      icon: BarChart3,
      label: "Analíticas",
      action: onAnalytics,
      description: "Ver estadísticas del inventario"
    },
    {
      icon: Settings,
      label: "Configuración",
      action: onSettings,
      description: "Ajustes de la tabla"
    },
  ];

  const handleAction = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="md:hidden h-11 w-11 p-0 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Menú de acciones"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader className="text-left">
          <SheetTitle className="text-lg font-semibold">Acciones Rápidas</SheetTitle>
          <SheetDescription>
            Accede a todas las funciones del dashboard desde aquí
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start h-14 px-4 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => handleAction(item.action)}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Dashboard de Productos Veterinarios
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Versión 1.0 - Optimizado para móvil
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
