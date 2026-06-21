// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { Card, CardHeader } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';

type Props = { events: any[]; loading: boolean };

const typeLabels: Record<string, string> = {
  CONFERENCE: 'Conferencia',
  WORKSHOP: 'Taller',
  MEETING: 'Reunión',
  WEBINAR: 'Webinar',
  SOCIAL: 'Social',
  OTHER: 'Otro',
};

export function UpcomingEventsList({ events, loading }: Props) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Próximos Eventos</h2>
          <Link href="/dashboard/eventos" className="flex items-center gap-1 text-xs text-[#1a3c6e] hover:underline">
            Ver todos <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </CardHeader>
      <div className="px-4 py-3 divide-y divide-gray-50">
        {loading ? (
          <p className="py-8 text-center text-sm text-gray-400">Cargando...</p>
        ) : events.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">No hay eventos próximos</p>
        ) : (
          events.map((ev) => (
            <div key={ev.id} className="flex gap-3 py-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[#1a3c6e]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{ev.title}</p>
                <p className="text-xs text-gray-400">{typeLabels[ev.type] ?? 'Otro'} · {formatDate(ev.startDate)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
