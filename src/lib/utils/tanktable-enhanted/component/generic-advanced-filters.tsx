import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { 
  Filter, 
  X, 
  Check,
  Calendar,
  Hash,
  ToggleLeft,
  ToggleRight,
  Type,
  Minus,
  Plus
} from "lucide-react";
import type { FilterConfig, FilterState } from "../hooks/use-advanced-filters";

interface GenericAdvancedFiltersProps<TData extends Record<string, unknown>> {
  filters: FilterConfig<TData>[];
  filterState: FilterState;
  onUpdateFilter: (key: string, value: unknown) => void;
  onClearFilter: (key: string) => void;
  onClearAll: () => void;
  activeFiltersCount: number;
  getFilterOptions: (key: string) => Array<{ value: unknown; label: string }>;
}

export function GenericAdvancedFilters<TData extends Record<string, unknown>>({
  filters,
  filterState,
  onUpdateFilter,
  onClearFilter,
  onClearAll,
  activeFiltersCount,
  getFilterOptions,
}: GenericAdvancedFiltersProps<TData>) {

  const getFilterIcon = (type: string) => {
    switch (type) {
      case 'select': return <Check className="h-3 w-3" />;
      case 'range': return <Hash className="h-3 w-3" />;
      case 'boolean': return <ToggleLeft className="h-3 w-3" />;
      case 'text': return <Type className="h-3 w-3" />;
      case 'date': return <Calendar className="h-3 w-3" />;
      default: return <Filter className="h-3 w-3" />;
    }
  };

  const renderFilterControl = (filter: FilterConfig<TData>) => {
    const value = filterState[filter.key];

    switch (filter.type) {
      case 'select':
        const options = getFilterOptions(filter.key);
        return (
          <div className="space-y-2">
            <DropdownMenuLabel className="text-xs font-medium text-gray-500 flex items-center">
              {getFilterIcon(filter.type)}
              <span className="ml-1">{filter.label}</span>
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onUpdateFilter(filter.key, null)}
              className={value === null ? "bg-blue-50 text-blue-700" : ""}
            >
              <Check className={`h-3 w-3 mr-2 ${value === null ? "text-blue-600" : "text-gray-400"}`} />
              Todos
            </DropdownMenuItem>
            {options.map((option) => (
              <DropdownMenuItem
                key={String(option.value)}
                onClick={() => onUpdateFilter(filter.key, option.value)}
                className={value === option.value ? "bg-blue-50 text-blue-700" : ""}
              >
                <Check className={`h-3 w-3 mr-2 ${value === option.value ? "text-blue-600" : "text-gray-400"}`} />
                {option.label}
              </DropdownMenuItem>
            ))}
          </div>
        );

      case 'range':
        const rangeValue = value as { min: number; max: number } || { min: filter.min || 0, max: filter.max || 100 };
        return (
          <div className="space-y-2 p-2">
            <DropdownMenuLabel className="text-xs font-medium text-gray-500 flex items-center">
              {getFilterIcon(filter.type)}
              <span className="ml-1">{filter.label}</span>
            </DropdownMenuLabel>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={rangeValue.min}
                onChange={(e) => onUpdateFilter(filter.key, { ...rangeValue, min: Number(e.target.value) })}
                min={filter.min}
                max={filter.max}
                step={filter.step}
                className="h-8 text-xs"
              />
              <Minus className="h-3 w-3 text-gray-400" />
              <Input
                type="number"
                placeholder="Max"
                value={rangeValue.max}
                onChange={(e) => onUpdateFilter(filter.key, { ...rangeValue, max: Number(e.target.value) })}
                min={filter.min}
                max={filter.max}
                step={filter.step}
                className="h-8 text-xs"
              />
            </div>
          </div>
        );

      case 'boolean':
        return (
          <div className="space-y-2">
            <DropdownMenuLabel className="text-xs font-medium text-gray-500 flex items-center">
              {getFilterIcon(filter.type)}
              <span className="ml-1">{filter.label}</span>
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onUpdateFilter(filter.key, null)}
              className={value === null ? "bg-blue-50 text-blue-700" : ""}
            >
              <Check className={`h-3 w-3 mr-2 ${value === null ? "text-blue-600" : "text-gray-400"}`} />
              Todos
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onUpdateFilter(filter.key, true)}
              className={value === true ? "bg-green-50 text-green-700" : ""}
            >
              <ToggleRight className={`h-3 w-3 mr-2 ${value === true ? "text-green-600" : "text-gray-400"}`} />
              Sí
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onUpdateFilter(filter.key, false)}
              className={value === false ? "bg-red-50 text-red-700" : ""}
            >
              <ToggleLeft className={`h-3 w-3 mr-2 ${value === false ? "text-red-600" : "text-gray-400"}`} />
              No
            </DropdownMenuItem>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-2 p-2">
            <DropdownMenuLabel className="text-xs font-medium text-gray-500 flex items-center">
              {getFilterIcon(filter.type)}
              <span className="ml-1">{filter.label}</span>
            </DropdownMenuLabel>
            <Input
              type="text"
              placeholder={`Buscar en ${filter.label.toLowerCase()}...`}
              value={String(value || '')}
              onChange={(e) => onUpdateFilter(filter.key, e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        );

      case 'date':
        return (
          <div className="space-y-2 p-2">
            <DropdownMenuLabel className="text-xs font-medium text-gray-500 flex items-center">
              {getFilterIcon(filter.type)}
              <span className="ml-1">{filter.label}</span>
            </DropdownMenuLabel>
            <Input
              type="date"
              value={String(value || '')}
              onChange={(e) => onUpdateFilter(filter.key, e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        );

      default:
        return null;
    }
  };

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
        <DropdownMenuContent align="start" className="w-80 max-h-96 overflow-y-auto">
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
          
          {filters
            .filter(filter => filter.key !== 'select') // Exclude select column
            .map((filter, index) => (
            <React.Fragment key={filter.key}>
              {renderFilterControl(filter)}
              {index < filters.filter(f => f.key !== 'select').length - 1 && <DropdownMenuSeparator />}
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-1 flex-wrap max-w-md">
          {filters
            .filter(filter => filter.key !== 'select') // Exclude select column
            .map((filter) => {
            const value = filterState[filter.key];
            if (value === undefined || value === null || value === '') return null;

            let displayValue = '';
            if (filter.type === 'range' && typeof value === 'object') {
              const range = value as { min: number; max: number };
              displayValue = `${range.min} - ${range.max}`;
            } else if (filter.type === 'boolean') {
              displayValue = value ? 'Sí' : 'No';
            } else {
              displayValue = String(value);
            }

            return (
              <Badge 
                key={filter.key}
                variant="secondary" 
                className="bg-blue-100 text-blue-800 text-xs"
              >
                {getFilterIcon(filter.type)}
                <span className="ml-1">{filter.label}: {displayValue}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onClearFilter(filter.key)}
                  className="h-3 w-3 p-0 ml-1 hover:bg-blue-200"
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
