// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  RefreshControl, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/LoadingScreen';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { formatDate } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';

const TYPE_LABELS: Record<string, string> = {
  CONFERENCE: 'Conferencia', WORKSHOP: 'Taller', MEETING: 'Reunión',
  WEBINAR: 'Webinar', SOCIAL: 'Social', OTHER: 'Otro',
};

const TYPE_COLORS: Record<string, string> = {
  CONFERENCE: '#1a3c6e', WORKSHOP: '#065f46', MEETING: '#7c3aed',
  WEBINAR: '#0369a1', SOCIAL: '#c8932a', OTHER: '#6b7280',
};

export default function EventosScreen() {
  const { user } = useAuthStore();
  const qc = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['events-mobile'],
    queryFn: () => api.get('/events?status=PUBLISHED&perPage=30').then(r => r.data),
  });

  const register = useMutation({
    mutationFn: ({ eventId, affiliateId }: { eventId: string; affiliateId: string }) =>
      api.post(`/events/${eventId}/register/${affiliateId}`),
    onSuccess: () => {
      Alert.alert('¡Inscripción Exitosa!', 'Ha sido registrado en el evento correctamente.');
      qc.invalidateQueries({ queryKey: ['events-mobile'] });
    },
    onError: () => {
      Alert.alert('Aviso', 'Ya está inscrito en este evento o no está disponible para registro.');
    },
  });

  const handleRegister = (ev: any) => {
    if (!user?.affiliateId) return;
    Alert.alert(
      'Confirmar Inscripción',
      `¿Desea inscribirse al evento "${ev.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Inscribirme', onPress: () => register.mutate({ eventId: ev.id, affiliateId: user.affiliateId! }) },
      ],
    );
  };

  if (isLoading) return <LoadingScreen message="Cargando eventos..." />;

  const events = data?.data ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Eventos y Actividades</Text>
        <Text style={styles.headerSub}>Eventos publicados por UCEZ</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#1a3c6e" />}
      >
        {events.length === 0 ? (
          <EmptyState icon="📅" title="Sin eventos disponibles" subtitle="No hay eventos publicados en este momento" />
        ) : (
          <View style={styles.list}>
            {events.map((ev: any) => {
              const typeColor = TYPE_COLORS[ev.type] ?? '#6b7280';
              return (
                <Card key={ev.id} style={styles.eventCard}>
                  {/* Tipo */}
                  <View style={[styles.typeBadge, { backgroundColor: typeColor + '18' }]}>
                    <Text style={[styles.typeBadgeText, { color: typeColor }]}>
                      {TYPE_LABELS[ev.type] ?? 'Evento'}
                    </Text>
                  </View>

                  <Text style={styles.eventTitle}>{ev.title}</Text>
                  <Text style={styles.eventDesc} numberOfLines={3}>{ev.description}</Text>

                  <View style={styles.eventMeta}>
                    <View style={styles.metaRow}>
                      <Ionicons name="calendar-outline" size={14} color="#6b7280" />
                      <Text style={styles.metaText}>
                        {formatDate(ev.startDate)} — {formatDate(ev.endDate)}
                      </Text>
                    </View>
                    <View style={styles.metaRow}>
                      {ev.isVirtual
                        ? <Ionicons name="globe-outline" size={14} color="#6b7280" />
                        : <Ionicons name="location-outline" size={14} color="#6b7280" />
                      }
                      <Text style={styles.metaText} numberOfLines={1}>
                        {ev.isVirtual ? 'Modalidad Virtual' : ev.location ?? 'Sin ubicación'}
                      </Text>
                    </View>
                    {ev.capacity && (
                      <View style={styles.metaRow}>
                        <Ionicons name="people-outline" size={14} color="#6b7280" />
                        <Text style={styles.metaText}>
                          {ev._count?.registrations ?? 0} inscritos de {ev.capacity} cupos
                        </Text>
                      </View>
                    )}
                  </View>

                  {user?.affiliateId && (
                    <TouchableOpacity
                      style={[styles.registerBtn, { backgroundColor: typeColor }]}
                      onPress={() => handleRegister(ev)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
                      <Text style={styles.registerBtnText}>Inscribirme</Text>
                    </TouchableOpacity>
                  )}
                </Card>
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
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  headerTitle: { color: '#ffffff', fontSize: 22, fontWeight: '800' },
  headerSub: { color: '#93c5fd', fontSize: 13, marginTop: 2 },

  scroll: { flex: 1, backgroundColor: '#f9fafb', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  list: { padding: 16 },

  eventCard: { padding: 16, marginBottom: 0 },

  typeBadge: {
    alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 10,
    paddingVertical: 4, marginBottom: 10,
  },
  typeBadgeText: { fontSize: 11, fontWeight: '700' },

  eventTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 6 },
  eventDesc: { fontSize: 13, color: '#6b7280', lineHeight: 20, marginBottom: 14 },

  eventMeta: { gap: 6, marginBottom: 16 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: '#6b7280', flex: 1 },

  registerBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, padding: 12, borderRadius: 10,
  },
  registerBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
