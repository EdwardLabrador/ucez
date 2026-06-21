// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { Card, StatCard } from '@/components/ui/Card';
import { StatusBadge, PlanBadge } from '@/components/ui/Badge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';

export default function InicioScreen() {
  const { user } = useAuthStore();
  const logout = useLogout();

  const { data: affiliate, refetch: refetchAffiliate, isLoading: loadingAffiliate } = useQuery({
    queryKey: ['my-affiliate-mobile'],
    queryFn: () => api.get(`/affiliates/${user?.affiliateId}`).then(r => r.data),
    enabled: !!user?.affiliateId,
  });

  const { data: statement, refetch: refetchStatement, isLoading: loadingStatement } = useQuery({
    queryKey: ['my-statement-mobile'],
    queryFn: () => api.get(`/affiliates/${user?.affiliateId}/account-statement`).then(r => r.data),
    enabled: !!user?.affiliateId,
  });

  const { data: events } = useQuery({
    queryKey: ['events-mobile-home'],
    queryFn: () => api.get('/events?status=PUBLISHED&perPage=3').then(r => r.data),
  });

  const pendingPayments = (statement?.payments ?? []).filter(
    (p: any) => p.status === 'PENDING' || p.status === 'OVERDUE',
  );

  const isRefreshing = loadingAffiliate || loadingStatement;

  const onRefresh = () => {
    refetchAffiliate();
    refetchStatement();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoMini}>
            <Text style={styles.logoMiniText}>U</Text>
          </View>
          <View>
            <Text style={styles.welcome}>Bienvenido</Text>
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={22} color="#93c5fd" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#1a3c6e" />}
      >
        {/* Tarjeta de membresía */}
        {affiliate && (
          <View style={styles.memberCard}>
            <View style={styles.memberCardTop}>
              <View>
                <Text style={styles.memberName}>{affiliate.businessName}</Text>
                <Text style={styles.memberRuc}>RUC: {affiliate.ruc}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <StatusBadge status={affiliate.membershipStatus} />
                <PlanBadge plan={affiliate.membershipPlan} />
              </View>
            </View>
            <View style={styles.memberDivider} />
            <View style={styles.memberCardBottom}>
              <View>
                <Text style={styles.memberDateLabel}>Miembro desde</Text>
                <Text style={styles.memberDateValue}>{formatDate(affiliate.membershipStartDate)}</Text>
              </View>
              {affiliate.membershipEndDate && (
                <View>
                  <Text style={styles.memberDateLabel}>Vigencia hasta</Text>
                  <Text style={styles.memberDateValue}>{formatDate(affiliate.membershipEndDate)}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Resumen financiero */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen de Cuenta</Text>
          <View style={styles.statsRow}>
            <StatCard
              label="Total Pagado"
              value={formatCurrency(statement?.totalPaid ?? 0)}
              bgColor="#d1fae5"
              textColor="#065f46"
            />
            <StatCard
              label="Pendiente"
              value={formatCurrency(statement?.totalPending ?? 0)}
              bgColor="#fef9c3"
              textColor="#854d0e"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              label="Vencido"
              value={formatCurrency(statement?.totalOverdue ?? 0)}
              bgColor="#fee2e2"
              textColor="#991b1b"
            />
            <View style={{ flex: 1 }} />
          </View>
        </View>

        {/* Alerta de pagos pendientes */}
        {pendingPayments.length > 0 && (
          <TouchableOpacity
            style={styles.alertCard}
            onPress={() => router.push('/(tabs)/pagos')}
            activeOpacity={0.8}
          >
            <View style={styles.alertIcon}>
              <Ionicons name="warning" size={20} color="#92400e" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>
                {pendingPayments.length} pago(s) pendiente(s)
              </Text>
              <Text style={styles.alertSub}>Toque aquí para ver el detalle</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#92400e" />
          </TouchableOpacity>
        )}

        {/* Próximos eventos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximos Eventos</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/eventos')}>
              <Text style={styles.seeAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          {(events?.data ?? []).length === 0 ? (
            <Text style={styles.emptyText}>No hay eventos próximos</Text>
          ) : (
            (events?.data ?? []).map((ev: any) => (
              <Card key={ev.id} style={styles.eventItem}>
                <View style={styles.eventRow}>
                  <View style={styles.eventIcon}>
                    <Ionicons name="calendar-outline" size={18} color="#1a3c6e" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.eventTitle} numberOfLines={1}>{ev.title}</Text>
                    <Text style={styles.eventDate}>{formatDate(ev.startDate)}</Text>
                  </View>
                </View>
              </Card>
            ))
          )}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1a3c6e' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoMini: {
    width: 38, height: 38, borderRadius: 10, backgroundColor: '#c8932a',
    alignItems: 'center', justifyContent: 'center',
  },
  logoMiniText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  welcome: { color: '#93c5fd', fontSize: 11 },
  userName: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  logoutBtn: { padding: 8 },

  scroll: { flex: 1, backgroundColor: '#f9fafb', borderTopLeftRadius: 24, borderTopRightRadius: 24 },

  memberCard: {
    margin: 16, marginTop: 20, backgroundColor: '#1a3c6e',
    borderRadius: 18, padding: 20,
    shadowColor: '#1a3c6e', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  memberCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  memberName: { color: '#ffffff', fontSize: 16, fontWeight: '700', maxWidth: 180 },
  memberRuc: { color: '#93c5fd', fontSize: 12, marginTop: 2 },
  memberDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 14 },
  memberCardBottom: { flexDirection: 'row', gap: 32 },
  memberDateLabel: { color: '#93c5fd', fontSize: 11 },
  memberDateValue: { color: '#ffffff', fontSize: 13, fontWeight: '600', marginTop: 2 },

  section: { paddingHorizontal: 16, marginBottom: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 10 },
  seeAll: { fontSize: 13, color: '#1a3c6e', fontWeight: '600' },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },

  alertCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fef3c7', borderRadius: 14, padding: 16,
    marginHorizontal: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#fcd34d',
  },
  alertIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#fef9c3',
    alignItems: 'center', justifyContent: 'center',
  },
  alertTitle: { fontSize: 14, fontWeight: '700', color: '#92400e' },
  alertSub: { fontSize: 12, color: '#b45309', marginTop: 2 },

  eventItem: { padding: 14, marginBottom: 0 },
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  eventIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#eff6ff',
    alignItems: 'center', justifyContent: 'center',
  },
  eventTitle: { fontSize: 14, fontWeight: '600', color: '#111827' },
  eventDate: { fontSize: 12, color: '#6b7280', marginTop: 2 },

  emptyText: { color: '#9ca3af', fontSize: 13, textAlign: 'center', paddingVertical: 16 },
});
