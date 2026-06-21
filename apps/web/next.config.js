// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  transpilePackages: ['@ucez/shared'],
  images: {
    domains: ['localhost', 'ucez.com'],
  },
};

module.exports = nextConfig;
