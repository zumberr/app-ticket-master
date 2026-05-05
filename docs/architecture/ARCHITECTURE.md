# Arquitectura de la Plataforma de Gestión de Tiquetes Estudiantiles

## Visión General

Plataforma fullstack digital, segura y optimizada para la gestión de tiquetes de soporte estudiantil. Permite a estudiantes crear tickets de soporte, a agentes de soporte gestionarlos, y a administradores supervisar todo el sistema.

## Componentes Principales

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Frontend   │  │   Web App    │  │   Mobile     │           │
│  │  (React/Web) │  │  (Flutter)   │  │  (Flutter)   │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│         │                 │                 │                   │
│         └─────────────────┼─────────────────┘                   │
│                           │                                     │
│                    HTTPS / REST API                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      API GATEWAY                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Rate Limiting│  │   Helmet     │  │     CORS     │           │
│  │   (100/15m)  │  │  (Headers)   │  │  (Origins)   │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│         └─────────────────┼─────────────────┘                   │
│                           │                                     │
│                    Node.js / Express                             │
│                           │                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Routes     │  │ Controllers  │  │  Services    │           │
│  │ (API v1)     │  │ (Business)   │  │  (Logic)     │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│         └─────────────────┼─────────────────┘                   │
│                           │                                     │
│  ┌──────────────┐  ┌──────▼───────┐  ┌──────────────┐           │
│  │   Models     │  │ Middleware   │  │   Utils      │           │
│  │ (Mongoose)   │  │(Auth/Valid)  │  │ (Log/Valid)  │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                           │                                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                    MongoDB Connection
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      BASE DE DATOS                               │
│                         MongoDB                                  │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │    Users     │  │   Tickets    │  │  Categories  │           │
│  │              │  │              │  │              │           │
│  │  - email     │  │  - title     │  │  - name      │           │
│  │  - password  │  │  - status    │  │  - color     │           │
│  │  - role      │  │  - priority  │  │  - icon      │           │
│  │  - studentId │  │  - history   │  │  - order     │           │
│  │  - isActive  │  │  - comments  │  │              │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                  │
│  ┌──────────────┐                                               │
│  │   Comments   │                                               │
│  │              │                                               │
│  │  - ticket    │                                               │
│  │  - content   │                                               │
│  │  - internal  │                                               │
│  │  - editedAt  │                                               │
│  └──────────────┘                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Flujo de Datos

### 1. Creación de Ticket (Estudiante)
```
Estudiante → Frontend → POST /api/v1/tickets
                              ↓
                    [Validación + Auth JWT]
                              ↓
                    TicketService.create()
                              ↓
                    MongoDB (Ticket + History)
                              ↓
                    Response (ticketNumber, status: open)
```

### 2. Asignación de Ticket (Admin)
```
Admin → Frontend → POST /api/v1/tickets/:id/assign
                         ↓
               [Auth + Role: admin]
                         ↓
               TicketService.assign()
                         ↓
               MongoDB (assignedTo, status: in_progress, history)
                         ↓
               Response (ticket con asignado)
```

### 3. Comentario en Ticket (Soporte)
```
Support → Frontend → POST /api/v1/tickets/:id/comments
                           ↓
                 [Auth + Permisos]
                           ↓
                 CommentService.create()
                           ↓
                 MongoDB (Comment + Ticket history)
                           ↓
                 Response (comment)
```

## Modelo de Base de Datos

### User
| Campo | Tipo | Descripción |
|-------|------|-------------|
| email | String (unique) | Correo institucional |
| password | String (hashed) | Contraseña con bcrypt |
| firstName | String | Nombre |
| lastName | String | Apellido |
| studentId | String (unique) | ID de estudiante |
| role | Enum | student, admin, support |
| isActive | Boolean | Estado de la cuenta |
| lastLogin | Date | Último acceso |

### Ticket
| Campo | Tipo | Descripción |
|-------|------|-------------|
| ticketNumber | String (unique) | TK-YYYYMMDD-XXXX |
| title | String | Título del ticket |
| description | String | Descripción detallada |
| status | Enum | open, in_progress, resolved, closed, reopened |
| priority | Enum | low, medium, high, urgent |
| category | ObjectId (ref: Category) | Categoría |
| createdBy | ObjectId (ref: User) | Creador |
| assignedTo | ObjectId (ref: User) | Asignado |
| history | Array | Historial de cambios |
| resolvedAt | Date | Fecha de resolución |
| closedAt | Date | Fecha de cierre |
| reopenCount | Number | Veces reabierto |

### Category
| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | String (unique) | Nombre |
| description | String | Descripción |
| color | String | Color hexadecimal |
| icon | String | Nombre del icono |
| isActive | Boolean | Activa/Inactiva |
| order | Number | Orden de visualización |

### Comment
| Campo | Tipo | Descripción |
|-------|------|-------------|
| ticket | ObjectId (ref: Ticket) | Ticket |
| content | String | Contenido |
| createdBy | ObjectId (ref: User) | Autor |
| isInternal | Boolean | Solo admin/support |
| editedAt | Date | Fecha de edición |
| editedBy | ObjectId (ref: User) | Editor |

## Especificaciones de Seguridad

### 1. Autenticación
- JWT con expiración de 7 días
- Refresh tokens (futuro)
- Contraseñas hasheadas con bcrypt (12 salt rounds)

### 2. Autorización
- Roles: student, support, admin
- Middleware `protect` para rutas privadas
- Middleware `authorize` para restricción por rol
- Verificación de propiedad de recursos

### 3. Protección contra ataques
- Helmet: headers de seguridad HTTP
- Rate Limiting: 100 peticiones cada 15 minutos
- CORS: origenes configurados
- Validación de inputs con express-validator
- Sanitización de datos

### 4. Logging
- Winston: logs estructurados en JSON
- Archivos: error.log, combined.log
- Console en desarrollo

## Endpoints API

### Auth
| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| POST | /api/v1/auth/register | Público | Registrar usuario |
| POST | /api/v1/auth/login | Público | Iniciar sesión |
| GET | /api/v1/auth/profile | Privado | Perfil del usuario |
| PUT | /api/v1/auth/change-password | Privado | Cambiar contraseña |

### Users
| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| GET | /api/v1/users | Admin | Lista de usuarios |
| GET | /api/v1/users/:id | Admin | Detalle de usuario |
| PUT | /api/v1/users/:id | Admin | Actualizar usuario |
| POST | /api/v1/users/:id/deactivate | Admin | Desactivar usuario |
| POST | /api/v1/users/:id/activate | Admin | Activar usuario |
| GET | /api/v1/users/:id/stats | Privado | Estadísticas |

### Tickets
| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| POST | /api/v1/tickets | Privado | Crear ticket |
| GET | /api/v1/tickets | Privado | Lista de tickets |
| GET | /api/v1/tickets/:id | Privado | Detalle de ticket |
| PUT | /api/v1/tickets/:id | Privado | Actualizar ticket |
| POST | /api/v1/tickets/:id/close | Privado | Cerrar ticket |
| POST | /api/v1/tickets/:id/reopen | Privado | Reabrir ticket |
| POST | /api/v1/tickets/:id/assign | Admin | Asignar a soporte |

### Comments
| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| POST | /api/v1/tickets/:ticketId/comments | Privado | Crear comentario |
| PUT | /api/v1/comments/:id | Privado | Editar comentario |
| DELETE | /api/v1/comments/:id | Privado | Eliminar comentario |

### Categories
| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| GET | /api/v1/categories | Privado | Lista de categorías |
| POST | /api/v1/categories | Admin | Crear categoría |
| PUT | /api/v1/categories/:id | Admin | Actualizar categoría |
| DELETE | /api/v1/categories/:id | Admin | Eliminar categoría |

### Dashboard
| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| GET | /api/v1/dashboard | Privado | Métricas según rol |

## Respuesta Estándar

```json
{
  "success": true|false,
  "message": "Mensaje descriptivo",
  "data": { ... },
  "errors": [ ... ] // Solo en errores de validación
}
```
