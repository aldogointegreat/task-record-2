'use client';

import React, { useState } from 'react';
import { TreeView, TreeDataItem } from '@/components/tree-view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Folder,
  FolderOpen,
  FileText,
  Settings,
  User,
  Users,
  FolderTree,
  ChevronDown,
  Info,
  Package,
  Layers,
  Tag,
  Calendar,
  Clock,
} from 'lucide-react';

// Tipo para metadata como objeto (compatibilidad hacia atrás)
interface MetadataObject {
  description?: string;
  type?: string;
  size?: string;
  created?: string;
  modified?: string;
  tags?: string[];
  components?: ComponentInfo[];
}

// Extender TreeDataItem con información detallada (ahora metadata ya soporta ambos tipos en TreeDataItem)
type ExtendedTreeDataItem = TreeDataItem & {
  metadata?: React.ReactNode | MetadataObject;
}

interface ComponentInfo {
  name: string;
  type: string;
  description?: string;
  subcomponents?: ComponentInfo[];
  properties?: Record<string, string>;
}

// Función helper para verificar si metadata es un objeto
function isMetadataObject(metadata: React.ReactNode | MetadataObject | Record<string, unknown> | undefined): metadata is MetadataObject {
  return metadata !== undefined && 
         metadata !== null && 
         typeof metadata === 'object' && 
         !React.isValidElement(metadata) &&
         ('description' in metadata || 'type' in metadata || 'size' in metadata || 'created' in metadata || 'modified' in metadata || 'tags' in metadata || 'components' in metadata);
}

// Componente de Panel de Información Expandible
function ItemInfoPanel({ item }: { item: ExtendedTreeDataItem }) {
  // Si metadata es un componente React, renderizarlo directamente
  if (item.metadata && React.isValidElement(item.metadata)) {
    return (
      <div className="space-y-4">
        {/* Header con icono y nombre */}
        <div className="flex items-start gap-3 pb-4 border-b border-border">
          {item.icon && (
            <div className="p-2 rounded-lg bg-primary/10">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{item.name}</h3>
          </div>
        </div>
        {/* Renderizar el componente metadata */}
        <div>{item.metadata}</div>
      </div>
    );
  }

  // Si metadata es un objeto, usar la lógica anterior
  const metadata = isMetadataObject(item.metadata) ? item.metadata : {};

  return (
    <div className="space-y-4">
      {/* Header con icono y nombre */}
      <div className="flex items-start gap-3 pb-4 border-b border-border">
        {item.icon && (
          <div className="p-2 rounded-lg bg-primary/10">
            <item.icon className="h-5 w-5 text-primary" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          {metadata.type && (
            <p className="text-sm text-muted-foreground mt-1">Tipo: {metadata.type}</p>
          )}
        </div>
      </div>

      {/* Información básica */}
      <div className="space-y-3">
        {metadata.description && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Descripción</span>
            </div>
            <p className="text-sm text-muted-foreground pl-6">{metadata.description}</p>
          </div>
        )}

        {/* Detalles */}
        {(metadata.size || metadata.created || metadata.modified) && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="details" className="border-none">
              <AccordionTrigger className="py-2 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Detalles</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-2 pl-6">
                <div className="space-y-2 text-sm">
                  {metadata.size && (
                    <div className="flex items-center gap-2">
                      <Package className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Tamaño:</span>
                      <span className="font-medium">{metadata.size}</span>
                    </div>
                  )}
                  {metadata.created && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Creado:</span>
                      <span className="font-medium">{metadata.created}</span>
                    </div>
                  )}
                  {metadata.modified && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Modificado:</span>
                      <span className="font-medium">{metadata.modified}</span>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* Tags */}
        {metadata.tags && metadata.tags.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Etiquetas</span>
            </div>
            <div className="flex flex-wrap gap-2 pl-6">
              {metadata.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary border border-primary/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Componentes y Subcomponentes */}
        {metadata.components && metadata.components.length > 0 && (
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="components" className="border-none">
              <AccordionTrigger className="py-2 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Componentes ({metadata.components.length})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <ComponentList components={metadata.components} level={0} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* Información de hijos */}
        {item.children && item.children.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Folder className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Contenido</span>
            </div>
            <p className="text-sm text-muted-foreground pl-6">
              {item.children.length} {item.children.length === 1 ? 'elemento' : 'elementos'} dentro
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente recursivo para mostrar componentes y subcomponentes
function ComponentList({ components, level = 0 }: { components: ComponentInfo[]; level?: number }) {
  return (
    <div className={`space-y-2 ${level > 0 ? 'pl-4 border-l border-border' : ''}`}>
      {components.map((component, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-start gap-2">
                      <ChevronDown className="h-3 w-3 text-muted-foreground mt-1 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{component.name}</span>
                <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">
                  {component.type}
                </span>
              </div>
              {component.description && (
                <p className="text-xs text-muted-foreground mt-1">{component.description}</p>
              )}
              {component.properties && Object.keys(component.properties).length > 0 && (
                <div className="mt-2 space-y-1">
                  {Object.entries(component.properties).map(([key, value]) => (
                    <div key={key} className="text-xs text-muted-foreground pl-4">
                      <span className="font-medium">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {component.subcomponents && component.subcomponents.length > 0 && (
            <div className="pl-6">
              <ComponentList components={component.subcomponents} level={level + 1} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function TreeViewPage() {
  const [selectedItem, setSelectedItem] = useState<ExtendedTreeDataItem | undefined>(undefined);

  // Datos de ejemplo con información detallada
  const treeData = [
    {
      id: '1',
      name: 'Sistema Principal',
      icon: FolderTree,
      openIcon: FolderOpen,
      metadata: {
        description: 'Sistema principal de gestión que contiene todos los módulos',
        type: 'Sistema',
        created: '2024-01-15',
        modified: '2024-01-20',
        tags: ['Producción', 'Crítico'],
        components: [
          {
            name: 'Módulo de Autenticación',
            type: 'Módulo',
            description: 'Gestiona la autenticación de usuarios',
            properties: {
              'Versión': '2.1.0',
              'Estado': 'Activo',
            },
            subcomponents: [
              {
                name: 'LoginService',
                type: 'Servicio',
                description: 'Servicio de inicio de sesión',
                properties: {
                  'Endpoint': '/api/auth/login',
                  'Método': 'POST',
                },
              },
              {
                name: 'TokenManager',
                type: 'Utilidad',
                description: 'Gestiona tokens JWT',
              },
            ],
          },
          {
            name: 'Módulo de Base de Datos',
            type: 'Módulo',
            description: 'Conexión y gestión de base de datos',
            properties: {
              'Tipo': 'SQL Server',
              'Conexiones': '10',
            },
            subcomponents: [
              {
                name: 'ConnectionPool',
                type: 'Servicio',
                description: 'Pool de conexiones a la base de datos',
              },
              {
                name: 'QueryBuilder',
                type: 'Utilidad',
                description: 'Constructor de queries SQL',
              },
            ],
          },
        ],
      },
      children: [
        {
          id: '1-1',
          name: 'Módulo de Usuarios',
          icon: Users,
          metadata: {
            description: 'Gestión completa de usuarios del sistema',
            type: 'Módulo',
            created: '2024-01-16',
            modified: '2024-01-19',
            tags: ['Usuario', 'Gestión'],
            components: [
              {
                name: 'UserController',
                type: 'Controlador',
                description: 'Controla las operaciones CRUD de usuarios',
                properties: {
                  'Rutas': '5',
                  'Métodos': 'GET, POST, PUT, DELETE',
                },
              },
              {
                name: 'UserService',
                type: 'Servicio',
                description: 'Lógica de negocio para usuarios',
              },
            ],
          },
          children: [
            {
              id: '1-1-1',
              name: 'Lista de Usuarios',
              icon: User,
              metadata: {
                description: 'Vista que muestra la lista de todos los usuarios',
                type: 'Vista',
                created: '2024-01-17',
                size: '45 KB',
                tags: ['Vista', 'Lista'],
              },
            },
            {
              id: '1-1-2',
              name: 'Perfil de Usuario',
              icon: User,
              metadata: {
                description: 'Vista de perfil individual de usuario',
                type: 'Vista',
                created: '2024-01-18',
                size: '32 KB',
                tags: ['Vista', 'Detalle'],
              },
            },
          ],
        },
        {
          id: '1-2',
          name: 'Módulo de Configuración',
          icon: Settings,
          metadata: {
            description: 'Configuraciones generales del sistema',
            type: 'Módulo',
            created: '2024-01-15',
            modified: '2024-01-20',
            tags: ['Configuración'],
            components: [
              {
                name: 'ConfigManager',
                type: 'Servicio',
                description: 'Gestor de configuraciones',
                properties: {
                  'Fuente': 'Archivo JSON',
                  'Hot Reload': 'Sí',
                },
              },
            ],
          },
          children: [
            {
              id: '1-2-1',
              name: 'Configuración General',
              icon: Settings,
              metadata: {
                description: 'Configuraciones generales del sistema',
                type: 'Vista',
                created: '2024-01-15',
                size: '28 KB',
              },
            },
          ],
        },
        {
          id: '1-3',
          name: 'Documentación',
          icon: FileText,
          metadata: {
            description: 'Documentación técnica del sistema',
            type: 'Carpeta',
            created: '2024-01-10',
            size: '2.5 MB',
            tags: ['Documentación'],
          },
          children: [
            {
              id: '1-3-1',
              name: 'README.md',
              icon: FileText,
              metadata: {
                description: 'Documentación principal del proyecto',
                type: 'Archivo',
                created: '2024-01-10',
                modified: '2024-01-20',
                size: '12 KB',
                tags: ['Markdown', 'Docs'],
              },
            },
            {
              id: '1-3-2',
              name: 'API.md',
              icon: FileText,
              metadata: {
                description: 'Documentación de la API',
                type: 'Archivo',
                created: '2024-01-12',
                modified: '2024-01-19',
                size: '45 KB',
                tags: ['API', 'Docs'],
              },
            },
            {
              id: '1-3-3',
              name: 'Ejemplo con Componente',
              icon: FileText,
              metadata: (
                <div className="space-y-3">
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Metadata Personalizada
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Este es un ejemplo de metadata como componente React. 
                      Puedes crear cualquier UI personalizada aquí.
                    </p>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 text-xs rounded-md bg-primary text-primary-foreground">
                        Componente
                      </span>
                      <span className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground">
                        React
                      </span>
                    </div>
                  </div>
                  <div className="text-sm space-y-1">
                    <p><strong>Ventajas:</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                      <li>Total flexibilidad en el diseño</li>
                      <li>Puedes usar hooks y estado</li>
                      <li>Interactividad completa</li>
                      <li>Reutilización de componentes</li>
                    </ul>
                  </div>
                </div>
              ),
            },
          ],
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <main className="flex flex-col gap-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tree View - Con Panel de Información</h1>
            <p className="text-muted-foreground">
              Selecciona cualquier elemento del árbol para ver su información detallada en el panel lateral
            </p>
          </div>
        </div>

        {/* Layout de dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
          {/* Panel izquierdo - Tree View (compacto como Windows Explorer) */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sistema de Gestión</CardTitle>
                <CardDescription className="text-xs">
                  Explora la estructura del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TreeView
                  data={treeData as unknown as ExtendedTreeDataItem[]}
                  onSelectChange={(item) => setSelectedItem(item as ExtendedTreeDataItem)}
                  expandAll={false}
                />
              </CardContent>
            </Card>
          </div>

          {/* Panel derecho - Información del item seleccionado */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Información del Item</CardTitle>
                <CardDescription>
                  {selectedItem
                    ? 'Detalles del elemento seleccionado'
                    : 'Selecciona un elemento del árbol para ver su información'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedItem ? (
                  <ItemInfoPanel item={selectedItem} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Info className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Haz clic en cualquier elemento del árbol para ver su información detallada
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
