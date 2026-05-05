#!/usr/bin/env bash
# ===========================================
# Script de backup - Base de datos PostgreSQL
# Uso: ./backup.sh [retention_days]
# ===========================================

set -euo pipefail

RETENTION_DAYS=${1:-7}
BACKUP_DIR="/opt/backups/ticket-platform"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

mkdir -p "$BACKUP_DIR"

echo "[INFO] Creando backup de la base de datos..."
docker exec ticket-db pg_dump -U ticketuser -d ticketdb > "$BACKUP_FILE"

gzip "$BACKUP_FILE"
echo "[INFO] Backup guardado: ${BACKUP_FILE}.gz"

# Limpiar backups antiguos
echo "[INFO] Limpiando backups antiguos (>$RETENTION_DAYS días)..."
find "$BACKUP_DIR" -name "db_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "[INFO] Backup completado exitosamente."
