import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { 
  Filter, 
  X, 
  Package, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";

interface AdvancedFiltersProps {
  categories: Array<{ id: number; nombre: string }>;
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  priceRange: { min: number; max: number } | null;
  onPriceRangeChange: (range: { min: number; max: number } | null) => void;
  stockFilter: 'all' | 'low' | 'normal';
  onStockFilterChange: (filter: 'all' | 'low' | 'normal') => void;
  statusFilter: 'all' | 'active' | 'inactive';
  onStatusFilterChange: (filter: 'all' | 'active' | 'inactive') => void;
  onClearAll: () => void;
}

export function AdvancedFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  stockFilter,
  onStockFilterChange,
  statusFilter,
  onStatusFilterChange,
  onClearAll,
}: AdvancedFiltersProps) {
  const activeFiltersCount = [
    selectedCategory !== null,
    priceRange !== null,
    stockFilter !== 'all',
    statusFilter !== 'all'
  ].filter(Boolean).length;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="h-10 px-3 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
            aria-label="Filtros avanzados"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Filtros Avanzados</span>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="h-6 px-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Limpiar
              </Button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Category Filter */}
          <DropdownMenuLabel className="text-xs font-medium text-gray-500">
            <Package className="h-3 w-3 mr-1 inline" />
            Categoría
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onCategoryChange(null)}
            className={selectedCategory === null ? "bg-blue-50 text-blue-700" : ""}
          >
            <CheckCircle className={`h-3 w-3 mr-2 ${selectedCategory === null ? "text-blue-600" : "text-gray-400"}`} />
            Todas las categorías
          </DropdownMenuItem>
          {categories.map((category) => (
            <DropdownMenuItem
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={selectedCategory === category.id ? "bg-blue-50 text-blue-700" : ""}
            >
              <CheckCircle className={`h-3 w-3 mr-2 ${selectedCategory === category.id ? "text-blue-600" : "text-gray-400"}`} />
              {category.nombre}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          {/* Stock Filter */}
          <DropdownMenuLabel className="text-xs font-medium text-gray-500">
            <AlertTriangle className="h-3 w-3 mr-1 inline" />
            Stock
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onStockFilterChange('all')}
            className={stockFilter === 'all' ? "bg-blue-50 text-blue-700" : ""}
          >
            <CheckCircle className={`h-3 w-3 mr-2 ${stockFilter === 'all' ? "text-blue-600" : "text-gray-400"}`} />
            Todos
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onStockFilterChange('low')}
            className={stockFilter === 'low' ? "bg-red-50 text-red-700" : ""}
          >
            <AlertTriangle className={`h-3 w-3 mr-2 ${stockFilter === 'low' ? "text-red-600" : "text-gray-400"}`} />
            Stock Bajo
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onStockFilterChange('normal')}
            className={stockFilter === 'normal' ? "bg-green-50 text-green-700" : ""}
          >
            <CheckCircle className={`h-3 w-3 mr-2 ${stockFilter === 'normal' ? "text-green-600" : "text-gray-400"}`} />
            Stock Normal
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Status Filter */}
          <DropdownMenuLabel className="text-xs font-medium text-gray-500">
            Estado
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onStatusFilterChange('all')}
            className={statusFilter === 'all' ? "bg-blue-50 text-blue-700" : ""}
          >
            <CheckCircle className={`h-3 w-3 mr-2 ${statusFilter === 'all' ? "text-blue-600" : "text-gray-400"}`} />
            Todos
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onStatusFilterChange('active')}
            className={statusFilter === 'active' ? "bg-green-50 text-green-700" : ""}
          >
            <CheckCircle className={`h-3 w-3 mr-2 ${statusFilter === 'active' ? "text-green-600" : "text-gray-400"}`} />
            Activos
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onStatusFilterChange('inactive')}
            className={statusFilter === 'inactive' ? "bg-gray-50 text-gray-700" : ""}
          >
            <XCircle className={`h-3 w-3 mr-2 ${statusFilter === 'inactive' ? "text-gray-600" : "text-gray-400"}`} />
            Inactivos
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-1 flex-wrap max-w-md">
          {selectedCategory !== null && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
              <Package className="h-3 w-3 mr-1" />
              {categories.find(c => c.id === selectedCategory)?.nombre}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCategoryChange(null)}
                className="h-3 w-3 p-0 ml-1 hover:bg-blue-200"
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
          
          {stockFilter !== 'all' && (
            <Badge variant="secondary" className={`text-xs ${stockFilter === 'low' ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
              <AlertTriangle className="h-3 w-3 mr-1" />
              {stockFilter === 'low' ? 'Stock Bajo' : 'Stock Normal'}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStockFilterChange('all')}
                className="h-3 w-3 p-0 ml-1 hover:bg-red-200"
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
          
          {statusFilter !== 'all' && (
            <Badge variant="secondary" className={`text-xs ${statusFilter === 'active' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
              {statusFilter === 'active' ? 'Activos' : 'Inactivos'}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStatusFilterChange('all')}
                className="h-3 w-3 p-0 ml-1 hover:bg-gray-200"
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
