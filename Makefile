# ===========================================
# Makefile - Gestión de Tickets Estudiantiles
# ===========================================

.PHONY: help dev down staging prod logs test lint clean

help: ## Muestra esta ayuda
	@echo "Comandos disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

dev: ## Levanta entorno de desarrollo
	@echo "🚀 Iniciando entorno de desarrollo..."
	docker compose -f docker-compose.yml -f docker-compose.override.yml up -d --build
	@echo "✅ Servicios disponibles:"
	@echo "   Frontend: http://localhost:8080"
	@echo "   Backend:  http://localhost:3000"
	@echo "   DB:       localhost:5432"
	@echo "   Redis:    localhost:6379"

down: ## Detiene todos los servicios
	@echo "🛑 Deteniendo servicios..."
	docker compose down --remove-orphans

staging: ## Despliegue en staging
	@echo "🚀 Desplegando en STAGING..."
	./infra/scripts/deploy.sh staging

prod: ## Despliegue en producción
	@echo "🚀 Desplegando en PRODUCCIÓN..."
	./infra/scripts/deploy.sh prod

logs: ## Muestra logs de todos los servicios
	docker compose logs -f

logs-backend: ## Logs del backend
	docker compose logs -f backend

logs-frontend: ## Logs del frontend
	docker compose logs -f frontend

test: ## Ejecuta tests del frontend Flutter
	flutter test

lint: ## Ejecuta lint del código Flutter
	flutter analyze

format: ## Formatea el código Dart
	dart format .

clean: ## Limpia contenedores, volúmenes e imágenes no usadas
	@echo "🧹 Limpiando..."
	docker compose down -v --remove-orphans
	docker system prune -f

backup: ## Backup de la base de datos
	./infra/scripts/backup.sh

monitoring: ## Levanta stack de monitoreo
	@echo "📊 Iniciando monitoreo..."
	docker compose --profile monitoring up -d
	@echo "   Prometheus: http://localhost:9090"
	@echo "   Grafana:    http://localhost:3001"
