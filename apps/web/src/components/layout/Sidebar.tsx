// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/hooks/useAuth';
import {
  LayoutDashboard, Building2, CreditCard, CalendarDays,
  Briefcase, Bell, Users, LogOut, ChevronRight,
  FileBarChart2, Settings,
} from 'lucide-react';

const adminNav = [
  { href: '/dashboard', label: 'Panel Principal', icon: LayoutDashboard },
  { href: '/afiliados', label: 'Afiliados', icon: Building2 },
  { href: '/cobros', label: 'Cobros y Pagos', icon: CreditCard },
  { href: '/eventos', label: 'Eventos', icon: CalendarDays },
  { href: '/servicios', label: 'Servicios', icon: Briefcase },
  { href: '/notificaciones', label: 'Notificaciones', icon: Bell },
  { href: '/reportes', label: 'Reportes', icon: FileBarChart2 },
];

const adminOnlyNav = [
  { href: '/usuarios', label: 'Usuarios', icon: Users },
  { href: '/configuracion', label: 'Configuración', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const logout = useLogout();

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-[#1a3c6e] text-white">
      <div className="px-6 py-6 border-b border-[#2d5a9e]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#c8932a] flex items-center justify-center font-bold text-white text-lg">U</div>
          <div>
            <p className="font-bold text-white leading-tight">UCEZ</p>
            <p className="text-xs text-blue-200">Cámara de Comercio</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">Menú Principal</p>
        {adminNav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                active
                  ? 'bg-white/15 text-white'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white',
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3 h-3" />}
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <p className="px-3 py-2 mt-4 text-xs font-semibold text-blue-300 uppercase tracking-wider">Administración</p>
            {adminOnlyNav.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    active ? 'bg-white/15 text-white' : 'text-blue-100 hover:bg-white/10 hover:text-white',
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">{label}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="px-3 py-4 border-t border-[#2d5a9e]">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-white truncate">{user?.name}</p>
          <p className="text-xs text-blue-300 truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-blue-100 hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
