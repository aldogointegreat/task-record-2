import React from "react";
import { flexRender, type Table } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Package, DollarSign, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MobileCardViewProps<TData extends Record<string, unknown>> {
  table: Table<TData>;
}

export function MobileCardView<TData extends Record<string, unknown>>({ table }: MobileCardViewProps<TData>) {
  const rows = table.getRowModel().rows;

  // Helper function to safely access object properties
  const getProperty = (obj: TData, key: string): boolean | number | string | undefined => {
    const value = obj[key as keyof TData];
    return typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string' ? value : undefined;
  };

  return (
    <div className="space-y-5">
      {rows.map((row) => {
        const cells = row.getVisibleCells();
        const data = row.original as TData;
        
        // Extract key information for the card
        const skuCell = cells.find(cell => cell.column.id === 'codigo_sku');
        const nameCell = cells.find(cell => cell.column.id === 'nombre');
        const categoryCell = cells.find(cell => cell.column.id === 'categoria_id');
        const descriptionCell = cells.find(cell => cell.column.id === 'descripcion');
        const priceCell = cells.find(cell => cell.column.id === 'precio_venta');
        const stockCell = cells.find(cell => cell.column.id === 'stock_minimo');
        const activeCell = cells.find(cell => cell.column.id === 'activo');
        const actionsCell = cells.find(cell => cell.column.id === 'actions');

        return (
          <Card key={row.id} className="w-full hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              {/* Title Section - Full Width */}
              <div className="mb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-start gap-2">
                  <Package className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="break-words leading-tight">
                    {nameCell ? flexRender(nameCell.column.columnDef.cell, nameCell.getContext()) : 'N/A'}
                  </span>
                </CardTitle>
              </div>
              
              {/* Badges and Actions Row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {skuCell && (
                    <Badge variant="outline" className="text-xs font-mono bg-gray-50">
                      {flexRender(skuCell.column.columnDef.cell, skuCell.getContext())}
                    </Badge>
                  )}
                  {activeCell && (
                    <Badge 
                      variant={getProperty(data, 'activo') ? "default" : "secondary"}
                      className={`text-xs font-medium ${getProperty(data, 'activo') ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {getProperty(data, 'activo') ? "✓ Activo" : "✗ Inactivo"}
                    </Badge>
                  )}
                  {/* Stock warning indicator */}
                  {getProperty(data, 'stock_minimo') && getProperty(data, 'stock_actual') && 
                   Number(getProperty(data, 'stock_actual')) <= Number(getProperty(data, 'stock_minimo')) && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Stock Bajo
                    </Badge>
                  )}
                </div>
                
                {actionsCell && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex-shrink-0"
                        aria-label="Acciones del producto"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Producto
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 cursor-pointer focus:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar Producto
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-4">
                {categoryCell && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 min-w-0 flex-shrink-0">Categoría:</span>
                    <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                      {flexRender(categoryCell.column.columnDef.cell, categoryCell.getContext())}
                    </Badge>
                  </div>
                )}
                
                {descriptionCell && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 block mb-1">Descripción:</span>
                    <div className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                      {flexRender(descriptionCell.column.columnDef.cell, descriptionCell.getContext())}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                  {priceCell && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-medium text-gray-500 block">Precio</span>
                        <div className="text-sm font-bold text-green-700">
                          {flexRender(priceCell.column.columnDef.cell, priceCell.getContext())}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {stockCell && (
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-medium text-gray-500 block">Stock Mín</span>
                        <div className="text-sm font-bold text-orange-700">
                          {flexRender(stockCell.column.columnDef.cell, stockCell.getContext())}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
