// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SERVICIOS = [
  { icono: 'shield-checkmark', label: 'Asesoría Legal' },
  { icono: 'school', label: 'Capacitación' },
  { icono: 'people', label: 'Networking' },
  { icono: 'megaphone', label: 'Promoción' },
  { icono: 'business', label: 'Representación' },
  { icono: 'document-text', label: 'Trámites' },
];

export default function LandingScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#1a3c6e" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* HERO */}
        <LinearGradient colors={['#1a3c6e', '#2563be']} style={styles.hero}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>UC</Text>
          </View>
          <Text style={styles.heroTitle}>Unión de Comerciantes{'\n'}del Estado Zulia</Text>
          <Text style={styles.heroSub}>
            Representando y fortaleciendo al sector comercial zuliano por más de 30 años.
          </Text>

          {/* STATS */}
          <View style={styles.statsRow}>
            {[['500+', 'Afiliados'], ['+30', 'Años'], ['12', 'Sectores']].map(([n, l]) => (
              <View key={l} style={styles.statItem}>
                <Text style={styles.statNumber}>{n}</Text>
                <Text style={styles.statLabel}>{l}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* CTA AFILIADOS */}
        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>¿Eres afiliado?</Text>
          <Text style={styles.ctaSub}>
            Consulta tus pagos, descarga recibos e inscríbete en eventos desde tu teléfono.
          </Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => router.push('/login')}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaBtnText}>Zona de Afiliados</Text>
            <Ionicons name="arrow-forward" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* SERVICIOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTag}>Lo que ofrecemos</Text>
          <Text style={styles.sectionTitle}>Servicios para tu empresa</Text>
          <View style={styles.serviciosGrid}>
            {SERVICIOS.map((s) => (
              <View key={s.label} style={styles.servicioCard}>
                <View style={styles.servicioIcon}>
                  <Ionicons name={s.icono as any} size={22} color="#1a3c6e" />
                </View>
                <Text style={styles.servicioLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* NOSOTROS */}
        <View style={[styles.section, styles.sectionBlue]}>
          <Text style={[styles.sectionTag, { color: '#93c5fd' }]}>Quiénes somos</Text>
          <Text style={[styles.sectionTitle, { color: '#ffffff' }]}>La voz del comercio zuliano</Text>
          <Text style={styles.nosotrosText}>
            UCEZ es una organización gremial sin fines de lucro fundada para representar,
            proteger y promover los intereses del sector comercial del estado Zulia.
            Trabajamos con empresas de todos los tamaños brindando servicios, asesoría
            y representación ante organismos públicos y privados.
          </Text>
          {[
            ['🎯', 'Misión', 'Promover el desarrollo sostenible del comercio zuliano.'],
            ['👁️', 'Visión', 'Ser la cámara de comercio líder del occidente venezolano.'],
          ].map(([icono, titulo, desc]) => (
            <View key={titulo as string} style={styles.valorCard}>
              <Text style={styles.valorIcono}>{icono as string}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.valorTitulo}>{titulo as string}</Text>
                <Text style={styles.valorDesc}>{desc as string}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CONTACTO */}
        <View style={styles.section}>
          <Text style={styles.sectionTag}>Contacto</Text>
          <Text style={styles.sectionTitle}>Estamos aquí para ayudarte</Text>
          {[
            { icono: 'location', texto: 'Av. 5 de Julio, Edificio UCEZ\nMaracaibo, Estado Zulia' },
            { icono: 'call', texto: '(0261) 000-0000\nLun–Vie  8:00 AM – 5:00 PM' },
            { icono: 'mail', texto: 'info@ucez.com' },
          ].map((c) => (
            <View key={c.icono} style={styles.contactRow}>
              <View style={styles.contactIcon}>
                <Ionicons name={c.icono as any} size={18} color="#1a3c6e" />
              </View>
              <Text style={styles.contactText}>{c.texto}</Text>
            </View>
          ))}
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 UCEZ — Todos los Derechos Reservados</Text>
          <TouchableOpacity onPress={() => router.push('/login')} activeOpacity={0.8}>
            <Text style={styles.footerLink}>Zona de Afiliados →</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1a3c6e' },
  scroll: { flex: 1 },

  hero: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 48, alignItems: 'center' },
  logoBox: {
    width: 64, height: 64, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  logoText: { color: '#ffffff', fontSize: 22, fontWeight: '900' },
  heroTitle: { color: '#ffffff', fontSize: 26, fontWeight: '900', textAlign: 'center', lineHeight: 34, marginBottom: 12 },
  heroSub: { color: '#bfdbfe', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  statsRow: { flexDirection: 'row', gap: 32, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: 24, marginTop: 4 },
  statItem: { alignItems: 'center' },
  statNumber: { color: '#ffffff', fontSize: 26, fontWeight: '900' },
  statLabel: { color: '#93c5fd', fontSize: 11, marginTop: 2 },

  ctaBox: {
    backgroundColor: '#ffffff', margin: 16, borderRadius: 20, padding: 24, alignItems: 'center',
    shadowColor: '#1a3c6e', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 4,
  },
  ctaTitle: { fontSize: 20, fontWeight: '900', color: '#111827', marginBottom: 8 },
  ctaSub: { fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#1a3c6e', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 14 },
  ctaBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 15 },

  section: { backgroundColor: '#ffffff', paddingHorizontal: 24, paddingVertical: 32 },
  sectionBlue: { backgroundColor: '#1a3c6e' },
  sectionTag: { color: '#1a3c6e', fontWeight: '700', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  sectionTitle: { color: '#111827', fontSize: 22, fontWeight: '900', marginBottom: 20 },

  serviciosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  servicioCard: {
    width: (width - 48 - 12) / 2, backgroundColor: '#f8faff', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#e0e9f7', flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  servicioIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center' },
  servicioLabel: { fontSize: 13, fontWeight: '700', color: '#1e293b', flex: 1 },

  nosotrosText: { color: '#bfdbfe', fontSize: 13, lineHeight: 22, marginBottom: 20 },
  valorCard: { flexDirection: 'row', gap: 14, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: 16, marginBottom: 10 },
  valorIcono: { fontSize: 24 },
  valorTitulo: { color: '#ffffff', fontWeight: '800', fontSize: 14, marginBottom: 3 },
  valorDesc: { color: '#93c5fd', fontSize: 12, lineHeight: 18 },

  contactRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 16 },
  contactIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center' },
  contactText: { color: '#374151', fontSize: 13, lineHeight: 20, flex: 1, paddingTop: 8 },

  footer: { backgroundColor: '#0f2545', paddingHorizontal: 24, paddingVertical: 24, alignItems: 'center', gap: 8 },
  footerText: { color: '#93c5fd', fontSize: 12 },
  footerLink: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
});
