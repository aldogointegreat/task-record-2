import { useState, useCallback, useMemo } from "react";
import type { Table } from "@tanstack/react-table";

export interface FilterConfig<TData extends Record<string, unknown>> {
  key: string;
  label: string;
  type: 'select' | 'range' | 'boolean' | 'text' | 'date';
  options?: Array<{ value: unknown; label: string }>;
  getValue?: (row: TData) => unknown;
  getDisplayValue?: (row: TData) => string;
  min?: number;
  max?: number;
  step?: number;
}

export interface FilterState {
  [key: string]: unknown;
}

interface UseAdvancedFiltersOptions<TData extends Record<string, unknown>> {
  table: Table<TData>;
  filters: FilterConfig<TData>[];
  storageKey?: string;
}

export function useAdvancedFilters<TData extends Record<string, unknown>>({
  table,
  filters,
  storageKey,
}: UseAdvancedFiltersOptions<TData>) {
  const [filterState, setFilterState] = useState<FilterState>(() => {
    if (storageKey) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (error) {
        console.warn('Failed to load filters from localStorage:', error);
      }
    }
    return {};
  });

  // Save filter state to localStorage
  const saveFilterState = useCallback((state: FilterState) => {
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch (error) {
        console.warn('Failed to save filters to localStorage:', error);
      }
    }
  }, [storageKey]);

  // Update filter state
  const updateFilter = useCallback((key: string, value: unknown) => {
    setFilterState(prev => {
      const newState = { ...prev, [key]: value };
      saveFilterState(newState);
      return newState;
    });
  }, [saveFilterState]);

  // Clear specific filter
  const clearFilter = useCallback((key: string) => {
    setFilterState(prev => {
      const newState = { ...prev };
      delete newState[key];
      saveFilterState(newState);
      return newState;
    });
  }, [saveFilterState]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilterState({});
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  // Apply filters to table data
  const filteredData = useMemo(() => {
    const data = table.getRowModel().rows.map(row => row.original);
    
    return data.filter(row => {
      return filters.every(filter => {
        const filterValue = filterState[filter.key];
        
        // Skip if no filter value
        if (filterValue === undefined || filterValue === null || filterValue === '') {
          return true;
        }

        const rowValue = filter.getValue ? filter.getValue(row) : row[filter.key];

        switch (filter.type) {
          case 'select':
            return rowValue === filterValue;
          
          case 'range':
            if (typeof filterValue === 'object' && filterValue !== null) {
              const range = filterValue as { min: number; max: number };
              const numValue = Number(rowValue);
              return numValue >= range.min && numValue <= range.max;
            }
            return true;
          
          case 'boolean':
            return Boolean(rowValue) === Boolean(filterValue);
          
          case 'text':
            const textValue = String(rowValue || '').toLowerCase();
            const searchValue = String(filterValue || '').toLowerCase();
            return textValue.includes(searchValue);
          
          case 'date':
            if (filterValue && rowValue) {
              const filterDate = new Date(filterValue as string);
              const rowDate = new Date(rowValue as string);
              return filterDate.toDateString() === rowDate.toDateString();
            }
            return true;
          
          default:
            return true;
        }
      });
    });
  }, [table, filters, filterState]);

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.values(filterState).filter(value => 
      value !== undefined && value !== null && value !== ''
    ).length;
  }, [filterState]);

  // Get filter options for select filters
  const getFilterOptions = useCallback((filterKey: string) => {
    const filter = filters.find(f => f.key === filterKey);
    if (!filter || filter.type !== 'select') return [];

    if (filter.options) {
      return filter.options;
    }

    // Generate options from data
    const data = table.getRowModel().rows.map(row => row.original);
    const uniqueValues = new Set();
    
    data.forEach(row => {
      const value = filter.getValue ? filter.getValue(row) : row[filter.key];
      if (value !== undefined && value !== null) {
        uniqueValues.add(value);
      }
    });

    return Array.from(uniqueValues).map(value => ({
      value,
      label: String(value),
    }));
  }, [filters, table]);

  return {
    filterState,
    updateFilter,
    clearFilter,
    clearAllFilters,
    filteredData,
    activeFiltersCount,
    getFilterOptions,
    hasActiveFilters: activeFiltersCount > 0,
  };
}
