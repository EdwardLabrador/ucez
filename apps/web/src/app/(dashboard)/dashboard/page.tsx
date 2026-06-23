// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { formatCurrency } from '@/lib/utils';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Building2, CreditCard, AlertTriangle, CheckCircle,
  TrendingUp, CalendarDays, Clock, DollarSign,
} from 'lucide-react';

function StatCard({ title, value, subtitle, icon, colorClass, bgClass }: any) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-black text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass}`}>
          <span className={colorClass}>{icon}</span>
        </div>
      </div>
    </div>
  );
}

const STATUS_LABELS: Record<string, string> = {
  PAID: 'Pagado', PENDING: 'Pendiente', OVERDUE: 'Vencido', CANCELLED: 'Cancelado',
};
const STATUS_COLORS: Record<string, string> = {
  PAID: 'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  OVERDUE: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
};

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/dashboard/stats').then(r => r.data),
    refetchInterval: 60_000,
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#4169E1] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Cargando datos...</p>
        </div>
      </div>
    );
  }

  const s = stats ?? {};
  const chart = s.monthlyChart ?? [];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <TopBar title="Panel Principal" />
      <main className="p-6 space-y-6 max-w-7xl mx-auto">

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Afiliados"
            value={s.affiliates?.total ?? '—'}
            subtitle={`${s.affiliates?.active ?? 0} activos · ${s.affiliates?.pending ?? 0} pendientes`}
            icon={<Building2 className="w-5 h-5" />}
            bgClass="bg-blue-50" colorClass="text-[#4169E1]"
          />
          <StatCard
            title="Ingresos del Mes"
            value={formatCurrency(s.payments?.monthlyRevenue ?? 0)}
            subtitle="Pagos confirmados este mes"
            icon={<DollarSign className="w-5 h-5" />}
            bgClass="bg-green-50" colorClass="text-green-700"
          />
          <StatCard
            title="Pagos Vencidos"
            value={s.payments?.overdue ?? '—'}
            subtitle="Requieren atención inmediata"
            icon={<AlertTriangle className="w-5 h-5" />}
            bgClass="bg-red-50" colorClass="text-red-600"
          />
          <StatCard
            title="Eventos Próximos"
            value={s.events?.upcoming ?? '—'}
            subtitle="Publicados y vigentes"
            icon={<CalendarDays className="w-5 h-5" />}
            bgClass="bg-amber-50" colorClass="text-amber-600"
          />
        </div>

        {/* SEGUNDA FILA */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Pagos Pendientes"
            value={s.payments?.pending ?? '—'}
            subtitle="En espera de pago"
            icon={<Clock className="w-5 h-5" />}
            bgClass="bg-yellow-50" colorClass="text-yellow-600"
          />
          <StatCard
            title="Pagos Confirmados"
            value={s.payments?.paid ?? '—'}
            subtitle="Total pagos recibidos"
            icon={<CheckCircle className="w-5 h-5" />}
            bgClass="bg-emerald-50" colorClass="text-emerald-600"
          />
          <StatCard
            title="Total Cobros"
            value={s.payments?.total ?? '—'}
            subtitle="Registrados en el sistema"
            icon={<CreditCard className="w-5 h-5" />}
            bgClass="bg-purple-50" colorClass="text-purple-600"
          />
        </div>

        {/* GRÁFICA + PAGOS RECIENTES */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* GRÁFICA INGRESOS */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-[#4169E1]" />
              <h2 className="text-base font-black text-gray-900">Ingresos Últimos 6 Meses</h2>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chart} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradMonto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4169E1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4169E1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(v: number) => [formatCurrency(v), 'Ingresos']}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                />
                <Area type="monotone" dataKey="monto" stroke="#4169E1" strokeWidth={2}
                  fill="url(#gradMonto)" dot={{ fill: '#4169E1', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* PAGOS RECIENTES */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-base font-black text-gray-900 mb-4">Cobros Recientes</h2>
            <div className="space-y-3">
              {(s.recentPayments ?? []).length === 0 && (
                <p className="text-gray-400 text-sm text-center py-6">Sin cobros registrados</p>
              )}
              {(s.recentPayments ?? []).map((p: any) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-4 h-4 text-[#4169E1]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {p.affiliate?.businessName}
                    </p>
                    <p className="text-xs text-gray-400">{p.period}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-black text-gray-900">{formatCurrency(Number(p.amount))}</p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${STATUS_COLORS[p.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {STATUS_LABELS[p.status] ?? p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
