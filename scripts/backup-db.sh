#!/bin/bash
# Diseñado por: Edward Labrador
# Para Unión de Comerciantes del Estado Zulia
# Versión: 1.0.0
# Todos los Derechos Reservados UCEZ 2026
#
# Script de backup de la base de datos PostgreSQL.
# Uso: ./scripts/backup-db.sh
# Recomendado: ejecutar via cron diariamente.
#   0 2 * * * /ruta/ucez/scripts/backup-db.sh >> /var/log/ucez-backup.log 2>&1

set -e

BACKUP_DIR="./backups/db"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/ucez_db_${TIMESTAMP}.sql.gz"
KEEP_DAYS=30

mkdir -p "$BACKUP_DIR"

if [ ! -f .env.production ]; then
  echo "❌ ERROR: No se encontró .env.production"
  exit 1
fi

export $(grep -v '^#' .env.production | xargs)

echo "[$(date)] Iniciando backup de ucez_db..."

docker exec ucez_db_prod pg_dump \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --no-owner \
  --no-acl \
  | gzip > "$BACKUP_FILE"

SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
echo "[$(date)] Backup creado: $BACKUP_FILE ($SIZE)"

# Eliminar backups más antiguos de $KEEP_DAYS días
find "$BACKUP_DIR" -name "ucez_db_*.sql.gz" -mtime +$KEEP_DAYS -delete
echo "[$(date)] Backups antiguos eliminados (>$KEEP_DAYS días)"

echo "[$(date)] Backup completado."
