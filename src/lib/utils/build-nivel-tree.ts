'use client';

import React from 'react';
import type { TreeDataItem } from '@/components/tree-view';
import type { Jerarquia, Nivel, ActividadNivel } from '@/models';
import { FolderTree, Folder, FileText, Wrench, ListChecks } from 'lucide-react';

/**
 * Construye un árbol jerárquico en cadena atravesando las jerarquías
 * 
 * Estructura en CADENA (PLANTILLA):
 * Área -> Proceso -> Sistema -> Conjunto -> Componente -> Sub-Componente
 *   └── ACTIVIDAD_NIVEL (actividades asociadas a cada nivel)
 * 
 * Cada nivel pertenece a una jerarquía (IDJ) y puede tener un padre (IDNP)
 * que pertenece a la jerarquía anterior en la cadena.
 * Cada nivel puede tener múltiples ACTIVIDAD_NIVEL asociadas.
 */
export function buildNivelTree(
  jerarquias: Jerarquia[],
  niveles: Nivel[],
  actividadesNivel?: ActividadNivel[]
): TreeDataItem[] {
  // Orden esperado de jerarquías (en cadena)
  const jerarquiaOrder = ['área', 'proceso', 'sistema', 'conjunto', 'componente', 'sub-componente'];
  
  // Crear un mapa de jerarquías por nombre para acceso rápido
  const jerarquiaMap = new Map<string, Jerarquia>();
  jerarquias.forEach(j => {
    const matchedOrder = jerarquiaOrder.find(order => 
      j.DESCRIPCION.toLowerCase().includes(order)
    );
    if (matchedOrder) {
      jerarquiaMap.set(matchedOrder, j);
    }
  });

  // Helper para construir actividades de nivel
  const buildActividadesNivel = (nivelId: number): TreeDataItem[] => {
    if (!actividadesNivel || actividadesNivel.length === 0) {
      return [];
    }

    const actividades = actividadesNivel
      .filter(a => a.IDN === nivelId)
      .sort((a, b) => a.ORDEN - b.ORDEN); // Ordenar por ORDEN

    return actividades.map(actividad => ({
      id: `actividad-${actividad.IDA}`,
      name: `${actividad.ORDEN}. ${actividad.DESCRIPCION}`,
      icon: ListChecks,
      metadata: {
        type: 'Actividad',
        entity: 'actividad-nivel',
        data: actividad,
      },
    }));
  };

  // Helper para obtener el nombre de la jerarquía de un nivel
  const getJerarquiaNombre = (nivel: Nivel): string => {
    const jerarquia = jerarquias.find(j => j.IDJ === nivel.IDJ);
    return jerarquia ? jerarquia.DESCRIPCION : '';
  };

  // Helper para construir niveles recursivamente a través de las jerarquías
  const buildNivelChildren = (parentId: number): TreeDataItem[] => {
    // Buscar todos los niveles cuyo padre (IDNP) es el parentId
    const children = niveles.filter(n => n.IDNP === parentId);
    
    // Ordenar los hijos alfabéticamente
    const sortedChildren = children.sort((a, b) => 
      a.NOMBRE.localeCompare(b.NOMBRE)
    );
    
    return sortedChildren.map(nivel => {
      // Verificar si este nivel tiene hijos (otros niveles)
      const hasNivelChildren = niveles.some(n => n.IDNP === nivel.IDN);
      
      // Obtener actividades de este nivel
      const actividades = buildActividadesNivel(nivel.IDN);
      
      // Obtener nombre de la jerarquía
      const jerarquiaNombre = getJerarquiaNombre(nivel);
      
      // Combinar hijos de nivel y actividades
      const allChildren: TreeDataItem[] = [];
      
      // Primero agregar hijos de nivel (otros niveles)
      if (hasNivelChildren) {
        allChildren.push(...buildNivelChildren(nivel.IDN));
      }
      
      // Luego agregar actividades de nivel
      if (actividades.length > 0) {
        allChildren.push(...actividades);
      }
      
      return {
        id: `nivel-${nivel.IDN}`,
        name: (
          <span className="flex items-center gap-2 w-full">
            <span className="flex-1 truncate">{nivel.NOMBRE}</span>
            {jerarquiaNombre && (
              <span className="text-xs text-muted-foreground font-normal shrink-0">
                ({jerarquiaNombre})
              </span>
            )}
          </span>
        ),
        icon: hasNivelChildren || actividades.length > 0 ? Folder : FileText,
        openIcon: Folder,
        metadata: {
          type: 'Nivel',
          entity: 'nivel',
          data: nivel,
        },
        // Combinar hijos de nivel y actividades
        children: allChildren.length > 0 ? allChildren : undefined,
      };
    });
  };

  // Obtener la jerarquía raíz (Área)
  const areaJerarquia = jerarquiaMap.get('área');
  
  if (!areaJerarquia) {
    console.warn('No se encontró la jerarquía "Área". Mostrando todas las jerarquías.');
    // Fallback: mostrar estructura anterior si no hay Área
    return jerarquias.map(jerarquia => {
      const rootNiveles = niveles.filter(
        n => n.IDJ === jerarquia.IDJ && (n.IDNP === null || n.IDNP === 0)
      );
      
      const children = rootNiveles.map(nivel => {
        const jerarquiaNombre = getJerarquiaNombre(nivel);
        return {
          id: `nivel-${nivel.IDN}`,
          name: (
            <span className="flex items-center gap-2 w-full">
              <span className="flex-1 truncate">{nivel.NOMBRE}</span>
              {jerarquiaNombre && (
                <span className="text-xs text-muted-foreground font-normal shrink-0">
                  ({jerarquiaNombre})
                </span>
              )}
            </span>
          ),
          icon: niveles.some(n => n.IDNP === nivel.IDN) ? Folder : FileText,
          openIcon: Folder,
          metadata: {
            type: 'Nivel',
            entity: 'nivel',
            data: nivel,
          },
          children: niveles.some(n => n.IDNP === nivel.IDN) 
            ? buildNivelChildren(nivel.IDN) 
            : undefined,
        };
      });

      return {
        id: `jerarquia-${jerarquia.IDJ}`,
        name: jerarquia.DESCRIPCION,
        icon: FolderTree,
        openIcon: FolderTree,
        metadata: {
          type: 'Jerarquía',
          entity: 'jerarquia',
          data: jerarquia,
        },
        children: children.length > 0 ? children : undefined,
      };
    });
  }

  // Construir árbol comenzando desde los niveles raíz de Área
  const rootNiveles = niveles.filter(
    n => n.IDJ === areaJerarquia.IDJ && (n.IDNP === null || n.IDNP === 0)
  );

  // Ordenar niveles raíz alfabéticamente
  const sortedRootNiveles = rootNiveles.sort((a, b) => 
    a.NOMBRE.localeCompare(b.NOMBRE)
  );

  // Construir el árbol completo a través de todas las jerarquías en cadena
  return sortedRootNiveles.map(nivel => {
    // Verificar si este nivel tiene hijos (otros niveles)
    const hasNivelChildren = niveles.some(n => n.IDNP === nivel.IDN);
    
    // Obtener actividades de este nivel
    const actividades = buildActividadesNivel(nivel.IDN);
    
    // Obtener nombre de la jerarquía
    const jerarquiaNombre = getJerarquiaNombre(nivel);
    
    // Combinar hijos de nivel y actividades
    const allChildren: TreeDataItem[] = [];
    
    // Primero agregar hijos de nivel (otros niveles)
    if (hasNivelChildren) {
      allChildren.push(...buildNivelChildren(nivel.IDN));
    }
    
    // Luego agregar actividades de nivel
    if (actividades.length > 0) {
      allChildren.push(...actividades);
    }
    
    return {
      id: `nivel-${nivel.IDN}`,
      name: (
        <span className="flex items-center gap-2 w-full">
          <span className="flex-1 truncate">{nivel.NOMBRE}</span>
          {jerarquiaNombre && (
            <span className="text-xs text-muted-foreground font-normal shrink-0">
              ({jerarquiaNombre})
            </span>
          )}
        </span>
      ),
      icon: allChildren.length > 0 ? Folder : FileText,
      openIcon: Folder,
      metadata: {
        type: 'Nivel',
        entity: 'nivel',
        data: nivel,
      },
      // Combinar hijos de nivel y actividades
      children: allChildren.length > 0 ? allChildren : undefined,
    };
  });
}

