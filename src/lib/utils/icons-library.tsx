import React from 'react';
import {
  FaHelmetSafety,
  FaTruckMoving,
  FaScrewdriverWrench,
  FaGear,
  FaFire,
  FaBolt,
  FaDroplet,
  FaTriangleExclamation,
  FaCheck,
  FaIndustry,
  FaMountain,
  FaExplosion,
  FaHammer,
  FaTractor,
  FaOilWell,
  FaWrench,
  FaBoxesStacked,
  FaClipboardCheck,
  FaStopwatch,
  FaChartLine,
  FaUserGear,
  FaHelmetUn
} from 'react-icons/fa6';
import {
  GiMineWagon,
  GiMiningHelmet,
  GiPickOfDestiny,
  GiGoldBar,
  GiRock,
  GiCoalWagon,
  GiDrill,
  GiHeavyBullets,
  GiFactory,
  GiConveyorBelt,
  GiGearHammer,
  GiChemicalDrop,
  GiElectricalResistance,
  GiRadioactive,
  GiToxicSkull,
  GiWaterDrop,
  GiFireZone,
  GiSafetyPin,
  GiCogsplosion,
  GiMineTruck
} from 'react-icons/gi';
import {
  MdEngineering,
  MdPrecisionManufacturing,
  MdFactory,
  MdWarning,
  MdConstruction,
  MdLocalShipping,
  MdSettings,
  MdBuild,
  MdScience,
  MdWater,
  MdElectricBolt,
  MdLocalFireDepartment
} from 'react-icons/md';

// Definición del tipo Icono
export interface IconOption {
  name: string;
  component: React.ComponentType<{ className?: string }>;
  label: string;
  tags: string[];
}

// Mapa de íconos disponibles
export const ICON_LIBRARY: Record<string, IconOption> = {
  // Minería y Maquinaria Pesada
  'mine-wagon': { name: 'mine-wagon', component: GiMineWagon, label: 'Vagón de Mina', tags: ['mina', 'transporte'] },
  'mining-helmet': { name: 'mining-helmet', component: GiMiningHelmet, label: 'Casco Minero', tags: ['seguridad', 'epp'] },
  'pick-destiny': { name: 'pick-destiny', component: GiPickOfDestiny, label: 'Pico', tags: ['herramienta', 'mina'] },
  'drill': { name: 'drill', component: GiDrill, label: 'Taladro', tags: ['herramienta', 'perforación'] },
  'mine-truck': { name: 'mine-truck', component: GiMineTruck, label: 'Camión Minero', tags: ['transporte', 'maquinaria'] },
  'tractor': { name: 'tractor', component: FaTractor, label: 'Tractor', tags: ['maquinaria', 'vehículo'] },
  'truck-moving': { name: 'truck-moving', component: FaTruckMoving, label: 'Camión', tags: ['transporte', 'logística'] },
  
  // Industria y Planta
  'factory': { name: 'factory', component: FaIndustry, label: 'Fábrica', tags: ['planta', 'industria'] },
  'conveyor-belt': { name: 'conveyor-belt', component: GiConveyorBelt, label: 'Faja Transportadora', tags: ['transporte', 'proceso'] },
  'gears': { name: 'gears', component: FaGear, label: 'Engranaje', tags: ['mecánica', 'sistema'] },
  'engineering': { name: 'engineering', component: MdEngineering, label: 'Ingeniería', tags: ['técnico', 'personal'] },
  'manufacturing': { name: 'manufacturing', component: MdPrecisionManufacturing, label: 'Manufactura', tags: ['proceso', 'producción'] },
  
  // Seguridad y Mantenimiento
  'helmet-safety': { name: 'helmet-safety', component: FaHelmetSafety, label: 'Seguridad', tags: ['seguridad', 'epp'] },
  'wrench': { name: 'wrench', component: FaWrench, label: 'Llave', tags: ['herramienta', 'mantenimiento'] },
  'screwdriver-wrench': { name: 'screwdriver-wrench', component: FaScrewdriverWrench, label: 'Mantenimiento', tags: ['herramienta', 'reparación'] },
  'hammer': { name: 'hammer', component: FaHammer, label: 'Martillo', tags: ['herramienta', 'construcción'] },
  'warning': { name: 'warning', component: FaTriangleExclamation, label: 'Advertencia', tags: ['alerta', 'peligro'] },
  
  // Elementos y Materiales
  'rock': { name: 'rock', component: GiRock, label: 'Roca', tags: ['material', 'mina'] },
  'gold-bar': { name: 'gold-bar', component: GiGoldBar, label: 'Lingote', tags: ['producto', 'valor'] },
  'coal-wagon': { name: 'coal-wagon', component: GiCoalWagon, label: 'Carbón', tags: ['material', 'combustible'] },
  'oil-well': { name: 'oil-well', component: FaOilWell, label: 'Pozo Petrolero', tags: ['energía', 'combustible'] },
  'water': { name: 'water', component: FaDroplet, label: 'Agua', tags: ['fluido', 'recurso'] },
  'fire': { name: 'fire', component: FaFire, label: 'Fuego', tags: ['calor', 'peligro'] },
  'electricity': { name: 'electricity', component: FaBolt, label: 'Electricidad', tags: ['energía', 'sistema'] },
  'chemical': { name: 'chemical', component: GiChemicalDrop, label: 'Químico', tags: ['material', 'peligro'] },
  
  // Gestión y Procesos
  'clipboard-check': { name: 'clipboard-check', component: FaClipboardCheck, label: 'Verificación', tags: ['gestión', 'control'] },
  'chart-line': { name: 'chart-line', component: FaChartLine, label: 'Estadística', tags: ['gestión', 'datos'] },
  'boxes-stacked': { name: 'boxes-stacked', component: FaBoxesStacked, label: 'Inventario', tags: ['almacén', 'logística'] },
  'stopwatch': { name: 'stopwatch', component: FaStopwatch, label: 'Tiempo', tags: ['medición', 'proceso'] },
};

// Función helper para obtener el componente de ícono por nombre
export const getIconComponent = (name?: string | null) => {
  if (!name || !ICON_LIBRARY[name]) return null;
  return ICON_LIBRARY[name].component;
};

// Lista de íconos para selectores
export const ICON_OPTIONS = Object.values(ICON_LIBRARY);

