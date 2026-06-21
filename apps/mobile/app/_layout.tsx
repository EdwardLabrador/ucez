// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import React, { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function AuthGate({ children }: { children: React.ReactNode }) {
  const { setAuth, clearAuth } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (!token) { router.replace('/'); return; }

        const res = await api.get('/auth/me').catch(() => null);
        if (res?.data) {
          setAuth(res.data);
          router.replace('/(tabs)/');
        } else {
          clearAuth();
          router.replace('/');
        }
      } catch {
        router.replace('/login');
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  if (checking) return <LoadingScreen message="Iniciando UCEZ..." />;
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </AuthGate>
    </QueryClientProvider>
  );
}
