// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLogout } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, CreditCard, CalendarDays, Briefcase, Bell, LogOut } from 'lucide-react';

const nav = [
  { href: '/portal/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { href: '/portal/mis-pagos', label: 'Mis Pagos', icon: CreditCard },
  { href: '/portal/eventos', label: 'Eventos', icon: CalendarDays },
  { href: '/portal/servicios', label: 'Servicios', icon: Briefcase },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const logout = useLogout();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#4169E1] text-white shadow-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c8932a] flex items-center justify-center font-bold text-white">U</div>
            <div>
              <p className="font-bold text-sm leading-tight">UCEZ</p>
              <p className="text-xs text-blue-200 leading-tight">Portal del Afiliado</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden sm:block text-blue-100">{user?.name}</span>
            <button onClick={logout} className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-blue-100">
              <LogOut className="w-4 h-4" /> <span className="hidden sm:block">Salir</span>
            </button>
          </div>
        </div>
        <nav className="max-w-5xl mx-auto px-4 flex gap-1 pb-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname.startsWith(href) ? 'bg-white/15 text-white' : 'text-blue-200 hover:text-white hover:bg-white/10',
              )}
            >
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        {children}
      </main>

      <footer className="text-center py-4 text-xs text-gray-400 border-t border-gray-200">
        © 2026 Unión de Comerciantes del Estado Zulia — Todos los Derechos Reservados
      </footer>

      <Toaster position="top-right" />
    </div>
  );
}
