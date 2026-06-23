// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { Calendar, MapPin, Globe, Users, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const TYPE_LABELS: Record<string, string> = {
  CONFERENCE: 'Conferencia', WORKSHOP: 'Taller', MEETING: 'Reunión',
  WEBINAR: 'Webinar', SOCIAL: 'Social', OTHER: 'Otro',
};

export default function PortalEventosPage() {
  const { user } = useAuthStore();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['portal-events'],
    queryFn: () => api.get('/events?status=PUBLISHED&perPage=20').then(r => r.data),
  });

  const register = useMutation({
    mutationFn: ({ eventId, affiliateId }: { eventId: string; affiliateId: string }) =>
      api.post(`/events/${eventId}/register/${affiliateId}`),
    onSuccess: () => { toast.success('Inscripción exitosa'); qc.invalidateQueries({ queryKey: ['portal-events'] }); },
    onError: () => toast.error('Ya está inscrito o el evento no está disponible'),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Eventos y Actividades</h1>

      {isLoading ? (
        <p className="text-center text-gray-400 py-12">Cargando eventos...</p>
      ) : (data?.data ?? []).length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No hay eventos disponibles en este momento</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(data?.data ?? []).map((ev: any) => (
            <Card key={ev.id} className="flex flex-col">
              <CardBody className="flex-1 space-y-3">
                <div>
                  <span className="text-xs font-medium text-[#4169E1] bg-blue-50 px-2 py-0.5 rounded-full">
                    {TYPE_LABELS[ev.type] ?? 'Evento'}
                  </span>
                  <h3 className="font-bold text-gray-900 mt-2">{ev.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{ev.description}</p>
                </div>
                <div className="space-y-1.5 text-sm text-gray-500">
                  <div className="flex gap-2 items-center">
                    <Calendar className="w-4 h-4 text-[#4169E1]" />
                    <span>{formatDate(ev.startDate)} — {formatDate(ev.endDate)}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    {ev.isVirtual ? <Globe className="w-4 h-4 text-[#4169E1]" /> : <MapPin className="w-4 h-4 text-[#4169E1]" />}
                    <span>{ev.isVirtual ? 'Modalidad Virtual' : ev.location ?? 'Sin ubicación'}</span>
                  </div>
                  {ev.capacity && (
                    <div className="flex gap-2 items-center">
                      <Users className="w-4 h-4 text-[#4169E1]" />
                      <span>{ev._count?.registrations ?? 0} inscritos de {ev.capacity} cupos</span>
                    </div>
                  )}
                </div>
                {user?.affiliateId && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 w-full"
                    onClick={() => register.mutate({ eventId: ev.id, affiliateId: user.affiliateId! })}
                    loading={register.isPending}
                  >
                    <UserCheck className="w-4 h-4" /> Inscribirme
                  </Button>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
