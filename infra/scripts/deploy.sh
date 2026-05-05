#!/usr/bin/env bash
# ===========================================
# Script de despliegue - Gestión de Tickets
# Uso: ./deploy.sh [dev|staging|prod]
# ===========================================

set -euo pipefail

ENV=${1:-dev}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

cd "$PROJECT_DIR"

case "$ENV" in
  dev)
    log_info "Levantando entorno de desarrollo..."
    docker compose -f docker-compose.yml -f docker-compose.override.yml up -d --build
    log_info "Servicios disponibles:"
    echo "  - Frontend: http://localhost:8080"
    echo "  - Backend API: http://localhost:3000"
    echo "  - PostgreSQL: localhost:5432"
    echo "  - Redis: localhost:6379"
    ;;

  staging)
    log_info "Desplegando en STAGING..."
    docker compose -f docker-compose.yml -f docker-compose.staging.yml pull
    docker compose -f docker-compose.yml -f docker-compose.staging.yml up -d --remove-orphans
    docker system prune -f
    log_info "Staging desplegado correctamente."
    ;;

  prod|production)
    log_warn "Desplegando en PRODUCCIÓN..."
    read -p "¿Estás seguro? (yes/no): " confirm
    if [[ "$confirm" != "yes" ]]; then
      log_error "Despliegue cancelado."
      exit 1
    fi
    docker compose -f docker-compose.yml -f docker-compose.prod.yml pull
    docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --remove-orphans
    docker system prune -f
    log_info "Producción desplegada correctamente."
    ;;

  *)
    log_error "Entorno no válido: $ENV"
    echo "Uso: $0 [dev|staging|prod]"
    exit 1
    ;;
esac

log_info "Estado de los contenedores:"
docker compose ps
