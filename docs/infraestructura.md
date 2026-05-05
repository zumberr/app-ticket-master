# Infraestructura - Gestión de Tickets Estudiantiles

## Arquitectura de Despliegue

```
┌─────────────────────────────────────────────────────────────┐
│                        Nginx (Reverse Proxy)                 │
│                     SSL Termination + Rate Limit             │
└─────────────┬───────────────────────────────┬───────────────┘
              │                               │
     ┌────────▼────────┐           ┌─────────▼────────┐
     │  Frontend Web   │           │  Backend API     │
     │  (Flutter Web)  │◄─────────►│  (Node.js)       │
     │  Nginx:80       │           │  Express:3000    │
     └─────────────────┘           └────────┬─────────┘
                                            │
                              ┌─────────────┼─────────────┐
                              │             │             │
                       ┌──────▼─────┐ ┌─────▼────┐ ┌─────▼────┐
                       │ PostgreSQL │ │  Redis   │ │Prometheus│
                       │    5432    │ │   6379   │ │  9090    │
                       └────────────┘ └──────────┘ └────┬─────┘
                                                         │
                                                  ┌──────▼──────┐
                                                  │   Grafana   │
                                                  │   3001      │
                                                  └─────────────┘
```

## Entornos

| Entorno | Branch | URL | Descripción |
|---------|--------|-----|-------------|
| Desarrollo | `feature/*` | `localhost` | Desarrollo local con Docker Compose |
| Staging | `develop` | `staging.tickets.sanadatech.com` | Pre-producción para QA |
| Producción | `main` | `tickets.sanadatech.com` | Entorno productivo |

## Servicios Docker

### Desarrollo (`docker compose up`)
- **db**: PostgreSQL 16
- **redis**: Redis 7 (cache/sesiones)
- **backend**: API Node.js (puerto 3000)
- **frontend**: Flutter Web vía Nginx (puerto 8080)

### Staging / Producción
- Añade **nginx** como reverse proxy
- Escaneo de vulnerabilidades con Trivy
- Despliegue automático vía GitHub Actions + SSH

### Monitoreo (`--profile monitoring`)
- **prometheus**: Métricas (puerto 9090)
- **grafana**: Dashboards (puerto 3001)

## Scripts Útiles

```bash
# Desarrollo local
./infra/scripts/deploy.sh dev

# Backup de base de datos
./infra/scripts/backup.sh 7

# Staging
./infra/scripts/deploy.sh staging

# Producción (requiere confirmación)
./infra/scripts/deploy.sh prod
```

## CI/CD Pipeline

1. **CI** (`ci.yml`): Lint → Test → Build Web → Docker Build → Security Scan
2. **CD Staging** (`cd-staging.yml`): Build & Push → Deploy SSH → Health Check
3. **CD Production** (`cd-production.yml`): Build & Push → Deploy SSH → Health Check → Slack Notify

## Kubernetes (Producción Escalable)

Los manifiestos en `infra/k8s/` incluyen:
- Namespace y ConfigMaps
- Deployments con securityContext (non-root)
- Services (ClusterIP)
- Ingress con TLS (Let's Encrypt)
- HPA (auto-scaling 2-10 réplicas)
