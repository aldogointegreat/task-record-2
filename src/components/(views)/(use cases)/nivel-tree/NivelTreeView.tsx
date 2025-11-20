'use client';

import { useState, useEffect } from 'react';
import { TreeView, TreeDataItem } from '@/components/tree-view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { getAllJerarquias, getAllNiveles, getAllActividadNiveles, getAllAtributos } from '@/lib/api';
import type { Jerarquia, Nivel, ActividadNivel, Atributo } from '@/models';
import { buildNivelTree } from '@/lib/utils/build-nivel-tree';
import { NivelDetailsPanel } from './NivelDetailsPanel';
import { ActividadNivelDetailsPanel } from './ActividadNivelDetailsPanel';
import { Info, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function NivelTreeView() {
  const [jerarquias, setJerarquias] = useState<Jerarquia[]>([]);
  const [niveles, setNiveles] = useState<Nivel[]>([]);
  const [actividadesNivel, setActividadesNivel] = useState<ActividadNivel[]>([]);
  const [atributos, setAtributos] = useState<Atributo[]>([]);
  const [treeData, setTreeData] = useState<TreeDataItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<TreeDataItem | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jerarquiasResult, nivelesResult, actividadesResult, atributosResult] = await Promise.all([
        getAllJerarquias(),
        getAllNiveles(),
        getAllActividadNiveles(),
        getAllAtributos(),
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

      // Construir el árbol si los datos principales están disponibles
      if (jerarquiasResult.success && nivelesResult.success && 
          jerarquiasResult.data && nivelesResult.data) {
        const tree = buildNivelTree(
          jerarquiasResult.data, 
          nivelesResult.data,
          actividadesResult.success && actividadesResult.data ? actividadesResult.data : undefined
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

  const renderTreeContent = (isResizable = false) => (
    <Card className={isResizable ? "h-full border-0 shadow-none rounded-none" : ""}>
          <CardHeader>
            <CardTitle className="text-lg">Jerarquía de Niveles</CardTitle>
            <CardDescription className="text-xs">
              Estructura jerárquica del sistema
            </CardDescription>
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
                  expandAll={false}
                />
              )}
            </div>
          </CardContent>
        </Card>
  );

  const renderDetailContent = (isResizable = false) => (
    <Card className={isResizable ? "h-full border-0 shadow-none rounded-none" : ""}>
          <CardHeader>
            <CardTitle>Información</CardTitle>
            <CardDescription>
              {selectedNivel
                ? 'Detalles del nivel seleccionado'
                : selectedActividad
                ? 'Detalles de la actividad seleccionada'
                : 'Selecciona un nivel o actividad del árbol para ver su información'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedNivel ? (
              <NivelDetailsPanel 
                nivel={selectedNivel} 
                jerarquias={jerarquias}
                niveles={niveles}
              />
            ) : selectedActividad ? (
              <ActividadNivelDetailsPanel 
                actividad={selectedActividad}
                atributos={atributos}
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

