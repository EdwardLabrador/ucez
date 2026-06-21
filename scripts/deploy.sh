#!/bin/bash
# Diseñado por: Edward Labrador
# Para Unión de Comerciantes del Estado Zulia
# Versión: 1.0.0
# Todos los Derechos Reservados UCEZ 2026
#
# Script de despliegue a producción.
# Uso: ./scripts/deploy.sh

set -e

echo "══════════════════════════════════════════"
echo "  UCEZ — Despliegue a Producción"
echo "══════════════════════════════════════════"

# Verificar que existe el archivo de entorno
if [ ! -f .env.production ]; then
  echo "❌ ERROR: No se encontró .env.production"
  echo "   Copia .env.production.example y completa los valores."
  exit 1
fi

# Cargar variables de entorno
export $(grep -v '^#' .env.production | xargs)

echo ""
echo "▸ Paso 1/5 — Pulling cambios de git..."
git pull origin main

echo ""
echo "▸ Paso 2/5 — Construyendo imágenes Docker..."
docker compose -f docker-compose.prod.yml --env-file .env.production build --no-cache

echo ""
echo "▸ Paso 3/5 — Deteniendo contenedores anteriores..."
docker compose -f docker-compose.prod.yml down --remove-orphans

echo ""
echo "▸ Paso 4/5 — Iniciando servicios..."
docker compose -f docker-compose.prod.yml --env-file .env.production up -d

echo ""
echo "▸ Paso 5/5 — Verificando estado de los servicios..."
sleep 10
docker compose -f docker-compose.prod.yml ps

echo ""
echo "✅ Despliegue completado."
echo "   Web:     https://ucez.com"
echo "   API:     https://ucez.com/api/v1"
echo "   Swagger: https://ucez.com/api/docs"
echo ""
