'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface SessionData {
  userId: number;
  usuario: string;
  nombre: string;
  idRol: number | null;
  idDis: number | null;
}

/**
 * Hook para manejar la autenticación en el cliente
 */
export function useAuth() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSession(data.data);
          } else {
            setSession(null);
          }
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error('Error al obtener sesión:', error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        setSession(null);
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return {
    session,
    isLoading,
    isAuthenticated: !!session,
    logout,
  };
}

