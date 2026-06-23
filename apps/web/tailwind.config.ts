// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#1a3c6e',
          600: '#1a3c6e',
          700: '#152f57',
          900: '#0f1e38',
        },
        accent: {
          500: '#c8932a',
          600: '#b07d22',
        },
      },
    },
  },
  plugins: [],
};

export default config;
