'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useToast } from './use-toast';
import { useAuth } from '@/firebase';

export function useAuthForm() {
  const { toast } = useToast();
  const auth = useAuth();

  const handleLogin = async (email: string, password: string) => {
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirection is handled by AuthListener
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error al iniciar sesión',
        description:
          error.code === 'auth/invalid-credential'
            ? 'Credenciales incorrectas.'
            : 'Ocurrió un error inesperado.',
      });
    }
  };

  const handleRegister = async (email: string, password: string) => {
    if (!auth) return;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
       // Redirection is handled by AuthListener
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error al registrarse',
        description:
          error.code === 'auth/email-already-in-use'
            ? 'El correo electrónico ya está en uso.'
            : 'Ocurrió un error inesperado.',
      });
    }
  };

  return { handleLogin, handleRegister };
}
