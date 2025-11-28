"use client";

import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAllPM } from '@/lib/api';
import type { PM } from '@/models';

// Datos constantes para la tabla semanal (fuera del componente para evitar recreaciones)
const DIAS = ['1', '2', '3', '4', '5', '6', '7'];
const ACTIVO_NOMBRE = ['CAM9', 'CAM20', 'CAM8', 'CAM15', 'CAM12', 'CAM25', 'CAM30'];
const ACTIVO_HOROMETRO = ['500', '1000', '2000', '500', '1500', '800', '1200'];
const ACTIVO_ULTIMO_HOROMETRO = ['500', '300', '800', '200', '600', '400', '700'];

export default function ProgramacionPautasPage() {
  // Estado para el número de semana
  const [numeroSemana, setNumeroSemana] = useState(48);
  
  // Estado para la columna seleccionada (null si ninguna está seleccionada)
  const [columnaSeleccionada, setColumnaSeleccionada] = useState<number | null>(null);
  
  // Estado para la columna sobre la que está el mouse (null si ninguna)
  const [columnaHover, setColumnaHover] = useState<number | null>(null);
  
  // Estado para las pautas PM
  const [pautas, setPautas] = useState<PM[]>([]);
  const [loadingPautas, setLoadingPautas] = useState(false);
  
  // Datos para la tabla semanal
  const semana = `Semana ${numeroSemana}`;
  
  // Cargar pautas cuando se selecciona una columna
  useEffect(() => {
    const loadPautas = async () => {
      if (columnaSeleccionada !== null) {
        setLoadingPautas(true);
        try {
          // Extraer el número del horómetro de ACTIVO_HOROMETRO (ej: 'PM500' -> 500)
          const horometroStr = ACTIVO_HOROMETRO[columnaSeleccionada];
          const horometro = horometroStr ? parseInt(horometroStr.replace('PM', '')) : null;
          
          // Filtrar por horómetro si se pudo extraer
          const filters = horometro ? { HOROMETRO: horometro } : undefined;
          const result = await getAllPM(filters);
          
          if (result.success && result.data) {
            setPautas(result.data);
          } else {
            setPautas([]);
          }
        } catch (error) {
          console.error('Error al cargar pautas:', error);
          setPautas([]);
        } finally {
          setLoadingPautas(false);
        }
      } else {
        // Si no hay columna seleccionada, limpiar las pautas
        setPautas([]);
      }
    };
    
    loadPautas();
  }, [columnaSeleccionada]);
  
  // Función para cambiar a la semana anterior
  const semanaAnterior = () => {
    setNumeroSemana((prev) => prev - 1);
  };
  
  // Función para cambiar a la semana siguiente
  const semanaSiguiente = () => {
    setNumeroSemana((prev) => prev + 1);
  };
  
  // Función para manejar el click en una columna
  const handleColumnaClick = (index: number) => {
    if (columnaSeleccionada === index) {
      // Deseleccionar
      setColumnaSeleccionada(null);
      // Limpiar el hover si el mouse está sobre esa columna
      if (columnaHover === index) {
        setColumnaHover(null);
      }
    } else {
      // Seleccionar
      setColumnaSeleccionada(index);
    }
  };
  
  // Función para manejar el hover en una columna
  const handleColumnaHover = (index: number | null) => {
    setColumnaHover(index);
  };

  // Obtener el horómetro de la columna seleccionada
  const horometroSeleccionado = columnaSeleccionada !== null ? ACTIVO_HOROMETRO[columnaSeleccionada] : null;
  const tituloPautas = horometroSeleccionado ? `Pautas con horómetro ${horometroSeleccionado}` : 'Pautas';

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Programación de Pautas</h1>
        <p className="text-muted-foreground">
          Gestión y programación de pautas de mantenimiento
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Columna Izquierda */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{tituloPautas}</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPautas ? (
                <div className="text-center py-4 text-muted-foreground">
                  Cargando...
                </div>
              ) : columnaSeleccionada === null ? (
                <div className="text-center py-4 text-muted-foreground">
                  Selecciona una columna para ver las pautas con ese horómetro
                </div>
              ) : pautas.length > 0 ? (
                <div className="space-y-2">
                  {pautas.map((pauta) => (
                    <div
                      key={pauta.IDPM}
                      className="p-3 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors"
                    >
                      {pauta.TITULO || `PM${pauta.IDPM}`}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No hay pautas con el horómetro {horometroSeleccionado}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Columna Derecha - Tabla */}
        <div className="lg:col-span-3">
          <Card className="bg-[#1a1a1a] border-[#3a3a3a] overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="bg-[#1a1a1a]">
                  <Table>
                    <TableHeader>
                      {/* Fila de Semana */}
                      <TableRow className="bg-[#1a1a1a] hover:bg-[#1a1a1a] border-b border-[#3a3a3a] border-t-0">
                        <TableHead colSpan={8} className="text-center font-semibold text-lg py-4 bg-[#1a1a1a] border-t-0">
                          <div className="flex items-center justify-center gap-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={semanaAnterior}
                              className="h-8 w-8 rounded-full hover:bg-[#3a3a3a] text-white hover:text-white transition-colors"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="min-w-[120px] text-white">{semana}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={semanaSiguiente}
                              className="h-8 w-8 rounded-full hover:bg-[#3a3a3a] text-white hover:text-white transition-colors"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableHead>
                      </TableRow>
                      <TableRow className="bg-[#2a2a2a] hover:bg-[#2a2a2a] border-b border-[#3a3a3a]">
                        <TableHead className="text-white font-bold px-4 py-3">Día</TableHead>
                        {DIAS.map((dia, index) => (
                          <TableHead 
                            key={index} 
                            onClick={() => handleColumnaClick(index)}
                            onMouseEnter={() => handleColumnaHover(index)}
                            onMouseLeave={() => handleColumnaHover(null)}
                            className={`text-white font-bold px-4 py-3 text-center cursor-pointer transition-all ${
                              columnaSeleccionada === index 
                                ? 'bg-[#333333]' 
                                : columnaHover === index
                                ? 'bg-[#333333]'
                                : ''
                            }`}
                          >
                            {dia}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      
                      {/* Fila de CAM */}
                      <TableRow className="bg-[#1a1a1a] hover:!bg-[#1a1a1a] border-b border-[#3a3a3a]">
                        <TableCell className="text-white font-medium px-4 py-3">Activo</TableCell>
                        {ACTIVO_NOMBRE.map((cam, index) => (
                          <TableCell 
                            key={index} 
                            onClick={() => handleColumnaClick(index)}
                            onMouseEnter={() => handleColumnaHover(index)}
                            onMouseLeave={() => handleColumnaHover(null)}
                            className={`text-white text-center px-4 py-3 cursor-pointer transition-all ${
                              columnaSeleccionada === index 
                                ? 'bg-[#252525]' 
                                : columnaHover === index
                                ? 'bg-[#252525]'
                                : ''
                            }`}
                          >
                            {cam}
                          </TableCell>
                        ))}
                      </TableRow>
                      
                      {/* Fila de PM */}
                      <TableRow className="bg-[#1a1a1a] hover:!bg-[#1a1a1a] border-b border-[#3a3a3a]">
                        <TableCell className="text-white font-medium px-4 py-3">Horómetro</TableCell>
                        {ACTIVO_HOROMETRO.map((pm, index) => (
                          <TableCell 
                            key={index} 
                            onClick={() => handleColumnaClick(index)}
                            onMouseEnter={() => handleColumnaHover(index)}
                            onMouseLeave={() => handleColumnaHover(null)}
                            className={`text-white text-center px-4 py-3 cursor-pointer transition-all ${
                              columnaSeleccionada === index 
                                ? 'bg-[#252525]' 
                                : columnaHover === index
                                ? 'bg-[#252525]'
                                : ''
                            }`}
                          >
                            {pm}
                          </TableCell>
                        ))}
                      </TableRow>
                      
                      {/* Fila de Última PM realizada */}
                      <TableRow className="bg-[#1a1a1a] hover:!bg-[#1a1a1a] border-b border-[#3a3a3a]">
                        <TableCell className="text-white font-medium px-4 py-3">Última PM realizada</TableCell>
                        {ACTIVO_ULTIMO_HOROMETRO.map((ultimaPM, index) => (
                          <TableCell 
                            key={index} 
                            onClick={() => handleColumnaClick(index)}
                            onMouseEnter={() => handleColumnaHover(index)}
                            onMouseLeave={() => handleColumnaHover(null)}
                            className={`text-white text-center px-4 py-3 cursor-pointer transition-all ${
                              columnaSeleccionada === index 
                                ? 'bg-[#252525]' 
                                : columnaHover === index
                                ? 'bg-[#252525]'
                                : ''
                            }`}
                          >
                            {ultimaPM}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

