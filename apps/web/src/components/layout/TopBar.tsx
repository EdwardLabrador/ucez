// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

type TopBarProps = {
  title: string;
};

export function TopBar({ title }: TopBarProps) {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/notificaciones"
          className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <Bell className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-[#4169E1] flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700 leading-tight">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role === 'SUPER_ADMIN' ? 'Super Admin' : user?.role === 'ADMIN' ? 'Administrador' : 'Staff'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
