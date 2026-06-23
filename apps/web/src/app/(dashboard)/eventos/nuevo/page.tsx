// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

'use client';

import { useForm } from 'react-hook-form';
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

const TIPOS = [
  { value: 'CONFERENCE', label: 'Conferencia' },
  { value: 'WORKSHOP', label: 'Taller' },
  { value: 'MEETING', label: 'Reunión' },
  { value: 'WEBINAR', label: 'Webinar' },
  { value: 'SOCIAL', label: 'Social' },
  { value: 'OTHER', label: 'Otro' },
];

function toIso(value: string): string {
  if (!value) return value;
  // datetime-local envía "2026-06-23T14:30" sin segundos — agregar :00
  return value.length === 16 ? `${value}:00` : value;
}

export default function NuevoEventoPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<Record<string, any>>({
    defaultValues: { type: 'OTHER', isPublic: true, isVirtual: false },
  });

  const mutation = useMutation({
    mutationFn: (raw: any) => {
      const payload: Record<string, any> = { ...raw };
      // Convertir fechas a ISO completo
      if (payload.startDate) payload.startDate = toIso(payload.startDate);
      if (payload.endDate) payload.endDate = toIso(payload.endDate);
      // Eliminar campos opcionales vacíos
      if (!payload.location) delete payload.location;
      if (!payload.capacity && payload.capacity !== 0) delete payload.capacity;
      else if (payload.capacity) payload.capacity = Number(payload.capacity);
      // Asegurar booleanos
      payload.isVirtual = Boolean(payload.isVirtual);
      payload.isPublic = payload.isPublic !== false;
      return api.post('/events', payload);
    },
    onSuccess: () => {
      toast.success('Evento creado correctamente');
      qc.invalidateQueries({ queryKey: ['events'] });
      router.push('/eventos');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? 'Error al crear el evento');
    },
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Crear Nuevo Evento" />
      <main className="p-6 max-w-2xl space-y-4">
        <Link href="/eventos">
          <Button variant="ghost" size="sm" className="gap-1"><ArrowLeft className="w-4 h-4" /> Volver</Button>
        </Link>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <Card>
            <CardHeader><h3 className="font-semibold text-gray-800">Información del Evento</h3></CardHeader>
            <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Título del Evento *"
                  placeholder="Nombre del evento"
                  error={(errors.title as any)?.message}
                  {...register('title', { required: 'El título es requerido' })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">Descripción *</label>
                <textarea
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]"
                  rows={3}
                  {...register('description', { required: true })}
                />
              </div>
              <Select label="Tipo de Evento" options={TIPOS} {...register('type')} />
              <Input
                label="Capacidad (opcional)"
                type="number"
                min="1"
                placeholder="Número de asistentes"
                {...register('capacity')}
              />
              <Input
                label="Fecha y Hora de Inicio *"
                type="datetime-local"
                error={(errors.startDate as any)?.message}
                {...register('startDate', { required: 'Requerido' })}
              />
              <Input
                label="Fecha y Hora de Cierre *"
                type="datetime-local"
                error={(errors.endDate as any)?.message}
                {...register('endDate', { required: 'Requerido' })}
              />
              <div className="sm:col-span-2 flex gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" className="rounded" {...register('isVirtual')} />
                  Evento Virtual
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" className="rounded" defaultChecked {...register('isPublic')} />
                  Evento Público
                </label>
              </div>
              <Input
                label="Ubicación / Enlace Virtual"
                placeholder="Dirección o URL del evento"
                {...register('location')}
                className="sm:col-span-2"
              />
            </CardBody>
          </Card>
          <div className="flex justify-end gap-3">
            <Link href="/eventos"><Button variant="ghost">Cancelar</Button></Link>
            <Button type="submit" loading={mutation.isPending}>Crear Evento</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
