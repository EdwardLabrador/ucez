// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getStatusLabel, parseStatusColor } from '@/lib/utils';

type BadgeProps = {
  status: string;
};

export function StatusBadge({ status }: BadgeProps) {
  const { bg, text } = parseStatusColor(status);
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: text }]}>{getStatusLabel(status)}</Text>
    </View>
  );
}

const PLAN_COLORS: Record<string, { bg: string; text: string }> = {
  BASIC:      { bg: '#f3f4f6', text: '#374151' },
  STANDARD:   { bg: '#dbeafe', text: '#1e40af' },
  PREMIUM:    { bg: '#ede9fe', text: '#6d28d9' },
  ENTERPRISE: { bg: '#fef3c7', text: '#92400e' },
};

export function PlanBadge({ plan }: { plan: string }) {
  const colors = PLAN_COLORS[plan] ?? { bg: '#f3f4f6', text: '#374151' };
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.label, { color: colors.text }]}>{getStatusLabel(plan)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
});
