# Procedimiento de publicación — Imágenes y Analítica web (Etapa 15)

> Requiere autorización antes de ejecutarse. Ningún paso de este documento se ha
> ejecutado contra producción. No incluye contraseñas: los secretos se quedan en
> `backend/.env` del servidor y en el panel de Vercel.
>
> Consola de cada paso: **[DEV]** tu equipo · **[SERVIDOR]** SSH en cPanel como
> `capitalc` · **[VERCEL]** panel web · **[CPANEL]** panel web.

## Por qué hay dos pushes

Un push a `main` despliega solo (`.github/workflows/deploy.yml` ejecuta
`deploy.sh` en el servidor) y Vercel publica el frontend. El servidor ejecuta la
copia de `deploy.sh` que **ya tenía**, y esa copia no hace `prisma generate`. Si
el código nuevo llegara con ella:

- `nest build` falla (47 errores de tipos), pero `dist/` ya quedó reescrito con
  código nuevo y cliente Prisma viejo;
- el siguiente reinicio de Passenger rompe noticias, blog, equipo, servicios y
  vacantes (`prisma.file_links` es `undefined`).

Por eso primero se publica solo el nuevo `deploy.sh` (fase 1) y la migración;
después el código (fase 3).

## Fase 0 — Antes de empezar

**[DEV]** Revisar el árbol de trabajo y publicar solo cuando esté autorizado:

```bash
git status
```

**[SERVIDOR]** Confirmar las rutas que usa `deploy.sh` y que no hay cambios locales
(el despliegue hace `git reset --hard`):

```bash
cd /home/capitalc/backend-git
git status --short
VENV=/home/capitalc/nodevenv/backend-git/backend/22
ls "$VENV/bin/node" "$VENV/lib/node_modules/prisma/build/index.js" "$VENV/lib/node_modules/typescript/bin/tsc" "$VENV/lib/node_modules/@nestjs/cli/bin/nest.js"
test -f backend/.env && echo ".env presente" || echo "FALTA backend/.env: revisar antes de seguir"
```

`verify-deploy.js` lee `backend/.env`. Si alguna variable está solo en la interfaz de
"Setup Node.js App", agrégala también a `.env`; si no, la verificación previa fallará
y el despliegue se detendrá (sin daño, pero sin publicar).

## Fase 1 — Publicar `deploy.sh`, verificador y migración

Nada de esto cambia el comportamiento del backend en servicio.

**[DEV]**

```bash
git add deploy.sh backend/scripts/verify-deploy.js database/migrations/014_media_and_web_analytics.sql
git commit -m "chore: verificacion de despliegue y migracion 014"
git push origin main
```

**[SERVIDOR]** Esperar a que termine y confirmar:

```bash
tail -n 15 /home/capitalc/backend-git/deploy.log
grep -c "PRISMA GENERATE" /home/capitalc/backend-git/deploy.sh    # debe ser 1
curl -fsS https://api.capitalconsulting.com.co/api/v1/health/ready
```

## Fase 2 — Preparar PostgreSQL y variables

**[SERVIDOR]** Conexión (no imprime la contraseña; se quita `?schema=public`, que `psql` no acepta):

```bash
cd /home/capitalc/backend-git/backend
DB_URL="$(grep -E '^DATABASE_URL=' .env | cut -d= -f2- | sed -E "s/^[\"']//; s/[\"']$//; s/\?.*$//")"
psql "$DB_URL" -Atc "SHOW server_version"     # se espera 10.x
```

**[SERVIDOR]** Copia de seguridad de base y archivos (antes de cualquier cambio):

```bash
mkdir -p "$HOME/backups"
pg_dump "$DB_URL" -Fc -f "$HOME/backups/antes-014-$(date +%F-%H%M).dump"
tar -czf "$HOME/backups/uploads-$(date +%F-%H%M).tgz" -C /home/capitalc/backend-git/backend uploads 2>/dev/null || echo "sin uploads previos"
ls -lh "$HOME/backups" | tail -n 3
```

**[SERVIDOR]** Comprobar el estado real (solo lectura). Se esperan fallos únicamente de
los objetos de la 014; las variables nuevas se agregan en el paso siguiente:

```bash
VENV=/home/capitalc/nodevenv/backend-git/backend/22
"$VENV/bin/node" scripts/verify-deploy.js preflight
```

Si falla algo de `content.posts`, `careers.job_positions.department`,
`careers.applications.cv_file_id`, `pqr.requests` o `foundation.notifications`, **detente**:
producción no tiene aplicadas las migraciones 008–010 y hay que revisarlo primero.

**[SERVIDOR]** Ensayo en el PostgreSQL 10 real: ejecuta toda la migración y la deshace con
`ROLLBACK`. No deja cambios. Es la primera ejecución real en PG10, porque las pruebas se
hicieron en PG17 (debe terminar sin `ERROR`):

```bash
M=/home/capitalc/backend-git/database/migrations/014_media_and_web_analytics.sql
sed -E 's/^COMMIT;\r?$/ROLLBACK;/' "$M" | psql "$DB_URL" -v ON_ERROR_STOP=1 -q && echo "ENSAYO CORRECTO"
```

**[SERVIDOR]** Aplicar la 014. Es una sola transacción (si algo falla no queda nada
aplicado), es idempotente y solo agrega objetos; el backend en servicio la ignora:

```bash
psql "$DB_URL" -v ON_ERROR_STOP=1 -f "$M"
curl -fsS https://api.capitalconsulting.com.co/api/v1/health/ready
```

> `prisma migrate diff` propone además borrar columnas antiguas de
> `careers.candidates` que el modelo no usa. **Nunca ejecutes ese diff**: la 014 es lo
> único que debe aplicarse.

**[SERVIDOR]** Variables en `backend/.env` (valores no secretos):

```dotenv
MEDIA_PUBLIC_BASE_URL=https://api.capitalconsulting.com.co/api/v1/media/public
ANALYTICS_ALLOWED_ORIGINS=https://capitalconsulting.com.co,https://www.capitalconsulting.com.co
```

Verificar que ya existan y sean correctas:

```bash
grep -E '^(NODE_ENV|API_PREFIX|CORS_ORIGINS|FILE_STORAGE_PROVIDER|FILE_STORAGE_PATH|THROTTLE_LIMIT)=' .env
"$VENV/bin/node" scripts/verify-deploy.js preflight     # ahora debe terminar en "todo correcto"
```

`NODE_ENV` debe ser `production`; `CORS_ORIGINS` debe tener ambos dominios y ningún
`localhost`. **No cambies `FILE_STORAGE_PATH`** si ya está en uso: PQR y hojas de vida
guardan rutas relativas a ella.

**[CPANEL]** Copias de seguridad: `backend/uploads/` no está en Git y sobrevive a
`git reset --hard`, pero **hay que confirmar que el backup del hosting la incluye**:

```bash
cat ~/cpbackup-exclude.conf 2>/dev/null      # [SERVIDOR] no debe excluir backend-git ni uploads
du -sh /home/capitalc/backend-git/backend/uploads; quota -s 2>/dev/null
```

**[VERCEL]** Project → Settings → Environment Variables, entorno **Production**:

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://api.capitalconsulting.com.co/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | `https://www.capitalconsulting.com.co` |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | no definir (activa en producción). `false` la apaga |
| `NEXT_PUBLIC_MEDIA_BASE_URL` | no definir, salvo imágenes en otro dominio |

Sin `NEXT_PUBLIC_API_URL` correcta, el build de producción en Vercel ahora **falla a
propósito** con un mensaje claro. Ninguna variable `NEXT_PUBLIC_*` debe tener secretos.

## Fase 3 — Publicar el código

**[DEV]** Tus cambios de Yuri, login y sitemap también están sin confirmar. Las pruebas se
hicieron con todo junto; se recomiendan dos commits en un solo push (solo se compila el último):

```bash
git add backend/src/modules/chat backend/src/modules/crm/leads "src/app/(auth)/login/page.tsx" src/app/sitemap.ts src/components/organisms/WhatsAppAssistant src/lib/auth/remembered-email.ts src/lib/navigation
git commit -m "feat: mejoras de Yuri, login y sitemap"
git add -A
git status            # revisar antes de confirmar
git commit -m "feat: imagenes del panel, analitica web y rate limiting compartido"
git push origin main
```

**[SERVIDOR]** Seguir el despliegue (`deploy.sh` escribe en este registro, no en GitHub):

```bash
tail -f /home/capitalc/backend-git/deploy.log     # termina en "=== DEPLOY OK ===" o "=== DEPLOY FALLIDO"
```

Orden que ejecuta: verificación previa → `npm install` (solo si cambió el lockfile; esta
versión no lo cambia) → `prisma generate` → comprobación de tipos → `nest build` →
reinicio de Passenger → verificación posterior. **No ejecuta migraciones.**

Si falla antes del build, la versión anterior sigue en servicio. Registros de la app:
`/home/capitalc/backend-git/backend/stderr.log` o `~/logs/`.

**[VERCEL]** Deployments → comprobar que el despliegue de producción terminó sin errores.

## Fase 4 — Pruebas posteriores

**[DEV o cualquier equipo]** Salud y protección de endpoints:

```bash
API=https://api.capitalconsulting.com.co/api/v1
curl -s -o /dev/null -w "health/ready %{http_code} (200)\n" $API/health/ready
curl -s -o /dev/null -w "public/services %{http_code} (200)\n" $API/public/services
curl -s -o /dev/null -w "analytics/report %{http_code} (401)\n" "$API/analytics/report?from=2026-01-01&to=2026-01-02"
curl -s -o /dev/null -w "media/images %{http_code} (401)\n" -X POST $API/media/images
```

**Identificación del cliente detrás del proxy (imprescindible).** No se pudo comprobar
desde fuera del servidor. Inicia sesión en el panel, copia el token (`access_token` en
localStorage) y ejecuta:

```bash
TOKEN='pega-aqui-tu-token'
curl -s -H "Authorization: Bearer $TOKEN" $API/analytics/diagnostics
curl -s -H "Authorization: Bearer $TOKEN" -H "X-Forwarded-For: 1.2.3.4" $API/analytics/diagnostics
```

| Resultado | Significado | Qué hacer |
|---|---|---|
| Ambas muestran tu IP pública y `rateLimitStore: postgres` | Correcto | Nada |
| La segunda muestra `1.2.3.4` | Se puede falsificar la IP | `TRUST_PROXY_HOPS=0` en `.env`: todos comparten cupo (seguro, no evadible); subir `ANALYTICS_RATE_LIMIT` y revisar el proxy |
| Muestran la IP del proxy o `sin-ip` | Hay más saltos de los previstos (p. ej. Cloudflare) | Ajustar `TRUST_PROXY_HOPS` a la cantidad real y repetir |
| `rateLimitStore: memoria` | No se usa el contador compartido | Revisar la 014 y los registros (`RateLimit`) |

**Rate limiting real.** Usa un origen falso: la petición cuenta para el límite pero se
descarta, así que no ensucia las estadísticas. Tu IP queda limitada 60 s:

```bash
UA='Mozilla/5.0 (X11; Linux x86_64) Chrome/141.0 Safari/537.36'
BODY='{"events":[{"type":"pageview","path":"/verificacion"}]}'
seq 1 140 | xargs -P 20 -I{} curl -s -o /dev/null -w "%{http_code}\n" -X POST -H 'Content-Type: text/plain' -H 'Origin: https://verificacion.invalid' -A "$UA" -d "$BODY" $API/analytics/collect | sort | uniq -c
```

Esperado: `120 202` y `20 429`. Con 2 o más instancias de Passenger debe dar lo mismo.

**[Navegador]** En una ventana privada, **sin haber abierto el panel en ese navegador**
(si lo abriste, ese navegador queda marcado como tráfico interno y no se mide):

1. Abre `https://www.capitalconsulting.com.co/?utm_source=prueba&utm_medium=social&utm_campaign=verificacion`,
   acepta cookies y navega por 2 o 3 páginas. En *Red* debe verse `collect` con estado 202.
2. En otra ventana privada pulsa **Rechazar** y navega: no debe salir ninguna petición nueva a `collect`.
3. En **Analítica web** (`/admin/analytics`): deben aparecer la campaña `verificacion`, el canal
   Redes sociales y las páginas visitadas. Este tráfico es de prueba: se distingue por esa campaña.
4. En **Noticias** sube una portada a un borrador: debe verse la vista previa. Publica una noticia
   de prueba, compruébala en `/noticias/<slug>` y en `/noticias` (hasta 1 minuto) y elimínala.
5. Repite con la foto de un integrante, la portada de una vacante y la imagen de un servicio.
   Para los servicios, al final quita la imagen: la página vuelve a la suya.

## Reversión

- **Backend/frontend:** **[DEV]** `git revert <commit>` y `git push origin main`, o **[VERCEL]**
  "Promote" sobre el despliegue anterior.
- **Migración 014:** no hace falta revertirla: es aditiva y el código anterior la ignora.
- **Restaurar datos** (solo si fuera imprescindible): `pg_restore` del `.dump` de la fase 2.

## Referencia: variables

| Dónde | Variable | Obligatoria | Nota |
|---|---|---|---|
| Backend | `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Sí | Ya existen. Secretas |
| Backend | `NODE_ENV=production` | Sí | |
| Backend | `MEDIA_PUBLIC_BASE_URL` | **Sí, nueva** | Sin ella la carga responde 503 |
| Backend | `CORS_ORIGINS` | Sí | Ambos dominios, sin localhost |
| Backend | `ANALYTICS_ALLOWED_ORIGINS` | Recomendada, nueva | Por defecto, `CORS_ORIGINS` |
| Backend | `FILE_STORAGE_PROVIDER`, `FILE_STORAGE_PATH` | Ya existen | `local`, `./uploads` |
| Backend | `TRUST_PROXY_HOPS` | No | Solo si la fase 4 lo indica |
| Backend | `ANALYTICS_RATE_LIMIT`, `ANALYTICS_RETENTION_DAYS`, `ANALYTICS_TIMEZONE`, `ANALYTICS_COUNTRY_HEADER` | No | 120, 395, America/Bogota, — |
| Backend | `MEDIA_MAX_IMAGE_MB`, `MEDIA_MAX_DIMENSION_PX`, `MEDIA_MAX_GALLERY_IMAGES`, `MEDIA_ALLOWED_FORMATS` | No | 5, 8000, 12, jpeg,png,webp,avif |
| Vercel | `NEXT_PUBLIC_API_URL` | **Sí** | Al compilar; también autoriza el dominio en `next/image` |
| Vercel | `NEXT_PUBLIC_SITE_URL` | Recomendada | Por defecto, el dominio oficial |
| Vercel | `NEXT_PUBLIC_ANALYTICS_ENABLED`, `NEXT_PUBLIC_MEDIA_BASE_URL` | No | |
