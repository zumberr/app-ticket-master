# Plan de Pruebas — Plataforma de Gestión de Tiquetes Estudiantiles

> Versión: 1.0  
> Autor: QA / Security Engineer

---

## 1. Objetivo

Definir el alcance, estrategia, casos de prueba y criterios de salida para garantizar la calidad funcional y no funcional de la plataforma.

---

## 2. Alcance

| Módulo | Descripción | Prioridad |
|---|---|---|
| Autenticación y Registro | Login, registro, recuperación de contraseña, roles | Alta |
| Gestión de Tiquetes | Crear, editar, asignar, cerrar, escalar tickets | Alta |
| Geolocalización y Eventos | Mapa interactivo, eventos cercanos, filtros | Alta |
| Notificaciones | Push, email, in-app | Media |
| Panel de Administración | Reportes, métricas, gestión de usuarios | Media |
| API REST | Todos los endpoints documentados | Alta |

---

## 3. Estrategia de Pruebas

### 3.1 Niveles de Testing

```
┌─────────────────────────────────────┐
│  E2E / Acceptance Tests             │  Validar flujos de usuario completos
├─────────────────────────────────────┤
│  Integration Tests                  │  Validar interacción entre capas
├─────────────────────────────────────┤
│  Unit / Widget Tests                │  Validar lógica y componentes aislados
└─────────────────────────────────────┘
```

### 3.2 Enfoque por Módulo

| Módulo | Unit | Integration | E2E | Security | Performance |
|---|---|---|---|---|---|
| Auth | ✅ | ✅ | ✅ | ✅ | — |
| Tiquetes | ✅ | ✅ | ✅ | ✅ | ✅ |
| Geolocalización | ✅ | ✅ | ✅ | — | — |
| Notificaciones | — | ✅ | ✅ | — | — |
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |
| API | ✅ | ✅ | — | ✅ | ✅ |

---

## 4. Herramientas

| Tipo | Herramienta | Notas |
|---|---|---|
| Unit / Widget | `flutter_test`, `mockito`, `bloc_test` | Mock de `Geolocator`, `http.Client` |
| Integration | `integration_test` | Requiere emulador/dispositivo |
| API | Postman + Newman | Colecciones exportables a CI/CD |
| E2E Web | Cypress / Playwright | Si hay versión web admin |
| Performance | k6, Lighthouse | Load testing y métricas de UI |
| Security | OWASP ZAP, Snyk, SonarQube | Automatizado en pipeline |

---

## 5. Casos de Prueba de Ejemplo

### CP-001: Login exitoso

| Campo | Valor |
|---|---|
| ID | CP-001 |
| Módulo | Autenticación |
| Precondición | Usuario registrado y activo |
| Pasos | 1. Ingresar email válido. 2. Ingresar contraseña correcta. 3. Tocar "Iniciar sesión". |
| Resultado esperado | Redirección al dashboard. Token JWT generado y almacenado de forma segura. |
| Criterio de seguridad | Contraseña nunca visible en logs. Token con expiración. |

### CP-002: Crear tiquete como estudiante

| Campo | Valor |
|---|---|
| ID | CP-002 |
| Módulo | Gestión de Tiquetes |
| Precondición | Usuario autenticado con rol "estudiante" |
| Pasos | 1. Tocar "Nuevo tiquete". 2. Completar campos obligatorios. 3. Tocar "Enviar". |
| Resultado esperado | Tiquete creado con estado "Abierto". Confirmación visual. Notificación al admin. |
| Criterio de seguridad | Validación de inputs (longitud, tipo). Prevención de XSS en descripción. |

### CP-003: Eventos cercanos — permiso de ubicación concedido

| Campo | Valor |
|---|---|
| ID | CP-003 |
| Módulo | Geolocalización |
| Precondición | App instalada. Permiso de ubicación concedido. |
| Pasos | 1. Abrir pantalla de mapa. 2. Esperar carga de ubicación. 3. Verificar marcadores de eventos. |
| Resultado esperado | Mapa centrado en ubicación actual. Marcadores de eventos en radio de 10 km. |
| Criterio de seguridad | API key de Ticketmaster no expuesta en frontend. Datos de ubicación no persistidos sin consentimiento. |

### CP-004: Intento de inyección XSS en descripción de tiquete

| Campo | Valor |
|---|---|
| ID | CP-004 |
| Módulo | Seguridad / Tiquetes |
| Precondición | Usuario autenticado |
| Pasos | 1. Crear tiquete con descripción: `<script>alert('xss')</script>`. 2. Guardar. 3. Visualizar tiquete en panel de admin. |
| Resultado esperado | El script no se ejecuta. El texto se renderiza como texto plano o es escapado. |
| Criterio de seguridad | Sanitización de HTML en frontend y backend. |

---

## 6. Ambientes

| Ambiente | Uso | Datos |
|---|---|---|
| Local | Desarrollo y unit tests | Datos mock / SQLite local |
| CI | Tests automatizados en PR | Datos de seed automatizados |
| Staging | Integration, E2E, DAST | Datos anonimizados |
| Producción | Usuarios finales | Datos reales |

---

## 7. Criterios de Entrada

- Historias de usuario definidas y aprobadas.
- Criterios de aceptación escritos en Gherkin o similar.
- Ambiente de pruebas configurado y estable.
- Datos de prueba (fixtures / seeds) disponibles.

## 8. Criterios de Salida

- Cobertura de código ≥ 80% (unitarias).
- 0 bugs críticos, 0 bugs altos abiertos.
- 0 vulnerabilidades críticas/altas en SAST/DAST/SCA.
- Todos los casos de prueba de alta prioridad ejecutados y aprobados.
- Documentación de usuario actualizada (si aplica).

---

## 9. Roles y Responsabilidades

| Rol | Responsabilidad |
|---|---|
| QA Engineer | Definir plan, ejecutar pruebas manuales, reportar bugs, validar fixes |
| Backend Engineer | Tests unitarios de API y lógica de negocio, corregir bugs |
| Frontend Engineer | Tests de widgets, integración con API, accesibilidad |
| DevOps Engineer | Pipeline CI/CD, ambientes, herramientas de testing automatizado |
| Security Engineer | Pentesting, revisión de código seguro, configuración de seguridad |

---

## 10. Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Falta de tiempo para testing exhaustivo | Alto | Automatizar regresión. Priorizar casos de alta criticidad. |
| Dependencia de API externa (Ticketmaster) | Medio | Mock de API en tests. Manejo de fallos graceful. |
| Dificultad para reproducir bugs en dispositivos específicos | Medio | Device farm (Firebase Test Lab) o emuladores diversos. |
| Acumulación de deuda técnica de seguridad | Alto | SAST/DAST en cada PR. Revisión de seguridad obligatoria. |

---

*Plan vivo — actualizar con cada sprint y release.*
