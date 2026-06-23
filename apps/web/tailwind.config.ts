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
          50: '#eef1fb',
          100: '#d5dcf5',
          500: '#4169E1',
          600: '#3457c8',
          700: '#2845ae',
          900: '#1a2d80',
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
