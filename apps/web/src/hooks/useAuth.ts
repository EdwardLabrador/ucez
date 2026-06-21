// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

export function useLogin() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post('/auth/login', data);
      return res.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      if (data.user.role === 'AFFILIATE') {
        router.push('/portal/dashboard');
      } else {
        router.push('/dashboard');
      }
      toast.success(`Bienvenido, ${data.user.name}`);
    },
    onError: () => {
      toast.error('Correo o contraseña incorrectos');
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const { clearAuth } = useAuthStore();

  return () => {
    api.post('/auth/logout').catch(() => {});
    clearAuth();
    localStorage.clear();
    router.push('/login');
    toast.success('Sesión cerrada correctamente');
  };
}
