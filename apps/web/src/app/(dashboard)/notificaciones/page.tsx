// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDateTime } from '@/lib/utils';
import { Bell, CheckCheck, CreditCard, Calendar, Megaphone, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  PAYMENT_CONFIRMED: <CreditCard className="w-4 h-4 text-green-600" />,
  PAYMENT_REMINDER: <CreditCard className="w-4 h-4 text-yellow-600" />,
  PAYMENT_OVERDUE: <CreditCard className="w-4 h-4 text-red-600" />,
  EVENT_PUBLISHED: <Calendar className="w-4 h-4 text-blue-600" />,
  EVENT_REMINDER: <Calendar className="w-4 h-4 text-blue-500" />,
  ANNOUNCEMENT: <Megaphone className="w-4 h-4 text-purple-600" />,
  SYSTEM: <Info className="w-4 h-4 text-gray-500" />,
};

export default function NotificacionesPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications').then(r => r.data),
  });

  const markRead = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllRead = useMutation({
    mutationFn: () => api.patch('/notifications/read-all'),
    onSuccess: () => {
      toast.success('Todas las notificaciones marcadas como leídas');
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const notifications = data ?? [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Notificaciones" />
      <main className="p-6 max-w-3xl space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}
          </p>
          {unreadCount > 0 && (
            <Button size="sm" variant="outline" className="gap-1" onClick={() => markAllRead.mutate()} loading={markAllRead.isPending}>
              <CheckCheck className="w-4 h-4" /> Marcar todas como leídas
            </Button>
          )}
        </div>

        {isLoading ? (
          <p className="text-center text-gray-400 py-12">Cargando...</p>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">No tienes notificaciones</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif: any) => (
              <Card
                key={notif.id}
                className={cn('cursor-pointer transition-all', !notif.isRead && 'border-l-4 border-l-[#1a3c6e] bg-blue-50/40')}
                onClick={() => !notif.isRead && markRead.mutate(notif.id)}
              >
                <CardBody className="flex gap-3 py-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm mt-0.5">
                    {TYPE_ICONS[notif.type] ?? <Bell className="w-4 h-4 text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm font-medium', notif.isRead ? 'text-gray-600' : 'text-gray-900')}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{notif.body}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDateTime(notif.createdAt)}</p>
                  </div>
                  {!notif.isRead && (
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#1a3c6e] mt-2" />
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
