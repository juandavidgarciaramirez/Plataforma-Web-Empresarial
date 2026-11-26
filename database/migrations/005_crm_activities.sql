-- ============================================================================
-- ETAPA 6 — CRM Activities (tabla nueva)
-- Proyecto : Capital Consulting and Services S.A.S.
-- Archivo  : 005_crm_activities.sql
-- Objetivo : conectar el módulo `crm/activities` (hoy en memoria) sin tocar
--            `crm.lead_activities`, que exige siempre un lead (`lead_id`
--            NOT NULL) y no calza con el modelo genérico de la app
--            (`ActivityEntity`: relación polimórfica opcional a lead/
--            company/contact/opportunity, sección 24/25 del encargo).
--
-- Mismo criterio que Opportunities/Tasks (Etapa 4): en vez de aflojar una
-- restricción de una tabla real ya existente con un propósito propio
-- (`lead_activities` parece pensada para una bitácora más rica y
-- específica de leads, con duración/ubicación/URL de reunión), se agrega
-- una tabla nueva que calza con lo que el código ya implementa.
--
-- Seguridad de la operación: solo CREATE TABLE. No se toca ninguna fila ni
-- tabla existente.
-- ============================================================================

BEGIN;

CREATE TABLE crm.activities (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  uuid            UUID NOT NULL DEFAULT gen_random_uuid(),
  type            VARCHAR(20) NOT NULL
                    CHECK (type IN ('CALL','EMAIL','WHATSAPP','MEETING','NOTE','WEB','INSTAGRAM','FACEBOOK','FOLLOW_UP','OTHER')),
  description     TEXT NOT NULL,
  author_user_id  BIGINT REFERENCES security.users(id) ON DELETE SET NULL,
  occurred_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  related_type    VARCHAR(20) CHECK (related_type IS NULL OR related_type IN ('lead','company','contact','opportunity')),
  related_id      BIGINT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm.activities IS 'Actividades/interacciones genéricas del CRM (secciones 24/25 del encargo) — Etapa 6, tabla nueva. Distinta de crm.lead_activities (siempre requiere lead, más detallada).';

CREATE INDEX idx_crm_activities_author ON crm.activities(author_user_id);
CREATE INDEX idx_crm_activities_related ON crm.activities(related_type, related_id);
CREATE INDEX idx_crm_activities_occurred ON crm.activities(occurred_at);

COMMIT;
