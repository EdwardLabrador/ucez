// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

type Props = { message?: string };

export function LoadingScreen({ message = 'Cargando...' }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1a3c6e" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

export function EmptyState({ icon, title, subtitle }: { icon?: string; title: string; subtitle?: string }) {
  return (
    <View style={styles.empty}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle && <Text style={styles.emptySub}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12,
    backgroundColor: '#f9fafb',
  },
  text: { color: '#6b7280', fontSize: 14 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  icon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#374151', textAlign: 'center' },
  emptySub: { fontSize: 13, color: '#9ca3af', textAlign: 'center', marginTop: 6 },
});
