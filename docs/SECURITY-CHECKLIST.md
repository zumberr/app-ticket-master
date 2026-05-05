# Checklist de Seguridad — Plataforma de Gestión de Tiquetes Estudiantiles

> Versión: 1.0  
> Uso: Revisar antes de cada Pull Request y antes de cada release.

---

## Pre-Commit / Pre-PR

### Código
- [ ] No hay secrets, API keys, ni contraseñas hardcodeadas.
- [ ] No se usa `print()` en producción; se usa un logger con niveles.
- [ ] Todos los inputs de usuario están validados y sanitizados.
- [ ] No hay consultas SQL/NoQL construidas por concatenación de strings.
- [ ] Se manejan errores de forma defensiva (sin exponer información interna).

### Autenticación y Autorización
- [ ] Todos los endpoints protegidos verifican JWT / token de sesión.
- [ ] Las contraseñas se hashean con bcrypt / Argon2 (nunca MD5 / SHA1).
- [ ] Los tokens JWT tienen expiración corta (< 15 min) y refresh token rotativo.
- [ ] Se implementa rate limiting en login y endpoints sensibles.

### Datos
- [ ] No se almacena información sensible en `SharedPreferences` / `localStorage` sin cifrado.
- [ ] Los datos PII están minimizados y justificados.
- [ ] Los backups de base de datos están cifrados.

### Comunicaciones
- [ ] Todas las peticiones usan HTTPS (certificado TLS válido).
- [ ] Se validan certificados SSL (no se desactiva la verificación).
- [ ] Se usa Certificate Pinning para APIs críticas (opcional, recomendado).

---

## Pre-Release (Staging)

### Infraestructura
- [ ] Headers de seguridad configurados: `HSTS`, `CSP`, `X-Frame-Options`, `X-Content-Type-Options`.
- [ ] CORS configurado de forma restrictiva (whitelist de orígenes).
- [ ] Puertos y servicios innecesarios están cerrados.
- [ ] Variables de entorno sensibles no están expuestas en logs o errores.

### Testing de Seguridad
- [ ] SAST: sin vulnerabilidades críticas ni altas.
- [ ] SCA: todas las dependencias con CVEs críticos/altos están actualizadas o mitigadas.
- [ ] DAST: escaneo OWASP ZAP sin findings críticos.
- [ ] Revisión manual de endpoints de autenticación, autorización y manejo de archivos.

### Monitoreo
- [ ] Logs de seguridad centralizados (intentos de login fallidos, accesos 403, errores 5xx).
- [ ] Alertas configuradas para anomalías (fuerza bruta, scraping, tráfico inusual).
- [ ] Plan de respuesta a incidentes documentado y conocido por el equipo.

---

## Post-Release (Producción)

- [ ] Revisión semanal de logs de seguridad.
- [ ] Revisión mensual de dependencias (`pubspec.yaml`, `package.json`, `requirements.txt`).
- [ ] Pentesting manual trimestral o por release mayor.
- [ ] Simulacro de respuesta a incidentes cada 6 meses.

---

*Marcar cada ítem con ✅ una vez verificado. Documentar excepciones con justificación y aprobación del lead.*
