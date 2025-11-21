'use client';

import { useState, useEffect } from 'react';
import { TreeView, TreeDataItem } from '@/components/tree-view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { 
  getAllJerarquias, 
  getAllNiveles, 
  getAllActividadNiveles, 
  getAllAtributos,
  getAllConsecuenciasFalla,
  getAllClasesMantencion,
  getAllCondicionesAcceso,
  getAllDisciplinasTarea,
  getAllDisciplinasNivel
} from '@/lib/api';
import type { 
  Jerarquia, 
  Nivel, 
  ActividadNivel, 
  Atributo,
  ConsecuenciaFalla,
  ClaseMantencion,
  CondicionAcceso,
  DisciplinaTarea,
  DisciplinaNivel
} from '@/models';
import { buildNivelTree } from '@/lib/utils/build-nivel-tree';
import { NivelDetailsPanel } from './NivelDetailsPanel';
import { ActividadNivelDetailsPanel } from './ActividadNivelDetailsPanel';
import { Info, Loader2, List, ListX, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function NivelTreeView() {
  const [jerarquias, setJerarquias] = useState<Jerarquia[]>([]);
  const [niveles, setNiveles] = useState<Nivel[]>([]);
  const [actividadesNivel, setActividadesNivel] = useState<ActividadNivel[]>([]);
  const [atributos, setAtributos] = useState<Atributo[]>([]);
  const [consecuenciasFalla, setConsecuenciasFalla] = useState<ConsecuenciaFalla[]>([]);
  const [clasesMantencion, setClasesMantencion] = useState<ClaseMantencion[]>([]);
  const [condicionesAcceso, setCondicionesAcceso] = useState<CondicionAcceso[]>([]);
  const [disciplinasTarea, setDisciplinasTarea] = useState<DisciplinaTarea[]>([]);
  const [disciplinasNivel, setDisciplinasNivel] = useState<DisciplinaNivel[]>([]);
  const [treeData, setTreeData] = useState<TreeDataItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<TreeDataItem | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [showActividades, setShowActividades] = useState(true);
  const [showJerarquia, setShowJerarquia] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  // Reconstruir árbol cuando cambie showActividades o showJerarquia (solo si ya tenemos datos)
  useEffect(() => {
    if (!loading && jerarquias.length > 0 && niveles.length > 0) {
      const tree = buildNivelTree(
        jerarquias,
        niveles,
        actividadesNivel.length > 0 ? actividadesNivel : undefined,
        showActividades,
        showJerarquia
      );
      setTreeData(tree);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showActividades, showJerarquia]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [
        jerarquiasResult, 
        nivelesResult, 
        actividadesResult, 
        atributosResult,
        consecuenciasResult,
        clasesResult,
        condicionesResult,
        disciplinasResult,
        disciplinasNivelResult
      ] = await Promise.all([
        getAllJerarquias(),
        getAllNiveles(),
        getAllActividadNiveles(),
        getAllAtributos(),
        getAllConsecuenciasFalla(),
        getAllClasesMantencion(),
        getAllCondicionesAcceso(),
        getAllDisciplinasTarea(),
        getAllDisciplinasNivel(),
      ]);

      if (jerarquiasResult.success && jerarquiasResult.data) {
        setJerarquias(jerarquiasResult.data);
      } else {
        toast.error('Error al cargar jerarquías');
      }

      if (nivelesResult.success && nivelesResult.data) {
        setNiveles(nivelesResult.data);
      } else {
        toast.error('Error al cargar niveles');
      }

      if (actividadesResult.success && actividadesResult.data) {
        setActividadesNivel(actividadesResult.data);
      }

      if (atributosResult.success && atributosResult.data) {
        setAtributos(atributosResult.data);
      }

      if (consecuenciasResult.success && consecuenciasResult.data) {
        setConsecuenciasFalla(consecuenciasResult.data);
      }

      if (clasesResult.success && clasesResult.data) {
        setClasesMantencion(clasesResult.data);
      }

      if (condicionesResult.success && condicionesResult.data) {
        setCondicionesAcceso(condicionesResult.data);
      }

      if (disciplinasResult.success && disciplinasResult.data) {
        setDisciplinasTarea(disciplinasResult.data);
      }

      if (disciplinasNivelResult.success && disciplinasNivelResult.data) {
        setDisciplinasNivel(disciplinasNivelResult.data);
      }

      // Construir el árbol si los datos principales están disponibles
      if (jerarquiasResult.success && nivelesResult.success && 
          jerarquiasResult.data && nivelesResult.data) {
        const tree = buildNivelTree(
          jerarquiasResult.data, 
          nivelesResult.data,
          actividadesResult.success && actividadesResult.data ? actividadesResult.data : undefined,
          showActividades,
          showJerarquia
        );
        setTreeData(tree);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleActividadUpdate = (updatedActividad: ActividadNivel) => {
    // Actualizar la actividad en el estado local
    setActividadesNivel(prev => {
      const updated = prev.map(act => act.IDA === updatedActividad.IDA ? updatedActividad : act);
      
      // Reconstruir el árbol con los datos actualizados
      if (jerarquias.length > 0 && niveles.length > 0) {
        const tree = buildNivelTree(
          jerarquias,
          niveles,
          updated,
          showActividades,
          showJerarquia
        );
        setTreeData(tree);
      }
      
      return updated;
    });
    
    // Actualizar el selectedItem si es la actividad seleccionada
    if (selectedItem?.metadata && 
        typeof selectedItem.metadata === 'object' && 
        'entity' in selectedItem.metadata && 
        selectedItem.metadata.entity === 'actividad-nivel' &&
        'data' in selectedItem.metadata) {
      const currentActividad = selectedItem.metadata.data as ActividadNivel;
      if (currentActividad.IDA === updatedActividad.IDA) {
        // Actualizar el metadata del selectedItem
        const updatedItem: TreeDataItem = {
          ...selectedItem,
          metadata: {
            ...selectedItem.metadata,
            data: updatedActividad
          }
        };
        setSelectedItem(updatedItem);
      }
    }
  };

  const handleActividadesChange = async () => {
    // Recargar solo las actividades en segundo plano sin refrescar el árbol
    try {
      const actividadesResult = await getAllActividadNiveles();
      if (actividadesResult.success && actividadesResult.data) {
        setActividadesNivel(actividadesResult.data);
        
        // Reconstruir el árbol con los nuevos datos pero sin cambiar el estado de loading
        if (jerarquias.length > 0 && niveles.length > 0) {
          const tree = buildNivelTree(
            jerarquias, 
            niveles,
            actividadesResult.data,
            showActividades,
            showJerarquia
          );
          setTreeData(tree);
          
          // Si hay un item seleccionado, actualizarlo con el nuevo árbol
          if (selectedItem?.metadata && typeof selectedItem.metadata === 'object' && 'entity' in selectedItem.metadata) {
            const metadata = selectedItem.metadata;
            
            // Actualizar nivel seleccionado
            if (metadata.entity === 'nivel' && 'data' in metadata) {
              const currentNivelId = (metadata.data as Nivel).IDN;
              const findUpdatedItem = (items: TreeDataItem[]): TreeDataItem | null => {
                for (const item of items) {
                  if (item.id === `nivel-${currentNivelId}`) return item;
                  if (item.children) {
                    const found = findUpdatedItem(item.children);
                    if (found) return found;
                  }
                }
                return null;
              };
              const updatedItem = findUpdatedItem(tree);
              if (updatedItem) setSelectedItem(updatedItem);
            }
            
            // Actualizar actividad seleccionada
            if (metadata.entity === 'actividad-nivel' && 'data' in metadata) {
              const currentActividadId = (metadata.data as ActividadNivel).IDA;
              const findUpdatedItem = (items: TreeDataItem[]): TreeDataItem | null => {
                for (const item of items) {
                  if (item.id === `actividad-${currentActividadId}`) return item;
                  if (item.children) {
                    const found = findUpdatedItem(item.children);
                    if (found) return found;
                  }
                }
                return null;
              };
              const updatedItem = findUpdatedItem(tree);
              if (updatedItem) setSelectedItem(updatedItem);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error updating actividades:', error);
    }
  };

  const handleNivelesChange = async () => {
    // Recargar los niveles Y actividades en segundo plano sin refrescar completamente
    try {
      const [nivelesResult, actividadesResult] = await Promise.all([
        getAllNiveles(),
        getAllActividadNiveles()
      ]);
      
      if (nivelesResult.success && nivelesResult.data) {
        setNiveles(nivelesResult.data);
      }
      
      if (actividadesResult.success && actividadesResult.data) {
        setActividadesNivel(actividadesResult.data);
      }
        
      // Reconstruir el árbol con los nuevos datos
      if (jerarquias.length > 0 && nivelesResult.success && nivelesResult.data) {
        const tree = buildNivelTree(
          jerarquias,
          nivelesResult.data,
          actividadesResult.success && actividadesResult.data ? actividadesResult.data : undefined,
          showActividades,
          showJerarquia
        );
        setTreeData(tree);
        
        // Si hay un nivel seleccionado, actualizarlo con los datos frescos
        if (selectedItem?.metadata && 
            typeof selectedItem.metadata === 'object' && 
            'entity' in selectedItem.metadata && 
            selectedItem.metadata.entity === 'nivel' &&
            'data' in selectedItem.metadata) {
          const currentNivelId = (selectedItem.metadata.data as Nivel).IDN;
          const updatedNivel = nivelesResult.data.find(n => n.IDN === currentNivelId);
          
          if (updatedNivel) {
            // Encontrar el item actualizado en el nuevo árbol
            const findUpdatedItem = (items: TreeDataItem[]): TreeDataItem | null => {
              for (const item of items) {
                if (item.id === `nivel-${currentNivelId}`) {
                  return item;
                }
                if (item.children) {
                  const found = findUpdatedItem(item.children);
                  if (found) return found;
                }
              }
              return null;
            };
            
            const updatedItem = findUpdatedItem(tree);
            if (updatedItem) {
              setSelectedItem(updatedItem);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error updating niveles:', error);
    }
  };

  // Extraer el nivel o actividad del item seleccionado
  const selectedNivel = selectedItem?.metadata && 
    typeof selectedItem.metadata === 'object' && 
    'entity' in selectedItem.metadata && 
    selectedItem.metadata.entity === 'nivel' &&
    'data' in selectedItem.metadata
    ? (selectedItem.metadata.data as Nivel)
    : null;

  const selectedActividad = selectedItem?.metadata && 
    typeof selectedItem.metadata === 'object' && 
    'entity' in selectedItem.metadata && 
    selectedItem.metadata.entity === 'actividad-nivel' &&
    'data' in selectedItem.metadata
    ? (selectedItem.metadata.data as ActividadNivel)
    : null;

  const handleToggleActividades = () => {
    setShowActividades(prev => !prev);
  };

  const handleToggleJerarquia = () => {
    setShowJerarquia(prev => !prev);
  };

  const renderTreeContent = (isResizable = false) => (
    <Card className={isResizable ? "h-full border-0 shadow-none rounded-none gap-1" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
            <CardTitle className="text-lg">Jerarquía de Niveles</CardTitle>
            <CardDescription className="text-xs">
              Estructura jerárquica del sistema
            </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleToggleActividades}
                    title={showActividades ? 'Ocultar actividades' : 'Mostrar actividades'}
                  >
                    {showActividades ? (
                      <List className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ListX className="h-4 w-4 text-muted-foreground opacity-50" />
                    )}
                  </Button>
                  <span className="text-[10px] text-muted-foreground leading-none">Actividades</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleToggleJerarquia}
                    title={showJerarquia ? 'Ocultar jerarquía' : 'Mostrar jerarquía'}
                  >
                    {showJerarquia ? (
                      <Layers className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <div className="relative">
                        <Layers className="h-4 w-4 text-muted-foreground opacity-40" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-[1.5px] w-5 bg-muted-foreground opacity-60 rotate-45" />
                        </div>
                      </div>
                    )}
                  </Button>
                  <span className="text-[10px] text-muted-foreground leading-none">Jerarquía</span>
                </div>
              </div>
            </div>
          </CardHeader>
      <CardContent className="p-0 h-[calc(100%-80px)]">
        <div className={`overflow-x-auto overflow-y-auto p-4 ${isResizable ? "h-full" : "max-h-[calc(100vh-200px)] min-w-[300px]"}`}>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : treeData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Info className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No hay datos disponibles
                  </p>
                </div>
              ) : (
                <TreeView
                  data={treeData}
                  onSelectChange={(item) => setSelectedItem(item)}
                  expandAll={true}
                />
              )}
            </div>
          </CardContent>
        </Card>
  );

  const renderDetailContent = (isResizable = false) => (
    <Card className={isResizable ? "h-full border-0 shadow-none rounded-none" : ""}>
         
          <CardContent>
            {selectedNivel ? (
              <NivelDetailsPanel 
                nivel={selectedNivel} 
                jerarquias={jerarquias}
                niveles={niveles}
                actividadesNivel={actividadesNivel}
                atributos={atributos}
                disciplinasNivel={disciplinasNivel}
                onActividadesChange={handleActividadesChange}
                onNivelesChange={handleNivelesChange}
              />
            ) : selectedActividad ? (
              <ActividadNivelDetailsPanel 
                actividad={selectedActividad}
                atributos={atributos}
                consecuenciasFalla={consecuenciasFalla}
                clasesMantencion={clasesMantencion}
                condicionesAcceso={condicionesAcceso}
                disciplinasTarea={disciplinasTarea}
                niveles={niveles}
                onActividadChange={handleActividadUpdate}
                onActividadesChange={handleActividadesChange}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Info className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Haz clic en cualquier nivel o actividad del árbol para ver su información detallada
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Los niveles pueden contener otros niveles y actividades asociadas
                </p>
              </div>
            )}
          </CardContent>
        </Card>
  );

  return (
    <>
      {/* Mobile View - Stacked */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        <div>
          {renderTreeContent(false)}
        </div>
        <div>
          {renderDetailContent(false)}
        </div>
      </div>

      {/* Desktop View - Resizable Panel */}
      <div className="hidden lg:block h-[calc(100vh-140px)] border rounded-lg overflow-hidden bg-background shadow-sm">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40} className="bg-card">
            {renderTreeContent(true)}
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={75} className="bg-card">
            <div className="h-full overflow-y-auto">
              {renderDetailContent(true)}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
    </div>
    </>
  );
}
