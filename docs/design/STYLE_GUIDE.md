# Guía de Estilos - Plataforma de Gestión de Tickets Estudiantiles

## Identidad Visual

### Nombre de Marca
**StudentTicket** — Plataforma digital para la gestión de tickets estudiantiles.

### Filosofía de Diseño
- **Claro**: Interfaces limpias sin distracciones.
- **Rápido**: Acceso inmediato a la información y acciones principales.
- **Confiable**: Estética profesional que transmite seguridad y estabilidad.
- **Accesible**: Cumplimiento con WCAG 2.1 AA.

---

## Paleta de Colores

### Colores Primarios
| Nombre | Hex | Uso |
|--------|-----|-----|
| Primary | `#2563EB` | Botones principales, enlaces activos, indicadores de estado |
| Primary Dark | `#1D4ED8` | Hover de botones primarios |
| Primary Light | `#DBEAFE` | Fondos de badges, estados de foco |

### Colores Secundarios
| Nombre | Hex | Uso |
|--------|-----|-----|
| Secondary | `#0F172A` | Texto principal, encabezados, navegación |
| Secondary Light | `#334155` | Subtítulos, texto secundario |

### Colores de Estado (Tickets)
| Estado | Color | Hex | Uso |
|--------|-------|-----|-----|
| Abierto | Azul info | `#3B82F6` | Tickets nuevos o abiertos |
| En Progreso | Ámbar | `#F59E0B` | Tickets en atención |
| Resuelto | Verde éxito | `#10B981` | Tickets resueltos |
| Cerrado | Gris | `#6B7280` | Tickets cerrados |
| Urgente | Rojo alerta | `#EF4444` | Tickets de alta prioridad |

### Colores de Feedback
| Tipo | Color | Hex |
|------|-------|-----|
| Éxito | Verde | `#10B981` |
| Error | Rojo | `#EF4444` |
| Advertencia | Ámbar | `#F59E0B` |
| Información | Azul | `#3B82F6` |

### Neutros
| Nombre | Hex | Uso |
|--------|-----|-----|
| Background | `#F8FAFC` | Fondo de página |
| Surface | `#FFFFFF` | Tarjetas, paneles, modales |
| Border | `#E2E8F0` | Bordes de inputs, divisores |
| Muted | `#94A3B8` | Texto deshabilitado, placeholders |

---

## Tipografía

### Familia Tipográfica
- **Primaria**: `Inter` (Google Fonts) — interfaz y texto general
- **Monoespaciada**: `JetBrains Mono` — códigos de ticket, timestamps, datos técnicos

### Escala Tipográfica
| Estilo | Tamaño | Peso | Altura de línea | Uso |
|--------|--------|------|-----------------|-----|
| H1 | 32px (2rem) | 700 | 1.2 | Títulos de página |
| H2 | 24px (1.5rem) | 600 | 1.3 | Secciones principales |
| H3 | 20px (1.25rem) | 600 | 1.4 | Subsecciones |
| H4 | 18px (1.125rem) | 500 | 1.4 | Cards headers |
| Body | 16px (1rem) | 400 | 1.6 | Texto general |
| Small | 14px (0.875rem) | 400 | 1.5 | Descripciones, metadata |
| XS | 12px (0.75rem) | 500 | 1.4 | Etiquetas, badges |

---

## Componentes Base

### Botones

#### Botón Primario
```
Background: #2563EB
Text: #FFFFFF
Padding: 12px 24px
Border-radius: 8px
Font: 16px / 500
Hover: #1D4ED8
Active: scale(0.98)
Disabled: opacity 0.5
```

#### Botón Secundario
```
Background: transparent
Border: 1px solid #E2E8F0
Text: #0F172A
Padding: 12px 24px
Border-radius: 8px
Hover: background #F1F5F9
```

#### Botón de Peligro
```
Background: #EF4444
Text: #FFFFFF
Hover: #DC2626
```

#### Botón Fantasma (Ghost)
```
Background: transparent
Text: #2563EB
Hover: background #DBEAFE
```

### Inputs
```
Background: #FFFFFF
Border: 1px solid #E2E8F0
Border-radius: 8px
Padding: 10px 14px
Font: 16px / 400
Focus: border #2563EB, shadow 0 0 0 3px rgba(37,99,235,0.1)
Error: border #EF4444
Placeholder: #94A3B8
```

### Tarjetas (Cards)
```
Background: #FFFFFF
Border-radius: 12px
Border: 1px solid #E2E8F0
Shadow: 0 1px 3px rgba(0,0,0,0.05)
Hover shadow: 0 4px 12px rgba(0,0,0,0.08)
Padding: 20px
```

### Badges de Estado
```
Padding: 4px 10px
Border-radius: 9999px
Font: 12px / 500
```

| Estado | Estilo |
|--------|--------|
| Abierto | bg-blue-100 text-blue-700 |
| En Progreso | bg-amber-100 text-amber-700 |
| Resuelto | bg-green-100 text-green-700 |
| Cerrado | bg-gray-100 text-gray-600 |
| Urgente | bg-red-100 text-red-700 |

### Tablas
```
Header: bg-gray-50, text-gray-600, font-medium, text-sm
Row: bg-white, border-bottom 1px solid #E2E8F0
Row hover: bg-gray-50
Cell padding: 14px 16px
```

### Modales
```
Overlay: bg-black/50 backdrop-blur-sm
Container: bg-white, rounded-xl, shadow-2xl
Max-width: 480px (default), 640px (large)
Padding: 24px
```

---

## Layout y Grid

### Sistema de Grid
- 12 columnas
- Gutter: 24px
- Container max-width: 1280px
- Breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

### Espaciado
Escala basada en 4px:
| Token | Valor |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |
| 3xl | 64px |

---

## Iconografía
- **Librería**: Lucide React (lucide-react)
- **Tamaño default**: 20px
- **Tamaño small**: 16px
- **Tamaño large**: 24px
- **Stroke width**: 1.5px
- **Color**: hereda del texto padre

### Iconos por Contexto
| Contexto | Icono |
|----------|-------|
| Dashboard | LayoutDashboard |
| Tickets | Ticket |
| Nuevo ticket | PlusCircle |
| Usuarios | Users |
| Configuración | Settings |
| Cerrar sesión | LogOut |
| Buscar | Search |
| Filtro | Filter |
| Notificación | Bell |
| Éxito | CheckCircle |
| Error | XCircle |
| Advertencia | AlertTriangle |

---

## Animaciones y Transiciones

### Duraciones
| Token | Valor |
|-------|-------|
| fast | 150ms |
| default | 200ms |
| slow | 300ms |

### Curvas de easing
| Token | Valor |
|-------|-------|
| default | cubic-bezier(0.4, 0, 0.2, 1) |
| in | cubic-bezier(0.4, 0, 1, 1) |
| out | cubic-bezier(0, 0, 0.2, 1) |
| bounce | cubic-bezier(0.68, -0.55, 0.265, 1.55) |

### Patrones de animación
- **Hover de botones**: background-color 200ms
- **Aparición de cards**: opacity 0→1, translateY 8px→0, 300ms
- **Modales**: overlay fade-in 200ms, content scale 0.95→1 200ms
- **Toasts**: slide-in from right 300ms, auto-dismiss fade-out 200ms

---

## Responsive Design

### Mobile First
El diseño se construye primero para mobile y se escala hacia arriba.

### Patrones Adaptativos
| Elemento | Mobile | Desktop |
|----------|--------|---------|
| Navegación | Bottom nav / hamburger | Sidebar fija |
| Tablas | Cards apiladas | Tabla tradicional |
| Filtros | Sheet bottom | Barra lateral |
| Modales | Full screen | Centrado |
| Sidebar | Collapsible | Expandido |

### Breakpoints en Tailwind
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## Accesibilidad (WCAG 2.1 AA)

### Contraste
- Texto normal: ratio mínimo 4.5:1
- Texto grande (18px+ o 14px bold): ratio mínimo 3:1
- Componentes UI: ratio mínimo 3:1

### Enfoque (Focus)
- Todo elemento interactivo debe tener un indicador de foco visible
- Outline: 2px solid #2563EB, offset 2px
- No remover outline sin reemplazo visual

### Reducción de Movimiento
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Assets

### Logo
- Variante horizontal para header
- Variante ícono para favicon y mobile
- Formato: SVG principal, PNG fallback

### Ilustraciones
- Estilo: Flat design, colores de marca
- Uso: páginas de error, empty states, onboarding

---

*Documento versión 1.0 — Frontend Engineering Team*
