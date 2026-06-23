// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const schema = z.object({
  businessName: z.string().min(2, 'Requerido'),
  tradeName: z.string().optional(),
  ruc: z.string().min(6, 'RUC inválido'),
  sector: z.string().min(2, 'Requerido'),
  category: z.string().optional(),
  membershipPlan: z.enum(['BASIC', 'STANDARD', 'PREMIUM', 'ENTERPRISE']),
  membershipStartDate: z.string().min(1, 'Requerido'),
  address: z.string().min(3, 'Requerido'),
  city: z.string().min(2, 'Requerido'),
  phone: z.string().min(7, 'Teléfono inválido'),
  email: z.string().email('Correo inválido'),
  website: z.string().optional(),
  description: z.string().optional(),
  representativeName: z.string().min(2, 'Requerido'),
  representativeEmail: z.string().email('Correo inválido'),
  representativePhone: z.string().min(7, 'Teléfono inválido'),
});

type FormData = z.infer<typeof schema>;

const PLANES = [
  { value: 'BASIC', label: 'Básico' },
  { value: 'STANDARD', label: 'Estándar' },
  { value: 'PREMIUM', label: 'Premium' },
  { value: 'ENTERPRISE', label: 'Empresarial' },
];

export default function NuevoAfiliadoPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { membershipPlan: 'BASIC' },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const payload: Record<string, any> = { ...data };
      const optionalStrings = ['tradeName', 'category', 'website', 'description'];
      for (const key of optionalStrings) {
        if (!payload[key]) delete payload[key];
      }
      return api.post('/affiliates', payload);
    },
    onSuccess: () => {
      toast.success('Afiliado registrado correctamente');
      qc.invalidateQueries({ queryKey: ['affiliates'] });
      router.push('/afiliados');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? 'Error al registrar el afiliado');
    },
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Registrar Nuevo Afiliado" />
      <main className="p-6 max-w-4xl space-y-4">
        <Link href="/afiliados">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Button>
        </Link>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <Card>
            <CardHeader><h3 className="font-semibold text-gray-800">Datos de la Empresa</h3></CardHeader>
            <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Razón Social *" placeholder="Empresa S.A." error={errors.businessName?.message} {...register('businessName')} />
              <Input label="Nombre Comercial" placeholder="Nombre comercial (opcional)" {...register('tradeName')} />
              <Input label="RUC / RIF *" placeholder="J-123456789" error={errors.ruc?.message} {...register('ruc')} />
              <Input label="Sector *" placeholder="Tecnología, Alimentos, etc." error={errors.sector?.message} {...register('sector')} />
              <Input label="Categoría" placeholder="Categoría (opcional)" {...register('category')} />
              <Select label="Plan de Membresía *" options={PLANES} error={errors.membershipPlan?.message} {...register('membershipPlan')} />
              <Input label="Fecha de Inicio de Membresía *" type="date" error={errors.membershipStartDate?.message} {...register('membershipStartDate')} />
              <Input label="Teléfono *" placeholder="+58 412 000 0000" error={errors.phone?.message} {...register('phone')} />
              <Input label="Correo Electrónico *" type="email" placeholder="empresa@correo.com" error={errors.email?.message} {...register('email')} />
              <Input label="Sitio Web" placeholder="https://empresa.com" {...register('website')} />
              <Input label="Dirección *" placeholder="Av. Principal 123" error={errors.address?.message} {...register('address')} />
              <Input label="Ciudad *" placeholder="Maracaibo" error={errors.city?.message} {...register('city')} />
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]"
                  rows={3}
                  placeholder="Descripción de la empresa (opcional)"
                  {...register('description')}
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h3 className="font-semibold text-gray-800">Representante Legal</h3></CardHeader>
            <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Nombre Completo *" placeholder="Juan Pérez" error={errors.representativeName?.message} {...register('representativeName')} />
              <Input label="Correo del Representante *" type="email" placeholder="juan@empresa.com" error={errors.representativeEmail?.message} {...register('representativeEmail')} />
              <Input label="Teléfono del Representante *" placeholder="+58 412 000 0000" error={errors.representativePhone?.message} {...register('representativePhone')} />
            </CardBody>
          </Card>

          <div className="flex justify-end gap-3">
            <Link href="/afiliados">
              <Button variant="ghost">Cancelar</Button>
            </Link>
            <Button type="submit" loading={mutation.isPending}>
              Registrar Afiliado
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
