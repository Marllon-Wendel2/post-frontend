'use client';

import { setupIonicReact } from '@ionic/react';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth-context';

setupIonicReact();

export function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
