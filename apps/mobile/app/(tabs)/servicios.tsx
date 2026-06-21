// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  RefreshControl, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { LoadingScreen, EmptyState } from '@/components/ui/LoadingScreen';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = [
  { value: '', label: 'Todos' },
  { value: 'LEGAL', label: 'Legal' },
  { value: 'FINANCIAL', label: 'Financiero' },
  { value: 'TRAINING', label: 'Formación' },
  { value: 'NETWORKING', label: 'Networking' },
  { value: 'CONSULTING', label: 'Consultoría' },
  { value: 'BENEFITS', label: 'Beneficios' },
];

const CAT_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  LEGAL:      { bg: '#ede9fe', text: '#7c3aed', icon: 'shield-checkmark-outline' },
  FINANCIAL:  { bg: '#d1fae5', text: '#065f46', icon: 'cash-outline' },
  TRAINING:   { bg: '#dbeafe', text: '#1e40af', icon: 'school-outline' },
  NETWORKING: { bg: '#ffedd5', text: '#9a3412', icon: 'people-outline' },
  CONSULTING: { bg: '#fef9c3', text: '#854d0e', icon: 'chatbubbles-outline' },
  BENEFITS:   { bg: '#fce7f3', text: '#9d174d', icon: 'gift-outline' },
  OTHER:      { bg: '#f3f4f6', text: '#374151', icon: 'grid-outline' },
};

export default function ServiciosScreen() {
  const [activeCategory, setActiveCategory] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['services-mobile', activeCategory],
    queryFn: () =>
      api.get('/services', { params: { perPage: 50, category: activeCategory || undefined } })
        .then(r => r.data),
  });

  if (isLoading) return <LoadingScreen message="Cargando servicios..." />;

  const services = data?.data ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Servicios y Beneficios</Text>
        <Text style={styles.headerSub}>Servicios disponibles para afiliados</Text>
      </View>

      {/* Filtros de categoría */}
      <View style={styles.filterWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              onPress={() => setActiveCategory(cat.value)}
              style={[styles.filterChip, activeCategory === cat.value && styles.filterChipActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterLabel, activeCategory === cat.value && styles.filterLabelActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#1a3c6e" />}
      >
        {services.length === 0 ? (
          <EmptyState icon="💼" title="Sin servicios disponibles" subtitle="No hay servicios en esta categoría" />
        ) : (
          <View style={styles.list}>
            {services.map((svc: any) => {
              const colors = CAT_COLORS[svc.category] ?? CAT_COLORS.OTHER;
              const iconName = colors.icon as any;
              return (
                <Card key={svc.id} style={styles.serviceCard}>
                  <View style={styles.serviceHeader}>
                    <View style={[styles.serviceIcon, { backgroundColor: colors.bg }]}>
                      <Ionicons name={iconName} size={20} color={colors.text} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.serviceTitle}>{svc.title}</Text>
                      <View style={[styles.catChip, { backgroundColor: colors.bg }]}>
                        <Text style={[styles.catChipText, { color: colors.text }]}>
                          {CATEGORIES.find(c => c.value === svc.category)?.label ?? 'Otro'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.serviceDesc}>{svc.description}</Text>

                  {svc.contactInfo && (
                    <View style={styles.contactBox}>
                      <Ionicons name="information-circle-outline" size={14} color="#6b7280" />
                      <Text style={styles.contactText}>{svc.contactInfo}</Text>
                    </View>
                  )}

                  {svc.externalLink && (
                    <TouchableOpacity
                      style={styles.linkBtn}
                      onPress={() => Linking.openURL(svc.externalLink)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="open-outline" size={14} color="#1a3c6e" />
                      <Text style={styles.linkBtnText}>Más información</Text>
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
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  headerTitle: { color: '#ffffff', fontSize: 22, fontWeight: '800' },
  headerSub: { color: '#93c5fd', fontSize: 13, marginTop: 2 },

  filterWrap: { backgroundColor: '#1a3c6e', paddingBottom: 12 },
  filters: { paddingHorizontal: 16, gap: 8 },
  filterChip: {
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'transparent',
  },
  filterChipActive: { backgroundColor: '#ffffff', borderColor: '#ffffff' },
  filterLabel: { fontSize: 12, fontWeight: '600', color: '#93c5fd' },
  filterLabelActive: { color: '#1a3c6e' },

  scroll: { flex: 1, backgroundColor: '#f9fafb', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  list: { padding: 16 },

  serviceCard: { padding: 16, marginBottom: 0 },
  serviceHeader: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  serviceIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  serviceTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 4 },
  catChip: {
    alignSelf: 'flex-start', borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  catChipText: { fontSize: 10, fontWeight: '700' },

  serviceDesc: { fontSize: 13, color: '#6b7280', lineHeight: 20, marginBottom: 12 },

  contactBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    backgroundColor: '#f9fafb', borderRadius: 8, padding: 10, marginBottom: 10,
  },
  contactText: { fontSize: 12, color: '#6b7280', flex: 1 },

  linkBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1.5, borderColor: '#1a3c6e', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 7, alignSelf: 'flex-start',
  },
  linkBtnText: { fontSize: 12, color: '#1a3c6e', fontWeight: '700' },
});
