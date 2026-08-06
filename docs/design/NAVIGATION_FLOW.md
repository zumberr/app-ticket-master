# Flujo de Navegación - Plataforma de Gestión de Tickets Estudiantiles

## Mapa de Navegación General

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              PÚBLICO                                     │
├─────────────────────────────────────────────────────────────────────────┤
│  /login  ──────►  /register                                              │
│     │                                                                      │
│     ▼                                                                      │
│  /forgot-password  ──────►  /reset-password                              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           AUTENTICADO                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌───────────┐  │
│  │  Dashboard  │◄──►│   Tickets   │◄──►│  Crear      │◄──►│  Ticket   │  │
│  │    /        │    │   /tickets  │    │  Ticket     │    │  /t/:id   │  │
│  └─────────────┘    └─────────────┘    │  /tickets/  │    └───────────┘  │
│         │                    │          │  new        │          │        │
│         │                    │          └─────────────┘          │        │
│         ▼                    ▼                                    ▼        │
│  ┌─────────────┐    ┌─────────────┐                      ┌───────────┐   │
│  │  Perfil     │    │  Notificaci-│                      │  Editar   │   │
│  │  /profile   │    │  ones /notif│                      │  Ticket   │   │
│  └─────────────┘    └─────────────┘                      │  /t/:id/  │   │
│                                                          │  edit     │   │
│                                                          └───────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          ADMINISTRADOR                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌───────────┐  │
│  │  Usuarios   │◄──►│  Categorías │◄──►│  Reportes   │◄──►│ Configura-│  │
│  │  /admin/    │    │  /admin/    │    │  /admin/    │    │ ción      │  │
│  │  users      │    │  categories │    │  reports    │    │ /admin/   │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    │ settings  │  │
│                                                           └───────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Detalle de Rutas

### Rutas Públicas (Sin autenticación)

| Ruta | Nombre | Descripción |
|------|--------|-------------|
| `/login` | Iniciar Sesión | Formulario de login con email y contraseña. Incluye enlace a registro y recuperación de contraseña. |
| `/register` | Registro | Formulario de registro para nuevos estudiantes. Datos: nombre, email, ID estudiantil, contraseña. |
| `/forgot-password` | Recuperar Contraseña | Formulario para solicitar enlace de recuperación por email. |
| `/reset-password` | Restablecer Contraseña | Formulario para crear nueva contraseña (token en URL). |

### Rutas de Estudiante (Autenticado)

| Ruta | Nombre | Descripción |
|------|--------|-------------|
| `/` | Dashboard | Vista principal con resumen: tickets activos, estadísticas rápidas, actividad reciente. |
| `/tickets` | Lista de Tickets | Tabla/cards con todos los tickets del estudiante. Filtros por estado, categoría, fecha. Búsqueda. |
| `/tickets/new` | Crear Ticket | Formulario para crear nuevo ticket: título, descripción, categoría, prioridad, adjuntos. |
| `/tickets/:id` | Detalle de Ticket | Vista completa de un ticket: información, historial de mensajes, acciones (responder, cerrar). |
| `/tickets/:id/edit` | Editar Ticket | Solo disponible si el ticket está en estado "Abierto". |
| `/notifications` | Notificaciones | Centro de notificaciones: respuestas a tickets, actualizaciones de estado, anuncios. |
| `/profile` | Perfil | Datos del usuario, cambio de contraseña, preferencias de notificación. |

### Rutas de Administrador (Rol: admin)

| Ruta | Nombre | Descripción |
|------|--------|-------------|
| `/admin/users` | Gestión de Usuarios | Lista de usuarios, crear/editar/desactivar, asignar roles. |
| `/admin/categories` | Categorías | Gestión de categorías de tickets (Académico, Técnico, Administrativo, etc.). |
| `/admin/reports` | Reportes | Dashboard de métricas: tickets por estado, tiempo de resolución, satisfacción. |
| `/admin/settings` | Configuración | Configuración general de la plataforma. |

---

## Flujos de Usuario

### Flujo 1: Crear un Ticket (Estudiante)
```
Dashboard ──► "Nuevo Ticket" ──► Formulario ──► Confirmación ──► Detalle del Ticket
   │                                                              │
   └─────────────────── ◄── ◄── ◄── ◄── ◄── ◄── ◄── ◄────────────┘
```

1. Estudiante hace clic en "Nuevo Ticket" desde el dashboard o sidebar
2. Completa el formulario: título, categoría, descripción, prioridad
3. Opcional: adjunta archivos (máx. 5MB cada uno, formatos: pdf, jpg, png)
4. Envía el ticket
5. Sistema muestra confirmación y redirige al detalle del ticket
6. Ticket aparece en su lista con estado "Abierto"

### Flujo 2: Responder a un Ticket (Estudiante)
```
Lista de Tickets ──► Seleccionar Ticket ──► Detalle ──► Escribir Respuesta ──► Enviar
```

1. Estudiante navega a su lista de tickets
2. Selecciona un ticket (estado: Abierto o En Progreso)
3. En el panel de detalle, ve el historial completo
4. Escribe una respuesta en el campo de texto inferior
5. Envía la respuesta, que se añade al historial

### Flujo 3: Administrar Tickets (Admin)
```
Dashboard ──► Lista de Tickets (todos) ──► Seleccionar Ticket ──► Acciones
                                              │
                                              ├──► Asignar a agente
                                              ├──► Cambiar estado
                                              ├──► Cambiar categoría
                                              └──► Responder
```

---

## Estados de Autenticación

```
┌─────────────────┐
│   No auth       │
│   (público)     │
└────────┬────────┘
         │ Login exitoso
         ▼
┌─────────────────┐
│   Auth: User    │
│   (estudiante)  │
└────────┬────────┘
         │ Tiene rol admin
         ▼
┌─────────────────┐
│   Auth: Admin   │
│   (admin)       │
└─────────────────┘
```

### Guards de Navegación
- **PublicGuard**: Si está autenticado, redirigir a `/`
- **AuthGuard**: Si no está autenticado, redirigir a `/login`
- **AdminGuard**: Si no es admin, redirigir a `/` (404 o 403)

---

## Layouts

### Layout Público
```
┌─────────────────────────────┐
│         Header (logo)        │
├─────────────────────────────┤
│                             │
│         Content             │
│      (formularios)          │
│                             │
├─────────────────────────────┤
│         Footer               │
└─────────────────────────────┘
```

### Layout Autenticado (Desktop)
```
┌────────┬────────────────────────────────────┐
│        │                                    │
│Sidebar │           Main Content             │
│ (nav)  │                                    │
│        │                                    │
│        │                                    │
├────────┴────────────────────────────────────┤
│              Footer (opcional)               │
└─────────────────────────────────────────────┘
```
- Sidebar: 260px fijo, con navegación principal
- Main: contenido scrollable
- Header móvil: barra superior con menú hamburger

### Layout Autenticado (Mobile)
```
┌─────────────────────────────┐
│  Header (logo + hamburger)  │
├─────────────────────────────┤
│                             │
│         Content             │
│                             │
├─────────────────────────────┤
│   Bottom Navigation         │
│   (icons: home, tickets,    │
│    notif, profile)          │
└─────────────────────────────┘
```

---

## Sidebar Navegación

### Items (Estudiante)
1. Dashboard (icon: LayoutDashboard)
2. Mis Tickets (icon: Ticket)
3. Nuevo Ticket (icon: PlusCircle) — destacado
4. Notificaciones (icon: Bell) — con badge de contador
5. Mi Perfil (icon: User)

### Items (Admin)
1. Dashboard (icon: LayoutDashboard)
2. Todos los Tickets (icon: Ticket)
3. Usuarios (icon: Users)
4. Categorías (icon: Tag)
5. Reportes (icon: BarChart3)
6. Configuración (icon: Settings)

---

## Estados de Error

| Código | Ruta | Descripción |
|--------|------|-------------|
| 404 | `*` | Página no encontrada. Enlace a dashboard. |
| 403 | `/admin/*` | Sin permisos. Mensaje amigable, enlace a home. |
| 500 | — | Error del servidor. Mensaje de disculpa, opción de reintentar. |

---

*Documento versión 1.0 — Frontend Engineering Team*
