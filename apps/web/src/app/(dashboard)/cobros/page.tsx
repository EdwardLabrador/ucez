// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/Card';
import { Table, Pagination } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Plus, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'PENDING', label: 'Pendientes' },
  { value: 'PAID', label: 'Pagados' },
  { value: 'OVERDUE', label: 'Vencidos' },
  { value: 'CANCELLED', label: 'Cancelados' },
];

export default function CobrosPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['payments', page, status],
    queryFn: () =>
      api.get('/payments', { params: { page, perPage: 15, status: status || undefined } })
        .then(r => r.data),
  });

  const registerPayment = useMutation({
    mutationFn: (id: string) => api.patch(`/payments/${id}/pay`, { method: 'TRANSFER' }),
    onSuccess: () => {
      toast.success('Pago registrado y recibo generado');
      qc.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: () => toast.error('Error al registrar el pago'),
  });

  const cancelPayment = useMutation({
    mutationFn: (id: string) => api.patch(`/payments/${id}/cancel`),
    onSuccess: () => {
      toast.success('Cobro cancelado');
      qc.invalidateQueries({ queryKey: ['payments'] });
    },
  });

  const columns = [
    { key: 'receiptNumber', header: 'N° Recibo', render: (r: any) => <span className="font-mono text-xs">{r.receiptNumber}</span> },
    { key: 'affiliate', header: 'Empresa', render: (r: any) => <span className="font-medium">{r.affiliate?.businessName}</span> },
    { key: 'period', header: 'Período' },
    { key: 'amount', header: 'Monto', render: (r: any) => formatCurrency(Number(r.amount), r.currency) },
    { key: 'dueDate', header: 'Vencimiento', render: (r: any) => formatDate(r.dueDate) },
    { key: 'paidAt', header: 'Fecha Pago', render: (r: any) => r.paidAt ? formatDate(r.paidAt) : '—' },
    { key: 'status', header: 'Estado', render: (r: any) => <StatusBadge status={r.status} /> },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (r: any) => (
        <div className="flex gap-1">
          {r.status === 'PENDING' || r.status === 'OVERDUE' ? (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="gap-1 text-green-700 hover:bg-green-50"
                onClick={() => registerPayment.mutate(r.id)}
                loading={registerPayment.isPending}
              >
                <CheckCircle className="w-3.5 h-3.5" /> Pagar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="gap-1 text-red-600 hover:bg-red-50"
                onClick={() => cancelPayment.mutate(r.id)}
              >
                <XCircle className="w-3.5 h-3.5" /> Cancelar
              </Button>
            </>
          ) : r.receiptUrl ? (
            <a href={r.receiptUrl} target="_blank" rel="noreferrer" className="text-xs text-[#1a3c6e] underline">
              Ver Recibo
            </a>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Cobros y Pagos" />
      <main className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e] w-full sm:w-auto"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <Link href="/cobros/nuevo">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Nuevo Cobro
            </Button>
          </Link>
        </div>

        <Card>
          <Table
            columns={columns}
            data={data?.data ?? []}
            loading={isLoading}
            emptyMessage="No hay cobros registrados"
          />
          <Pagination page={page} totalPages={data?.meta?.totalPages ?? 1} onPageChange={setPage} />
        </Card>
      </main>
    </div>
  );
}
