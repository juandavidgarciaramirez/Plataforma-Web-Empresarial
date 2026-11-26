# Bootstrap del CRM en producción

Guía para instalar, verificar y recuperar los catálogos del CRM, y para reutilizar el
patrón en otros proyectos con NestJS, Prisma, PostgreSQL y Next.js. La lista de
comprobación para una instalación nueva está en
[CRM_NEW_INSTALL_CHECKLIST.md](CRM_NEW_INSTALL_CHECKLIST.md).

## El problema que evita

Crear un lead exige varias filas de catálogo. Si faltan, la conversación sigue respondiendo
HTTP 200, pero el lead no se guarda. Eso pasó en producción: el esquema se creó a partir de
un volcado sin datos, y ninguna migración definía esos catálogos porque en desarrollo se
habían cargado a mano.

Tres piezas lo evitan:

| Pieza | Archivo | Qué hace |
|---|---|---|
| Definición única | `backend/src/modules/crm/common/crm-catalog.json` | Lista lo que el código necesita. La usan la API y el verificador |
| Migraciones | `database/migrations/015_crm_catalog_bootstrap.sql` (CRM) y `016_platform_catalog_bootstrap.sql` (PQR, chat y almacenamiento) | Crean los registros que falten. Idempotentes, solo insertan |
| Verificador | `backend/scripts/verify-deploy.js` | Detiene el despliegue si falta algo e indica cómo resolverlo |

Una prueba automática (`backend/test/crm-catalog-consistency.test.js`) falla si la
migración, el JSON y el código dejan de coincidir.

## Arquitectura de catálogos

Un lead apunta a seis tablas obligatorias. La empresa es opcional en el lead, pero
obligatoria en el contacto; por eso existe la empresa técnica.

```
crm.leads
 ├─ source_id    → crm.lead_sources            (fuente)
 ├─ status_id    → crm.lead_statuses           (estado)
 ├─ pipeline_id  → crm.pipelines               (el predeterminado activo)
 ├─ stage_id     → crm.pipeline_stages         → crm.pipelines
 ├─ assigned_to  → security.users              (SEED_ADMIN_EMAIL si no hay dueño)
 ├─ created_by   → security.users
 ├─ company_id   → core.companies              (opcional: NULL si no hay empresa)
 └─ contact_id   → core.contacts
                    └─ company_id → core.companies (obligatorio: empresa técnica si no hay)
                                     └─ country_id → core.countries
```

**Estado y etapa son catálogos distintos.** El estado describe la gestión comercial
(10 valores). La etapa es la posición en el pipeline (5 requeridas). La aplicación usa 5
estados propios y los traduce así:

| Estado de la aplicación | `crm.lead_statuses` | `crm.pipeline_stages` |
|---|---|---|
| `NEW` | Nuevo | Nuevo |
| `CONTACTED` | Contactado | Contactado |
| `QUALIFIED` | En Gestión | Calificado |
| `DISQUALIFIED` | No Interesado | Perdido |
| `CONVERTED` | Ganado | Ganado |

## Inicialización: tres responsabilidades separadas

| | Qué contiene | Cómo se ejecuta | ¿En producción? |
|---|---|---|---|
| **A. Seguridad** | Permisos, roles y administrador | `npm run seed:security` (`src/database/production-seed.ts`). Además, `SeedService` crea el administrador al arrancar si falta | Sí |
| **B. Catálogos** | Fuentes, estados, pipeline, etapas, país y empresa técnica (015). PQR, intenciones del chat y proveedor de almacenamiento (016) | Migraciones, a mano | Sí |
| **C. Demostración** | Empresas, contactos y leads ficticios (`crm-seed.service.ts`) | No está registrado en `SeedModule` y exige `CRM_DEMO_SEED=true` | **Nunca** |

El arranque de la API nunca inserta datos comerciales. Las migraciones se aplican a mano:
`MigrationModule` existe, pero no está registrado en `AppModule`.

## Orden de migraciones en una instalación nueva

`backend/database-production-pg10.sql` ya incluye las tablas de las migraciones 001 y 003 a
007. Volver a ejecutarlas falla porque los objetos ya existen. Este orden se probó sobre una
base vacía:

1. Esquema base: `backend/database-production-pg10.sql`
2. `008`, `009` y `010`: estructura posterior al volcado
3. `011`: contenido del sitio (en un clon, sustituirlo por el propio)
4. `013` y después `012`: servicios y equipo. **`012` falla si va antes de `013`**, por la clave foránea `team_members.service_code`
5. `014`: imágenes y analítica
6. `015`: catálogos del CRM
7. `016`: catálogos de PQR, chat y almacenamiento
8. `npm run build && npm run seed:security`
9. Empresa propia: ver el apartado siguiente
10. `node scripts/verify-deploy.js preflight`

### Empresa propia: se crea a mano

`foundation.files.company_id` es obligatorio y el código lo resuelve buscando en `core.companies`
el nombre de `ownCompany` en `crm-catalog.json`. Si no existe, **fallan las postulaciones y la
carga de imágenes, y una PQR con adjunto devuelve error aunque ya quedó creada**.

Ninguna migración la crea a propósito: si la empresa ya existe con otro nombre legal, insertarla
duplicaría una empresa real. Comprueba si existe; si tiene otro nombre, ajusta `ownCompany`, y si
no existe, créala con sus datos reales:

```sql
SELECT id, legal_name, commercial_name FROM core.companies ORDER BY id;
```

### Qué pasa si faltan los catálogos de la 016

El verificador avisa, pero no bloquea el despliegue, porque no impiden crear leads:

| Tabla | Efecto si falta |
|---|---|
| `pqr.request_types`, `pqr.request_statuses`, `pqr.request_priorities` | **La radicación de PQR falla** |
| `chat.chat_intents` | Yuri responde, pero sus conversaciones quedan sin intención registrada |
| `foundation.storage_providers` | Los archivos subidos quedan sin proveedor registrado. La 016 solo lo crea si la tabla está vacía |

## Configuración

| Variable | Obligatoria | Nota |
|---|---|---|
| `SEED_ADMIN_EMAIL` | **Sí** | Usuario que recibe los leads automáticos. Debe existir, estar activo y no eliminado. No tiene valor por defecto |
| `SEED_ADMIN_PASSWORD` | Solo para crearlo | Nunca cambia la contraseña de un usuario existente |
| `SEED_ADMIN_NAME` | No | Nombre al crearlo. Por defecto, "Administrador del sistema" |

`verify-deploy.js` lee `backend/.env`. Si una variable solo está en "Setup Node.js App" de
cPanel, agrégala también al `.env`; si no, la verificación previa detendrá el despliegue.

## Empresa técnica

`core.contacts.company_id` es obligatorio, así que un contacto sin empresa necesita una fila
a la que apuntar.

- **Nombre legal:** `Contactos Independientes (Sin Empresa)`. **Nombre comercial:** `Sin Empresa`. **País:** el de `defaultCountryIso2`.
- Se usa solo para contactos sin empresa: en esos casos, `crm.leads.company_id` queda en `NULL`.
- No es un cliente y no debe borrarse: puede tener contactos asociados.
- `legal_name` no tiene índice único, así que `ON CONFLICT` no evita duplicados. La 015 comprueba su existencia sin distinguir mayúsculas.

Yuri interpreta como "sin empresa" respuestas como "no tengo empresa", "soy independiente",
"persona natural" o "ninguna" (`isNoCompanyAnswer` en `chat.rules.ts`).

Para comprobarla:

```sql
SELECT c.legal_name, c.commercial_name, co.iso2, c.is_active
  FROM core.companies c JOIN core.countries co ON co.id = c.country_id
 WHERE lower(c.legal_name) = lower('Contactos Independientes (Sin Empresa)');
```

## Fuentes, estados, pipeline y etapas

La lista completa está en `crm-catalog.json`. Reglas de la migración:

- **Fuentes y estados:** `ON CONFLICT (name) DO NOTHING`. Los registros existentes no cambian, aunque se hayan personalizado.
- **Pipeline:** debe haber exactamente un predeterminado activo y llamarse como indica el catálogo. Los pipelines adicionales no predeterminados se respetan.
- **Etapas:** se buscan por nombre. Se exigen los valores de `is_closed` e `is_success`. Un `stage_order` distinto es válido y solo genera un aviso: la base de desarrollo tiene 7 etapas (con Propuesta y Negociación) y Ganado=6, Perdido=7, y el código no depende del orden.

| Orden de referencia | Etapa | `is_closed` | `is_success` |
|---|---|---|---|
| 1 | Nuevo | no | no |
| 2 | Contactado | no | no |
| 3 | Calificado | no | no |
| 4 | Perdido | sí | no |
| 5 | Ganado | sí | sí |

## Ejecución controlada

Todo se ejecuta en el servidor, desde `backend/`.

**1. Conexión** (no imprime la contraseña; quita `?schema=public`, que `psql` no acepta):

```bash
DB_URL="$(grep -E '^DATABASE_URL=' .env | cut -d= -f2- | sed -E "s/^[\"']//; s/[\"']$//; s/\?.*$//")"
psql "$DB_URL" -Atc "SHOW server_version"
```

**2. Copia de seguridad.** Siempre antes de cualquier cambio:

```bash
mkdir -p "$HOME/backups"
pg_dump "$DB_URL" -Fc -f "$HOME/backups/antes-015-$(date +%F-%H%M).dump"
ls -lh "$HOME/backups" | tail -n 3
```

**3. Ensayo.** Ejecuta toda la migración y la deshace. Debe terminar sin `ERROR`:

```bash
M=../database/migrations/015_crm_catalog_bootstrap.sql
sed -E 's/^COMMIT;\r?$/ROLLBACK;/' "$M" | psql "$DB_URL" -v ON_ERROR_STOP=1 -q && echo "ENSAYO CORRECTO"
```

**4. Aplicar.** Es una sola transacción: si algo falla, no queda nada aplicado.

```bash
psql "$DB_URL" -v ON_ERROR_STOP=1 -f "$M"
```

**5. Verificar:**

```bash
psql "$DB_URL" -v ON_ERROR_STOP=1 -f ../database/migrations/015_crm_catalog_bootstrap_verify.sql
node scripts/verify-deploy.js crm      # debe terminar en "OK CRM catalog ready"
```

**La 016 se ejecuta igual.** Repite los pasos 3 a 5 con
`M=../database/migrations/016_platform_catalog_bootstrap.sql` y su archivo `_verify.sql`. Después,
`verify-deploy.js crm` no debe mostrar ningún `AVISO Catálogo`.

> Usa siempre `-v ON_ERROR_STOP=1`. Sin esa opción, `psql` continúa tras un error y puede
> terminar con código 0.

Las migraciones fijan `client_encoding` en UTF-8 dentro de su transacción. Sin eso, un cliente en
LATIN1 o WIN1252 inserta `Correo ElectrÃ³nico` como una fila nueva, sin ningún error.

## Verificación de despliegue

| Comando | Cuándo | Qué comprueba |
|---|---|---|
| `node scripts/verify-deploy.js crm` | Tras una migración o en cualquier momento | Solo el catálogo CRM |
| `node scripts/verify-deploy.js preflight` | `deploy.sh`, antes de compilar | Variables, esquema, almacenamiento y CRM. Si falla, sigue en servicio la versión anterior |
| `node scripts/verify-deploy.js postflight` | `deploy.sh`, tras reiniciar | API, imágenes, endpoints protegidos y CRM |

Solo lee, nunca imprime secretos ni el correo del administrador, y **no exige que `crm.leads`
esté vacío**. `OK CRM catalog ready` significa que están todas las dependencias para crear un
lead. `AVISO` no bloquea; `FALLO` detiene el despliegue e indica qué falta, qué migración o
paso lo resuelve, en qué archivo y qué verificar después.

## Pruebas de Yuri

`npm test` (en `backend/`) compila y ejecuta las pruebas. Crea bases `capital_test_*` en el
PostgreSQL **local** y las elimina al terminar. Se niega a usar un host remoto y nunca abre la
base configurada en `DATABASE_URL`. Toma las credenciales de `TEST_DATABASE_URL` o `backend/.env`.

Cubren: lead nuevo, repetición de sesión, peticiones simultáneas, contacto sin empresa, empresa
informada, administrador real, fuente, estado, pipeline y etapa, atomicidad, y catálogos vacíos.

**Prueba manual en desarrollo:** pide una cotización de un servicio, responde nombre, empresa,
correo y teléfono, y comprueba el lead en `/admin/crm/leads`. En producción cada prueba crea un
lead real: hazla solo con autorización e identifica el registro para retirarlo después.

## Recuperación

### Catálogos vacíos o incompletos

Síntomas: Yuri responde "no pude registrar la solicitud", y el registro de la API muestra
`Falta la fuente ... ejecutar database/migrations/015_crm_catalog_bootstrap.sql`.

Sigue la sección [Ejecución controlada](#ejecución-controlada). No hace falta reiniciar la API:
los catálogos se consultan en cada lead.

### La radicación de PQR falla

Síntoma: el registro de la API muestra `No existe el tipo de PQR ... ejecutar
database/migrations/016_platform_catalog_bootstrap.sql`. Aplica la 016 como en
[Ejecución controlada](#ejecución-controlada). No hace falta reiniciar la API.

### La migración 015 se detiene

La 015 no corrige contradicciones: decidirlas requiere criterio de negocio. No hay nada aplicado
y los datos siguen como estaban.

| Mensaje | Qué revisar | Salida habitual |
|---|---|---|
| `hay N pipelines predeterminados activos` | Cuál es el correcto y a cuál apuntan los leads | Dejar `is_default` solo en el correcto |
| `el pipeline predeterminado es "X"` | Si X es correcto en esta instalación | Ajustar el nombre en `crm-catalog.json` y en la 015, o corregir el dato |
| `pipeline predeterminado desactivado` | Por qué se desactivó | Reactivarlo o quitarle `is_default` |
| `"Ventas" existe pero no es el predeterminado activo` | Por qué se cambió | Activarlo con `is_default = true` e `is_active = true` |
| `etapa "X" duplicada` | Qué leads usan cada fila: `SELECT stage_id, count(*) FROM crm.leads GROUP BY 1` | Mover los leads a una y retirar la otra |
| `etapa "X" con is_closed/is_success distintos` | Si la fila es realmente esa etapa | Corregir los indicadores |
| `falta la etapa "X" y su stage_order N ya lo usa "Y"` | El orden de las etapas | Reordenar o crear la etapa con otro orden |
| `empresa placeholder ... duplicada` | Qué contactos tiene cada fila | Unificar los contactos en una y retirar la otra |
| `no se pudo garantizar el país con iso2 = CO` | Qué fila ocupa `iso3 = COL` | Corregir esa fila |

Haz una copia de seguridad antes de corregir a mano y vuelve a ejecutar la migración.

### Volver atrás

La 015 solo agrega datos y el código anterior los ignora: normalmente no hace falta revertirla.
No borres catálogos con leads asociados. Para restaurar por completo, usa `pg_restore` con la copia
del paso 2.

## Reutilizar el patrón en otro proyecto

1. **Copia los archivos:** `crm-catalog.json`, `crm-db.util.ts`, `safe-error.util.ts`, las migraciones 015 y 016 con sus verificaciones, `verify-deploy.js`, `production-seed.ts` y `backend/test/`.
2. **Renumera** las migraciones según el proyecto nuevo y actualiza `migration` y `platformCatalog.migration` en el JSON.
3. **Ajusta el catálogo** en `crm-catalog.json` y en la migración: fuentes, estados, nombre del pipeline, etapas y `defaultCountryIso2`. La migración es SQL estático, así que los valores van en los dos sitios; las pruebas avisan si difieren. Ajusta también `ownCompany` (solo en el JSON) y crea esa empresa en la base.
4. **Ajusta el país** en la migración (`iso2`, `iso3`, moneda) y las dependencias del asistente en `yuri`, o elimínalas si no hay chatbot.
5. **No copies** datos propios del negocio ni credenciales: el contenido de 011 a 013, los valores de `.env` ni las rutas de `deploy.sh`.
6. **Reemplaza la identidad del negocio que sigue en el código.** Si se te pasa, por ejemplo, los avisos internos irán a los correos del proyecto original:
   - `modules/contacts/contact.service.ts` y `modules/careers/applications/applications.service.ts`: destinatarios internos y asuntos de correo.
   - `common/mailer/sendmail-mailer.service.ts`: remitente y firma.
   - `modules/chat/chat.constants.ts` y `chat.service.ts`: WhatsApp, correo, servicios y textos del asistente.
   - `modules/careers/applications/consent-policy.constants.ts`: identidad legal de la política de datos.
   - `modules/auth/auth.service.ts`, `main.ts` y las etiquetas de auditoría de `modules/crm/leads/leads.service.ts`.
7. **Antes de escribir una semilla nueva**, revisa qué catálogos tienen datos en desarrollo sin una migración que los cree: ese fue el origen de este problema.
8. **Sigue** [CRM_NEW_INSTALL_CHECKLIST.md](CRM_NEW_INSTALL_CHECKLIST.md).

## Limitaciones conocidas

- **PostgreSQL 10:** las pruebas locales corren en PostgreSQL 17. Las migraciones evitan funciones posteriores a la 10 y hay una prueba que lo comprueba, pero el ensayo con `ROLLBACK` del servidor es su primera ejecución real en esa versión.
- **Concurrencia de contactos y empresas:** `core.contacts.email` y `core.companies.legal_name` no tienen índice único. Dos sesiones distintas con el mismo dato nuevo, en el mismo instante, podrían duplicarlo. Sí se garantiza un solo lead por sesión.
