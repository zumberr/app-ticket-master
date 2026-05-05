# Estrategia de Seguridad y QA — Plataforma de Gestión de Tiquetes Estudiantiles

> Versión: 1.0  
> Autor: QA / Security Engineer  
> Fecha: 2025-05-05

---

## 1. Resumen Ejecutivo

Este documento define la estrategia integral de **Aseguramiento de Calidad (QA)** y **Seguridad** para la plataforma digital de gestión de tiquetes estudiantiles. El objetivo es garantizar que el software sea **robusto, seguro, optimizado y confiable** antes de su despliegue en producción.

---

## 2. Alcance

| Componente | Tipo | Alcance QA/Seguridad |
|---|---|---|
| Frontend (Flutter Web/Mobile) | Cliente | Tests UI/E2E, validación de inputs, manejo de sesiones |
| Backend API REST | Servidor | Tests de API, autenticación, autorización, validación de datos |
| Base de Datos | Persistencia | Integridad de datos, consultas parametrizadas, backups |
| Infraestructura / DevOps | Cloud/CI/CD | Configuración segura, secretos, pipelines de testing |

---

## 3. Plan de Pruebas

### 3.1 Pirámide de Testing

```
      /\
     /  \   E2E (Cypress / Playwright / Flutter Integration)
    /____\  ~10% del esfuerzo
   /      \
  /--------\  Integración (API + DB)
 /          \ ~30% del esfuerzo
/------------\
   Unitarias   ~60% del esfuerzo
```

### 3.2 Tipos de Pruebas

| Tipo | Descripción | Herramientas Recomendadas | Responsable |
|---|---|---|---|
| **Unitarias** | Validar funciones, widgets y lógica de negocio de forma aislada | `flutter_test`, `mockito`, `bloc_test` | Backend / Frontend |
| **Integración** | Validar flujos entre capas (API ↔ DB, Frontend ↔ API) | `flutter integration_test`, Postman/Newman, `http` mocking | QA |
| **E2E (End-to-End)** | Simular recorridos completos del usuario | `flutter integration_test`, Cypress (web) | QA |
| **Performance** | Validar tiempos de respuesta y carga | Lighthouse, k6, Artillery | DevOps / QA |
| **Seguridad** | Identificar vulnerabilidades OWASP | OWASP ZAP, Snyk, SonarQube, pruebas manuales | QA / Security |
| **Accesibilidad (a11y)** | Cumplimiento WCAG | axe-core, Lighthouse | Frontend / QA |

---

## 4. Checklist de Seguridad — OWASP Top 10 (2021)

| # | Riesgo | Verificación en el proyecto | Estado |
|---|--------|----------------------------|--------|
| A01 | **Broken Access Control** | Validar roles (estudiante, admin, soporte) en cada endpoint. Prohibir IDOR (Insecure Direct Object References). | 🔲 |
| A02 | **Cryptographic Failures** | Uso de HTTPS en todas las comunicaciones. Hash de contraseñas con bcrypt/Argon2. No exponer datos sensibles en logs. | 🔲 |
| A03 | **Injection** | Consultas parametrizadas / ORM. Sanitización de inputs en frontend y backend. Validación estricta de schemas. | 🔲 |
| A04 | **Insecure Design** | Principio de mínimo privilegio. Rate limiting en APIs. Circuit breakers para fallos externos (Ticketmaster). | 🔲 |
| A05 | **Security Misconfiguration** | Revisar headers de seguridad (HSTS, CSP, X-Frame-Options). Eliminar defaults inseguros. | 🔲 |
| A06 | **Vulnerable and Outdated Components** | Dependabot / Snyk para actualizar dependencias. Inventario de librerías (pubspec.yaml, package.json). | 🔲 |
| A07 | **Identification and Authentication Failures** | JWT con expiración corta + refresh tokens. MFA opcional para admins. Prevención de fuerza bruta. | 🔲 |
| A08 | **Software and Data Integrity Failures** | Firmar commits (GPG). Verificar integridad de dependencias (checksums). CI/CD inmutable. | 🔲 |
| A09 | **Security Logging and Monitoring Failures** | Logs centralizados (sin datos PII). Alertas de anomalías (intentos de login fallidos, 403 repetidos). | 🔲 |
| A10 | **Server-Side Request Forgery (SSRF)** | Validar y whitelistear URLs externas (ej. Ticketmaster). No permitir que el cliente defina URLs de backend. | 🔲 |

### Checklist Adicional Específico del Proyecto

- [ ] **API Key expuesta en código fuente**: La clave de Ticketmaster (`_ticketmasterApiKey`) está hardcodeada. Debe moverse a variables de entorno / secret manager.
- [ ] **Permisos de geolocalización**: Solicitar permisos con justificación clara. No almacenar ubicación sin consentimiento explícito.
- [ ] **Validación de datos de eventos**: Sanitizar nombres de eventos, venues y URLs antes de renderizarlos para prevenir XSS.
- [ ] **Deep linking seguro**: Validar URLs antes de lanzarlas con `url_launcher`.
- [ ] **Manejo de errores**: No exponer stack traces ni información interna al usuario final.

---

## 5. Estrategia de Pentesting

### 5.1 Pentesting Manual (Caja Negra / Gris)

| Fase | Actividad | Herramientas |
|---|---|---|
| Reconocimiento | Mapeo de endpoints, tecnologías, dependencias | Burp Suite, OWASP ZAP, Wappalyzer |
| Escaneo | Detección automática de vulnerabilidades conocidas | Nessus, Nikto, OWASP ZAP Spider |
| Explotación | Pruebas controladas de inyección, XSS, CSRF, IDOR | Burp Suite Repeater, manual testing |
| Post-explotación | Evaluación de impacto, escalamiento de privilegios | Manual |
| Reporte | Documentación de hallazgos con CVSS y recomendaciones | Plantilla de reporte OWASP |

### 5.2 Pentesting Automatizado (CI/CD)

- **SAST** (Static Analysis): SonarQube, Semgrep, `flutter analyze`.
- **DAST** (Dynamic Analysis): OWASP ZAP baseline scan en staging.
- **SCA** (Software Composition Analysis): Snyk, Dependabot, `pubspec.lock` audit.
- **Secret Scanning**: GitHub secret scanning, TruffleHog.

### 5.3 Calendario Sugerido

| Evento | Frecuencia | Responsable |
|---|---|---|
| Escaneo SAST/SCA | Cada commit / PR | CI/CD (automatizado) |
| Pentesting automatizado (DAST) | Cada despliegue a staging | CI/CD |
| Pentesting manual | Cada release mayor (o trimestral) | QA / Security Engineer |
| Revisión de configuración de seguridad | Mensual | DevOps |

---

## 6. Herramientas de Testing Recomendadas

### 6.1 Stack Flutter

| Categoría | Herramienta | Uso |
|---|---|---|
| Unit / Widget Testing | `flutter_test`, `mockito`, `bloc_test` | Tests rápidos de lógica y UI |
| Integration Testing | `integration_test` (oficial Flutter) | Tests E2E en dispositivos reales/emuladores |
| Golden Tests | `golden_toolkit` | Regresión visual de widgets |
| Performance | `flutter_driver` (legacy) / `integration_test` + Timeline | Métricas de frame rate y jank |

### 6.2 API / Backend

| Categoría | Herramienta | Uso |
|---|---|---|
| API Testing | Postman, Newman, REST Assured | Colecciones de tests de API |
| Contrato | Pact, OpenAPI Validator | Validación de contratos API |
| Carga / Stress | k6, Artillery, Locust | Simulación de concurrencia |

### 6.3 Seguridad

| Categoría | Herramienta | Uso |
|---|---|---|
| SAST | SonarQube, Semgrep, CodeQL | Análisis estático de código |
| DAST | OWASP ZAP, Burp Suite | Análisis dinámico de aplicaciones |
| SCA | Snyk, OWASP Dependency-Check | Vulnerabilidades en dependencias |
| Secret Scanning | GitHub Advanced Security, TruffleHog | Detección de secretos en código |

---

## 7. Criterios de Aceptación por Funcionalidad

> A completar a medida que se definan las historias de usuario. Plantilla base:

### Plantilla de Criterios de Aceptación (Gherkin)

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

### Ejemplo: Búsqueda de Eventos Cercanos

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

## 9. Hallazgos Iniciales del Código Base (v1.0)

> Basado en la revisión del commit `37eb388` (rama `master`).

| ID | Severidad | Hallazgo | Recomendación | Referencia |
|---|---|---|---|---|
| SEC-001 | 🔴 Crítica | API key de Ticketmaster hardcodeada (`_ticketmasterApiKey = 'APIKEY'`). Puede filtrarse en repositorios públicos o builds. | Mover a variables de entorno y usar un secret manager (dotenv, Firebase Remote Config seguro, etc.). Nunca commitear secrets. | [OWASP A07](https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/) |
| SEC-002 | 🟡 Media | Uso de `print(e)` para errores en producción. Puede filtrar información sensible en logs de dispositivos. | Usar un logger estructurado con niveles (`debug`, `info`, `error`). En producción, redirigir logs a servicio centralizado (Sentry, Datadog). | [OWASP A09](https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/) |
| SEC-003 | 🟡 Media | No hay validación de schema de respuesta de Ticketmaster. Si la API cambia, la app puede crashear (`null` en campos esperados). | Definir modelos con `freezed` / `json_serializable` y validar respuestas antes de usarlas. Manejar nulls de forma defensiva. | [OWASP A08](https://owasp.org/Top10/A08_2021-Software_and_Data_Integrity_Failures/) |
| SEC-004 | 🟡 Media | URLs externas (`eventUrl`) se lanzan sin validación. Podría llevar a phishing si la API es comprometida. | Validar que `eventUrl` pertenezca a dominios permitidos (`ticketmaster.com`, `livenation.com`) antes de llamar `launchUrl`. | [OWASP A10](https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/) |
| QA-001 | 🟢 Baja | Test por defecto (`widget_test.dart`) no coincide con la app actual (busca texto "0" y botón "+" del template Counter). | Actualizar o eliminar el test por defecto. Crear tests para `MapScreen`, `_getLocation`, `_getEvents` y `_showEventDetails`. | — |
| QA-002 | 🟢 Baja | No hay tests de integración ni E2E definidos. | Crear suite de `integration_test` que simule flujo: permiso de ubicación → carga de mapa → tap en marcador → detalle de evento. | — |
| QA-003 | 🟢 Baja | `analysis_options.yaml` usa solo `flutter_lints` básico. Se recomienda un lints más estricto para producción. | Considerar `very_good_analysis` o activar reglas adicionales: `avoid_print`, `prefer_const_constructors`, `always_specify_types`. | — |

---

## 10. Próximos Pasos y Roadmap

1. **Inmediato (Sprint 0)**
   - [ ] Remover API key hardcodeada y configurar gestión de secretos.
   - [ ] Actualizar `widget_test.dart` para reflejar la app real.
   - [ ] Agregar `avoid_print: true` en `analysis_options.yaml`.

2. **Corto plazo (Sprint 1–2)**
   - [ ] Definir modelos de datos con validación para respuestas de Ticketmaster.
   - [ ] Implementar suite de tests unitarios para `_getEvents`, `_updateMarkers`.
   - [ ] Implementar suite de tests de integración (E2E) con `integration_test`.
   - [ ] Configurar pipeline de CI/CD con SAST (SonarQube / Semgrep) y cobertura de tests.

3. **Medio plazo (Sprint 3–4)**
   - [ ] Primer pentesting manual en ambiente de staging.
   - [ ] Configurar DAST automatizado (OWASP ZAP) en pipeline.
   - [ ] Implementar logging estructurado y monitoreo de seguridad.

4. **Continuo**
   - [ ] Revisión trimestral de dependencias y vulnerabilidades.
   - [ ] Actualización de este documento con nuevos hallazgos y métricas.

---

## 11. Referencias

- [OWASP Top 10 – 2021](https://owasp.org/Top10/)
- [OWASP Mobile Security Testing Guide (MSTG)](https://owasp.org/www-project-mobile-security-testing-guide/)
- [Flutter Testing Docs](https://docs.flutter.dev/testing)
- [Flutter Integration Testing](https://docs.flutter.dev/testing/integration-tests)
- [CIS Controls v8](https://www.cisecurity.org/controls)

---

*Documento vivo — se actualizará conforme evolucione el proyecto.*
