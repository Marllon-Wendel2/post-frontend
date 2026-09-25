'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-context';

/**
 * Guard equivalente ao `ngOnInit` das páginas protegidas do Angular:
 * espera a hidratação do auth e redireciona para /login quando não há sessão.
 * Retorna `ready` para as páginas só carregarem dados com a sessão válida.
 */
export function useAuthGuard(): boolean {
  const { isLoggedIn, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [initialized, isLoggedIn, router]);

  return initialized && isLoggedIn;
}
