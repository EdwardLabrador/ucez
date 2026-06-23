// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import { Card, CardBody, StatCard } from '@/components/ui/Card';
import { StatusBadge, PlanBadge } from '@/components/ui/Badge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { CreditCard, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function PortalDashboardPage() {
  const { user } = useAuthStore();

  const { data: affiliate } = useQuery({
    queryKey: ['my-affiliate'],
    queryFn: () => api.get(`/affiliates/${user?.affiliateId ?? ''}`).then(r => r.data),
    enabled: !!user?.affiliateId,
  });

  const { data: statement } = useQuery({
    queryKey: ['my-statement'],
    queryFn: () => api.get(`/affiliates/${user?.affiliateId}/account-statement`).then(r => r.data),
    enabled: !!user?.affiliateId,
  });

  const { data: events } = useQuery({
    queryKey: ['public-events'],
    queryFn: () => api.get('/events?status=PUBLISHED&perPage=3').then(r => r.data),
  });

  const pendingPayments = (statement?.payments ?? []).filter((p: any) => p.status === 'PENDING' || p.status === 'OVERDUE');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Bienvenido, {user?.name}</h1>
            {affiliate && (
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-500">{affiliate.businessName}</p>
                <StatusBadge status={affiliate.membershipStatus} />
                <PlanBadge plan={affiliate.membershipPlan} />
              </div>
            )}
          </div>
          {affiliate && (
            <div className="text-sm text-gray-500">
              <p>Miembro desde: <strong className="text-gray-700">{formatDate(affiliate.membershipStartDate)}</strong></p>
              {affiliate.membershipEndDate && (
                <p>Vigencia hasta: <strong className="text-gray-700">{formatDate(affiliate.membershipEndDate)}</strong></p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Pagado"
          value={formatCurrency(statement?.totalPaid ?? 0)}
          icon={<CheckCircle className="w-6 h-6" />}
          color="bg-green-50 text-green-700"
        />
        <StatCard
          title="Monto Pendiente"
          value={formatCurrency(statement?.totalPending ?? 0)}
          icon={<CreditCard className="w-6 h-6" />}
          color="bg-yellow-50 text-yellow-700"
        />
        <StatCard
          title="Monto Vencido"
          value={formatCurrency(statement?.totalOverdue ?? 0)}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="bg-red-50 text-red-600"
        />
      </div>

      {pendingPayments.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardBody>
            <p className="font-semibold text-yellow-800 mb-3">
              Tiene {pendingPayments.length} pago(s) pendiente(s)
            </p>
            <div className="space-y-2">
              {pendingPayments.slice(0, 3).map((p: any) => (
                <div key={p.id} className="flex justify-between items-center text-sm">
                  <span className="text-yellow-700">Período: {p.period}</span>
                  <span className="font-semibold text-yellow-800">{formatCurrency(Number(p.amount), p.currency)}</span>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
            <Link href="/portal/mis-pagos" className="mt-3 inline-block text-sm text-[#4169E1] underline">
              Ver todos mis pagos →
            </Link>
          </CardBody>
        </Card>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">Próximos Eventos</h2>
          <Link href="/portal/eventos" className="text-sm text-[#4169E1] hover:underline">Ver todos</Link>
        </div>
        {(events?.data ?? []).length === 0 ? (
          <p className="text-center text-gray-400 py-8">No hay eventos próximos</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(events?.data ?? []).map((ev: any) => (
              <Card key={ev.id}>
                <CardBody className="space-y-2">
                  <p className="font-medium text-gray-900">{ev.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{ev.description}</p>
                  <div className="flex items-center gap-1 text-xs text-[#4169E1]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(ev.startDate)}</span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
