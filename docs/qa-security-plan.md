# Plan Integral de QA y Seguridad — Plataforma de Gestión de Tiquetes Estudiantiles

> Versión: 1.0  
> Autor: QA / Security Engineer  
> Fecha: 2025-05-05  
> Ubicación: `/home/team/shared/docs/qa-security-plan.md`

---

## 1. Resumen Ejecutivo

Este documento consolida la estrategia de **Aseguramiento de Calidad (QA)** y **Seguridad** para la plataforma de gestión de tiquetes estudiantiles. El objetivo es garantizar que el software sea **robusto, seguro, optimizado y confiable** antes de su despliegue en producción.

---

## 2. Plan de Pruebas

### 2.1 Pirámide de Testing

```
      /\\
     /  \\   E2E (Flutter Integration / Cypress) — ~10%
    /____\\
   /      \\
  /--------\\  Integration (API + DB) — ~30%
 /          \\
/------------\\
   Unit / Widget Tests — ~60%
```

### 2.2 Tipos de Pruebas por Nivel

| Tipo | Descripción | Herramientas Recomendadas |
|---|---|---|
| **Unitarias** | Validar funciones, widgets y lógica de negocio de forma aislada | `flutter_test`, `mockito`, `bloc_test` |
| **Integración** | Validar flujos entre capas (API ↔ DB, Frontend ↔ API) | `flutter integration_test`, Postman/Newman |
| **E2E (End-to-End)** | Simular recorridos completos del usuario | `flutter integration_test`, Cypress (web) |
| **Performance** | Validar tiempos de respuesta y carga | Lighthouse, k6, Artillery |
| **Seguridad** | Identificar vulnerabilidades OWASP | OWASP ZAP, Snyk, SonarQube, pruebas manuales |
| **Accesibilidad (a11y)** | Cumplimiento WCAG | axe-core, Lighthouse |

### 2.3 Enfoque por Módulo

| Módulo | Unit | Integration | E2E | Security | Performance |
|---|---|---|---|---|---|
| Auth | ✅ | ✅ | ✅ | ✅ | — |
| Tiquetes | ✅ | ✅ | ✅ | ✅ | ✅ |
| Geolocalización | ✅ | ✅ | ✅ | — | — |
| Notificaciones | — | ✅ | ✅ | — | — |
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |
| API | ✅ | ✅ | — | ✅ | ✅ |

---

## 3. Checklist de Seguridad — OWASP Top 10 (2021)

| # | Riesgo | Verificación en el proyecto | Estado |
|---|--------|----------------------------|--------|
| A01 | **Broken Access Control** | Validar roles (estudiante, admin, soporte) en cada endpoint. Prohibir IDOR. | 🔲 |
| A02 | **Cryptographic Failures** | HTTPS obligatorio. Hash de contraseñas con bcrypt/Argon2. No exponer PII en logs. | 🔲 |
| A03 | **Injection** | Consultas parametrizadas / ORM. Sanitización de inputs en frontend y backend. | 🔲 |
| A04 | **Insecure Design** | Principio de mínimo privilegio. Rate limiting en APIs. Circuit breakers. | 🔲 |
| A05 | **Security Misconfiguration** | Headers de seguridad (HSTS, CSP, X-Frame-Options). Eliminar defaults inseguros. | 🔲 |
| A06 | **Vulnerable and Outdated Components** | Dependabot / Snyk para actualizar dependencias. Inventario de librerías. | 🔲 |
| A07 | **Identification and Authentication Failures** | JWT con expiración corta + refresh tokens. MFA opcional para admins. Prevención de fuerza bruta. | 🔲 |
| A08 | **Software and Data Integrity Failures** | Firmar commits (GPG). Verificar integridad de dependencias. CI/CD inmutable. | 🔲 |
| A09 | **Security Logging and Monitoring Failures** | Logs centralizados (sin datos PII). Alertas de anomalías. | 🔲 |
| A10 | **Server-Side Request Forgery (SSRF)** | Validar y whitelistear URLs externas. No permitir que el cliente defina URLs de backend. | 🔲 |

### Checklist Adicional Específico del Proyecto

- [ ] **API Key expuesta en código fuente**: La clave de Ticketmaster (`_ticketmasterApiKey`) está hardcodeada. Debe moverse a variables de entorno / secret manager.
- [ ] **Permisos de geolocalización**: Solicitar permisos con justificación clara. No almacenar ubicación sin consentimiento explícito.
- [ ] **Validación de datos de eventos**: Sanitizar nombres de eventos, venues y URLs antes de renderizarlos para prevenir XSS.
- [ ] **Deep linking seguro**: Validar URLs antes de lanzarlas con `url_launcher`.
- [ ] **Manejo de errores**: No exponer stack traces ni información interna al usuario final.

### Pre-Commit / Pre-PR Security Checklist

- [ ] No hay secrets, API keys, ni contraseñas hardcodeadas.
- [ ] No se usa `print()` en producción; se usa un logger con niveles.
- [ ] Todos los inputs de usuario están validados y sanitizados.
- [ ] No hay consultas construidas por concatenación de strings.
- [ ] Se manejan errores de forma defensiva (sin exponer información interna).
- [ ] Todos los endpoints protegidos verifican JWT / token de sesión.
- [ ] Las contraseñas se hashean con bcrypt / Argon2 (nunca MD5 / SHA1).
- [ ] Los tokens JWT tienen expiración corta (< 15 min) y refresh token rotativo.
- [ ] Se implementa rate limiting en login y endpoints sensibles.
- [ ] No se almacena información sensible en `SharedPreferences` / `localStorage` sin cifrado.

---

## 4. Estrategia de Pentesting

### 4.1 Pentesting Manual (Caja Negra / Gris)

| Fase | Actividad | Herramientas |
|---|---|---|
| Reconocimiento | Mapeo de endpoints, tecnologías, dependencias | Burp Suite, OWASP ZAP, Wappalyzer |
| Escaneo | Detección automática de vulnerabilidades conocidas | Nessus, Nikto, OWASP ZAP Spider |
| Explotación | Pruebas controladas de inyección, XSS, CSRF, IDOR | Burp Suite Repeater, manual testing |
| Post-explotación | Evaluación de impacto, escalamiento de privilegios | Manual |
| Reporte | Documentación de hallazgos con CVSS y recomendaciones | Plantilla de reporte OWASP |

### 4.2 Pentesting Automatizado (CI/CD)

- **SAST** (Static Analysis): SonarQube, Semgrep, `flutter analyze`.
- **DAST** (Dynamic Analysis): OWASP ZAP baseline scan en staging.
- **SCA** (Software Composition Analysis): Snyk, Dependabot, `pubspec.lock` audit.
- **Secret Scanning**: GitHub secret scanning, TruffleHog.

### 4.3 Calendario Sugerido

| Evento | Frecuencia | Responsable |
|---|---|---|
| Escaneo SAST/SCA | Cada commit / PR | CI/CD (automatizado) |
| Pentesting automatizado (DAST) | Cada despliegue a staging | CI/CD |
| Pentesting manual | Cada release mayor (o trimestral) | QA / Security Engineer |
| Revisión de configuración de seguridad | Mensual | DevOps |

---

## 5. Herramientas Recomendadas

### 5.1 Stack Flutter (Frontend/Mobile)

| Categoría | Herramienta | Uso |
|---|---|---|
| Unit / Widget Testing | `flutter_test`, `mockito`, `bloc_test` | Tests rápidos de lógica y UI |
| Integration Testing | `integration_test` (oficial Flutter) | Tests E2E en dispositivos reales/emuladores |
| Golden Tests | `golden_toolkit` | Regresión visual de widgets |
| Performance | `integration_test` + Timeline | Métricas de frame rate y jank |

### 5.2 API / Backend

| Categoría | Herramienta | Uso |
|---|---|---|
| API Testing | Postman, Newman, REST Assured | Colecciones de tests de API |
| Contrato | Pact, OpenAPI Validator | Validación de contratos API |
| Carga / Stress | k6, Artillery, Locust | Simulación de concurrencia |

### 5.3 Seguridad

| Categoría | Herramienta | Uso |
|---|---|---|
| SAST | SonarQube, Semgrep, CodeQL | Análisis estático de código |
| DAST | OWASP ZAP, Burp Suite | Análisis dinámico de aplicaciones |
| SCA | Snyk, OWASP Dependency-Check | Vulnerabilidades en dependencias |
| Secret Scanning | GitHub Advanced Security, TruffleHog | Detección de secretos en código |

---

## 6. Criterios de Aceptación

### 6.1 Plantilla Gherkin

```gherkin
Feature: <Nombre de la funcionalidad>

  Scenario: <Escenario feliz>
    Given <precondición>
    When <acción>
    Then <resultado esperado>
    And <criterio de seguridad>

  Scenario: <Escenario de error / seguridad>
    Given <precondición>
    When <acción maliciosa o inválida>
    Then <sistema rechaza la acción>
    And <se registra el intento>
```

### 6.2 Ejemplo: Búsqueda de Eventos Cercanos

```gherkin
Feature: Búsqueda de eventos cercanos por geolocalización

  Scenario: Usuario autorizado consulta eventos cercanos
    Given el usuario ha concedido permisos de ubicación
    When solicita eventos en un radio de 10 km
    Then recibe una lista de eventos ordenados por proximidad
    And la API no expone la API key de Ticketmaster al cliente

  Scenario: Usuario deniega permisos de ubicación
    Given el usuario deniega permisos de ubicación
    When intenta buscar eventos cercanos
    Then se muestra un mensaje informativo y opción de búsqueda manual

  Scenario: Intento de inyección en parámetro de radio
    Given un atacante envía un valor no numérico como radio
    When el backend recibe la petición
    Then devuelve 400 Bad Request
    And registra el intento de inyección
```

### 6.3 Ejemplo: Login y Autenticación

```gherkin
Feature: Autenticación de usuarios

  Scenario: Login exitoso
    Given el usuario está registrado y activo
    When ingresa credenciales válidas
    Then es redirigido al dashboard
    And recibe un JWT con expiración de 15 minutos

  Scenario: Intento de fuerza bruta
    Given un atacante intenta login con múltiples contraseñas
    When falla 5 veces consecutivas
    Then la cuenta se bloquea temporalmente por 15 minutos
    And se genera una alerta de seguridad
```

---

## 7. Casos de Prueba de Ejemplo

| ID | Módulo | Caso | Prioridad |
|---|---|---|---|
| CP-001 | Autenticación | Login exitoso con JWT seguro | Alta |
| CP-002 | Tiquetes | Crear tiquete como estudiante con validación de inputs | Alta |
| CP-003 | Geolocalización | Eventos cercanos con permiso de ubicación concedido | Alta |
| CP-004 | Seguridad | Intento de inyección XSS en descripción de tiquete | Alta |
| CP-005 | Seguridad | Validación de rate limiting en login | Alta |
| CP-006 | API | Respuesta 400 para parámetros inválidos en búsqueda | Media |
| CP-007 | Admin | Acceso denegado a panel admin para rol estudiante | Alta |

---

## 8. Métricas de Calidad y Seguridad

| Métrica | Objetivo | Cómo medir |
|---|---|---|
| Cobertura de código | ≥ 80% (unitarias) | `flutter test --coverage` + lcov |
| Bugs críticos en producción | 0 | Issues de GitHub + Sentry |
| Vulnerabilidades críticas/altas | 0 | Snyk / SonarQube |
| Tiempo medio de resolución de bugs críticos | < 24h | Dashboard de issues |
| Tiempo de respuesta de API (p95) | < 500ms | k6 / APM |
| Score de Lighthouse (Performance) | ≥ 90 | Lighthouse CI |

---

## 9. Ambientes de Pruebas

| Ambiente | Uso | Datos |
|---|---|---|
| Local | Desarrollo y unit tests | Datos mock / SQLite local |
| CI | Tests automatizados en PR | Datos de seed automatizados |
| Staging | Integration, E2E, DAST | Datos anonimizados |
| Producción | Usuarios finales | Datos reales |

---

## 10. Criterios de Entrada y Salida

### Entrada
- Historias de usuario definidas y aprobadas.
- Criterios de aceptación escritos en Gherkin o similar.
- Ambiente de pruebas configurado y estable.
- Datos de prueba (fixtures / seeds) disponibles.

### Salida
- Cobertura de código ≥ 80% (unitarias).
- 0 bugs críticos, 0 bugs altos abiertos.
- 0 vulnerabilidades críticas/altas en SAST/DAST/SCA.
- Todos los casos de prueba de alta prioridad ejecutados y aprobados.
- Documentación de usuario actualizada (si aplica).

---

## 11. Hallazgos Iniciales del Código Base

> Basado en la revisión del commit `37eb388` (rama `master`).

| ID | Severidad | Hallazgo | Recomendación |
|---|---|---|---|
| SEC-001 | 🔴 Crítica | API key de Ticketmaster hardcodeada (`_ticketmasterApiKey = 'APIKEY'`). | Mover a variables de entorno / secret manager. |
| SEC-002 | 🟡 Media | Uso de `print(e)` para errores en producción. | Usar logger estructurado con niveles. |
| SEC-003 | 🟡 Media | No hay validación de schema de respuesta de Ticketmaster. | Definir modelos con `freezed` / `json_serializable`. |
| SEC-004 | 🟡 Media | URLs externas (`eventUrl`) se lanzan sin validación. | Validar dominios permitidos antes de `launchUrl`. |
| QA-001 | 🟢 Baja | Test por defecto (`widget_test.dart`) no coincide con la app actual. | Actualizar o eliminar el test por defecto. |
| QA-002 | 🟢 Baja | No hay tests de integración ni E2E definidos. | Crear suite de `integration_test`. |
| QA-003 | 🟢 Baja | `analysis_options.yaml` usa solo `flutter_lints` básico. | Considerar `very_good_analysis` o reglas adicionales. |

---

## 12. Roadmap y Próximos Pasos

1. **Inmediato (Sprint 0)**
   - [ ] Remover API key hardcodeada y configurar gestión de secretos.
   - [ ] Actualizar `widget_test.dart` para reflejar la app real.
   - [ ] Agregar `avoid_print: true` en `analysis_options.yaml`.

2. **Corto plazo (Sprint 1–2)**
   - [ ] Definir modelos de datos con validación para respuestas de Ticketmaster.
   - [ ] Implementar suite de tests unitarios para `_getEvents`, `_updateMarkers`.
   - [ ] Implementar suite de tests de integración (E2E) con `integration_test`.
   - [ ] Configurar pipeline de CI/CD con SAST y cobertura de tests.

3. **Medio plazo (Sprint 3–4)**
   - [ ] Primer pentesting manual en ambiente de staging.
   - [ ] Configurar DAST automatizado (OWASP ZAP) en pipeline.
   - [ ] Implementar logging estructurado y monitoreo de seguridad.

4. **Continuo**
   - [ ] Revisión trimestral de dependencias y vulnerabilidades.
   - [ ] Actualización de este documento con nuevos hallazgos y métricas.

---

## 13. Referencias

- [OWASP Top 10 – 2021](https://owasp.org/Top10/)
- [OWASP Mobile Security Testing Guide (MSTG)](https://owasp.org/www-project-mobile-security-testing-guide/)
- [Flutter Testing Docs](https://docs.flutter.dev/testing)
- [Flutter Integration Testing](https://docs.flutter.dev/testing/integration-tests)
- [CIS Controls v8](https://www.cisecurity.org/controls)

---

*Documento vivo — se actualizará conforme evolucione el proyecto.*
