# Diseño UX/UI - StudentTicket

## 📁 Estructura de Archivos

```
docs/design/
├── README.md              # Este archivo
├── STYLE_GUIDE.md         # Guía de estilos completa
└── NAVIGATION_FLOW.md     # Flujo de navegación y mapa de rutas

wireframes/
├── login.html             # Pantalla de inicio de sesión
├── register.html          # Pantalla de registro
├── forgot-password.html   # Recuperación de contraseña
├── dashboard.html         # Dashboard del estudiante
├── tickets.html           # Lista de tickets
├── new-ticket.html        # Crear nuevo ticket
├── ticket-detail.html     # Detalle de ticket con conversación
└── admin-panel.html       # Panel de administración

frontend/design-system/
└── index.html             # Componentes reutilizables y guía visual
```

## 🎨 Resumen del Diseño

### Identidad Visual
- **Nombre**: StudentTicket
- **Filosofía**: Claro, rápido, confiable, accesible
- **Framework CSS recomendado**: Tailwind CSS
- **Tipografía**: Inter (Google Fonts)
- **Iconografía**: Lucide React

### Paleta de Colores Principal
| Color | Hex | Uso |
|-------|-----|-----|
| Primary | `#2563EB` | Botones, enlaces, estados activos |
| Success | `#10B981` | Tickets resueltos, confirmaciones |
| Warning | `#F59E0B` | Tickets en progreso |
| Danger | `#EF4444` | Errores, prioridad alta |
| Background | `#F8FAFC` | Fondo de página |
| Surface | `#FFFFFF` | Tarjetas, paneles |

### Breakpoints Responsive
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 📱 Wireframes Interactivos

Los wireframes son prototipos HTML funcionales que pueden abrirse directamente en un navegador. Usan Tailwind CSS vía CDN para los estilos.

### Para visualizar:
1. Abre cualquier archivo `.html` de la carpeta `wireframes/` en un navegador
2. Redimensiona la ventana para ver el comportamiento responsive
3. Navega entre pantallas usando los enlaces internos

### Pantallas incluidas:

| Pantalla | Descripción |
|----------|-------------|
| **Login** | Formulario de inicio de sesión con email y contraseña |
| **Register** | Registro de nuevos estudiantes con validación |
| **Forgot Password** | Recuperación de contraseña por email |
| **Dashboard** | Resumen con estadísticas, tickets recientes y navegación |
| **Tickets** | Lista con filtros, búsqueda, tabla/cards responsive |
| **New Ticket** | Formulario de creación con adjuntos |
| **Ticket Detail** | Vista de conversación, historial, acciones y detalles |
| **Admin Panel** | Gestión de usuarios, estadísticas globales |

## 🧩 Design System

El archivo `frontend/design-system/index.html` contiene todos los componentes base documentados:
- Paleta de colores completa
- Escala tipográfica
- Variantes de botones
- Estados de inputs
- Badges y estados
- Tarjetas
- Alertas
- Tablas
- Modales
- Paginación
- Empty states
- Skeleton loading

## 🗺️ Navegación

Ver `NAVIGATION_FLOW.md` para el mapa completo de rutas, flujos de usuario y guards de autenticación.

## ♿ Accesibilidad

- Cumplimiento WCAG 2.1 AA
- Contraste mínimo 4.5:1 para texto
- Indicadores de foco visibles
- Soporte para `prefers-reduced-motion`
- Etiquetas ARIA en formularios

---

*Documento versión 1.0 — Frontend Engineering Team*
