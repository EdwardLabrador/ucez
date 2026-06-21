// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import React, { forwardRef } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
};

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, containerStyle, ...props }, ref) => (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        ref={ref}
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor="#9ca3af"
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  ),
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  inputError: { borderColor: '#ef4444', backgroundColor: '#fef2f2' },
  error: { color: '#ef4444', fontSize: 12, marginTop: 4 },
});
