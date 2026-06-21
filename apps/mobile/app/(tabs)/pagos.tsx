// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  RefreshControl, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { LoadingScreen, EmptyState } from '@/components/ui/LoadingScreen';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';

export default function PagosScreen() {
  const { user } = useAuthStore();

  const { data: statement, isLoading, refetch } = useQuery({
    queryKey: ['my-statement-pagos'],
    queryFn: () => api.get(`/affiliates/${user?.affiliateId}/account-statement`).then(r => r.data),
    enabled: !!user?.affiliateId,
  });

  if (isLoading) return <LoadingScreen message="Cargando estado de cuenta..." />;

  const payments = statement?.payments ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Pagos</Text>
        <Text style={styles.headerSub}>Estado de cuenta</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#1a3c6e" />}
      >
        {/* Resumen */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryBox, { backgroundColor: '#d1fae5' }]}>
            <Text style={[styles.summaryValue, { color: '#065f46' }]}>
              {formatCurrency(statement?.totalPaid ?? 0)}
            </Text>
            <Text style={styles.summaryLabel}>Pagado</Text>
          </View>
          <View style={[styles.summaryBox, { backgroundColor: '#fef9c3' }]}>
            <Text style={[styles.summaryValue, { color: '#854d0e' }]}>
              {formatCurrency(statement?.totalPending ?? 0)}
            </Text>
            <Text style={styles.summaryLabel}>Pendiente</Text>
          </View>
          <View style={[styles.summaryBox, { backgroundColor: '#fee2e2' }]}>
            <Text style={[styles.summaryValue, { color: '#991b1b' }]}>
              {formatCurrency(statement?.totalOverdue ?? 0)}
            </Text>
            <Text style={styles.summaryLabel}>Vencido</Text>
          </View>
        </View>

        {/* Historial */}
        <Text style={styles.sectionTitle}>Historial de Transacciones</Text>

        {payments.length === 0 ? (
          <EmptyState icon="🧾" title="Sin pagos registrados" subtitle="Aún no tiene pagos en su cuenta" />
        ) : (
          <View style={styles.list}>
            {payments.map((p: any) => (
              <Card key={p.id} style={styles.paymentCard}>
                <View style={styles.paymentTop}>
                  <View style={styles.paymentIcon}>
                    <Ionicons name="receipt-outline" size={18} color="#1a3c6e" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.paymentPeriod}>Período: {p.period}</Text>
                    <Text style={styles.paymentReceipt}>Recibo: {p.receiptNumber}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <Text style={styles.paymentAmount}>
                      {formatCurrency(Number(p.amount), p.currency)}
                    </Text>
                    <StatusBadge status={p.status} />
                  </View>
                </View>

                <View style={styles.paymentDates}>
                  <View>
                    <Text style={styles.dateLabel}>Vencimiento</Text>
                    <Text style={styles.dateValue}>{formatDate(p.dueDate)}</Text>
                  </View>
                  {p.paidAt && (
                    <View>
                      <Text style={[styles.dateLabel, { color: '#065f46' }]}>Pagado el</Text>
                      <Text style={[styles.dateValue, { color: '#065f46' }]}>{formatDate(p.paidAt)}</Text>
                    </View>
                  )}
                  {p.receiptUrl && (
                    <TouchableOpacity
                      style={styles.receiptBtn}
                      onPress={() => Linking.openURL(`${process.env.EXPO_PUBLIC_API_URL?.replace('/api/v1', '')}${p.receiptUrl}`)}
                    >
                      <Ionicons name="download-outline" size={14} color="#1a3c6e" />
                      <Text style={styles.receiptBtnText}>Recibo</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Card>
            ))}
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

  summaryRow: { flexDirection: 'row', gap: 10, padding: 16, paddingBottom: 8 },
  summaryBox: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center' },
  summaryValue: { fontSize: 14, fontWeight: '700' },
  summaryLabel: { fontSize: 10, color: '#6b7280', marginTop: 2, fontWeight: '500' },

  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#111827', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10 },

  list: { paddingHorizontal: 16 },
  paymentCard: { padding: 14, marginBottom: 0 },
  paymentTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  paymentIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#eff6ff',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  paymentPeriod: { fontSize: 14, fontWeight: '600', color: '#111827' },
  paymentReceipt: { fontSize: 11, color: '#9ca3af', marginTop: 2, fontFamily: 'monospace' },
  paymentAmount: { fontSize: 15, fontWeight: '700', color: '#111827' },

  paymentDates: {
    flexDirection: 'row', gap: 20, marginTop: 12,
    paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6',
    alignItems: 'center',
  },
  dateLabel: { fontSize: 10, color: '#9ca3af', fontWeight: '500' },
  dateValue: { fontSize: 12, color: '#374151', fontWeight: '600', marginTop: 1 },

  receiptBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1.5, borderColor: '#1a3c6e', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 5, marginLeft: 'auto',
  },
  receiptBtnText: { fontSize: 12, color: '#1a3c6e', fontWeight: '600' },
});
