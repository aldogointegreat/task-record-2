import { useMemo } from "react";
import type { VirtualizationOptions } from "../types/tank-table.types";

export function useVirtualization<TData extends object>(
  data: TData[],
  virtualization?: VirtualizationOptions
) {
  const shouldVirtualize = useMemo(() => {
    if (!virtualization) return false;
    
    const threshold = virtualization.threshold || 100;
    const hasEnoughData = data.length >= threshold;
    
    return virtualization.enabled && hasEnoughData;
  }, [data.length, virtualization]);

  const virtualizationConfig = useMemo(() => {
    if (!shouldVirtualize) return null;

    return {
      height: virtualization?.height || 400,
      overscan: virtualization?.overscan || 5,
      rowHeight: virtualization?.rowHeight || 50,
    };
  }, [shouldVirtualize, virtualization]);

  return {
    shouldVirtualize,
    virtualizationConfig,
  };
}
