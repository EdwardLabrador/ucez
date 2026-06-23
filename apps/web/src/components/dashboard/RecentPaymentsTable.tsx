// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { Card, CardHeader } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDate, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Props = { payments: any[]; loading: boolean };

export function RecentPaymentsTable({ payments, loading }: Props) {
  const columns = [
    {
      key: 'affiliate',
      header: 'Empresa',
      render: (row: any) => <span className="font-medium text-gray-800">{row.affiliate?.businessName ?? '—'}</span>,
    },
    {
      key: 'period',
      header: 'Período',
      render: (row: any) => row.period,
    },
    {
      key: 'amount',
      header: 'Monto',
      render: (row: any) => <span className="font-semibold">{formatCurrency(Number(row.amount), row.currency)}</span>,
    },
    {
      key: 'dueDate',
      header: 'Vencimiento',
      render: (row: any) => formatDate(row.dueDate),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (row: any) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Pagos Recientes</h2>
          <Link href="/cobros" className="flex items-center gap-1 text-xs text-[#4169E1] hover:underline">
            Ver todos <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </CardHeader>
      <Table columns={columns} data={payments} loading={loading} emptyMessage="No hay pagos recientes" />
    </Card>
  );
}
