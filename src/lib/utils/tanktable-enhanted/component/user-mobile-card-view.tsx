import React from "react";
import { flexRender, type Table } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Shield,
  UserCheck,
  Activity,
  Building2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMobileCardViewProps<TData extends Record<string, unknown>> {
  table: Table<TData>;
}

export function UserMobileCardView<TData extends Record<string, unknown>>({ table }: UserMobileCardViewProps<TData>) {
  const rows = table.getRowModel().rows;

  // Helper function to safely access object properties
  const getProperty = (obj: TData, key: string): boolean | number | string | undefined => {
    const value = obj[key as keyof TData];
    return typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string' ? value : undefined;
  };

  // Helper function to get role icon and color
  const getRoleInfo = (rol: string) => {
    switch (rol) {
      case 'admin':
        return { icon: Shield, color: 'text-red-600', bgColor: 'bg-red-50', label: 'Administrador' };
      case 'supervisor':
        return { icon: UserCheck, color: 'text-blue-600', bgColor: 'bg-blue-50', label: 'Supervisor' };
      case 'operador':
        return { icon: Activity, color: 'text-green-600', bgColor: 'bg-green-50', label: 'Operador' };
      case 'vendedor':
        return { icon: User, color: 'text-purple-600', bgColor: 'bg-purple-50', label: 'Vendedor' };
      default:
        return { icon: User, color: 'text-gray-600', bgColor: 'bg-gray-50', label: 'Usuario' };
    }
  };

  return (
    <div className="space-y-4">
      {rows.map((row) => {
        const cells = row.getVisibleCells();
        const data = row.original as TData;
        
        // Extract key information for the user card
        const nameCell = cells.find(cell => cell.column.id === 'nombre');
        const apellidoCell = cells.find(cell => cell.column.id === 'apellido');
        const emailCell = cells.find(cell => cell.column.id === 'email');
        const telefonoCell = cells.find(cell => cell.column.id === 'telefono');
        const direccionCell = cells.find(cell => cell.column.id === 'direccion');
        const rolCell = cells.find(cell => cell.column.id === 'rol');
        const sucursalCell = cells.find(cell => cell.column.id === 'sucursal_id');
        const activoCell = cells.find(cell => cell.column.id === 'activo');
        const actionsCell = cells.find(cell => cell.column.id === 'actions');

        const nombre = getProperty(data, 'nombre') || '';
        const apellido = getProperty(data, 'apellido') || '';
        const email = getProperty(data, 'email') || '';
        const telefono = getProperty(data, 'telefono') || '';
        const direccion = getProperty(data, 'direccion') || '';
        const rol = getProperty(data, 'rol') || '';
        const sucursalId = getProperty(data, 'sucursal_id');
        const activo = getProperty(data, 'activo');

        const roleInfo = getRoleInfo(rol as string);
        const RoleIcon = roleInfo.icon;

        return (
          <Card key={row.id} className="w-full hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              {/* Title Section - Full Width */}
              <div className="mb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {nombre.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="break-words leading-tight">
                      {nombre} {apellido}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 break-all">
                      {email}
                    </div>
                  </div>
                </CardTitle>
              </div>
              
              {/* Badges and Actions Row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge 
                    variant="outline" 
                    className={`text-xs font-medium ${roleInfo.bgColor} ${roleInfo.color} border-current`}
                  >
                    <RoleIcon className="h-3 w-3 mr-1" />
                    {roleInfo.label}
                  </Badge>
                  
                  {activo ? (
                    <Badge variant="default" className="text-xs font-medium bg-green-100 text-green-800">
                      ✓ Activo
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs font-medium bg-gray-100 text-gray-600">
                      ✗ Inactivo
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
                        aria-label="Acciones del usuario"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Usuario
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 cursor-pointer focus:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar Usuario
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Contact Information */}
                <div className="space-y-2">
                  {telefono && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">{telefono}</span>
                    </div>
                  )}
                  
                  {direccion && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 break-words">{direccion}</span>
                    </div>
                  )}
                </div>

                {/* Sucursal Information */}
                {sucursalId && (
                  <div className="flex items-center gap-2 text-sm pt-2 border-t border-gray-100">
                    <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">
                      Sucursal ID: {sucursalId}
                    </span>
                  </div>
                )}

                {/* Role Details */}
                <div className="flex items-center gap-2 text-sm pt-2 border-t border-gray-100">
                  <RoleIcon className={`h-4 w-4 ${roleInfo.color} flex-shrink-0`} />
                  <span className="text-gray-600">
                    Rol: {roleInfo.label}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
