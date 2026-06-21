#!/bin/bash
# Diseñado por: Edward Labrador
# Para Unión de Comerciantes del Estado Zulia
# Versión: 1.0.0
# Todos los Derechos Reservados UCEZ 2026
#
# Script de restauración de la base de datos.
# Uso: ./scripts/restore-db.sh ./backups/db/ucez_db_20260101_020000.sql.gz

set -e

BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
  echo "Uso: $0 <archivo-backup.sql.gz>"
  echo "Ejemplo: $0 ./backups/db/ucez_db_20260101_020000.sql.gz"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ ERROR: Archivo no encontrado: $BACKUP_FILE"
  exit 1
fi

export $(grep -v '^#' .env.production | xargs)

echo "⚠️  ADVERTENCIA: Esto sobreescribirá la base de datos '$DB_NAME'."
read -p "¿Continuar? (escribe 'SI' para confirmar): " CONFIRM

if [ "$CONFIRM" != "SI" ]; then
  echo "Restauración cancelada."
  exit 0
fi

echo "[$(date)] Restaurando desde: $BACKUP_FILE"

gunzip -c "$BACKUP_FILE" | docker exec -i ucez_db_prod psql \
  -U "$DB_USER" \
  -d "$DB_NAME"

echo "[$(date)] Restauración completada."
