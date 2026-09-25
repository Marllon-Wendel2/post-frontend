'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function RootPage() {
  const { initialized, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    router.replace(isLoggedIn ? '/home' : '/login');
  }, [initialized, isLoggedIn, router]);

  return null;
}
