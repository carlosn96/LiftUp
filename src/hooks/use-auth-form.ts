'use client';

import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useToast } from './use-toast';
import { initializeFirebase } from '@/firebase';

export function useAuthForm() {
  const { toast } = useToast();
  const { auth } = initializeFirebase();

  const handleLogin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Inicio de sesión exitoso',
        description: 'Bienvenido de nuevo.',
      });
      // La redirección se manejará en un componente superior
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
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Registro exitoso',
        description: 'Tu cuenta ha sido creada.',
      });
      // La redirección se manejará en un componente superior
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
