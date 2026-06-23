// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import { Card, CardBody } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Receipt, Download } from 'lucide-react';

export default function MisPagosPage() {
  const { user } = useAuthStore();

  const { data: statement, isLoading } = useQuery({
    queryKey: ['my-statement'],
    queryFn: () => api.get(`/affiliates/${user?.affiliateId}/account-statement`).then(r => r.data),
    enabled: !!user?.affiliateId,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Mis Pagos y Estado de Cuenta</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
          <p className="text-xs text-green-600 mb-1">Total Pagado</p>
          <p className="text-2xl font-bold text-green-700">{formatCurrency(statement?.totalPaid ?? 0)}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-center">
          <p className="text-xs text-yellow-600 mb-1">Pendiente</p>
          <p className="text-2xl font-bold text-yellow-700">{formatCurrency(statement?.totalPending ?? 0)}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
          <p className="text-xs text-red-600 mb-1">Vencido</p>
          <p className="text-2xl font-bold text-red-700">{formatCurrency(statement?.totalOverdue ?? 0)}</p>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-gray-800 mb-3">Historial de Transacciones</h2>
        {isLoading ? (
          <p className="text-center text-gray-400 py-12">Cargando...</p>
        ) : (statement?.payments ?? []).length === 0 ? (
          <div className="text-center py-16">
            <Receipt className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">No tienes pagos registrados</p>
          </div>
        ) : (
          <div className="space-y-2">
            {statement.payments.map((p: any) => (
              <Card key={p.id}>
                <CardBody className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3">
                  <div className="flex gap-3 items-start">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Receipt className="w-4 h-4 text-[#4169E1]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Período: {p.period}</p>
                      <p className="text-xs text-gray-400">N° Recibo: {p.receiptNumber}</p>
                      <p className="text-xs text-gray-400">Vencimiento: {formatDate(p.dueDate)}</p>
                      {p.paidAt && <p className="text-xs text-green-600">Pagado el: {formatDate(p.paidAt)}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(Number(p.amount), p.currency)}</p>
                      <StatusBadge status={p.status} />
                    </div>
                    {p.receiptUrl && (
                      <a
                        href={p.receiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#4169E1] text-[#4169E1] text-xs hover:bg-blue-50 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Recibo
                      </a>
                    )}
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
