// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/Card';
import { Table, Pagination } from '@/components/ui/Table';
import { StatusBadge, PlanBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plus, Search, Eye, FileText } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export default function AfiliadosPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: ['affiliates', page, debouncedSearch],
    queryFn: () =>
      api.get('/affiliates', { params: { page, perPage: 15, search: debouncedSearch || undefined } })
        .then(r => r.data),
  });

  const columns = [
    {
      key: 'businessName',
      header: 'Empresa',
      render: (row: any) => (
        <div>
          <p className="font-medium text-gray-900">{row.businessName}</p>
          <p className="text-xs text-gray-400">{row.ruc}</p>
        </div>
      ),
    },
    { key: 'sector', header: 'Sector', render: (row: any) => row.sector },
    { key: 'city', header: 'Ciudad', render: (row: any) => row.city },
    {
      key: 'membershipPlan',
      header: 'Plan',
      render: (row: any) => <PlanBadge plan={row.membershipPlan} />,
    },
    {
      key: 'membershipStatus',
      header: 'Estatus',
      render: (row: any) => <StatusBadge status={row.membershipStatus} />,
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (row: any) => (
        <div className="flex gap-2">
          <Link href={`/afiliados/${row.id}`}>
            <Button size="sm" variant="ghost" className="gap-1">
              <Eye className="w-3.5 h-3.5" /> Ver
            </Button>
          </Link>
          <Link href={`/afiliados/${row.id}?tab=cuenta`}>
            <Button size="sm" variant="outline" className="gap-1">
              <FileText className="w-3.5 h-3.5" /> Estado de Cuenta
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Gestión de Afiliados" />
      <main className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]"
              placeholder="Buscar por nombre, RUC o correo..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <Link href="/afiliados/nuevo">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Nuevo Afiliado
            </Button>
          </Link>
        </div>

        <Card>
          <Table
            columns={columns}
            data={data?.data ?? []}
            loading={isLoading}
            emptyMessage="No se encontraron afiliados"
          />
          <Pagination
            page={page}
            totalPages={data?.meta?.totalPages ?? 1}
            onPageChange={setPage}
          />
        </Card>
      </main>
    </div>
  );
}
