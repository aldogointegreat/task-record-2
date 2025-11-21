'use client';

import React from 'react';
import type { TreeDataItem } from '@/components/tree-view';
import type { Jerarquia, Nivel, ActividadNivel } from '@/models';
import { Folder, Circle, ListChecks } from 'lucide-react';
import { getIconComponent } from '@/lib/constants/app-icons';

/**
 * Construye un árbol jerárquico basado en la relación padre-hijo de NIVEL
 * 
 * Estructura:
 * - Solo muestra NIVEL (no jerarquías como nodos)
 * - La jerarquía (JERARQUIA) solo aparece como metadata/etiqueta
 * - El árbol se construye basándose en IDNP -> IDN (relación padre-hijo)
 * - Cada nivel puede tener ACTIVIDAD_NIVEL asociadas
 * 
 * El árbol comienza desde los niveles raíz (IDNP es NULL)
 */
export function buildNivelTree(
  jerarquias: Jerarquia[],
  niveles: Nivel[],
  actividadesNivel?: ActividadNivel[],
  showActividades: boolean = true,
  showJerarquia: boolean = true
): TreeDataItem[] {
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

  // Helper para obtener información de la jerarquía
  const getJerarquiaInfo = (nivel: Nivel) => {
    const jerarquia = jerarquias.find(j => j.IDJ === nivel.IDJ);
    return {
      nombre: jerarquia?.DESCRIPCION || '',
      color: jerarquia?.COLOR || null
    };
  };

  // Helper para construir niveles recursivamente basándose en la relación padre-hijo
  const buildNivelChildren = (parentId: number): TreeDataItem[] => {
    // Esta función usa showActividades del scope externo
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
      
      // Obtener info de la jerarquía (solo para mostrar como etiqueta)
      const { nombre: jerarquiaNombre, color: jerarquiaColor } = getJerarquiaInfo(nivel);
      
      // Combinar hijos de nivel y actividades
      const allChildren: TreeDataItem[] = [];
      
      // Primero agregar hijos de nivel (otros niveles)
      if (hasNivelChildren) {
        allChildren.push(...buildNivelChildren(nivel.IDN));
      }
      
      // Luego agregar actividades de nivel (solo si showActividades es true)
      if (showActividades && actividades.length > 0) {
        allChildren.push(...actividades);
      }
      
      // Obtener el ícono del nivel - si no hay icono personalizado, usar Folder por defecto
      const hasIcono = nivel.ICONO && nivel.ICONO.trim() !== '';
      const CustomIcon = hasIcono ? getIconComponent(nivel.ICONO!) : null;
      const defaultIcon = Folder; // Icono por defecto para niveles sin icono personalizado
      
      // Determinar si es plantilla o genérico para aplicar estilos especiales
      const esPlantilla = nivel.PLANTILLA === true;
      const esGenerico = nivel.GENERICO === true;
      const tieneEstiloEspecial = esPlantilla || esGenerico;
      
      return {
        id: `nivel-${nivel.IDN}`,
        name: (
          <span className="flex items-center gap-2 w-full">
            <span className={`flex-1 truncate ${tieneEstiloEspecial ? 'font-bold text-white' : ''}`}>
              {nivel.NOMBRE}
            </span>
            {/* Badge para PLANTILLA o GENERICO */}
            {esPlantilla && (
              <span className="text-xs font-bold shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                PLANTILLA
              </span>
            )}
            {esGenerico && (
              <span className="text-xs font-bold shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                GENERICO
              </span>
            )}
            {showJerarquia && jerarquiaNombre && (
              <span 
                className="text-xs font-normal shrink-0 flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-muted/50"
                style={jerarquiaColor ? { 
                  color: jerarquiaColor,
                  backgroundColor: `${jerarquiaColor}15`,
                  borderColor: `${jerarquiaColor}30`
                } : undefined}
              >
                {jerarquiaColor && (
                  <span 
                    className="w-1.5 h-1.5 rounded-full shrink-0" 
                    style={{ backgroundColor: jerarquiaColor }} 
                  />
                )}
                {jerarquiaNombre}
              </span>
            )}
          </span>
        ),
        icon: CustomIcon || defaultIcon,
        openIcon: CustomIcon || defaultIcon,
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

  // Obtener todos los niveles raíz (sin padre: IDNP es NULL o 0)
  const rootNiveles = niveles.filter(
    n => n.IDNP === null || n.IDNP === 0
  );

  // Ordenar niveles raíz alfabéticamente
  const sortedRootNiveles = rootNiveles.sort((a, b) => 
    a.NOMBRE.localeCompare(b.NOMBRE)
  );

  // Construir el árbol completo comenzando desde los niveles raíz
  return sortedRootNiveles.map(nivel => {
    // Verificar si este nivel tiene hijos (otros niveles)
    const hasNivelChildren = niveles.some(n => n.IDNP === nivel.IDN);
    
    // Obtener actividades de este nivel
    const actividades = buildActividadesNivel(nivel.IDN);
    
    // Obtener nombre de la jerarquía (solo para mostrar como etiqueta)
    const { nombre: jerarquiaNombre, color: jerarquiaColor } = getJerarquiaInfo(nivel);
    
    // Combinar hijos de nivel y actividades
    const allChildren: TreeDataItem[] = [];
    
    // Primero agregar hijos de nivel (otros niveles)
    if (hasNivelChildren) {
      allChildren.push(...buildNivelChildren(nivel.IDN));
    }
    
    // Luego agregar actividades de nivel (solo si showActividades es true)
    if (showActividades && actividades.length > 0) {
      allChildren.push(...actividades);
    }
    
    // Obtener el ícono del nivel o usar el ícono por defecto
    const CustomIcon = nivel.ICONO ? getIconComponent(nivel.ICONO) : null;
    const hasAnyChildren = hasNivelChildren || (showActividades && actividades.length > 0);
    const defaultIcon = hasAnyChildren ? Folder : Circle;
    
    return {
      id: `nivel-${nivel.IDN}`,
      name: (
        <span className="flex items-center gap-2 w-full">
          <span className="flex-1 truncate">{nivel.NOMBRE}</span>
          {showJerarquia && jerarquiaNombre && (
            <span 
              className="text-xs font-normal shrink-0 flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-muted/50"
              style={jerarquiaColor ? { 
                color: jerarquiaColor,
                backgroundColor: `${jerarquiaColor}15`,
                borderColor: `${jerarquiaColor}30`
              } : undefined}
            >
              {jerarquiaColor && (
                <span 
                  className="w-1.5 h-1.5 rounded-full shrink-0" 
                  style={{ backgroundColor: jerarquiaColor }} 
                />
              )}
              {jerarquiaNombre}
            </span>
          )}
        </span>
      ),
      icon: CustomIcon || defaultIcon,
      openIcon: CustomIcon || Folder,
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

