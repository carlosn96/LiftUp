'use client';

import { useStore } from '@/store/use-store';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';

export default function DashboardPage() {
  const { user, logout } = useStore();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (!auth) return;
    await logout(auth);
    router.push('/');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24 bg-background">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-5xl font-bold text-center md:text-7xl font-headline text-foreground">
          Bienvenido a LiftUp
        </h1>
        <p className="text-center text-muted-foreground">
          {user?.email}
        </p>
        <Button onClick={handleLogout}>Cerrar Sesión</Button>
      </div>
    </div>
  );
}
