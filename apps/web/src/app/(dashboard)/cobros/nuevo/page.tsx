// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

'use client';

import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const schema = z.object({
  affiliateId: z.string().min(1, 'Seleccione un afiliado'),
  amount: z.coerce.number().positive('El monto debe ser mayor a 0'),
  currency: z.string().default('USD'),
  period: z.string().min(1, 'Ingrese el período (ej: Junio 2026)'),
  dueDate: z.string().min(1, 'Requerido'),
  method: z.string().optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const METODOS = [
  { value: '', label: '— Seleccionar método (opcional) —' },
  { value: 'CASH', label: 'Efectivo' },
  { value: 'TRANSFER', label: 'Transferencia' },
  { value: 'DEPOSIT', label: 'Depósito' },
  { value: 'CARD', label: 'Tarjeta' },
  { value: 'CHECK', label: 'Cheque' },
  { value: 'OTHER', label: 'Otro' },
];

function NuevoCobroForm() {
  const router = useRouter();
  const qc = useQueryClient();
  const searchParams = useSearchParams();
  const preselectedAfiliado = searchParams.get('affiliateId') ?? '';

  const { data: affiliates } = useQuery({
    queryKey: ['affiliates-all'],
    queryFn: () => api.get('/affiliates?perPage=200').then(r => r.data),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { affiliateId: preselectedAfiliado, currency: 'USD' },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.post('/payments', data),
    onSuccess: () => {
      toast.success('Cobro registrado correctamente');
      qc.invalidateQueries({ queryKey: ['payments'] });
      router.push('/cobros');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? 'Error al registrar el cobro');
    },
  });

  const affiliateOptions = [
    { value: '', label: '— Seleccione un afiliado —' },
    ...(affiliates?.data ?? []).map((a: any) => ({ value: a.id, label: `${a.businessName} (${a.ruc})` })),
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Registrar Nuevo Cobro" />
      <main className="p-6 max-w-2xl space-y-4">
        <Link href="/cobros">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Button>
        </Link>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <Card>
            <CardHeader><h3 className="font-semibold text-gray-800">Datos del Cobro</h3></CardHeader>
            <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Select
                  label="Empresa Afiliada *"
                  options={affiliateOptions}
                  error={errors.affiliateId?.message}
                  {...register('affiliateId')}
                />
              </div>
              <Input
                label="Período *"
                placeholder="Junio 2026"
                error={errors.period?.message}
                {...register('period')}
              />
              <Input
                label="Fecha de Vencimiento *"
                type="date"
                error={errors.dueDate?.message}
                {...register('dueDate')}
              />
              <Input
                label="Monto *"
                type="number"
                step="0.01"
                placeholder="0.00"
                error={errors.amount?.message}
                {...register('amount')}
              />
              <Select
                label="Moneda"
                options={[{ value: 'USD', label: 'USD - Dólar' }, { value: 'VES', label: 'VES - Bolívar' }]}
                {...register('currency')}
              />
              <Select label="Método de Pago" options={METODOS} {...register('method')} />
              <Input label="Referencia" placeholder="Número de referencia (opcional)" {...register('reference')} />
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">Observaciones</label>
                <textarea
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
                  rows={3}
                  placeholder="Notas adicionales (opcional)"
                  {...register('notes')}
                />
              </div>
            </CardBody>
          </Card>

          <div className="flex justify-end gap-3">
            <Link href="/cobros">
              <Button variant="ghost">Cancelar</Button>
            </Link>
            <Button type="submit" loading={mutation.isPending}>
              Registrar Cobro
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function NuevoCobroPage() {
  return (
    <Suspense>
      <NuevoCobroForm />
    </Suspense>
  );
}
