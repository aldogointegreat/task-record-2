"use client";

import { useState, useEffect } from "react";
import { getAllNiveles } from "@/lib/api";
import type {
  Nivel,
  DisciplinaTarea,
  ClaseMantencion,
  CondicionAcceso,
  ActividadFiltradaFilters,
} from "@/models";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { X, Filter } from "lucide-react";

interface FiltrosActividadesProps {
  onFilterChange: (filters: ActividadFiltradaFilters) => void;
  disciplinasTarea: DisciplinaTarea[];
  clasesMantencion: ClaseMantencion[];
  condicionesAcceso: CondicionAcceso[];
}

export function FiltrosActividades({
  onFilterChange,
  disciplinasTarea,
  clasesMantencion,
  condicionesAcceso,
}: FiltrosActividadesProps) {
  const [niveles, setNiveles] = useState<Nivel[]>([]);
  const [filters, setFilters] = useState<ActividadFiltradaFilters>({});

  useEffect(() => {
    loadNiveles();
  }, []);

  const loadNiveles = async () => {
    const result = await getAllNiveles();
    if (result.success && result.data) {
      setNiveles(result.data);
    }
  };

  const handleFilterChange = (
    key: keyof ActividadFiltradaFilters,
    value: string | number | undefined
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const hasFilters = Object.keys(filters).length > 0;

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h3 className="font-semibold">Filtros de Actividades</h3>
        </div>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-8"
          >
            <X className="h-4 w-4 mr-2" />
            Limpiar Filtros
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Filtro por Nivel */}
        <div className="space-y-2">
          <Label htmlFor="nivel">Nivel (incluye sub-niveles)</Label>
          <Select
            value={filters.nivelId?.toString()}
            onValueChange={(value) =>
              handleFilterChange("nivelId", value ? parseInt(value) : undefined)
            }
          >
            <SelectTrigger id="nivel">
              <SelectValue placeholder="Todos los niveles" />
            </SelectTrigger>
            <SelectContent>
              {niveles.map((nivel) => (
                <SelectItem key={nivel.IDN} value={nivel.IDN.toString()}>
                  {nivel.NOMBRE}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por Disciplina de Tarea */}
        <div className="space-y-2">
          <Label htmlFor="disciplina">Disciplina de Tarea</Label>
          <Select
            value={filters.disciplinaTareaId?.toString()}
            onValueChange={(value) =>
              handleFilterChange(
                "disciplinaTareaId",
                value ? parseInt(value) : undefined
              )
            }
          >
            <SelectTrigger id="disciplina">
              <SelectValue placeholder="Todas las disciplinas" />
            </SelectTrigger>
            <SelectContent>
              {disciplinasTarea.map((dt) => (
                <SelectItem
                  key={dt.ID_DISCIPLINA_TAREA}
                  value={dt.ID_DISCIPLINA_TAREA.toString()}
                >
                  {dt.NOMBRE}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por Condición de Acceso */}
        <div className="space-y-2">
          <Label htmlFor="condicion">Condición de Acceso</Label>
          <Select
            value={filters.condicionAccesoId?.toString()}
            onValueChange={(value) =>
              handleFilterChange(
                "condicionAccesoId",
                value ? parseInt(value) : undefined
              )
            }
          >
            <SelectTrigger id="condicion">
              <SelectValue placeholder="Todas las condiciones" />
            </SelectTrigger>
            <SelectContent>
              {condicionesAcceso.map((ca) => (
                <SelectItem
                  key={ca.ID_CONDICION}
                  value={ca.ID_CONDICION.toString()}
                >
                  {ca.NOMBRE}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por Clase de Mantención */}
        <div className="space-y-2">
          <Label htmlFor="clase">Clase de Mantención</Label>
          <Select
            value={filters.claseMantencionId?.toString()}
            onValueChange={(value) =>
              handleFilterChange(
                "claseMantencionId",
                value ? parseInt(value) : undefined
              )
            }
          >
            <SelectTrigger id="clase">
              <SelectValue placeholder="Todas las clases" />
            </SelectTrigger>
            <SelectContent>
              {clasesMantencion.map((cm) => (
                <SelectItem key={cm.ID_CLASE} value={cm.ID_CLASE.toString()}>
                  {cm.NOMBRE}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por Frecuencia */}
        <div className="space-y-2">
          <Label htmlFor="frecuencia">Frecuencia de Tarea</Label>
          <Input
            id="frecuencia"
            type="number"
            placeholder="Ej: 1, 2, 3..."
            value={filters.frecuenciaTarea?.toString() || ""}
            onChange={(e) =>
              handleFilterChange(
                "frecuenciaTarea",
                e.target.value ? parseFloat(e.target.value) : undefined
              )
            }
          />
        </div>

        {/* Filtro por Unidad de Frecuencia */}
        <div className="space-y-2">
          <Label htmlFor="unidadFrecuencia">Unidad de Frecuencia</Label>
          <Select
            value={filters.unidadFrecuencia}
            onValueChange={(value) =>
              handleFilterChange("unidadFrecuencia", value || undefined)
            }
          >
            <SelectTrigger id="unidadFrecuencia">
              <SelectValue placeholder="Todas las unidades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Segundos">Segundos</SelectItem>
              <SelectItem value="Minutos">Minutos</SelectItem>
              <SelectItem value="Horas">Horas</SelectItem>
              <SelectItem value="Días">Días</SelectItem>
              <SelectItem value="Semanas">Semanas</SelectItem>
              <SelectItem value="Meses">Meses</SelectItem>
              <SelectItem value="Años">Años</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleApplyFilters} className="w-full md:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
}
