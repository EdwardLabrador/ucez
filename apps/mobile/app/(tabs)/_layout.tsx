// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View, Text, StyleSheet } from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, focused, label }: { name: IconName; focused: boolean; label: string }) {
  return (
    <View style={[tabStyles.item, focused && tabStyles.itemActive]}>
      <Ionicons
        name={focused ? name : (`${name}-outline` as IconName)}
        size={22}
        color={focused ? '#1a3c6e' : '#9ca3af'}
      />
      <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: tabStyles.bar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home" focused={focused} label="Inicio" />
          ),
        }}
      />
      <Tabs.Screen
        name="pagos"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="card" focused={focused} label="Mis Pagos" />
          ),
        }}
      />
      <Tabs.Screen
        name="eventos"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="calendar" focused={focused} label="Eventos" />
          ),
        }}
      />
      <Tabs.Screen
        name="servicios"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="briefcase" focused={focused} label="Servicios" />
          ),
        }}
      />
      <Tabs.Screen
        name="notificaciones"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="notifications" focused={focused} label="Avisos" />
          ),
        }}
      />
    </Tabs>
  );
}

const tabStyles = StyleSheet.create({
  bar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    height: Platform.OS === 'ios' ? 82 : 64,
    paddingBottom: Platform.OS === 'ios' ? 20 : 4,
    paddingTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  item: { alignItems: 'center', gap: 2, paddingHorizontal: 8, paddingVertical: 4 },
  itemActive: {},
  label: { fontSize: 10, color: '#9ca3af', fontWeight: '500' },
  labelActive: { color: '#1a3c6e', fontWeight: '700' },
});
