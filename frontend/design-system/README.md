# Design System - StudentTicket Frontend

## Estructura del Proyecto Frontend

Este design system está preparado para ser implementado en **React + Next.js** (recomendado) o adaptado a Flutter si se mantiene el stack actual.

## Stack Tecnológico Recomendado

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4
- **Componentes UI**: shadcn/ui (basado en Radix UI)
- **Iconos**: Lucide React
- **Tipografía**: Inter (Google Fonts)
- **Manejo de Estado**: Zustand + React Query (TanStack Query)
- **Formularios**: React Hook Form + Zod
- **Autenticación**: NextAuth.js o JWT manual

## Estructura de Carpetas

```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Grupo de rutas de autenticación
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/       # Grupo de rutas protegidas
│   │   ├── page.tsx       # Dashboard
│   │   ├── tickets/page.tsx
│   │   ├── tickets/new/page.tsx
│   │   ├── tickets/[id]/page.tsx
│   │   ├── notifications/page.tsx
│   │   ├── profile/page.tsx
│   │   └── layout.tsx
│   ├── admin/             # Rutas de administración
│   │   ├── page.tsx
│   │   ├── users/page.tsx
│   │   ├── categories/page.tsx
│   │   ├── reports/page.tsx
│   │   └── layout.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                # Componentes base (shadcn)
│   ├── layout/            # Layouts compartidos
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── mobile-nav.tsx
│   │   └── auth-layout.tsx
│   ├── tickets/           # Componentes de tickets
│   │   ├── ticket-card.tsx
│   │   ├── ticket-list.tsx
│   │   ├── ticket-form.tsx
│   │   ├── ticket-detail.tsx
│   │   ├── status-badge.tsx
│   │   └── priority-badge.tsx
│   ├── dashboard/         # Componentes del dashboard
│   │   ├── stats-card.tsx
│   │   ├── recent-tickets.tsx
│   │   └── activity-feed.tsx
│   └── shared/            # Componentes compartidos
│       ├── empty-state.tsx
│       ├── loading.tsx
│       ├── error-boundary.tsx
│       ├── pagination.tsx
│       └── search-bar.tsx
├── hooks/                  # Custom React hooks
│   ├── use-auth.ts
│   ├── use-tickets.ts
│   ├── use-notifications.ts
│   └── use-media-query.ts
├── lib/                    # Utilidades y configuración
│   ├── api.ts             # Cliente HTTP (axios/fetch)
│   ├── utils.ts           # Funciones utilitarias
│   ├── constants.ts       # Constantes de la app
│   └── validators.ts      # Esquemas Zod
├── stores/                 # Estado global (Zustand)
│   ├── auth-store.ts
│   ├── ticket-store.ts
│   └── ui-store.ts
├── types/                  # Tipos TypeScript
│   ├── user.ts
│   ├── ticket.ts
│   └── api.ts
└── public/
    └── images/
```

## Componentes Clave

### StatusBadge
```tsx
interface StatusBadgeProps {
  status: 'open' | 'in-progress' | 'resolved' | 'closed' | 'urgent';
}
```

### TicketCard
```tsx
interface TicketCardProps {
  ticket: Ticket;
  variant?: 'list' | 'grid' | 'mobile';
}
```

### Sidebar
- Colapsable en desktop
- Drawer/sheet en mobile
- Items condicionales según rol

### AuthLayout
- Centrado vertical y horizontal
- Fondo sutil con patrón opcional
- Card con sombra suave

## API Integration

### Endpoints esperados (coordenar con backend)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Registro |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/tickets` | Lista de tickets |
| POST | `/api/tickets` | Crear ticket |
| GET | `/api/tickets/:id` | Detalle de ticket |
| PUT | `/api/tickets/:id` | Actualizar ticket |
| POST | `/api/tickets/:id/comments` | Comentar |
| GET | `/api/notifications` | Notificaciones |
| GET | `/api/admin/users` | Usuarios (admin) |
| GET | `/api/admin/reports` | Reportes (admin) |

## Configuración Tailwind

```js
// tailwind.config.ts
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          light: '#DBEAFE',
        },
        status: {
          open: '#3B82F6',
          'in-progress': '#F59E0B',
          resolved: '#10B981',
          closed: '#6B7280',
          urgent: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
};
```

## Instalación Rápida

```bash
# Crear proyecto Next.js
npx create-next-app@latest frontend --typescript --tailwind --app

# Instalar dependencias
npm install @tanstack/react-query zustand react-hook-form zod axios lucide-react

# Instalar shadcn/ui
npx shadcn@latest init

# Agregar componentes de shadcn
npx shadcn@latest add button input card badge dialog dropdown-menu sheet table avatar skeleton
```

---

*Documento versión 1.0 — Frontend Engineering Team*
