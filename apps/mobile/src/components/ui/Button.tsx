// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import React from 'react';
import {
  TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle,
} from 'react-native';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

type ButtonProps = {
  onPress?: () => void;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
};

const BG: Record<Variant, string> = {
  primary:   '#1a3c6e',
  secondary: '#c8932a',
  danger:    '#dc2626',
  ghost:     'transparent',
  outline:   'transparent',
};

const COLOR: Record<Variant, string> = {
  primary:   '#ffffff',
  secondary: '#ffffff',
  danger:    '#ffffff',
  ghost:     '#374151',
  outline:   '#1a3c6e',
};

const PADDING: Record<Size, { v: number; h: number; text: number }> = {
  sm: { v: 6,  h: 12, text: 12 },
  md: { v: 10, h: 18, text: 14 },
  lg: { v: 14, h: 24, text: 16 },
};

export function Button({
  onPress, children, variant = 'primary', size = 'md',
  loading, disabled, style, textStyle, fullWidth,
}: ButtonProps) {
  const pad = PADDING[size];
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.78}
      style={[
        styles.base,
        {
          backgroundColor: BG[variant],
          paddingVertical: pad.v,
          paddingHorizontal: pad.h,
          borderWidth: isOutline ? 1.5 : 0,
          borderColor: isOutline ? '#1a3c6e' : 'transparent',
          opacity: disabled || loading ? 0.55 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
    >
      {loading
        ? <ActivityIndicator color={COLOR[variant]} size="small" />
        : <Text style={[styles.label, { color: COLOR[variant], fontSize: pad.text }, textStyle]}>
            {children}
          </Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  label: { fontWeight: '600' },
});
