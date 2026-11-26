# BASELINE — jud_platform_dev

Auditoría de línea base, ETAPA 0. Generada 2026-08-23 a partir de una auditoría
de solo lectura (`database/audit/000_baseline_queries.sql`, salida completa en
`database/audit/000_baseline_raw_output.txt`). No se ejecutó ningún DDL/DML.

## 1. Conexión y entorno

| Campo | Valor |
|---|---|
| PostgreSQL | 17.10 on x86_64-windows |
| Base de datos | `jud_platform_dev` |
| Tamaño de la base | 11 MB |
| Usuario de auditoría | `postgres` (superusuario) |
| Roles de login en el cluster | solo `postgres` (resto son roles predefinidos de Postgres, sin `rolcanlogin`) |

## 2. Extensiones instaladas

| Extensión | Versión | Schema |
|---|---|---|
| citext | 1.6 | public |
| pg_trgm | 1.6 | public |
| pgcrypto | 1.3 | public |
| uuid-ossp | 1.1 | public |
| plpgsql | 1.0 | pg_catalog |

Coincide con lo esperado. No hay extensiones adicionales ni faltantes.

## 3. Schemas existentes (20)

| Schema | Tablas | Enums | Estado |
|---|---|---|---|
| **core** | 28 | 0 | ✅ activo, con datos parciales |
| **crm** | 11 | 3 (no usados) | ✅ activo, con datos |
| **security** | 11 | 6 (1 usado) | ✅ activo, con datos críticos |
| foundation | 0 | 0 | vacío — listo para construir |
| catalog | 0 | 0 | vacío — listo para construir |
| content | 0 | 0 | vacío — listo para construir |
| pqr | 0 | 0 | vacío — listo para construir |
| careers | 0 | 0 | vacío — listo para construir |
| audit | 0 | 0 | vacío — **no crear tablas aquí todavía**, ver §7 |
| analytics | 0 | 1 (no usado) | legado, sin tablas |
| blog | 0 | 0 | legado, vacío |
| cms | 0 | 5 (no usados) | legado, sin tablas |
| config | 0 | 2 (no usados) | legado, sin tablas |
| hr | 0 | 4 (no usados) | legado, sin tablas |
| integrations | 0 | 2 (no usados) | legado, sin tablas |
| media | 0 | 2 (no usados) | legado, sin tablas |
| notifications | 0 | 3 (no usados) | legado, sin tablas |
| pqrs | 0 | 3 (no usados) | legado, sin tablas |
| shared | 0 | 3 (no usados) | legado, sin tablas |
| public | 0 | 0 | solo objetos de extensiones |

**Hallazgo clave:** de los 20 schemas, únicamente `core`, `crm` y `security`
contienen tablas (50 en total). Los 6 schemas de la arquitectura nueva que
faltan por construir (`foundation`, `catalog`, `content`, `pqr`, `careers`,
`audit`) están completamente vacíos — no hay nada que migrar hacia ellos
todavía, se construyen desde cero. Los 11 schemas "legado" restantes
(`analytics, blog, cms, config, hr, integrations, media, notifications, pqrs,
shared, public`) **no tienen ni una sola tabla**; lo único que contienen son
tipos ENUM huérfanos (ver §5) que nunca llegaron a usarse. `jud_platform.sql`
(versionado en el repo) contenía el DDL original de esos schemas + enums; el
diseño real evolucionó hacia las tablas que sí existen en `core`/`crm`/`security`
y esos schemas legado quedaron como vestigios.

## 4. Tablas existentes (50) — resumen

**core (28):** audit_logs, branches, cities, companies, company_addresses,
company_emails, company_phones, company_settings, company_social_networks,
contact_addresses, contact_emails, contact_phones, contact_social_networks,
contacts, countries, currencies, file_access_logs, file_categories,
file_shares, file_tags, file_versions, files, holidays, languages, states,
storage_providers, system_settings, timezones.

**crm (11):** activity_types, lead_activities, lead_files, lead_notes,
lead_sources, lead_statuses, lead_tag_relations, lead_tags, leads,
pipeline_stages, pipelines.

**security (11):** api_clients, audit_logs, email_verifications,
login_attempts, password_resets, permissions, positions, role_permissions,
roles, sessions, users.

Todas las tablas usan `bigint` autoincremental (`id`) como PK física +
columna `uuid` (`gen_random_uuid()`) como identificador público en la
mayoría de los casos (excepciones: `activity_types`, `lead_sources`,
`lead_statuses` no tienen columna `id` bigserial explícita revisada — sí
la tienen, ver detalle en columnas; algunas tablas de catálogo simple como
`currencies`, `languages`, `holidays`, `file_categories`, `file_tags`,
`storage_providers` no tienen columna `uuid`, es consistente con ser
catálogos internos sin necesidad de ID público).

Naming consistente en todo el esquema real: `snake_case`, PK `<tabla>_pkey`,
FK `fk_<contexto>`, UNIQUE `uk_<contexto>` / `<tabla>_<col>_key`, índices
`idx_<contexto>`. **Esto ya cumple el objetivo de la Etapa 36** para las
partes que existen.

## 5. Tipos ENUM (130 valores en 28 tipos) — usados vs. huérfanos

Se cruzó cada ENUM contra las columnas reales que lo usan
(`information_schema` + `pg_attribute`). Resultado:

| Enum | Schema | ¿Usado por alguna columna? |
|---|---|---|
| `user_status` | security | ✅ `security.users.status` |
| `user_role` | security | ❌ huérfano — los roles reales están en la **tabla** `security.roles` (con datos) |
| `document_type`, `gender_type`, `audit_action` | security | ❌ huérfanos |
| `activity_type`, `company_size`, `contact_channel` | crm | ❌ huérfanos (crm usa `varchar` + `CHECK` para priority/temperature, y una tabla `activity_types` real para tipos de actividad) |
| todos los de `cms`, `hr`, `media`, `notifications`, `pqrs`, `integrations`, `analytics`, `shared`, `config` | — | ❌ huérfanos (esos schemas no tienen tablas) |

**Sólo 1 de 28 tipos ENUM está realmente en uso.** Los otros 27 son
remanentes del diseño original en `jud_platform.sql` que no se llegaron a
conectar a ninguna tabla real. No se tocan en esta etapa (regla: no asumir,
no borrar) pero quedan marcados como candidatos a consolidar/retirar cuando
se construyan `catalog`, `content`, `pqr`, `careers` (por ejemplo
`hr.application_status/contract_type/job_status/work_modality` son
exactamente lo que necesitará `careers`, y `pqrs.ticket_*` es lo que
necesitará `pqr` — ver §7).

## 6. Datos existentes que se deben preservar

Confirmados exactos (no aproximados):

| Tabla | Filas |
|---|---|
| `security.roles` | 5 |
| `security.permissions` | 44 |
| `security.role_permissions` | 72 |
| `security.users` | 2 |
| `security.api_clients` | 1 |
| `security.positions` | 10 |
| `crm.lead_statuses` | 10 |
| `crm.activity_types` | 15 |

Todo lo demás (28 tablas de `core`, 8 tablas restantes de `crm`, 6 tablas
restantes de `security`) está en **0 filas** — estructura correcta, sin
datos todavía (ni siquiera catálogos base como países/monedas/idiomas están
sembrados).

Sequences sincronizadas correctamente con los datos (`roles_id_seq`=6,
`permissions_id_seq`=45, `role_permissions_id_seq`=72, `users_id_seq`=2,
`api_clients_id_seq`=1, `positions_id_seq`=10, `lead_statuses_id_seq`=10,
`activity_types_id_seq`=15) — sin desincronización detectada.

## 7. Constraints, FKs, índices

- **149 constraints** (PK + UNIQUE + CHECK + FK), **158 índices**, **70 FKs**
  explícitas — todas revisadas, ninguna incoherente.
- `ON DELETE` está definido caso por caso (`CASCADE` en relaciones de
  composición como `company_*`/`contact_*`, `SET NULL` en relaciones
  opcionales como `branches.city_id`, `RESTRICT` en catálogos base como
  `countries`→`states`, `NO ACTION`/default en relaciones de auditoría hacia
  `security.users`). No se detectaron `ON DELETE CASCADE` peligrosos hacia
  tablas de usuarios.
- **0 triggers**, **0 funciones/procedimientos propios** (las únicas
  funciones son las de `citext`/`pgcrypto`/`pg_trgm`). Ninguna tabla tiene
  trigger de `updated_at` automático — se está confiando en el default
  `CURRENT_TIMESTAMP` en el insert y (presumiblemente) en la capa de
  aplicación para el update. Anotado como posible mejora, no como bug.
- **0 huérfanos posibles de verificar todavía** porque casi todas las
  tablas están vacías; la única verificación con datos reales
  (`security.role_permissions` → `roles`/`permissions`,
  `security.users` → `roles`/`positions`) no arrojó violaciones (los FKs
  existen y están saludables por construcción, ya que Postgres no permite
  insertar datos huérfanos con FK activa).

## 8. Situación que requiere decisión antes de la Etapa 9 (Audit)

Tal como anticipa la instrucción original: **existen dos sistemas de
auditoría**, `core.audit_logs` y `security.audit_logs`, ambos con 0 filas
pero con diseños distintos:

- `core.audit_logs`: genérico (`module`, `entity_name`, `entity_id`,
  `action`, `old_values`/`new_values` jsonb, ip, user_agent). FK simple a
  `security.users`.
- `security.audit_logs`: más rico — incluye `session_id` (FK a
  `security.sessions`), `entity_uuid`, contexto HTTP completo (browser, OS,
  device_type, request_method/url, http_status, execution_time_ms).

Como ambos están vacíos, no hay riesgo de pérdida de datos al decidir. Pero
por la regla explícita del punto 21/34 del encargo, **no se crea
`audit.audit_logs` en esta etapa** — se documenta aquí y se resuelve
formalmente al llegar a la Etapa 9, con la opción más probable siendo
consolidar en `audit.audit_logs` con el superset de columnas de
`security.audit_logs` (que ya cubre todo lo que tiene `core.audit_logs`) y
retirar las dos tablas antiguas mediante migración, no borrado directo.

No se generó `BLOCKERS.md` separado porque esto no bloquea las Etapas 1-8:
es una decisión aislada para la Etapa 9, ya queda registrada aquí.

## 9. Comparación contra la arquitectura objetivo

| Módulo objetivo | Estado real | Acción en su etapa |
|---|---|---|
| foundation | vacío | construir desde cero (Etapa 1) |
| security | completo y con datos | auditar y complementar si falta algo, **no recrear** (Etapa 2) |
| core | completo (empresas/contactos/archivos) pero mezclado con catálogos maestros | revisar qué se queda en `core` vs. se conceptualiza en `catalog` (Etapa 3) |
| catalog | vacío; candidatos ya viven en `core` (countries, states, cities, currencies, languages, timezones, holidays) | decidir migración conceptual, no copiar en automático (Etapa 4) |
| content | vacío; nada en `cms` que migrar (0 tablas) | construir desde cero, aprovechando los ENUMs de `cms` sólo como referencia de nomenclatura (Etapa 5) |
| crm | completo y con datos (`lead_statuses`, `activity_types`) | auditar y adaptar, **no recrear** (Etapa 6) |
| pqr | vacío; nada en `pqrs` que migrar (0 tablas) | construir desde cero, ENUMs de `pqrs` como referencia (Etapa 7) |
| careers | vacío; nada en `hr` que migrar (0 tablas) | construir desde cero, ENUMs de `hr` como referencia (Etapa 8) |
| audit | vacío, pero hay 2 sistemas legado a consolidar | decisión formal antes de crear tablas (Etapa 9, ver §8) |

## 10. Conclusión de la Etapa 0

- **PASS.** La base está sana, consistente, sin huérfanos, sin
  desincronización de sequences, sin duplicidad de estructuras activas.
- El trabajo real de las Etapas 2, 3 y 6 (Security, Core, CRM) es
  principalmente de **auditoría fina + complemento**, no de creación —
  esos tres módulos objetivo ya están implementados correctamente.
- Las Etapas 1, 5, 7, 8 (Foundation, Content, PQR, Careers) son
  construcción desde cero sin conflicto de datos.
- La Etapa 4 (Catalog) y la Etapa 9 (Audit) requieren una decisión de
  diseño explícita antes de escribir DDL (documentadas en §8 y §9).
