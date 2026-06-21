// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView, Platform,
  TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useLogin } from '@/hooks/useAuth';

export default function LoginScreen() {
  const login = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Correo inválido';
    if (!password) e.password = 'La contraseña es requerida';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;
    login.mutate({ email: email.trim(), password }, {
      onError: () => Alert.alert('Error', 'Correo o contraseña incorrectos'),
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>U</Text>
          </View>
          <Text style={styles.appName}>UCEZ</Text>
          <Text style={styles.appSub}>Unión de Comerciantes del Estado Zulia</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.subtitle}>Ingrese sus credenciales para continuar</Text>

          <Input
            label="Correo Electrónico"
            placeholder="correo@empresa.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            error={errors.email}
          />

          <View style={styles.passWrapper}>
            <Input
              label="Contraseña"
              placeholder="••••••••"
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              containerStyle={{ flex: 1, marginBottom: 0 }}
            />
            <TouchableOpacity
              onPress={() => setShowPass(!showPass)}
              style={styles.eyeBtn}
            >
              <Text style={styles.eyeText}>{showPass ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <Button
            onPress={handleLogin}
            loading={login.isPending}
            fullWidth
            size="lg"
            style={styles.loginBtn}
          >
            Ingresar
          </Button>
        </View>

        <Text style={styles.footer}>
          © 2026 UCEZ — Todos los Derechos Reservados
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#1a3c6e' },
  scroll: {
    flexGrow: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 24, paddingVertical: 48,
  },
  header: { alignItems: 'center', marginBottom: 32 },
  logo: {
    width: 72, height: 72, borderRadius: 20, backgroundColor: '#c8932a',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  logoText: { color: '#fff', fontSize: 32, fontWeight: '800' },
  appName: { color: '#ffffff', fontSize: 28, fontWeight: '800', letterSpacing: 1 },
  appSub: {
    color: '#93c5fd', fontSize: 12, marginTop: 4, textAlign: 'center',
    maxWidth: 220,
  },
  card: {
    backgroundColor: '#ffffff', borderRadius: 20, padding: 28,
    width: '100%', maxWidth: 400,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 16, elevation: 8,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#6b7280', marginBottom: 24 },
  passWrapper: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  eyeBtn: {
    paddingHorizontal: 10, paddingVertical: 11,
    borderWidth: 1.5, borderColor: '#d1d5db', borderRadius: 10,
    backgroundColor: '#f9fafb',
  },
  eyeText: { fontSize: 16 },
  loginBtn: { marginTop: 8 },
  footer: { color: '#93c5fd', fontSize: 11, marginTop: 32, textAlign: 'center' },
});
