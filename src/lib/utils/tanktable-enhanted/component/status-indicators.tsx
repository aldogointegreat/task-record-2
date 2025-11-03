import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";

interface StatusIndicatorsProps {
  status: 'active' | 'inactive';
  stockLevel: 'normal' | 'low' | 'critical';
  priceTrend?: 'up' | 'down' | 'stable';
  lastUpdated?: Date;
}

export function StatusIndicators({ 
  status, 
  stockLevel, 
  priceTrend,
  lastUpdated 
}: StatusIndicatorsProps) {
  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Activo
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200">
            <XCircle className="h-3 w-3 mr-1" />
            Inactivo
          </Badge>
        );
    }
  };

  const getStockBadge = () => {
    switch (stockLevel) {
      case 'normal':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Stock OK
          </Badge>
        );
      case 'low':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Stock Bajo
          </Badge>
        );
      case 'critical':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Stock Crítico
          </Badge>
        );
    }
  };

  const getPriceTrendIcon = () => {
    if (!priceTrend) return null;
    
    switch (priceTrend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      case 'stable':
        return <Minus className="h-3 w-3 text-gray-600" />;
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {getStatusBadge()}
      {getStockBadge()}
      {priceTrend && (
        <div className="flex items-center gap-1">
          {getPriceTrendIcon()}
        </div>
      )}
      {lastUpdated && (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>
            {new Date(lastUpdated).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit'
            })}
          </span>
        </div>
      )}
    </div>
  );
}

interface ProductStatusProps {
  product: {
    activo: boolean;
    stock_actual?: number;
    stock_minimo: number;
    precio_venta: number;
    precio_anterior?: number;
    fecha_actualizacion?: string;
  };
}

export function ProductStatus({ product }: ProductStatusProps) {
  const stockLevel = (() => {
    if (!product.stock_actual) return 'normal';
    if (product.stock_actual <= 0) return 'critical';
    if (product.stock_actual <= product.stock_minimo) return 'low';
    return 'normal';
  })();

  const priceTrend = (() => {
    if (!product.precio_anterior) return undefined;
    if (product.precio_venta > product.precio_anterior) return 'up';
    if (product.precio_venta < product.precio_anterior) return 'down';
    return 'stable';
  })();

  return (
    <StatusIndicators
      status={product.activo ? 'active' : 'inactive'}
      stockLevel={stockLevel}
      priceTrend={priceTrend}
      lastUpdated={product.fecha_actualizacion ? new Date(product.fecha_actualizacion) : undefined}
    />
  );
}
