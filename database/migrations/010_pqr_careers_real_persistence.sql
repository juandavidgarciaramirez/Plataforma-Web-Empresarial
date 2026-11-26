-- ============================================================================
-- ETAPA 14 — PQR, Careers Applications y Vacancies → persistencia real
-- Proyecto : Capital Consulting and Services S.A.S.
-- Archivo  : 010_pqr_careers_real_persistence.sql
-- Objetivo : conectar los 3 módulos que seguían 100% en memoria
--            (InMemoryPqrRepository, InMemoryApplicationRepository,
--            InMemoryVacancyRepository — hallazgo de la Etapa 13) a las
--            tablas reales ya existentes en jud_platform_dev, que hasta
--            ahora ningún módulo usaba: `pqr.requests` (+ catálogos reales
--            de tipos/estados/prioridades, ya sembrados) y
--            `careers.job_positions` / `careers.candidates` /
--            `careers.applications` (esquema tipo ATS completo).
--
-- Mismo criterio de todas las etapas anteriores: se adapta el código a la
-- base real (sección 6 del encargo), agregando solo las columnas que la
-- app necesita y el esquema real no tenía, sin tocar ni renombrar nada
-- existente.
--
-- Decisiones de mapeo relevantes:
--   - PQR: `type_id`/`status_id`/`priority_id` ya tienen catálogos reales
--     sembrados (5 tipos, 8 estados, 4 prioridades) — se adopta el set de
--     8 estados real (antes la app solo modelaba 3: OPEN/IN_PROGRESS/
--     CLOSED) en vez de forzar el esquema real a solo 3.
--   - `documentType`/`documentNumber` de la app no tenían columna en
--     `pqr.requests` -> se agregan.
--   - Careers: `careers.applications.job_position_id` es NOT NULL, pero
--     la app permite postulación general ("Base de Altos Potenciales",
--     sección 23) sin vacante puntual -> mismo patrón que la empresa
--     placeholder de CRM (Etapa 4): se crea una vacante placeholder real
--     ("Base de Altos Potenciales") para esas postulaciones.
--   - Campos ricos del formulario público sin columna real (sectores,
--     evidencia de consentimiento detallada, rango de experiencia,
--     ciudad, nivel educativo, disponibilidad) -> columnas nuevas.
--   - La hoja de vida se enlaza por FK real (`applications.cv_file_id` ->
--     `foundation.files.id`), reemplazando el registro por texto plano.
--
-- Seguridad de la operación: solo ALTER TABLE ADD COLUMN/SET DEFAULT e
-- INSERT de una fila placeholder. Ninguna fila ni tabla existente se toca.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. PQR — columnas nuevas en pqr.requests.
-- ----------------------------------------------------------------------------
ALTER TABLE pqr.requests
  ADD COLUMN document_type   VARCHAR(20),
  ADD COLUMN document_number VARCHAR(50);

-- ----------------------------------------------------------------------------
-- 2. Careers — columnas nuevas.
-- ----------------------------------------------------------------------------
ALTER TABLE careers.job_positions
  ADD COLUMN department VARCHAR(150);
ALTER TABLE careers.job_positions
  ALTER COLUMN vacancies SET DEFAULT 1;

ALTER TABLE careers.candidates
  ADD COLUMN city                   VARCHAR(150),
  ADD COLUMN education_level        VARCHAR(100),
  ADD COLUMN relocation             VARCHAR(100),
  ADD COLUMN referral_source        VARCHAR(150),
  ADD COLUMN sectors                JSONB,
  ADD COLUMN salary_expectation_text VARCHAR(100);

ALTER TABLE careers.applications
  ADD COLUMN experience_range        VARCHAR(20),
  ADD COLUMN consent_policy_version  VARCHAR(50),
  ADD COLUMN consent_text            TEXT,
  ADD COLUMN consent_ip              VARCHAR(64),
  ADD COLUMN consent_communications  BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN consent_share_cv        BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN cv_file_id              BIGINT REFERENCES foundation.files(id) ON DELETE SET NULL,
  ADD COLUMN desired_position        VARCHAR(200);

COMMENT ON COLUMN careers.applications.desired_position IS 'Cargo aspirado en texto libre (cargoAspirado del formulario público), para postulaciones generales a la Base de Altos Potenciales sin vacante puntual real asociada.';

COMMENT ON COLUMN careers.applications.cv_file_id IS 'Hoja de vida real en foundation.files (Etapa 14) — reemplaza el registro por texto plano que usaba la app en memoria.';

-- Vacante placeholder real para postulaciones generales a la Base de Altos
-- Potenciales (sección 23 del encargo) que no aplican a una vacante puntual.
INSERT INTO careers.job_positions (title, code, description, work_mode, status, vacancies, department)
VALUES (
  'Base de Altos Potenciales',
  'base-altos-potenciales',
  'Postulación general a la Base de Altos Potenciales de Capital Consulting, sin una vacante puntual asociada.',
  'ONSITE',
  'OPEN',
  0,
  'Talento Humano'
);

COMMIT;
