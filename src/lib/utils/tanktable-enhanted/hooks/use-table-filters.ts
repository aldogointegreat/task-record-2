import { useMemo } from "react";
import type { RowData } from "@tanstack/react-table";

export function useTableFilters<TData extends RowData>(
  data: TData[],
  globalFilter: string,
  searchTextExtractor?: (row: TData) => string
) {
  const filteredData = useMemo(() => {
    const term = globalFilter.toLowerCase();
    if (!term) return data;
    
    return data.filter((item) => {
      const base = searchTextExtractor
        ? searchTextExtractor(item)
        : Object.values(item as Record<string, unknown>)
            .map((v) => String(v))
            .join(" ");
      return base.toLowerCase().includes(term);
    });
  }, [data, globalFilter, searchTextExtractor]);

  return filteredData;
}
