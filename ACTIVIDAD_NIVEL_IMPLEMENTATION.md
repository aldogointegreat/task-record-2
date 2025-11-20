# Implementación CRUD de Actividad Nivel y Atributo Valor

## Resumen

Se ha implementado exitosamente el CRUD completo para las tablas `ACTIVIDAD_NIVEL` y `ATRIBUTO_VALOR`, siguiendo el patrón MVC establecido en el proyecto.

## Archivos Creados

### Modelos
- `src/models/atributo-valor.model.ts` - Modelo de AtributoValor con interfaces y DTOs
- Actualizado `src/models/index.ts` - Exportación de nuevos modelos

### API REST - Actividad Nivel
- `src/app/api/(controller)/actividad-nivel/route.ts` - GET (listar con filtros), POST (crear)
- `src/app/api/(controller)/actividad-nivel/[id]/route.ts` - GET, PUT, DELETE por ID

### API REST - Atributo Valor
- `src/app/api/(controller)/atributo-valor/route.ts` - GET (listar con filtros), POST (crear)
- `src/app/api/(controller)/atributo-valor/[id]/route.ts` - GET, PUT, DELETE por ID

### Clientes API
- `src/lib/api/actividad-nivel-api.ts` - Cliente completo con CRUD
- `src/lib/api/atributo-valor-api.ts` - Cliente completo con CRUD
- Actualizado `src/lib/api/index.ts` - Exportación de nuevos clientes

### Vistas - Actividad Nivel
- `src/components/(views)/(tables)/actividad-nivel/actividad-nivel-columns.tsx` - Definición de columnas con edición inline
- `src/components/(views)/(tables)/actividad-nivel/ActividadNivelList.tsx` - Tabla con TankTable y operaciones CRUD
- `src/app/actividad-nivel/page.tsx` - Página Next.js para gestión

### Vistas - Atributo Valor
- `src/components/(views)/(tables)/atributo-valor/atributo-valor-columns.tsx` - Definición de columnas con edición inline
- `src/components/(views)/(tables)/atributo-valor/AtributoValorList.tsx` - Tabla con TankTable y operaciones CRUD
- `src/app/atributo-valor/page.tsx` - Página Next.js para gestión

### Actualizado `src/components/(views)/index.ts` - Exportación de nuevas vistas

### Tree View
- Actualizado `src/components/(views)/(use cases)/nivel-tree/ActividadNivelDetailsPanel.tsx` - Ahora muestra valores de atributos asociados

## Características Implementadas

### Actividad Nivel
- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Filtros por: IDN (Nivel), IDT (Atributo), DESCRIPCION
- Ordenamiento por: IDN ASC, ORDEN ASC
- Edición inline en tabla
- Selects para relacionar con Nivel y Atributo
- Validación de campos requeridos (IDN, ORDEN, DESCRIPCION)
- Tree View muestra actividades como hijos de niveles

### Atributo Valor
- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Filtros por: IDA (Actividad), VALOR
- Ordenamiento por: IDAV ASC
- Edición inline en tabla
- Select para relacionar con Actividad de Nivel
- Validación de campos requeridos (IDA, VALOR)
- Visualización en panel de detalles de actividad

## Flujo de Datos

```
Nivel (NIVEL)
  └── Actividad de Nivel (ACTIVIDAD_NIVEL)
        ├── Atributo (ATRIBUTO) [opcional, via IDT]
        └── Valores de Atributo (ATRIBUTO_VALOR) [múltiples]
```

## Tree View Integrado

El árbol jerárquico (`NivelTreeView`) ahora muestra:
1. Niveles en estructura padre-hijo (IDNP -> IDN)
2. Actividades de Nivel como hijos de cada nivel
3. Panel de detalles con información completa:
   - Datos básicos de la actividad
   - Atributo asociado (si existe)
   - Valores de atributo asociados (lista)

## Rutas Disponibles

- `/actividad-nivel` - Gestión de Actividades de Nivel
- `/atributo-valor` - Gestión de Valores de Atributos
- `/tree-view` - Visualización jerárquica con actividades integradas

## Compatibilidad

- ✅ Sigue el patrón MVC documentado en `STRUCTURE.md`
- ✅ Usa TankTable para tablas consistentes
- ✅ Edición inline con validación
- ✅ API REST estándar
- ✅ TypeScript con tipos completos
- ✅ Sin errores de linter
- ✅ Integrado con Tree View existente

