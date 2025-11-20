import React from 'react';
import { 
  FaHardHat, 
    FaCogs, 
  FaIndustry, 
  FaBolt, 
  FaFire, 
  FaWrench,
  FaTools,
  FaBoxes,
  FaClipboardList,
  FaExclamationTriangle,
  FaShieldAlt,
  FaLeaf,
  FaRecycle,
  FaCog,
  FaTruck,
  FaCube,
  FaHammer,
  FaScrewdriver,
  FaWarehouse,
  FaBuilding,
  FaServer,
  FaDatabase,
  FaClipboard,
  FaChartLine,
  FaFlag
} from 'react-icons/fa';

export interface IconDef {
  name: string;
  component: React.ElementType;
  label: string;
  category: 'general' | 'mining' | 'maintenance' | 'safety';
}

export const APP_ICONS: Record<string, IconDef> = {
  // Minería / Producción
  'hard-hat': { name: 'hard-hat', component: FaHardHat, label: 'Casco', category: 'mining' },
  'truck': { name: 'truck', component: FaTruck, label: 'Camión', category: 'mining' },
  'cube': { name: 'cube', component: FaCube, label: 'Material', category: 'mining' },
  'industry': { name: 'industry', component: FaIndustry, label: 'Industria', category: 'mining' },
  'building': { name: 'building', component: FaBuilding, label: 'Edificio', category: 'mining' },
  
  // Mantenimiento
  'gear': { name: 'gear', component: FaCog, label: 'Engranaje', category: 'maintenance' },
  'gears': { name: 'gears', component: FaCogs, label: 'Engranajes', category: 'maintenance' },
  'wrench': { name: 'wrench', component: FaWrench, label: 'Llave', category: 'maintenance' },
  'tools': { name: 'tools', component: FaTools, label: 'Herramientas', category: 'maintenance' },
  'hammer': { name: 'hammer', component: FaHammer, label: 'Martillo', category: 'maintenance' },
  'screwdriver': { name: 'screwdriver', component: FaScrewdriver, label: 'Destornillador', category: 'maintenance' },
  
  // Energía y Recursos
  'bolt': { name: 'bolt', component: FaBolt, label: 'Electricidad', category: 'general' },
  'fire': { name: 'fire', component: FaFire, label: 'Fuego/Calor', category: 'general' },
  'leaf': { name: 'leaf', component: FaLeaf, label: 'Ambiente', category: 'general' },
  
  // Gestión y Seguridad
  'clipboard': { name: 'clipboard', component: FaClipboard, label: 'Clipboard', category: 'safety' },
  'clipboard-list': { name: 'clipboard-list', component: FaClipboardList, label: 'Reporte', category: 'safety' },
  'shield': { name: 'shield', component: FaShieldAlt, label: 'Seguridad', category: 'safety' },
  'warning': { name: 'warning', component: FaExclamationTriangle, label: 'Advertencia', category: 'safety' },
  'flag': { name: 'flag', component: FaFlag, label: 'Bandera', category: 'safety' },
  
  // Almacén y Datos
  'recycle': { name: 'recycle', component: FaRecycle, label: 'Reciclaje', category: 'general' },
  'boxes': { name: 'boxes', component: FaBoxes, label: 'Cajas', category: 'general' },
  'warehouse': { name: 'warehouse', component: FaWarehouse, label: 'Almacén', category: 'general' },
  'server': { name: 'server', component: FaServer, label: 'Servidor', category: 'general' },
  'database': { name: 'database', component: FaDatabase, label: 'Base de Datos', category: 'general' },
  'chart': { name: 'chart', component: FaChartLine, label: 'Gráfico', category: 'general' },
};

export const getIconComponent = (iconName: string | undefined | null) => {
  if (!iconName || !APP_ICONS[iconName]) return null;
  return APP_ICONS[iconName].component;
};

export const getIconList = () => Object.values(APP_ICONS);

