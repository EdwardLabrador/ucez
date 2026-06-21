// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

export function useLogin() {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post('/auth/login', data);
      return res.data;
    },
    onSuccess: async (data) => {
      await SecureStore.setItemAsync('accessToken', data.accessToken);
      await SecureStore.setItemAsync('refreshToken', data.refreshToken);
      setAuth(data.user);
      router.replace('/(tabs)/');
    },
  });
}

export function useLogout() {
  const { clearAuth } = useAuthStore();

  return async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    clearAuth();
    router.replace('/login');
  };
}
