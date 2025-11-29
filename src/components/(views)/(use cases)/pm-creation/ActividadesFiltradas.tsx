"use client";

import { useState, useEffect, useRef } from "react";
import type { ActividadFiltrada } from "@/models";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ActividadesFiltradasProps {
  actividades: ActividadFiltrada[];
  onSelectionChange: (selectedIds: number[]) => void;
  initialSelectedIds?: number[];
}

export function ActividadesFiltradas({
  actividades,
  onSelectionChange,
  initialSelectedIds = [],
}: ActividadesFiltradasProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    () => new Set(initialSelectedIds)
  );

  // Use ref to track if we've already initialized
  const prevInitialIdsRef = useRef<string>("");

  // Only update when the actual IDs change, not the array reference
  useEffect(() => {
    const newIdsKey = JSON.stringify([...initialSelectedIds].sort());
    if (prevInitialIdsRef.current !== newIdsKey) {
      prevInitialIdsRef.current = newIdsKey;
      setSelectedIds(new Set(initialSelectedIds));
    }
  }, [initialSelectedIds]);

  const toggleSelection = (actividadId: number) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(actividadId)) {
      newSelection.delete(actividadId);
    } else {
      newSelection.add(actividadId);
    }
    setSelectedIds(newSelection);
    onSelectionChange(Array.from(newSelection));
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === actividades.length) {
      setSelectedIds(new Set());
      onSelectionChange([]);
    } else {
      const allIds = new Set(actividades.map((a) => a.IDA));
      setSelectedIds(allIds);
      onSelectionChange(Array.from(allIds));
    }
  };

  const isAllSelected =
    selectedIds.size === actividades.length && actividades.length > 0;

  if (actividades.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No se encontraron actividades con los filtros seleccionados.</p>
        <p className="text-sm mt-2">
          Intenta ajustar los filtros para ver resultados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {selectedIds.size} de {actividades.length} actividades seleccionadas
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10 border-b">
              <TableRow>
                <TableHead className="w-[50px] sticky left-0 bg-background z-20 border-r">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-[160px]">Nivel</TableHead>
                <TableHead className="w-[70px] text-center">Orden</TableHead>
                <TableHead className="w-[250px]">Descripción</TableHead>
                <TableHead className="w-[150px]">Funcionalidad</TableHead>
                <TableHead className="w-[150px]">Tarea Mantención</TableHead>
                <TableHead className="w-[100px]">Frecuencia</TableHead>
                <TableHead className="w-[120px]">Disciplina</TableHead>
                <TableHead className="w-[120px]">Clase</TableHead>
                <TableHead className="w-[120px]">Acceso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actividades.map((actividad) => (
                <TableRow
                  key={actividad.IDA}
                  className={
                    selectedIds.has(actividad.IDA) ? "bg-muted/50" : ""
                  }
                >
                  <TableCell className="sticky left-0 bg-background z-10 border-r">
                    <Checkbox
                      checked={selectedIds.has(actividad.IDA)}
                      onCheckedChange={() => toggleSelection(actividad.IDA)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs leading-tight">
                        {actividad.NIVEL_NOMBRE}
                      </span>
                      {actividad.JERARQUIA_NOMBRE && (
                        <Badge
                          variant="outline"
                          className="w-fit text-[10px] px-1 py-0"
                          style={
                            actividad.JERARQUIA_COLOR
                              ? {
                                  borderColor: actividad.JERARQUIA_COLOR,
                                  color: actividad.JERARQUIA_COLOR,
                                }
                              : undefined
                          }
                        >
                          {actividad.JERARQUIA_NOMBRE}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs">
                    {actividad.ORDEN}
                  </TableCell>
                  <TableCell>
                    <div
                      className="text-xs leading-tight"
                      title={actividad.DESCRIPCION}
                    >
                      {actividad.DESCRIPCION}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className="text-xs text-muted-foreground leading-tight"
                      title={actividad.FUNCIONALIDAD || ""}
                    >
                      {actividad.FUNCIONALIDAD || "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className="text-xs leading-tight"
                      title={actividad.TAREA_MANTENCION || ""}
                    >
                      {actividad.TAREA_MANTENCION || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {actividad.FRECUENCIA_TAREA && actividad.UNIDAD_FRECUENCIA
                      ? `${actividad.FRECUENCIA_TAREA} ${actividad.UNIDAD_FRECUENCIA}`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-xs">
                    {actividad.DISCIPLINA_TAREA_NOMBRE || "-"}
                  </TableCell>
                  <TableCell className="text-xs">
                    {actividad.CLASE_MANTENCION_NOMBRE || "-"}
                  </TableCell>
                  <TableCell className="text-xs">
                    {actividad.CONDICION_ACCESO_NOMBRE || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
