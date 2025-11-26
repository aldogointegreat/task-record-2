"use client";

import { useState } from "react";
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
}

export function ActividadesFiltradas({
  actividades,
  onSelectionChange,
}: ActividadesFiltradasProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {selectedIds.size} de {actividades.length} actividades seleccionadas
        </p>
      </div>

      <div className="border rounded-lg max-w-full">
        <div className="h-[400px] overflow-x-auto overflow-y-auto max-w-[85vw] ml-3 block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 sticky left-0 bg-background z-10">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="min-w-[180px]">Nivel</TableHead>
                <TableHead className="w-16">Orden</TableHead>
                <TableHead className="min-w-[300px]">Descripción</TableHead>
                <TableHead className="min-w-[200px]">Funcionalidad</TableHead>
                <TableHead className="min-w-[200px]">
                  Tarea Mantención
                </TableHead>
                <TableHead className="min-w-[120px]">Frecuencia</TableHead>
                <TableHead className="min-w-[150px]">Disciplina</TableHead>
                <TableHead className="min-w-[150px]">Clase</TableHead>
                <TableHead className="min-w-[150px]">Acceso</TableHead>
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
                  <TableCell className="sticky left-0 bg-background z-10">
                    <Checkbox
                      checked={selectedIds.has(actividad.IDA)}
                      onCheckedChange={() => toggleSelection(actividad.IDA)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col gap-1">
                      <span>{actividad.NIVEL_NOMBRE}</span>
                      {actividad.JERARQUIA_NOMBRE && (
                        <Badge
                          variant="outline"
                          className="w-fit text-xs"
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
                  <TableCell>{actividad.ORDEN}</TableCell>
                  <TableCell>
                    <div
                      className="max-w-[300px]"
                      title={actividad.DESCRIPCION}
                    >
                      {actividad.DESCRIPCION}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className="max-w-[200px] text-sm text-muted-foreground"
                      title={actividad.FUNCIONALIDAD || ""}
                    >
                      {actividad.FUNCIONALIDAD || "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className="max-w-[200px] text-sm"
                      title={actividad.TAREA_MANTENCION || ""}
                    >
                      {actividad.TAREA_MANTENCION || "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {actividad.FRECUENCIA_TAREA && actividad.UNIDAD_FRECUENCIA
                      ? `${actividad.FRECUENCIA_TAREA} ${actividad.UNIDAD_FRECUENCIA}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {actividad.DISCIPLINA_TAREA_NOMBRE || "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {actividad.CLASE_MANTENCION_NOMBRE || "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {actividad.CONDICION_ACCESO_NOMBRE || "-"}
                    </div>
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
