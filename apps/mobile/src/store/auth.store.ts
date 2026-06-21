// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { create } from 'zustand';

type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'AFFILIATE';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  affiliateId?: string;
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setAuth: (user) => set({ user, isAuthenticated: true }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
}));
