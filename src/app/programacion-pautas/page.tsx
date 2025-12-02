"use client";

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAllPM, getAllNiveles } from '@/lib/api';
import type { PM, Nivel } from '@/models';

// Datos constantes para la tabla semanal (fuera del componente para evitar recreaciones)
const DIAS = ['1', '2', '3', '4', '5', '6', '7'];
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
  
  // Estados para valores editables de la tabla (inicialmente vacíos)
  // Cambiamos activoNombres para almacenar IDN en lugar de nombres
  const [activoIds, setActivoIds] = useState<number[]>(Array(7).fill(0));
  const [activoHorometros, setActivoHorometros] = useState<string[]>(Array(7).fill(''));
  
  // Estado para los niveles con IDJ=5 (activos)
  const [activos, setActivos] = useState<Nivel[]>([]);
  const [loadingActivos, setLoadingActivos] = useState(false);
  
  // Estado para tracking de inputs enfocados (para manejar blur correctamente)
  const [inputFocused, setInputFocused] = useState<{ columna: number; tipo: 'activo' | 'horometro' } | null>(null);
  
  // Estado para la PM seleccionada de la lista
  const [pautaSeleccionada, setPautaSeleccionada] = useState<number | null>(null);
  
  // Ref para el contenedor de la tabla (para detectar clics fuera)
  const tablaRef = useRef<HTMLDivElement>(null);
  // Ref para el contenedor de pautas (para excluir del click fuera)
  const pautasRef = useRef<HTMLDivElement>(null);
  
  // Datos para la tabla semanal
  const semana = `Semana ${numeroSemana}`;
  
  // Cargar activos (niveles con IDJ=5) al montar el componente
  useEffect(() => {
    const loadActivos = async () => {
      setLoadingActivos(true);
      try {
        const result = await getAllNiveles({ IDJ: 5 });
        if (result.success && result.data) {
          setActivos(result.data);
        } else {
          setActivos([]);
        }
      } catch (error) {
        console.error('Error al cargar activos:', error);
        setActivos([]);
      } finally {
        setLoadingActivos(false);
      }
    };
    
    loadActivos();
  }, []);
  
  // Resetear datos cuando cambia la semana
  useEffect(() => {
    setActivoIds(Array(7).fill(0));
    setActivoHorometros(Array(7).fill(''));
    setColumnaSeleccionada(null);
    setInputFocused(null);
    setPautaSeleccionada(null);
    setPautas([]);
  }, [numeroSemana]);
  
  // Limpiar la PM seleccionada cuando cambia la columna seleccionada
  useEffect(() => {
    setPautaSeleccionada(null);
  }, [columnaSeleccionada]);
  
  // Resetear hover cada vez que cambia el estado de selección
  useEffect(() => {
    // Siempre limpiar el hover cuando cambia la selección
    // Esto asegura que todas las columnas vuelvan a su estado original
    setColumnaHover(null);
  }, [columnaSeleccionada]);
  
  // Función para deseleccionar la columna (usada por click fuera y Enter)
  const deseleccionarColumna = () => {
    if (columnaSeleccionada !== null) {
      setColumnaSeleccionada(null);
      setInputFocused(null);
      // El hover se limpiará automáticamente por el useEffect anterior
    }
  };

  // Detectar clics fuera de la tabla para deseleccionar
  // Excluye el panel de pautas para que no se deseleccione al seleccionar una pauta
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Solo deseleccionar si el click está fuera de la tabla Y fuera del panel de pautas
      if (
        tablaRef.current && 
        !tablaRef.current.contains(target) &&
        pautasRef.current &&
        !pautasRef.current.contains(target)
      ) {
        deseleccionarColumna();
      }
    };

    // Agregar el event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Limpiar el event listener al desmontar
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [columnaSeleccionada]);

  // Detectar tecla Enter para deseleccionar (igual que click fuera)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Si se presiona Enter y hay una columna seleccionada
      if (event.key === 'Enter' && columnaSeleccionada !== null) {
        const target = event.target as HTMLElement;
        // Si el evento viene de dentro de la tabla (incluyendo los inputs editables)
        // o si no es un input, deseleccionar
        if (tablaRef.current?.contains(target)) {
          event.preventDefault();
          deseleccionarColumna();
        }
      }
    };

    // Agregar el event listener
    document.addEventListener('keydown', handleKeyDown);

    // Limpiar el event listener al desmontar
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [columnaSeleccionada]);
  
  // Cargar pautas cuando se selecciona una columna
  useEffect(() => {
    const loadPautas = async () => {
      if (columnaSeleccionada !== null) {
        setLoadingPautas(true);
        try {
          // Extraer el número del horómetro del estado editable
          const horometroStr = activoHorometros[columnaSeleccionada];
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
  }, [columnaSeleccionada, activoHorometros]);
  
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
    // Siempre limpiar el hover primero para resetear el estado
    setColumnaHover(null);
    
    if (columnaSeleccionada === index) {
      // Deseleccionar
      setColumnaSeleccionada(null);
      setInputFocused(null);
    } else {
      // Seleccionar
      setColumnaSeleccionada(index);
    }
  };
  
  // Función para manejar el hover en una columna
  // Solo permite hover si la columna NO está seleccionada
  // Garantiza que solo una columna tenga hover a la vez
  const handleColumnaHover = (index: number | null) => {
    // Si se está limpiando el hover (null), siempre permitirlo
    if (index === null) {
      setColumnaHover(null);
      return;
    }
    
    // Solo establecer hover si no hay ninguna columna seleccionada
    // React garantiza que columnaHover solo puede tener un valor a la vez,
    // por lo que establecer un nuevo hover automáticamente reemplaza el anterior
    if (columnaSeleccionada === null) {
      setColumnaHover(index);
    } else {
      // Si hay una columna seleccionada, asegurarse de que no haya hover
      setColumnaHover(null);
    }
  };
  
  // Función para manejar el blur de los inputs
  const handleInputBlur = (index: number, tipo: 'activo' | 'horometro') => {
    // Los datos ya están guardados en el estado
    // Usamos un pequeño delay para permitir que el click en otra celda se procese primero
    setTimeout(() => {
      // Verificar si el input que perdió el foco es el que estaba enfocado
      if (inputFocused?.columna === index && inputFocused?.tipo === tipo) {
        setInputFocused(null);
        // Si la columna sigue seleccionada, verificar si debemos deseleccionarla
        // Esto se manejará cuando ambos inputs pierdan el foco
        if (columnaSeleccionada === index) {
          // Pequeño delay adicional para permitir que el otro input pueda recibir el foco
          setTimeout(() => {
            if (columnaSeleccionada === index && !inputFocused) {
              setColumnaSeleccionada(null);
              // El hover se limpiará automáticamente por el useEffect
            }
          }, 100);
        }
      }
    }, 150);
  };
  
  // Función para manejar el focus de los inputs
  const handleInputFocus = (index: number, tipo: 'activo' | 'horometro') => {
    setInputFocused({ columna: index, tipo });
    // Asegurar que la columna esté seleccionada cuando se enfoca un input
    if (columnaSeleccionada !== index) {
      setColumnaSeleccionada(index);
      // El hover se limpiará automáticamente por el useEffect
    }
  };
  
  // Función para actualizar el ID del activo seleccionado
  const handleActivoChange = (index: number, value: string) => {
    const nuevoId = value ? parseInt(value) : 0;
    const nuevosIds = [...activoIds];
    nuevosIds[index] = nuevoId;
    setActivoIds(nuevosIds);
  };
  
  // Función para obtener el nombre del activo por su ID
  const getActivoNombre = (idn: number): string => {
    if (idn === 0) return '';
    const activo = activos.find(a => a.IDN === idn);
    return activo ? activo.NOMBRE : '';
  };
  
  // Función para actualizar el horómetro
  // Solo permite números
  const handleHorometroChange = (index: number, value: string) => {
    // Filtrar solo números (0-9)
    const soloNumeros = value.replace(/[^0-9]/g, '');
    const nuevosHorometros = [...activoHorometros];
    nuevosHorometros[index] = soloNumeros;
    setActivoHorometros(nuevosHorometros);
  };
  
  // Función para verificar si el botón "Programar Pauta" debe estar habilitado
  const puedeProgramarPauta = () => {
    if (columnaSeleccionada === null) {
      return false;
    }
    const activoId = activoIds[columnaSeleccionada];
    const horometro = activoHorometros[columnaSeleccionada];
    // El botón está habilitado solo si:
    // 1. Ambos campos (activo y horómetro) están llenos
    // 2. Hay una PM seleccionada de la lista
    return activoId !== 0 && horometro.trim() !== '' && pautaSeleccionada !== null;
  };
  
  // Función para manejar el click en "Programar Pauta"
  const handleProgramarPauta = () => {
    if (!puedeProgramarPauta() || columnaSeleccionada === null || pautaSeleccionada === null) {
      return;
    }
    
    const activoId = activoIds[columnaSeleccionada];
    const activoNombre = getActivoNombre(activoId);
    const horometro = activoHorometros[columnaSeleccionada];
    const pauta = pautas.find(p => p.IDPM === pautaSeleccionada);
    
    // Aquí puedes agregar la lógica para programar la pauta
    console.log('Programar pauta:', {
      columna: columnaSeleccionada,
      activoId,
      activoNombre,
      horometro,
      semana: numeroSemana,
      pautaId: pautaSeleccionada,
      pauta: pauta
    });
    
    // Por ahora solo mostramos un mensaje (puedes implementar la lógica real después)
    // toast.success(`Pauta programada para ${activoNombre} con horómetro ${horometro}`);
  };
  
  // Función para manejar la selección de una pauta
  const handlePautaClick = (pautaId: number) => {
    if (pautaSeleccionada === pautaId) {
      // Si se hace click en la misma pauta, deseleccionar
      setPautaSeleccionada(null);
    } else {
      // Seleccionar la nueva pauta
      setPautaSeleccionada(pautaId);
    }
  };

  // Obtener el horómetro de la columna seleccionada
  const horometroSeleccionado = columnaSeleccionada !== null ? activoHorometros[columnaSeleccionada] : null;
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
        <div className="lg:col-span-1" ref={pautasRef}>
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
                      onClick={() => handlePautaClick(pauta.IDPM)}
                      className={`p-3 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors ${
                        pautaSeleccionada === pauta.IDPM
                          ? 'bg-primary/20 border-primary'
                          : ''
                      }`}
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
              <div className="overflow-x-auto" ref={tablaRef}>
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
                              columnaHover === index && columnaSeleccionada === null
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
                      
                      {/* Fila de Activo */}
                      <TableRow className="bg-[#1a1a1a] hover:!bg-[#1a1a1a] border-b border-[#3a3a3a]">
                        <TableCell className="text-white font-medium px-4 py-3">Activo</TableCell>
                        {activoIds.map((activoId, index) => (
                          <TableCell 
                            key={index} 
                            onClick={() => handleColumnaClick(index)}
                            onMouseEnter={() => handleColumnaHover(index)}
                            onMouseLeave={() => handleColumnaHover(null)}
                            onBlur={() => {}}
                            className={`text-white text-center px-4 py-3 transition-all ${
                              columnaHover === index && columnaSeleccionada === null
                                ? 'bg-[#252525]'
                                : ''
                            } ${columnaSeleccionada === index ? '' : 'cursor-pointer'}`}
                          >
                            {columnaSeleccionada === index ? (
                              <Select
                                value={activoId !== 0 ? activoId.toString() : ''}
                                onValueChange={(value) => handleActivoChange(index, value)}
                                onOpenChange={(open) => {
                                  if (open) {
                                    handleInputFocus(index, 'activo');
                                  } else {
                                    // Cuando se cierra el Select, manejar el blur
                                    handleInputBlur(index, 'activo');
                                  }
                                }}
                              >
                                <SelectTrigger 
                                  className="w-full bg-[#2a2a2a] border-[#3a3a3a] text-white h-8"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <SelectValue placeholder="Seleccione activo" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#2a2a2a] border-[#3a3a3a]">
                                  {loadingActivos ? (
                                    <SelectItem value="loading" disabled>
                                      Cargando...
                                    </SelectItem>
                                  ) : activos.length > 0 ? (
                                    activos.map((activo) => (
                                      <SelectItem 
                                        key={activo.IDN} 
                                        value={activo.IDN.toString()}
                                        className="text-white focus:bg-[#3a3a3a]"
                                      >
                                        {activo.NOMBRE}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="no-data" disabled>
                                      No hay activos disponibles
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            ) : (
                              <span className={activoId !== 0 ? '' : 'text-muted-foreground'}>
                                {activoId !== 0 ? getActivoNombre(activoId) : '—'}
                              </span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      
                      {/* Fila de PM */}
                      <TableRow className="bg-[#1a1a1a] hover:!bg-[#1a1a1a] border-b border-[#3a3a3a]">
                        <TableCell className="text-white font-medium px-4 py-3">Horómetro</TableCell>
                        {activoHorometros.map((pm, index) => (
                          <TableCell 
                            key={index} 
                            onClick={() => handleColumnaClick(index)}
                            onMouseEnter={() => handleColumnaHover(index)}
                            onMouseLeave={() => handleColumnaHover(null)}
                            onBlur={() => {}}
                            className={`text-white text-center px-4 py-3 transition-all ${
                              columnaHover === index && columnaSeleccionada === null
                                ? 'bg-[#252525]'
                                : ''
                            } ${columnaSeleccionada === index ? '' : 'cursor-pointer'}`}
                          >
                            {columnaSeleccionada === index ? (
                              <Input
                                type="text"
                                value={pm}
                                onChange={(e) => handleHorometroChange(index, e.target.value)}
                                onFocus={() => handleInputFocus(index, 'horometro')}
                                onBlur={() => handleInputBlur(index, 'horometro')}
                                className="w-full bg-[#2a2a2a] border-[#3a3a3a] text-white text-center h-8"
                                placeholder="Ingrese horómetro"
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <span className={pm ? '' : 'text-muted-foreground'}>
                                {pm || '—'}
                              </span>
                            )}
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
                              columnaHover === index && columnaSeleccionada === null
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
      
      {/* Botón Programar Pauta */}
      <div className="flex justify-end mt-6">
        <Button
          onClick={handleProgramarPauta}
          disabled={!puedeProgramarPauta()}
          className="min-w-[180px]"
        >
          Programar Pauta
        </Button>
      </div>
    </div>
  );
}

