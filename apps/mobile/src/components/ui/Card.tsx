// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

type StatCardProps = {
  label: string;
  value: string;
  bgColor?: string;
  textColor?: string;
};

export function StatCard({ label, value, bgColor = '#eff6ff', textColor = '#1a3c6e' }: StatCardProps) {
  return (
    <View style={[styles.stat, { backgroundColor: bgColor }]}>
      <Text style={[styles.statValue, { color: textColor }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  stat: {
    borderRadius: 14,
    padding: 16,
    flex: 1,
    minWidth: 100,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
});
