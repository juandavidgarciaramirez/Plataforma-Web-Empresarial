# Imágenes del panel y Analítica web — Etapa 15

> Estado al 2026-10-29. Complementa [`deployment-security.md`](./deployment-security.md)
> y [`security.md`](./security.md). Migración: `database/migrations/014_media_and_web_analytics.sql`.

## 1. Imágenes administrables

### Dónde se gestionan

| Sección del panel | Imágenes | Dónde se ven en el sitio |
|---|---|---|
| Contenido › Noticias | Portada (+ alt) y galería | Tarjetas de `/noticias`, detalle, Open Graph |
| Contenido › Blog | Portada (+ alt) y galería | Tarjetas de `/blog`, detalle, Open Graph |
| Contenido › Equipo / Organigrama | Fotografía (+ alt) | Tarjetas y perfil del organigrama en `/about` |
| Servicios | Imagen principal (+ alt) y galería | Cabecera de `/servicios/<slug>`, galería al final, tarjeta del inicio |
| Talento › Vacantes | Portada (+ alt) e imágenes ilustrativas | Tarjeta y detalle de `/trabaja-con-nosotros` |
| Talento › Imágenes de la sección | Cabecera, imagen de cultura y complementaria | `/trabaja-con-nosotros` |

Sin imagen cargada, cada página conserva la imagen estática que ya tenía. Las
imágenes existentes (`/images/...`) no se modificaron. El organigrama sigue
siendo HTML: no se reemplazó por una imagen (su diseño no usa una imagen
institucional, así que no se agregó ese campo).

### Flujo

1. El formulario sube la imagen al elegirla: `POST /api/v1/media/images`
   (multipart: `archivo`, `context`, `slot`). Progreso real, vista previa,
   nombre, tamaño y dimensiones.
2. El backend valida el **contenido real** (firma y cabecera JPEG/PNG/WebP/AVIF),
   tamaño y dimensiones; guarda el archivo con nombre `UUID.ext` y lo registra
   en `foundation.files` (nombre original, MIME, tamaño, ancho, alto, URL
   pública, usuario que subió, fecha).
3. Al pulsar **Guardar**, el contenido envía solo el id (`coverImageFileId`,
   `imageFileId`, `photoFileId`, `galleryImages`). El backend comprueba que el
   id sea una imagen vigente del CMS y la enlaza en `foundation.file_links`.
4. Reemplazar o quitar una imagen elimina su enlace; el archivo se borra
   (lógico + físico) **solo si ningún otro contenido lo usa**. Eliminar un
   contenido libera sus imágenes con la misma regla. Los servicios se
   "eliminan" con `is_active=false`, así que conservan sus imágenes.
5. Imágenes subidas que nunca se guardaron (formulario cancelado) se limpian
   pasadas 24 h.

### Almacenamiento

- Abstracción `ImageStorage` (`backend/src/modules/media/image-storage.ts`).
  Implementación real: disco local (`FILE_STORAGE_PROVIDER=local`, carpeta
  `FILE_STORAGE_PATH/media`, la misma raíz que PQR y hojas de vida).
- El backend las sirve en `/api/v1/media/public/<uuid>.<ext>` con caché
  inmutable, `nosniff`, CSP `sandbox` y `Cross-Origin-Resource-Policy:
  cross-origin` (necesario porque el sitio está en otro dominio).
- Otro proveedor (S3, Cloudinary…) se agrega implementando la interfaz. Si se
  configura uno no implementado, o falta `MEDIA_PUBLIC_BASE_URL` en
  producción, la carga queda deshabilitada con un mensaje explícito (503) — nunca
  se simula una carga exitosa.
- En el sitio, `next/image` optimiza estas imágenes (tamaños adaptables, AVIF/WebP,
  carga diferida, proporción reservada). El host se autoriza en
  `next.config.ts` a partir de `NEXT_PUBLIC_API_URL`.

### Límites (variables del backend)

| Variable | Por defecto | Uso |
|---|---|---|
| `MEDIA_MAX_IMAGE_MB` | 5 | Tamaño máximo por imagen (tope duro 25) |
| `MEDIA_MAX_DIMENSION_PX` | 8000 | Ancho/alto máximo |
| `MEDIA_MAX_GALLERY_IMAGES` | 12 | Imágenes por galería (vacantes: 6) |
| `MEDIA_ALLOWED_FORMATS` | `jpeg,png,webp,avif` | Formatos aceptados (SVG/GIF nunca) |

Las dimensiones recomendadas por sección se muestran en cada campo y generan
un aviso (no un rechazo) si la imagen es menor.

### Permisos

Subir o asociar imágenes exige el permiso de crear/editar de la sección
(`cms.news.*`, `cms.blog.*`, `cms.services.*`, `cms.team.*`,
`jobs.vacancies.*`). Visitantes sin sesión reciben 401; usuarios sin el
permiso, 403.

## 2. Analítica web

### Arquitectura

- **Navegador** (`src/lib/analytics/`): `AnalyticsTracker` se monta solo en
  el layout público, registra la página vista en cada cambio de ruta del App
  Router y los clics de conversión por delegación. Envía lotes a
  `POST /api/v1/analytics/collect` como `text/plain` con `keepalive` (sin
  preflight CORS, sin bloquear la navegación).
- **Backend** (`backend/src/modules/analytics/`): valida, clasifica y guarda
  en el esquema `analytics` (`events`, `sessions`, `visitors`). El panel
  consulta solo agregados calculados en PostgreSQL.
- **Panel**: menú **Analítica web** (`/admin/analytics`), permiso
  `analytics.dashboard.read`; exportación CSV con `analytics.reports.export`
  (claves que ya existían en `security.permissions`). La migración los asigna a
  los roles Administrador y Comercial.

### Privacidad y consentimiento (decisiones)

- **Con** consentimiento de cookies "Analíticas": se guarda en `localStorage`
  un id de visitante aleatorio (UUID v4, seudónimo) y un id de sesión.
- **Mientras no haya decidido:** solo se registran páginas vistas y eventos **sin
  identificador y sin almacenar nada en el navegador**. Cuentan en páginas
  vistas, visitas y conversiones; no en visitantes ni sesiones. El panel muestra
  el porcentaje de cobertura.
- **Si rechaza** ("Rechazar", analíticas desactivadas en sus preferencias, *Do
  Not Track* o *Global Privacy Control*): **no se envía nada** y se borran los
  ids que hubiera. Lo que estuviera en cola sin enviar se descarta.
- Nunca se guarda: IP, User-Agent completo, query string, referente completo
  (solo su host), contenido de formularios, correos, teléfonos ni nombres. Las
  propiedades de eventos tienen lista blanca y solo aceptan identificadores
  cortos (slug, ruta, categoría).
- No se mezclan eventos anónimos con datos personales del CRM. La atribución
  comercial se mide por canal/campaña de la visita en la que ocurre la
  conversión.
- Retención: `ANALYTICS_RETENTION_DAYS` (por defecto 395 ≈ 13 meses), purga
  diaria automática.

Se recomienda que el área legal revise el texto de la categoría "Analíticas"
del banner y la política de privacidad para mencionar esta medición propia.

### Qué no se cuenta

Rutas `/admin`, `/login`, `/forgot-password`, `/reset-password`, `/api`,
`/_next` y archivos estáticos (también se rechazan en el backend); bots y
navegadores automatizados; orígenes distintos de `ANALYTICS_ALLOWED_ORIGINS`
(el tráfico de desarrollo o de previews no entra a producción); el modo
desarrollo de Next.js (salvo `NEXT_PUBLIC_ANALYTICS_ENABLED=true`); y los
navegadores donde alguien abrió el panel administrativo (tráfico interno).

### Definiciones

| Métrica | Definición |
|---|---|
| Páginas vistas | Cada página pública mostrada, también al navegar sin recargar. |
| Visitas | Llegadas al sitio: primera página vista de una entrada (buscador, red social, enlace, campaña o acceso directo). No cuentan recargas ni "atrás". Estimación. |
| Visitantes únicos* | UUID distintos (solo con consentimiento). Otro navegador = otro visitante. |
| Sesiones* | Navegación de un visitante con consentimiento; se cierra tras 30 min sin actividad o con una campaña distinta. |
| Duración promedio* | Promedio (última − primera actividad) de las sesiones con al menos dos señales (página, evento o salida de la pestaña). Sin sesiones medibles se muestra "Datos insuficientes". |
| Sesiones con interacción* | % de sesiones con ≥ 2 páginas vistas, ≥ 1 evento o ≥ 10 s. Definición propia: no es la "tasa de interacción" ni el "rebote" de Google Analytics. |
| Conversiones | Acciones comerciales (ver tabla de eventos). |

\* Solo visitantes con consentimiento analítico.

Canales: búsqueda orgánica, redes sociales, sitios de referencia, correo,
campañas pagadas (UTM de pago o `gclid`/`fbclid`/`msclkid`, cuyo valor no se
envía), otras campañas UTM y acceso directo.

### Eventos

| Evento | Cuándo | Propiedades | Conversión |
|---|---|---|---|
| `whatsapp_click` | Clic en enlace de WhatsApp | `location` | Sí |
| `email_click` | Clic en un `mailto:` | `mailbox` (comercial/pqr/talento/otro), `location` | Solo `comercial` |
| `contact_form_submit` | Formulario de contacto enviado con éxito | `service` | Sí |
| `pqr_submit` | PQR radicada | `type` | No |
| `yuri_chat_start` | Primer mensaje a Yuri en la conversación | — | No |
| `yuri_quote_start` | Yuri inicia el flujo de cotización | `service` | No |
| `yuri_quote_complete` | Cotización registrada en el CRM por Yuri | `service` | Sí |
| `vacancy_click` | Clic en una vacante | `vacancy` | No |
| `application_submit` | Candidatura enviada | `vacancy` | No |
| `service_click` | Clic hacia una página de servicio | `service`, `location` | No |

### Endpoints

| Método y ruta | Acceso |
|---|---|
| `POST /api/v1/analytics/collect` | Público. Origen permitido, DTO estricto, ≤ 25 eventos, 32 KB, rate limit por IP (`ANALYTICS_RATE_LIMIT`, 120/min) |
| `GET /api/v1/analytics/report?from&to&compare` | `analytics.dashboard.read` |
| `GET /api/v1/analytics/pages?from&to&page&pageSize&search` | `analytics.dashboard.read` |
| `GET /api/v1/analytics/export?from&to&report=daily\|pages\|sources\|campaigns\|devices\|events` | `analytics.dashboard.read` + `analytics.reports.export` |

Fechas en `America/Bogota` (`ANALYTICS_TIMEZONE`), rango máximo 400 días.
El CSV usa `;` y BOM UTF-8 (Excel es-CO) y neutraliza fórmulas.

### Ubicación geográfica

Solo si el backend recibe el país en una cabecera de la infraestructura
(`cf-ipcountry`, `x-vercel-ip-country` o `ANALYTICS_COUNTRY_HEADER`). El
hosting actual no la envía: el panel muestra un estado vacío, no datos inventados.

## 3. Rate limiting e identificación del cliente

Afecta a todas las rutas de la API, no solo a la analítica.

- **Contador compartido:** `PostgresThrottlerStorage` reemplaza al almacén en
  memoria de `@nestjs/throttler`, que es por proceso: con dos instancias de
  Passenger el límite real se duplicaba. Usa `INSERT ... ON CONFLICT DO UPDATE`
  sobre `foundation.rate_limit_counters`, atómico en PostgreSQL 9.5+. La tabla es
  `UNLOGGED`, guarda un HMAC en lugar de la IP y se purga cada 5 minutos. Si la base
  no responde, se usa un contador en memoria por proceso: el límite sigue aplicando
  y el log lo avisa (`RateLimit`).
- **Quién es el cliente:** `app.set('trust proxy', …)` en `main.ts` solo confía en
  `X-Forwarded-For` si la conexión es local (el socket de Passenger o loopback), y
  toma la entrada de más a la derecha, que es la que agregó el proxy. Lo que un
  cliente escriba a la izquierda se ignora; si se conecta directamente desde
  Internet, la cabecera se ignora por completo. `TRUST_PROXY_HOPS` fija otra
  cantidad de saltos (0 = no atender la cabecera).
- **Identidad normalizada:** `::ffff:1.2.3.4` y `1.2.3.4` son la misma; `::1` y
  `127.x` también; una IPv6 cuenta por su red /64, para que rotar direcciones no
  dé cupo nuevo. Sin IP resoluble, todos comparten un cupo: el fallo no abre el límite.
- **Verificación en producción:** `GET /api/v1/analytics/diagnostics` (permiso
  `analytics.dashboard.read`) muestra cómo se resuelve la IP de quien consulta y qué
  contador está activo.

## 4. Producción

Procedimiento completo, con comandos y orden: [`despliegue-etapa-15.md`](./despliegue-etapa-15.md).
