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
import { Card, CardBody } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { Plus, Globe, MapPin, Users, Eye, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const TYPE_LABELS: Record<string, string> = {
  CONFERENCE: 'Conferencia', WORKSHOP: 'Taller', MEETING: 'Reunión',
  WEBINAR: 'Webinar', SOCIAL: 'Social', OTHER: 'Otro',
};

export default function EventosPage() {
  const [status, setStatus] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['events', status],
    queryFn: () => api.get('/events', { params: { perPage: 20, status: status || undefined } }).then(r => r.data),
  });

  const publish = useMutation({
    mutationFn: (id: string) => api.patch(`/events/${id}/publish`),
    onSuccess: () => { toast.success('Evento publicado'); qc.invalidateQueries({ queryKey: ['events'] }); },
  });

  const cancel = useMutation({
    mutationFn: (id: string) => api.patch(`/events/${id}/cancel`),
    onSuccess: () => { toast.success('Evento cancelado'); qc.invalidateQueries({ queryKey: ['events'] }); },
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Gestión de Eventos" />
      <main className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e] w-full sm:w-auto"
          >
            <option value="">Todos los estados</option>
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicados</option>
            <option value="COMPLETED">Completados</option>
            <option value="CANCELLED">Cancelados</option>
          </select>
          <Link href="/eventos/nuevo">
            <Button className="gap-2"><Plus className="w-4 h-4" /> Nuevo Evento</Button>
          </Link>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-400 py-12">Cargando eventos...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {(data?.data ?? []).length === 0 && (
              <p className="col-span-3 text-center text-gray-400 py-12">No hay eventos registrados</p>
            )}
            {(data?.data ?? []).map((ev: any) => (
              <Card key={ev.id} className="flex flex-col">
                <CardBody className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{ev.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{TYPE_LABELS[ev.type] ?? 'Otro'}</p>
                    </div>
                    <StatusBadge status={ev.status} />
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{ev.description}</p>
                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex gap-1.5 items-center">
                      {ev.isVirtual ? <Globe className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                      <span>{ev.isVirtual ? 'Evento Virtual' : ev.location ?? 'Sin ubicación'}</span>
                    </div>
                    <div className="flex gap-1.5 items-center">
                      <Users className="w-3.5 h-3.5" />
                      <span>{ev._count?.registrations ?? 0} inscritos {ev.capacity ? `/ ${ev.capacity}` : ''}</span>
                    </div>
                    <p className="font-medium text-gray-600">{formatDate(ev.startDate)} — {formatDate(ev.endDate)}</p>
                  </div>
                </CardBody>
                <div className="px-4 pb-4 flex gap-2 flex-wrap">
                  {ev.status === 'DRAFT' && (
                    <Button size="sm" className="gap-1" onClick={() => publish.mutate(ev.id)} loading={publish.isPending}>
                      <Send className="w-3.5 h-3.5" /> Publicar
                    </Button>
                  )}
                  {ev.status === 'PUBLISHED' && (
                    <Button size="sm" variant="danger" onClick={() => cancel.mutate(ev.id)}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
