'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { useStore } from '@/store/use-store';
import { useAuth } from '@/firebase';

export function AuthListener({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const { setUser, user, isLoading } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth, setUser]);

  useEffect(() => {
    if (isLoading) return;

    const isAuthPage = pathname === '/';
    const isDashboardPage = pathname === '/dashboard';

    if (user && isAuthPage) {
      router.replace('/dashboard');
    } else if (!user && isDashboardPage) {
      router.replace('/');
    }
  }, [user, isLoading, router, pathname]);
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return <>{children}</>;
}
