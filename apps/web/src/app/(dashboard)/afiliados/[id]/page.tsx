// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { StatusBadge, PlanBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { formatDate, formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import { ArrowLeft, Building2, Phone, Mail, Globe, MapPin, User } from 'lucide-react';
import Link from 'next/link';

const TABS = [
  { key: 'perfil', label: 'Perfil' },
  { key: 'cuenta', label: 'Estado de Cuenta' },
  { key: 'contactos', label: 'Contactos' },
];

export default function AfiliadoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') ?? 'perfil';
  const router = useRouter();
  const qc = useQueryClient();

  const { data: affiliate, isLoading } = useQuery({
    queryKey: ['affiliate', id],
    queryFn: () => api.get(`/affiliates/${id}`).then(r => r.data),
  });

  const { data: statement } = useQuery({
    queryKey: ['affiliate-statement', id],
    queryFn: () => api.get(`/affiliates/${id}/account-statement`).then(r => r.data),
    enabled: activeTab === 'cuenta',
  });

  const updateStatus = useMutation({
    mutationFn: (status: string) => api.patch(`/affiliates/${id}/status`, { status }),
    onSuccess: () => {
      toast.success('Estatus actualizado');
      qc.invalidateQueries({ queryKey: ['affiliate', id] });
    },
  });

  if (isLoading) return <div className="flex-1 flex items-center justify-center text-gray-400">Cargando...</div>;
  if (!affiliate) return null;

  const paymentColumns = [
    { key: 'receiptNumber', header: 'N° Recibo' },
    { key: 'period', header: 'Período' },
    { key: 'amount', header: 'Monto', render: (r: any) => formatCurrency(Number(r.amount), r.currency) },
    { key: 'dueDate', header: 'Vencimiento', render: (r: any) => formatDate(r.dueDate) },
    { key: 'paidAt', header: 'Fecha Pago', render: (r: any) => r.paidAt ? formatDate(r.paidAt) : '—' },
    { key: 'status', header: 'Estado', render: (r: any) => <StatusBadge status={r.status} /> },
    {
      key: 'recibo',
      header: 'Recibo',
      render: (r: any) => r.receiptUrl
        ? <a href={r.receiptUrl} target="_blank" rel="noreferrer" className="text-[#1a3c6e] text-xs underline">Descargar</a>
        : <span className="text-gray-400 text-xs">—</span>,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Detalle de Afiliado" />
      <main className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/afiliados">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="w-4 h-4" /> Volver
            </Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#1a3c6e] flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{affiliate.businessName}</h2>
              <p className="text-sm text-gray-500">RUC: {affiliate.ruc} · {affiliate.sector}</p>
              <div className="flex gap-2 mt-1">
                <StatusBadge status={affiliate.membershipStatus} />
                <PlanBadge plan={affiliate.membershipPlan} />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {affiliate.membershipStatus !== 'ACTIVE' && (
              <Button size="sm" onClick={() => updateStatus.mutate('ACTIVE')} loading={updateStatus.isPending}>
                Activar
              </Button>
            )}
            {affiliate.membershipStatus === 'ACTIVE' && (
              <Button size="sm" variant="danger" onClick={() => updateStatus.mutate('SUSPENDED')} loading={updateStatus.isPending}>
                Suspender
              </Button>
            )}
            <Link href={`/dashboard/cobros/nuevo?affiliateId=${id}`}>
              <Button size="sm" variant="secondary">Registrar Cobro</Button>
            </Link>
          </div>
        </div>

        <div className="flex gap-1 border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => router.push(`/dashboard/afiliados/${id}?tab=${tab.key}`)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-[#1a3c6e] text-[#1a3c6e]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'perfil' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><h3 className="font-semibold text-gray-800">Información General</h3></CardHeader>
              <CardBody className="space-y-3">
                {[
                  { icon: Building2, label: 'Nombre Comercial', value: affiliate.tradeName ?? '—' },
                  { icon: MapPin, label: 'Dirección', value: `${affiliate.address}, ${affiliate.city}` },
                  { icon: Phone, label: 'Teléfono', value: affiliate.phone },
                  { icon: Mail, label: 'Correo', value: affiliate.email },
                  { icon: Globe, label: 'Sitio Web', value: affiliate.website ?? '—' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-3">
                    <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-sm text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
            <Card>
              <CardHeader><h3 className="font-semibold text-gray-800">Representante Legal</h3></CardHeader>
              <CardBody className="space-y-3">
                {[
                  { icon: User, label: 'Nombre', value: affiliate.representativeName },
                  { icon: Mail, label: 'Correo', value: affiliate.representativeEmail },
                  { icon: Phone, label: 'Teléfono', value: affiliate.representativePhone },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-3">
                    <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-sm text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>
        )}

        {activeTab === 'cuenta' && statement && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-5 text-center">
                <p className="text-xs text-gray-500 mb-1">Total Pagado</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(statement.totalPaid)}</p>
              </Card>
              <Card className="p-5 text-center">
                <p className="text-xs text-gray-500 mb-1">Pendiente</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(statement.totalPending)}</p>
              </Card>
              <Card className="p-5 text-center">
                <p className="text-xs text-gray-500 mb-1">Vencido</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(statement.totalOverdue)}</p>
              </Card>
            </div>
            <Card>
              <CardHeader><h3 className="font-semibold text-gray-800">Historial de Pagos</h3></CardHeader>
              <Table
                columns={paymentColumns}
                data={statement.payments ?? []}
                emptyMessage="No hay pagos registrados"
              />
            </Card>
          </div>
        )}

        {activeTab === 'contactos' && (
          <Card>
            <CardHeader><h3 className="font-semibold text-gray-800">Contactos de la Empresa</h3></CardHeader>
            <Table
              columns={[
                { key: 'name', header: 'Nombre' },
                { key: 'position', header: 'Cargo' },
                { key: 'email', header: 'Correo' },
                { key: 'phone', header: 'Teléfono', render: (r: any) => r.phone ?? '—' },
                {
                  key: 'isPrimary',
                  header: 'Principal',
                  render: (r: any) => r.isPrimary
                    ? <span className="text-green-600 text-xs font-medium">Sí</span>
                    : <span className="text-gray-400 text-xs">No</span>,
                },
              ]}
              data={affiliate.contacts ?? []}
              emptyMessage="No hay contactos registrados"
            />
          </Card>
        )}
      </main>
    </div>
  );
}
