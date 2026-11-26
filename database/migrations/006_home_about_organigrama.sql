-- ============================================================================
-- ETAPA 7 — Home / Nosotros / Organigrama
-- Proyecto : Capital Consulting and Services S.A.S.
-- Archivo  : 006_home_about_organigrama.sql
-- Objetivo : dar soporte real en base de datos al contenido institucional
--            que hoy vive hardcodeado en el frontend (secciones 14, 16 y 18
--            del encargo): Home (hero carousel + preview "Conócenos"),
--            Nosotros (hero, Quiénes somos, Misión, Visión, Valores,
--            Ecosistema, CTA) y Organigrama (jerarquía del equipo).
--
-- Fuente de la data sembrada: código real ya en producción
-- (`src/data/about.ts`, `src/data/hero.ts`, `src/data/team.ts`,
-- `src/components/organisms/ValuesGrid`, `WhoWeAreConcepts`) — no se
-- inventa ningún texto. Dos excepciones quedan documentadas explícitamente:
--   1) Misión y Visión: el propio código fuente las marca como "placeholder
--      corto, sin cifras ni afirmaciones inventadas" a la espera del
--      documento institucional oficial del cliente. Se siembra ese mismo
--      texto provisional (no se inventa uno distinto) y se dejan marcadas
--      como pendientes de reemplazo en este archivo y en el audit.
--   2) Las estadísticas del preview "Conócenos" de Home ("50+ Empresas
--      asesoradas", "98% Satisfacción del cliente") son marketing filler
--      sin fuente verificable (no vienen de `src/data/`, están hardcodeadas
--      directamente en `AboutSection.tsx`). NO se siembran como si fueran
--      reales: las columnas quedan en NULL = CONFIGURACIÓN PENDIENTE, a la
--      espera de que el cliente aporte cifras reales o se decida retirarlas.
--
-- Decisiones de diseño (mismo criterio aditivo de Etapas 4-6):
--   a) `content.team_members` (Etapa 5) ya modela un integrante básico
--      (nombre/cargo/bio/foto/orden/activo) pero el Organigrama real
--      necesita jerarquía (nivel, padre), datos profesionales adicionales
--      (profesión, área, línea de servicio, especialidades,
--      certificaciones) y un perfil transversal. Se AGREGAN columnas
--      nuevas, todas opcionales o con default — ninguna fila existente se
--      ve afectada (la tabla está vacía desde que se creó en Etapa 5).
--   b) Contenido textual singular de Home/Nosotros -> tabla nueva de una
--      sola fila (`content.company_profile`, PK fija = 1), mismo patrón de
--      "tabla dedicada que calza con la entidad real de la app" usado en
--      todas las etapas previas en vez de forzarlo dentro de un sistema
--      genérico de páginas/secciones JSON.
--   c) Listas editables (hero slides, valores, conceptos de "Quiénes
--      somos") -> tablas propias, igual que team_members/services, para
--      que el admin pueda añadir/quitar/reordenar sin tocar código.
--   d) `service_code` en `hero_slides` y `team_members` referencia
--      `catalog.services(code)`, que ya usa como valor exactamente el slug
--      real del frontend (`capital-learning`, `capital-hse`, etc. —
--      Etapa 5, migración 004), evitando duplicar ese dato como texto
--      libre sin integridad referencial.
--
-- Seguridad de la operación: solo CREATE TABLE, ALTER TABLE ADD COLUMN e
-- INSERT. Ninguna tabla ni fila existente se borra, renombra ni pierde
-- datos. Reversible (DROP de las tablas/columnas nuevas si hiciera falta).
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. content.team_members — columnas nuevas para soportar el Organigrama.
-- ----------------------------------------------------------------------------
ALTER TABLE content.team_members
  ADD COLUMN profession           VARCHAR(200),
  ADD COLUMN area                 VARCHAR(150),
  ADD COLUMN service_code         VARCHAR(50) REFERENCES catalog.services(code) ON UPDATE CASCADE ON DELETE SET NULL,
  ADD COLUMN specialties          JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN certifications       JSONB,
  ADD COLUMN certifications_label VARCHAR(150),
  ADD COLUMN is_transversal       BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN org_level            SMALLINT CHECK (org_level IS NULL OR org_level IN (1,2,3)),
  ADD COLUMN parent_id            BIGINT REFERENCES content.team_members(id) ON DELETE SET NULL,
  ADD COLUMN connector_curve      VARCHAR(5) CHECK (connector_curve IS NULL OR connector_curve IN ('left','right'));

COMMENT ON COLUMN content.team_members.org_level IS 'Nivel del organigrama (1 = dirección general, 2-3 = equipo). NULL = no aparece en el organigrama, solo en el listado plano de equipo.';
COMMENT ON COLUMN content.team_members.parent_id IS 'Integrante del que depende jerárquicamente en el organigrama (autorreferencia).';
COMMENT ON COLUMN content.team_members.service_code IS 'Línea de servicio asociada (catalog.services.code), si aplica.';

CREATE INDEX idx_team_members_parent ON content.team_members(parent_id);
CREATE INDEX idx_team_members_org_level ON content.team_members(org_level);

-- ----------------------------------------------------------------------------
-- 2. content.company_profile — contenido institucional singular (Home
--    preview "Conócenos" + página Nosotros completa). Fila única (id = 1).
-- ----------------------------------------------------------------------------
CREATE TABLE content.company_profile (
  id                      SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),

  -- Home: preview "Conócenos" (hoy hardcodeado en AboutSection.tsx)
  home_about_eyebrow      VARCHAR(150),
  home_about_title        VARCHAR(300),
  home_about_text         TEXT,
  home_about_image_url    TEXT,
  home_about_stat1_value  VARCHAR(20),
  home_about_stat1_label  VARCHAR(150),
  home_about_stat2_value  VARCHAR(20),
  home_about_stat2_label  VARCHAR(150),

  -- Nosotros: hero
  about_hero_title        VARCHAR(300),
  about_hero_subtitle     VARCHAR(400),
  about_hero_image_url    TEXT,

  -- Nosotros: Quiénes somos
  about_who_title         VARCHAR(300),
  about_who_text          TEXT,
  about_who_image_url     TEXT,

  -- Nosotros: Misión / Visión (ver nota de cabecera — placeholder oficial)
  about_mission_text        TEXT,
  about_mission_image_url   TEXT,
  about_vision_year         VARCHAR(10),
  about_vision_text         TEXT,
  about_vision_image_url    TEXT,
  mission_vision_is_placeholder BOOLEAN NOT NULL DEFAULT true,

  -- Nosotros: Ecosistema Capital
  about_ecosystem_title   VARCHAR(300),
  about_ecosystem_text    TEXT,

  -- Nosotros: sección equipo (encabezado; los integrantes viven en team_members)
  about_team_title        VARCHAR(300),
  about_team_subtitle     VARCHAR(400),

  -- Nosotros: CTA final
  about_cta_title         VARCHAR(300),
  about_cta_message       TEXT,
  about_cta_image_url     TEXT,

  updated_by              BIGINT REFERENCES security.users(id) ON DELETE SET NULL,
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE content.company_profile IS 'Contenido institucional singular de Home y Nosotros (secciones 14/16 del encargo) — Etapa 7, tabla nueva, no existía. Fila única (id=1).';
COMMENT ON COLUMN content.company_profile.mission_vision_is_placeholder IS 'true = el texto de mision/vision es el placeholder provisional del código fuente, pendiente del documento institucional oficial del cliente (CONFIGURACION PENDIENTE).';

INSERT INTO content.company_profile (
  id,
  about_hero_title, about_hero_subtitle, about_hero_image_url,
  about_who_title, about_who_text, about_who_image_url,
  about_mission_text, about_mission_image_url,
  about_vision_year, about_vision_text, about_vision_image_url,
  mission_vision_is_placeholder,
  about_ecosystem_title, about_ecosystem_text,
  about_team_title, about_team_subtitle,
  about_cta_title, about_cta_message, about_cta_image_url
) VALUES (
  1,
  'Personas, conocimiento y visión para transformar organizaciones.',
  'Conoce el equipo, la experiencia y la visión que hacen parte de Capital Consulting.',
  '/images/nosotros/hero.png',
  'Una visión integral de las organizaciones',
  'Acompañamos a las organizaciones desde una mirada que conecta a las personas, la operación y el negocio, con equipos especializados en cada frente de riesgo y de gestión.',
  '/images/nosotros/quienes-somos.png',
  'Brindar soluciones integrales de consultoría que fortalezcan la gestión financiera, administrativa, de riesgos y del talento humano de nuestros clientes, con conocimiento especializado y compromiso genuino con sus resultados.',
  '/images/nosotros/mision.png',
  '',
  'Ser reconocidos como un aliado estratégico de referencia para las organizaciones, por la calidad, integridad y especialización con la que acompañamos cada una de sus líneas de negocio.',
  '/images/nosotros/vision.png',
  true,
  'Cinco líneas. Una visión.',
  'Cada línea de Capital Consulting responde a un frente distinto de la organización, conectadas por el mismo equipo y la misma visión integral.',
  'Las personas detrás de Capital',
  'Conocimiento especializado, experiencia y diferentes perspectivas para acompañar cada desafío empresarial.',
  'Hablemos de su próximo desafío empresarial',
  'Conecte con el equipo especializado que mejor se ajusta a la necesidad de su organización.',
  '/images/nosotros/cta-contactanos.png'
);

-- ----------------------------------------------------------------------------
-- 3. content.hero_slides — carrusel principal de Home (5 líneas de negocio).
-- ----------------------------------------------------------------------------
CREATE TABLE content.hero_slides (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  uuid            UUID NOT NULL DEFAULT gen_random_uuid(),
  slug            VARCHAR(100) NOT NULL UNIQUE,
  service_code    VARCHAR(50) REFERENCES catalog.services(code) ON UPDATE CASCADE ON DELETE SET NULL,
  name_white      VARCHAR(50) NOT NULL,
  name_blue       VARCHAR(50) NOT NULL,
  title           VARCHAR(300) NOT NULL,
  description     TEXT,
  image_url       TEXT,
  image_position  VARCHAR(50),
  href            VARCHAR(300) NOT NULL,
  items           JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order      INT NOT NULL DEFAULT 1,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_by      BIGINT REFERENCES security.users(id) ON DELETE SET NULL,
  updated_by      BIGINT REFERENCES security.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE content.hero_slides IS 'Slides del carrusel principal de Home (sección 14 del encargo) — Etapa 7, tabla nueva, no existía.';
COMMENT ON COLUMN content.hero_slides.items IS 'Lista de {label, icon} mostrada en el slide, donde "icon" es el nombre del icono de lucide-react (mismo patrón que icon_key en company_values).';

CREATE INDEX idx_hero_slides_active ON content.hero_slides(is_active);
CREATE INDEX idx_hero_slides_order ON content.hero_slides(sort_order);

INSERT INTO content.hero_slides (slug, service_code, name_white, name_blue, title, description, image_url, image_position, href, items, sort_order) VALUES
  ('capital-learning', 'capital-learning', 'CAPITAL', 'LEARNING',
   'Desarrollamos el talento que transforma organizaciones.',
   'Soluciones de formación y desarrollo para fortalecer las capacidades de las personas y potenciar el desempeño organizacional.',
   '/images/heroprincipal/capital-learning.png', NULL, '/servicios/capital-learning',
   '[{"label":"Formación","icon":"GraduationCap"},{"label":"Desarrollo","icon":"Brain"},{"label":"Liderazgo","icon":"Users"},{"label":"Cultura","icon":"HeartPulse"},{"label":"Desempeño","icon":"BarChart3"}]'::jsonb,
   1),
  ('capital-mobility', 'capital-mobility', 'CAPITAL', 'MOBILITY',
   'Movilidad segura para organizaciones más eficientes.',
   'Gestionamos la seguridad vial y la movilidad empresarial para reducir riesgos y fortalecer la operación.',
   '/images/heroprincipal/capital-mobility.png', NULL, '/servicios/capital-mobility',
   '[{"label":"Seguridad vial","icon":"ShieldCheck"},{"label":"Movilidad","icon":"Truck"},{"label":"Gestión del riesgo","icon":"Route"},{"label":"Prevención","icon":"ClipboardCheck"},{"label":"Operación","icon":"Target"}]'::jsonb,
   2),
  ('capital-hse', 'capital-hse', 'CAPITAL', 'HSE',
   'Prevenir riesgos. Proteger personas. Fortalecer organizaciones.',
   'Soluciones integrales de Seguridad y Salud en el Trabajo orientadas a la prevención y gestión del riesgo.',
   '/images/heroprincipal/capital-sst.png', NULL, '/servicios/capital-hse',
   '[{"label":"Seguridad","icon":"HardHat"},{"label":"Prevención","icon":"ShieldCheck"},{"label":"Salud","icon":"HeartPulse"},{"label":"Gestión","icon":"ClipboardCheck"},{"label":"Cumplimiento","icon":"BarChart3"}]'::jsonb,
   3),
  ('capital-talento-humano', 'capital-staffing', 'CAPITAL', 'STAFFING',
   'Personas que impulsan organizaciones extraordinarias.',
   'Estrategias para fortalecer el talento, la cultura y las relaciones que construyen organizaciones sostenibles.',
   '/images/heroprincipal/capital-talento-humano.png', NULL, '/servicios/capital-staffing',
   '[{"label":"Talento","icon":"UserRound"},{"label":"Cultura","icon":"Users"},{"label":"Liderazgo","icon":"Target"},{"label":"Bienestar","icon":"HeartPulse"},{"label":"Productividad","icon":"TrendingUp"}]'::jsonb,
   4),
  ('capital-soluciones-empresariales', 'capital-business-services', 'CAPITAL', 'BUSINESS SERVICES',
   'Estrategia, innovación y crecimiento para tu organización.',
   'Acompañamiento estratégico para convertir los desafíos empresariales en oportunidades de crecimiento.',
   '/images/heroprincipal/capital-soluciones-empresariales.png', NULL, '/servicios/capital-business-services',
   '[{"label":"Estrategia","icon":"Target"},{"label":"Innovación","icon":"Lightbulb"},{"label":"Consultoría","icon":"Handshake"},{"label":"Gestión","icon":"Building2"},{"label":"Crecimiento","icon":"TrendingUp"}]'::jsonb,
   5);

-- ----------------------------------------------------------------------------
-- 4. content.company_values — los 5 valores corporativos (sección Valores).
-- ----------------------------------------------------------------------------
CREATE TABLE content.company_values (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  uuid         UUID NOT NULL DEFAULT gen_random_uuid(),
  key          VARCHAR(50) NOT NULL UNIQUE,
  title        VARCHAR(150) NOT NULL,
  description  TEXT,
  icon_key     VARCHAR(50),
  image_url    TEXT,
  sort_order   INT NOT NULL DEFAULT 1,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_by   BIGINT REFERENCES security.users(id) ON DELETE SET NULL,
  updated_by   BIGINT REFERENCES security.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE content.company_values IS 'Valores corporativos mostrados en Nosotros (sección 16 del encargo) — Etapa 7, tabla nueva, no existía.';
COMMENT ON COLUMN content.company_values.icon_key IS 'Nombre del icono de lucide-react (ShieldCheck, Lock, Award, Lightbulb, Handshake).';

CREATE INDEX idx_company_values_active ON content.company_values(is_active);
CREATE INDEX idx_company_values_order ON content.company_values(sort_order);

INSERT INTO content.company_values (key, title, description, icon_key, image_url, sort_order) VALUES
  ('integridad', 'Integridad', 'Actuamos con coherencia entre lo que decimos y lo que hacemos, siempre.', 'ShieldCheck', '/images/nosotros/valor-integridad.png', 1),
  ('privacidad', 'Privacidad', 'Protegemos la información de cada cliente bajo estrictos protocolos de confidencialidad.', 'Lock', '/images/nosotros/valor-privacidad.png', 2),
  ('excelencia', 'Excelencia', 'Buscamos el estándar más alto en cada proyecto, con rigor técnico y atención al detalle.', 'Award', '/images/nosotros/valor-excelencia.png', 3),
  ('innovacion', 'Innovación', 'Evolucionamos nuestras soluciones para responder a los retos reales de cada operación.', 'Lightbulb', '/images/nosotros/valor-innovacion.png', 4),
  ('compromiso', 'Compromiso', 'Nos involucramos con los resultados de nuestros clientes como si fueran propios.', 'Handshake', '/images/nosotros/valor-compromiso.png', 5);

-- ----------------------------------------------------------------------------
-- 5. content.who_we_are_concepts — los 3 conceptos de "Quiénes somos".
-- ----------------------------------------------------------------------------
CREATE TABLE content.who_we_are_concepts (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  uuid         UUID NOT NULL DEFAULT gen_random_uuid(),
  key          VARCHAR(50) NOT NULL UNIQUE,
  label        VARCHAR(100) NOT NULL,
  description  TEXT,
  sort_order   INT NOT NULL DEFAULT 1,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_by   BIGINT REFERENCES security.users(id) ON DELETE SET NULL,
  updated_by   BIGINT REFERENCES security.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE content.who_we_are_concepts IS 'Conceptos (Personas/Operación/Negocio) de la sección Quiénes somos en Nosotros — Etapa 7, tabla nueva, no existía.';

CREATE INDEX idx_who_we_are_concepts_active ON content.who_we_are_concepts(is_active);

INSERT INTO content.who_we_are_concepts (key, label, description, sort_order) VALUES
  ('personas', 'Personas', 'Equipos multidisciplinarios que ponen su conocimiento especializado al servicio de cada cliente.', 1),
  ('operacion', 'Operación', 'Acompañamiento en campo y en el día a día, donde el riesgo y la operación realmente ocurren.', 2),
  ('negocio', 'Negocio', 'Decisiones traducidas en valor: cumplimiento, continuidad y crecimiento para la organización.', 3);

-- ----------------------------------------------------------------------------
-- 6. security.permissions — permisos nuevos para los módulos de contenido
--    agregados en esta etapa (mismo patrón modulo.recurso.accion).
-- ----------------------------------------------------------------------------
INSERT INTO security.permissions (module, resource, action, permission_key, description) VALUES
  ('cms', 'home',     'read',   'cms.home.read',     'Ver el contenido institucional de Home y Nosotros'),
  ('cms', 'home',     'update', 'cms.home.update',   'Editar el contenido institucional de Home y Nosotros'),

  ('cms', 'hero',     'read',   'cms.hero.read',     'Ver los slides del carrusel principal de Home'),
  ('cms', 'hero',     'create', 'cms.hero.create',   'Crear slides del carrusel principal de Home'),
  ('cms', 'hero',     'update', 'cms.hero.update',   'Editar slides del carrusel principal de Home'),
  ('cms', 'hero',     'delete', 'cms.hero.delete',   'Eliminar slides del carrusel principal de Home'),

  ('cms', 'values',   'read',   'cms.values.read',   'Ver los valores corporativos'),
  ('cms', 'values',   'create', 'cms.values.create', 'Crear valores corporativos'),
  ('cms', 'values',   'update', 'cms.values.update', 'Editar valores corporativos'),
  ('cms', 'values',   'delete', 'cms.values.delete', 'Eliminar valores corporativos'),

  ('cms', 'concepts', 'read',   'cms.concepts.read',   'Ver los conceptos de Quiénes somos'),
  ('cms', 'concepts', 'create', 'cms.concepts.create', 'Crear conceptos de Quiénes somos'),
  ('cms', 'concepts', 'update', 'cms.concepts.update', 'Editar conceptos de Quiénes somos'),
  ('cms', 'concepts', 'delete', 'cms.concepts.delete', 'Eliminar conceptos de Quiénes somos');

-- Administrador: acceso total -> recibe también los 14 permisos nuevos.
INSERT INTO security.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM security.roles r
CROSS JOIN security.permissions p
WHERE r.name = 'Administrador'
  AND p.permission_key IN (
    'cms.home.read','cms.home.update',
    'cms.hero.read','cms.hero.create','cms.hero.update','cms.hero.delete',
    'cms.values.read','cms.values.create','cms.values.update','cms.values.delete',
    'cms.concepts.read','cms.concepts.create','cms.concepts.update','cms.concepts.delete'
  );

-- Editor: mismo alcance de "gestión de contenido" que ya tiene sobre
-- team/news/blog/services -> se le suma home/hero/values/concepts.
INSERT INTO security.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM security.roles r
CROSS JOIN security.permissions p
WHERE r.name = 'Editor'
  AND p.permission_key IN (
    'cms.home.read','cms.home.update',
    'cms.hero.read','cms.hero.create','cms.hero.update','cms.hero.delete',
    'cms.values.read','cms.values.create','cms.values.update','cms.values.delete',
    'cms.concepts.read','cms.concepts.create','cms.concepts.update','cms.concepts.delete'
  );

COMMIT;
