"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  getActividadesByPM,
  updateActividadesPM,
  getActividadesFiltradas,
  getAllDisciplinasTarea,
  getAllClasesMantencion,
  getAllCondicionesAcceso,
} from "@/lib/api";
import type {
  PM,
  ActividadFiltrada,
  ActividadFiltradaFilters,
  DisciplinaTarea,
  ClaseMantencion,
  CondicionAcceso,
} from "@/models";
import { FiltrosActividades } from "./FiltrosActividades";
import { ActividadesFiltradas } from "./ActividadesFiltradas";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PMEdicionActividadesProps {
  pm: PM;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function PMEdicionActividades({
  pm,
  onSuccess,
  trigger,
}: PMEdicionActividadesProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingActividades, setLoadingActividades] = useState(false);
  const [saving, setSaving] = useState(false);

  // Catálogos
  const [disciplinasTarea, setDisciplinasTarea] = useState<DisciplinaTarea[]>(
    []
  );
  const [clasesMantencion, setClasesMantencion] = useState<ClaseMantencion[]>(
    []
  );
  const [condicionesAcceso, setCondicionesAcceso] = useState<CondicionAcceso[]>(
    []
  );

  // Actividades actuales de la PM
  const [actividadesActuales, setActividadesActuales] = useState<
    ActividadFiltrada[]
  >([]);

  // Actividades disponibles (filtradas)
  const [actividadesDisponibles, setActividadesDisponibles] = useState<
    ActividadFiltrada[]
  >([]);

  // IDs seleccionados (inicialmente las actividades actuales)
  const [selectedActividadesIds, setSelectedActividadesIds] = useState<
    number[]
  >([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [actividadesResult, dtResult, cmResult, caResult] =
        await Promise.all([
          getActividadesByPM(pm.IDPM),
          getAllDisciplinasTarea(),
          getAllClasesMantencion(),
          getAllCondicionesAcceso(),
        ]);

      if (actividadesResult.success && actividadesResult.data) {
        setActividadesActuales(actividadesResult.data);
        setSelectedActividadesIds(actividadesResult.data.map((a) => a.IDA));
      }

      if (dtResult.success && dtResult.data) setDisciplinasTarea(dtResult.data);
      if (cmResult.success && cmResult.data) setClasesMantencion(cmResult.data);
      if (caResult.success && caResult.data)
        setCondicionesAcceso(caResult.data);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, [pm.IDPM]);

  useEffect(() => {
    if (openDialog) {
      loadData();
    }
  }, [openDialog, loadData]);

  const handleFilterChange = async (filters: ActividadFiltradaFilters) => {
    if (Object.keys(filters).length === 0) {
      setActividadesDisponibles([]);
      return;
    }

    setLoadingActividades(true);
    try {
      const result = await getActividadesFiltradas(filters);
      if (result.success && result.data) {
        setActividadesDisponibles(result.data);
      } else {
        toast.error("Error al obtener actividades filtradas");
        setActividadesDisponibles([]);
      }
    } catch (error) {
      console.error("Error fetching filtered activities:", error);
      toast.error("Error al obtener actividades filtradas");
      setActividadesDisponibles([]);
    } finally {
      setLoadingActividades(false);
    }
  };

  const handleSelectionChange = useCallback((selectedIds: number[]) => {
    setSelectedActividadesIds(selectedIds);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateActividadesPM(pm.IDPM, selectedActividadesIds);

      if (result.success) {
        toast.success(
          `Actividades actualizadas exitosamente (${selectedActividadesIds.length} actividades)`
        );
        setOpenDialog(false);

        if (onSuccess) onSuccess();
      } else {
        toast.error(result.message || "Error al actualizar actividades");
      }
    } catch (error) {
      console.error("Error updating activities:", error);
      toast.error("Error al actualizar actividades");
    } finally {
      setSaving(false);
    }
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm">
      <Edit className="h-4 w-4 mr-1" />
      Actividades
    </Button>
  );

  // Resetear estados cuando se cierra el dialog
  const handleOpenChange = (open: boolean) => {
    setOpenDialog(open);
    if (!open) {
      // Resetear estados cuando se cierra
      setActividadesDisponibles([]);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-[600px] sm:max-w-[1800px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Editar Actividades de PM #{pm.IDPM}
            {pm.TITULO && ` - ${pm.TITULO}`}
          </DialogTitle>
          <DialogDescription className="text-sm">
            Gestione las actividades de esta pauta de mantenimiento. Use los
            filtros para encontrar nuevas actividades o deseleccione las
            existentes para eliminarlas.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Sección 1: Actividades Actuales */}
            <div className="space-y-3 p-4 border-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-blue-500/10">
                    <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-base">
                    Actividades Actuales
                  </h3>
                </div>
                <Badge variant="secondary" className="text-sm font-medium">
                  {selectedActividadesIds.filter((id) =>
                    actividadesActuales.some((a) => a.IDA === id)
                  ).length}{" "}
                  de {actividadesActuales.length} actividades seleccionadas
                </Badge>
              </div>
              {actividadesActuales.length > 0 ? (
                <ActividadesFiltradas
                  actividades={actividadesActuales}
                  onSelectionChange={(ids) => {
                    // Mantener las actividades de disponibles y actualizar solo las actuales
                    const idsDisponibles = actividadesDisponibles
                      .map((a) => a.IDA)
                      .filter((id) => selectedActividadesIds.includes(id));
                    const nuevasIds = [...idsDisponibles, ...ids];
                    handleSelectionChange([...new Set(nuevasIds)]);
                  }}
                  initialSelectedIds={selectedActividadesIds.filter((id) =>
                    actividadesActuales.some((a) => a.IDA === id)
                  )}
                />
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center bg-background/50 rounded border-2 border-dashed">
                  Esta PM no tiene actividades asignadas
                </p>
              )}
            </div>

            {/* Sección 2: Filtros de Actividades */}
            <div className="p-4 border rounded-lg bg-muted/30">
              <FiltrosActividades
                onFilterChange={handleFilterChange}
                disciplinasTarea={disciplinasTarea}
                clasesMantencion={clasesMantencion}
                condicionesAcceso={condicionesAcceso}
              />
            </div>

            {/* Sección 3: Tabla de Actividades Disponibles */}
            {loadingActividades ? (
              <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/20">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <span className="text-sm text-muted-foreground">
                  Cargando actividades...
                </span>
              </div>
            ) : actividadesDisponibles.length > 0 ? (
              <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base">
                    Actividades Disponibles
                  </h3>
                  <Badge variant="outline" className="text-sm">
                    {actividadesDisponibles.length} encontradas
                  </Badge>
                </div>
                <ActividadesFiltradas
                  actividades={actividadesDisponibles}
                  onSelectionChange={(ids) => {
                    // Mantener las actividades actuales seleccionadas y agregar/remover las disponibles
                    const idsActuales = actividadesActuales
                      .map((a) => a.IDA)
                      .filter((id) => selectedActividadesIds.includes(id));
                    const nuevasIds = [...idsActuales, ...ids];
                    handleSelectionChange([...new Set(nuevasIds)]);
                  }}
                  initialSelectedIds={selectedActividadesIds.filter((id) =>
                    actividadesDisponibles.some((a) => a.IDA === id)
                  )}
                />
              </div>
            ) : null}

            {/* Resumen de Selección */}
            <div className="p-4 border-2 rounded-lg bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-base">
                  Actividades seleccionadas totales:
                </span>
                <Badge variant="default" className="text-base px-3 py-1.5">
                  {selectedActividadesIds.length}
                </Badge>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setOpenDialog(false)}
                className="min-w-[100px]"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="min-w-[140px]"
              >
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Guardar Cambios
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
