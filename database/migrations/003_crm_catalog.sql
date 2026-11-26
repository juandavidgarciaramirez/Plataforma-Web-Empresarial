-- ============================================================================
-- ETAPA 4 — CRM (catálogo + tablas nuevas)
-- Proyecto : Capital Consulting and Services S.A.S.
-- Archivo  : 003_crm_catalog.sql
-- Objetivo : completar lo que falta en el esquema real de CRM (`crm`/`core`)
--            para poder conectar los módulos NestJS de Leads/Companies/
--            Contacts/Opportunities/Tasks que ya existen en código, SIN
--            tocar ni borrar ninguna fila real existente.
--
-- Contexto: al auditar en vivo se encontró que la base real ya tiene mucho
-- más contenido del que registraba el baseline de la Etapa 0 (catalog,
-- content, pqr, careers con decenas de tablas reales) — trabajo hecho por
-- fuera de este flujo de migraciones, no documentado aquí. Para CRM
-- específicamente, `crm.leads` es NOT NULL en `contact_id`, `assigned_to`,
-- `source_id`, `status_id`, `pipeline_id`, `stage_id`; `core.contacts` es
-- NOT NULL en `company_id`. No existe ninguna tabla `opportunities` ni
-- `tasks` en toda la base (se buscó en los 9 schemas).
--
-- Decisiones del usuario (registradas en la conversación):
--   1. Agregar crm.opportunities y crm.tasks reales (no rediseñar los
--      módulos existentes como vistas sobre leads).
--   2. Los leads automáticos (Yuri, formulario público) se asignan al
--      administrador real (contacto@capitalconsulting.com.co) hasta que un
--      comercial los reasigne.
--   3. Agregar las fuentes de lead que faltan (Yuri, Manual, Chat, PQR) en
--      vez de forzarlas sobre los 10 canales genéricos ya existentes.
--
-- Seguridad de la operación: solo INSERT y CREATE TABLE. Ninguna fila ni
-- tabla existente se modifica, renombra ni borra.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. Fuentes de lead que el código NestJS ya usa (LEAD_SOURCES) y que no
--    existían en el catálogo real (10 filas ya existentes: Sitio Web,
--    WhatsApp, Correo Electrónico, Teléfono, Facebook, Instagram, LinkedIn,
--    Referido, Contacto Directo, Otro).
-- ----------------------------------------------------------------------------
INSERT INTO crm.lead_sources (name, description, sort_order) VALUES
  ('Yuri (Chatbot)',  'Lead generado por el asistente virtual Yuri.',              11),
  ('Registro Manual', 'Lead creado manualmente por un usuario del CRM.',           12),
  ('Chat en Vivo',    'Lead generado desde un chat en vivo con agente humano.',    13),
  ('PQR',             'Lead generado a partir de una PQR (creación manual desde Admin, sección 41).', 14);

-- ----------------------------------------------------------------------------
-- 2. Empresa placeholder para contactos sin empresa asociada. `core.contacts
--    .company_id` es NOT NULL en el esquema real; el código actual (`Create
--    ContactDto`) permite crear un contacto sin `companyId`. En vez de
--    cambiar esa validación (rompería el contrato de API ya usado por el
--    Admin), se usa esta empresa real, claramente rotulada como bucket, NO
--    como una empresa cliente — mismo criterio que ya usaba el seed de CRM
--    en memoria para marcar registros no sustantivos (sufijo visible).
-- ----------------------------------------------------------------------------
INSERT INTO core.companies (country_id, legal_name, commercial_name, description, is_active)
SELECT c.id, 'Contactos Independientes (Sin Empresa)', 'Sin Empresa',
       'Empresa placeholder del CRM para contactos que no pertenecen a ninguna empresa real. No es un cliente.',
       true
FROM core.countries c WHERE c.iso2 = 'CO'
ON CONFLICT DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. crm.opportunities — no existía ninguna tabla de oportunidades en toda
--    la base. Mismo patrón que el resto del esquema real (bigint + uuid,
--    snake_case, FKs con ON DELETE explícito, timestamptz).
-- ----------------------------------------------------------------------------
CREATE TABLE crm.opportunities (
  id                   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  uuid                 UUID NOT NULL DEFAULT gen_random_uuid(),
  title                VARCHAR(250) NOT NULL,
  company_id           BIGINT REFERENCES core.companies(id) ON DELETE SET NULL,
  contact_id           BIGINT REFERENCES core.contacts(id) ON DELETE SET NULL,
  source_lead_id       BIGINT REFERENCES crm.leads(id) ON DELETE SET NULL,
  value                NUMERIC(18,2) NOT NULL DEFAULT 0,
  currency             VARCHAR(10) NOT NULL DEFAULT 'COP',
  stage                VARCHAR(20) NOT NULL DEFAULT 'NEW'
                         CHECK (stage IN ('NEW','QUALIFYING','PROPOSAL','NEGOTIATION','WON','LOST')),
  probability          SMALLINT CHECK (probability IS NULL OR (probability BETWEEN 0 AND 100)),
  owner_user_id        BIGINT REFERENCES security.users(id) ON DELETE SET NULL,
  expected_close_date  DATE,
  closed_at            TIMESTAMPTZ,
  close_reason         TEXT,
  created_by           BIGINT REFERENCES security.users(id) ON DELETE SET NULL,
  updated_by           BIGINT REFERENCES security.users(id) ON DELETE SET NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm.opportunities IS 'Oportunidades comerciales del CRM (Etapa 4) — no existía como tabla propia, el diseño previo solo tenía leads+pipeline_stages.';

CREATE INDEX idx_opportunities_company  ON crm.opportunities(company_id);
CREATE INDEX idx_opportunities_contact  ON crm.opportunities(contact_id);
CREATE INDEX idx_opportunities_lead     ON crm.opportunities(source_lead_id);
CREATE INDEX idx_opportunities_stage    ON crm.opportunities(stage);
CREATE INDEX idx_opportunities_owner    ON crm.opportunities(owner_user_id);
CREATE INDEX idx_opportunities_created  ON crm.opportunities(created_at);

-- ----------------------------------------------------------------------------
-- 4. crm.tasks — tampoco existía. `related_id` es polimórfico (lead/company/
--    contact/opportunity, ver `CrmEntityType` en el código) por lo que NO
--    lleva FK física (Postgres no soporta FK polimórfica) — se valida en la
--    capa de aplicación, igual que ya hacía el repositorio en memoria.
-- ----------------------------------------------------------------------------
CREATE TABLE crm.tasks (
  id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  uuid              UUID NOT NULL DEFAULT gen_random_uuid(),
  title             VARCHAR(250) NOT NULL,
  description       TEXT,
  due_date          TIMESTAMPTZ,
  assignee_user_id  BIGINT REFERENCES security.users(id) ON DELETE SET NULL,
  priority          VARCHAR(20) NOT NULL DEFAULT 'MEDIUM'
                      CHECK (priority IN ('LOW','MEDIUM','HIGH','URGENT')),
  status            VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                      CHECK (status IN ('PENDING','IN_PROGRESS','COMPLETED','CANCELLED')),
  related_type      VARCHAR(20) CHECK (related_type IS NULL OR related_type IN ('lead','company','contact','opportunity')),
  related_id        BIGINT,
  created_by        BIGINT REFERENCES security.users(id) ON DELETE SET NULL,
  updated_by        BIGINT REFERENCES security.users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm.tasks IS 'Tareas del CRM (Etapa 4) — no existía como tabla propia.';

CREATE INDEX idx_tasks_assignee ON crm.tasks(assignee_user_id);
CREATE INDEX idx_tasks_status   ON crm.tasks(status);
CREATE INDEX idx_tasks_related  ON crm.tasks(related_type, related_id);
CREATE INDEX idx_tasks_due      ON crm.tasks(due_date);

COMMIT;
