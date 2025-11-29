"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getActividadesFiltradas,
  getAllDisciplinasTarea,
  getAllClasesMantencion,
  getAllCondicionesAcceso,
  createPMFromActividades,
} from "@/lib/api";
import type {
  ActividadFiltrada,
  ActividadFiltradaFilters,
  DisciplinaTarea,
  ClaseMantencion,
  CondicionAcceso,
  CreatePMFromActividadesDTO,
} from "@/models";
import { FiltrosActividades } from "./FiltrosActividades";
import { ActividadesFiltradas } from "./ActividadesFiltradas";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";

interface PMCreacionFormProps {
  onSuccess?: () => void;
}

export function PMCreacionForm({ onSuccess }: PMCreacionFormProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingActividades, setLoadingActividades] = useState(false);
  const [creating, setCreating] = useState(false);

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

  // Actividades filtradas
  const [actividades, setActividades] = useState<ActividadFiltrada[]>([]);
  const [selectedActividadesIds, setSelectedActividadesIds] = useState<
    number[]
  >([]);

  // Form data
  const [formData, setFormData] = useState({
    TITULO: "",
    NRO: 1,
    HOROMETRO: 0,
    PROGRAMACION: "",
    ESTADO: "PENDIENTE",
    INICIO: "",
    FIN: "",
  });

  useEffect(() => {
    if (openDialog) {
      loadCatalogos();
      initFormData();
    }
  }, [openDialog]);

  const loadCatalogos = async () => {
    setLoading(true);
    try {
      const [dtResult, cmResult, caResult] = await Promise.all([
        getAllDisciplinasTarea(),
        getAllClasesMantencion(),
        getAllCondicionesAcceso(),
      ]);

      if (dtResult.success && dtResult.data) setDisciplinasTarea(dtResult.data);
      if (cmResult.success && cmResult.data) setClasesMantencion(cmResult.data);
      if (caResult.success && caResult.data)
        setCondicionesAcceso(caResult.data);
    } catch (error) {
      console.error("Error loading catalogs:", error);
      toast.error("Error al cargar catálogos");
    } finally {
      setLoading(false);
    }
  };

  const initFormData = () => {
    const hoy = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({
      ...prev,
      PROGRAMACION: hoy,
      INICIO: hoy,
      FIN: hoy,
    }));
  };

  const handleFilterChange = async (filters: ActividadFiltradaFilters) => {
    if (Object.keys(filters).length === 0) {
      setActividades([]);
      setSelectedActividadesIds([]);
      return;
    }

    setLoadingActividades(true);
    try {
      const result = await getActividadesFiltradas(filters);
      if (result.success && result.data) {
        setActividades(result.data);
        setSelectedActividadesIds([]);
      } else {
        toast.error("Error al obtener actividades filtradas");
        setActividades([]);
      }
    } catch (error) {
      console.error("Error fetching filtered activities:", error);
      toast.error("Error al obtener actividades filtradas");
      setActividades([]);
    } finally {
      setLoadingActividades(false);
    }
  };

  const handleSelectionChange = (selectedIds: number[]) => {
    setSelectedActividadesIds(selectedIds);
  };

  const handleCreatePM = async () => {
    // Validaciones
    if (selectedActividadesIds.length === 0) {
      toast.error("Debe seleccionar al menos una actividad");
      return;
    }
    if (!formData.PROGRAMACION || !formData.INICIO || !formData.FIN) {
      toast.error("Debe completar todas las fechas");
      return;
    }

    setCreating(true);
    try {
      const createData: CreatePMFromActividadesDTO = {
        TITULO: formData.TITULO,
        NRO: formData.NRO,
        HOROMETRO: formData.HOROMETRO,
        IDN: 1, // Temporal - será implementado después
        CONJUNTO: 1, // Temporal - será implementado después
        PROGRAMACION: formData.PROGRAMACION,
        ESTADO: formData.ESTADO,
        INICIO: formData.INICIO,
        FIN: formData.FIN,
        actividadesIds: selectedActividadesIds,
      };

      const result = await createPMFromActividades(createData);

      if (result.success) {
        toast.success(
          `PM creada exitosamente con ${selectedActividadesIds.length} actividades`
        );
        setOpenDialog(false);

        // Reset form
        setActividades([]);
        setSelectedActividadesIds([]);
        initFormData();

        if (onSuccess) onSuccess();
      } else {
        toast.error(result.message || "Error al crear PM");
      }
    } catch (error) {
      console.error("Error creating PM:", error);
      toast.error("Error al crear PM");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Crear Nueva PM
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-[600px] sm:max-w-[1800px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Pauta de Mantenimiento</DialogTitle>
          <DialogDescription>
            Seleccione actividades usando los filtros y complete la información
            de la PM
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Sección 1: Información Básica de PM */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold">Información de la PM</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="col-span-full space-y-2">
                  <Label htmlFor="titulo">TÍTULO</Label>
                  <Input
                    id="titulo"
                    value={formData.TITULO}
                    onChange={(e) =>
                      setFormData({ ...formData, TITULO: e.target.value })
                    }
                    placeholder="Ingrese un título para la PM"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nro">NRO</Label>
                  <Input
                    id="nro"
                    type="number"
                    value={formData.NRO}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        NRO: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horometro">HORÓMETRO</Label>
                  <Input
                    id="horometro"
                    type="number"
                    value={formData.HOROMETRO}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        HOROMETRO: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="programacion">PROGRAMACIÓN *</Label>
                  <Input
                    id="programacion"
                    type="date"
                    value={formData.PROGRAMACION}
                    onChange={(e) =>
                      setFormData({ ...formData, PROGRAMACION: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">ESTADO *</Label>
                  <Select
                    value={formData.ESTADO}
                    onValueChange={(value) =>
                      setFormData({ ...formData, ESTADO: value })
                    }
                  >
                    <SelectTrigger id="estado">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDIENTE">PENDIENTE</SelectItem>
                      <SelectItem value="COMPLETADO">COMPLETADO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inicio">INICIO *</Label>
                  <Input
                    id="inicio"
                    type="date"
                    value={formData.INICIO}
                    onChange={(e) =>
                      setFormData({ ...formData, INICIO: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fin">FIN *</Label>
                  <Input
                    id="fin"
                    type="date"
                    value={formData.FIN}
                    onChange={(e) =>
                      setFormData({ ...formData, FIN: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Sección 2: Filtros de Actividades */}
            <FiltrosActividades
              onFilterChange={handleFilterChange}
              disciplinasTarea={disciplinasTarea}
              clasesMantencion={clasesMantencion}
              condicionesAcceso={condicionesAcceso}
            />

            {/* Sección 3: Tabla de Actividades */}
            {loadingActividades ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Cargando actividades...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-semibold">
                  Actividades Disponibles{" "}
                  {actividades.length > 0 && `(${actividades.length})`}
                </h3>
                <ActividadesFiltradas
                  actividades={actividades}
                  onSelectionChange={handleSelectionChange}
                />
              </div>
            )}

            {/* Botón de Crear */}
            <div className="flex justify-end gap-4 border-t pt-4">
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreatePM}
                disabled={creating || selectedActividadesIds.length === 0}
              >
                {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Crear PM con {selectedActividadesIds.length} actividades
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
