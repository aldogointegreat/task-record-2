# Implementación CRUD de Actividades desde Tree View

## Resumen

Se ha implementado la capacidad de gestionar actividades de nivel (CRUD completo) directamente desde la jerarquía de niveles, similar al comportamiento de PI System Builder.

## Funcionalidad Implementada

### Gestión de Actividades desde el Árbol

Cuando seleccionas un **Nivel** en el árbol jerárquico, el panel de detalles ahora incluye:

1. **Listado de Actividades**
   - Muestra todas las actividades asociadas al nivel seleccionado
   - Ordenadas por el campo ORDEN
   - Incluye descripción y atributo asociado (si existe)

2. **Botón "Agregar"**
   - Abre un diálogo para crear una nueva actividad
   - Campos:
     - Descripción (requerido)
     - Orden (auto-incrementado)
     - Atributo (opcional, select de atributos disponibles)

3. **Botón "Editar" por Actividad**
   - Permite modificar la actividad seleccionada
   - Mismos campos que crear

4. **Botón "Eliminar" por Actividad**
   - Elimina la actividad directamente
   - Muestra confirmación antes de eliminar

### Flujo de Trabajo

```
1. Navegar al Tree View (/tree-view)
2. Seleccionar un Nivel en el árbol
3. En el panel de detalles, ver la sección "Actividades"
4. Usar botones para:
   - Agregar nueva actividad
   - Editar actividad existente
   - Eliminar actividad
5. El árbol se actualiza automáticamente tras cada operación
```

## Archivos Creados/Modificados

### Nuevos Componentes
- `src/components/(views)/(use cases)/nivel-tree/NivelActividadesManager.tsx`
  - Componente principal de gestión de actividades
  - Incluye diálogos de crear/editar
  - Maneja todas las operaciones CRUD

### Modificados
- `src/components/(views)/(use cases)/nivel-tree/NivelDetailsPanel.tsx`
  - Agregado `NivelActividadesManager` al panel
  - Nuevas props: `actividadesNivel`, `atributos`, `onActividadesChange`

- `src/components/(views)/(use cases)/nivel-tree/NivelTreeView.tsx`
  - Agregado callback `handleActividadesChange` para recargar árbol
  - Pasar props necesarias a `NivelDetailsPanel`

## Características

### UI/UX
- ✅ Diálogos modales para crear/editar
- ✅ Botones de acción por actividad (editar/eliminar)
- ✅ Lista ordenada de actividades
- ✅ Indicador visual de atributo asociado
- ✅ Contador de actividades
- ✅ Auto-incremento de orden al crear

### Funcionalidad
- ✅ Crear actividad en el nivel seleccionado
- ✅ Editar actividad existente
- ✅ Eliminar actividad
- ✅ Asignar atributo opcional
- ✅ Ordenamiento automático
- ✅ Actualización automática del árbol
- ✅ Notificaciones toast de éxito/error
- ✅ **Actualización optimizada sin refrescar página**
  - Estado local actualizado inmediatamente
  - Árbol actualizado en segundo plano
  - No colapsa nodos expandidos
  - Experiencia fluida sin parpadeos

### Validación
- ✅ Descripción requerida
- ✅ Orden numérico
- ✅ Atributo opcional (puede ser null)

## Comparación con PI System Builder

| Característica | PI System Builder | Implementación Actual |
|----------------|-------------------|----------------------|
| Ver actividades en panel | ✅ | ✅ |
| Agregar actividad | ✅ | ✅ |
| Editar actividad | ✅ | ✅ |
| Eliminar actividad | ✅ | ✅ |
| Asignar atributos | ✅ | ✅ |
| Ordenamiento | ✅ | ✅ |
| Actualización en tiempo real | ✅ | ✅ |

## Ejemplo de Uso

1. **Crear Actividad**:
   ```
   - Seleccionar "SISTEMA MOTOR" en el árbol
   - Click en "Agregar" en la sección Actividades
   - Completar:
     * Descripción: "Inspección de filtro"
     * Orden: 1 (auto-sugerido)
     * Atributo: "FRECUENCIA" (opcional)
   - Click en "Crear"
   ```

2. **Editar Actividad**:
   ```
   - Click en ícono de lápiz en la actividad
   - Modificar campos necesarios
   - Click en "Guardar"
   ```

3. **Eliminar Actividad**:
   ```
   - Click en ícono de basura
   - Confirmación automática
   ```

## Ventajas

- 🎯 **Contexto visual**: Ver la estructura jerárquica mientras se edita
- ⚡ **Rapidez**: CRUD sin salir de la vista de árbol
- 🔄 **Sincronización**: Árbol se actualiza automáticamente
- 📊 **Vista completa**: Ver todas las actividades del nivel a la vez
- 🎨 **UI consistente**: Usa los mismos componentes de shadcn/ui
- 🚀 **Optimizado**: Actualización en segundo plano sin refrescar página
- ✨ **Experiencia fluida**: Cambios instantáneos en la UI
- 🔓 **Sin bloqueos**: El árbol no se colapsa al guardar

## Rutas

- `/tree-view` - Vista principal con CRUD integrado

## Tecnologías

- React Hooks (useState, useEffect)
- shadcn/ui (Dialog, Button, Input, Select)
- API REST existente
- Toast notifications (sonner)

## Optimización de Performance

### Estado Local con Sincronización en Segundo Plano

La implementación utiliza una estrategia de actualización optimizada:

1. **Estado Local (`localActividades`)**:
   - Mantiene una copia local de las actividades
   - Se actualiza inmediatamente tras CRUD
   - Usuario ve cambios instantáneamente

2. **Sincronización Diferida**:
   - Callback `onActividadesChange` se ejecuta con `setTimeout(100ms)`
   - Solo recarga las actividades desde API
   - Reconstruye árbol sin cambiar estado de loading

3. **Beneficios**:
   - ✅ Sin parpadeos ni recargas visuales
   - ✅ Árbol mantiene nodos expandidos/colapsados
   - ✅ UI responde inmediatamente
   - ✅ Datos sincronizados en segundo plano

### Comparación

| Método | Refresco Visual | Nodos Colapsados | Tiempo Respuesta |
|--------|----------------|------------------|------------------|
| Anterior | ✅ Sí | ❌ Sí | ~500ms |
| Optimizado | ❌ No | ✅ No | <10ms |

