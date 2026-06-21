// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { LoadingScreen, EmptyState } from '@/components/ui/LoadingScreen';
import { formatDateTime } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';

type NotifType = string;

const TYPE_CONFIG: Record<NotifType, { icon: string; color: string }> = {
  PAYMENT_CONFIRMED: { icon: 'checkmark-circle',    color: '#065f46' },
  PAYMENT_REMINDER:  { icon: 'time',                color: '#854d0e' },
  PAYMENT_OVERDUE:   { icon: 'warning',             color: '#991b1b' },
  EVENT_PUBLISHED:   { icon: 'calendar',            color: '#1e40af' },
  EVENT_REMINDER:    { icon: 'calendar-outline',    color: '#1e40af' },
  SERVICE_PUBLISHED: { icon: 'briefcase',           color: '#7c3aed' },
  ANNOUNCEMENT:      { icon: 'megaphone',           color: '#9a3412' },
  MEMBERSHIP_EXPIRING:{ icon: 'card',               color: '#92400e' },
  SYSTEM:            { icon: 'information-circle',  color: '#6b7280' },
};

const BG_COLORS: Record<NotifType, string> = {
  PAYMENT_CONFIRMED:  '#d1fae5',
  PAYMENT_REMINDER:   '#fef9c3',
  PAYMENT_OVERDUE:    '#fee2e2',
  EVENT_PUBLISHED:    '#dbeafe',
  EVENT_REMINDER:     '#dbeafe',
  SERVICE_PUBLISHED:  '#ede9fe',
  ANNOUNCEMENT:       '#ffedd5',
  MEMBERSHIP_EXPIRING:'#fef3c7',
  SYSTEM:             '#f3f4f6',
};

export default function NotificacionesScreen() {
  const qc = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['notifications-mobile'],
    queryFn: () => api.get('/notifications').then(r => r.data),
  });

  const markRead = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications-mobile'] }),
  });

  const markAllRead = useMutation({
    mutationFn: () => api.patch('/notifications/read-all'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications-mobile'] }),
  });

  if (isLoading) return <LoadingScreen message="Cargando notificaciones..." />;

  const notifications: any[] = data ?? [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notificaciones</Text>
          {unreadCount > 0
            ? <Text style={styles.headerSub}>{unreadCount} sin leer</Text>
            : <Text style={styles.headerSub}>Todo al día</Text>
          }
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllBtn}
            onPress={() => markAllRead.mutate()}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-done-outline" size={14} color="#1a3c6e" />
            <Text style={styles.markAllText}>Marcar todas</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#1a3c6e" />}
      >
        {notifications.length === 0 ? (
          <EmptyState icon="🔔" title="Sin notificaciones" subtitle="Aquí aparecerán los avisos de pagos, eventos y comunicados" />
        ) : (
          <View style={styles.list}>
            {notifications.map((notif) => {
              const config = TYPE_CONFIG[notif.type] ?? { icon: 'notifications-outline', color: '#6b7280' };
              const bgColor = BG_COLORS[notif.type] ?? '#f3f4f6';

              return (
                <TouchableOpacity
                  key={notif.id}
                  style={[styles.notifCard, !notif.isRead && styles.notifCardUnread]}
                  onPress={() => !notif.isRead && markRead.mutate(notif.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.notifIcon, { backgroundColor: bgColor }]}>
                    <Ionicons name={config.icon as any} size={20} color={config.color} />
                  </View>
                  <View style={styles.notifContent}>
                    <View style={styles.notifTopRow}>
                      <Text style={[styles.notifTitle, !notif.isRead && styles.notifTitleUnread]} numberOfLines={2}>
                        {notif.title}
                      </Text>
                      {!notif.isRead && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.notifBody} numberOfLines={3}>{notif.body}</Text>
                    <Text style={styles.notifTime}>{formatDateTime(notif.createdAt)}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1a3c6e' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20,
  },
  headerTitle: { color: '#ffffff', fontSize: 22, fontWeight: '800' },
  headerSub: { color: '#93c5fd', fontSize: 13, marginTop: 2 },
  markAllBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#ffffff', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 7,
  },
  markAllText: { fontSize: 12, color: '#1a3c6e', fontWeight: '700' },

  scroll: { flex: 1, backgroundColor: '#f9fafb', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  list: { padding: 16, gap: 8 },

  notifCard: {
    flexDirection: 'row', gap: 12, backgroundColor: '#ffffff',
    borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#e5e7eb',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
  },
  notifCardUnread: {
    borderLeftWidth: 4, borderLeftColor: '#1a3c6e',
    backgroundColor: '#f8faff',
  },
  notifIcon: {
    width: 42, height: 42, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  notifContent: { flex: 1 },
  notifTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  notifTitle: { fontSize: 14, color: '#374151', flex: 1, fontWeight: '500', lineHeight: 20 },
  notifTitleUnread: { fontWeight: '700', color: '#111827' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1a3c6e', marginTop: 6, flexShrink: 0 },
  notifBody: { fontSize: 12, color: '#6b7280', lineHeight: 18, marginTop: 4 },
  notifTime: { fontSize: 11, color: '#9ca3af', marginTop: 6 },
});
