-- ============================================================================
-- ETAPA 8 — Conectar el sitio público a la API real (parte 1: Organigrama)
-- Proyecto : Capital Consulting and Services S.A.S.
-- Archivo  : 007_team_members_seed_and_public_content.sql
-- Objetivo : sembrar en `content.team_members` los integrantes reales del
--            equipo (src/data/team.ts) para poder conectar la sección
--            Organigrama de /about a la API real sin que el sitio público
--            se quede sin contenido (la tabla llevaba 0 filas desde que se
--            creó en la Etapa 5 — nunca se había migrado la data real).
--
-- Se siembran los 6 integrantes ACTIVOS que hoy se muestran en producción.
-- Quedan fuera, a propósito, dos registros de `src/data/team.ts` que no son
-- datos reales activos:
--   - Julio Betín: está comentado en el código fuente (no se renderiza hoy).
--   - "Socia Co-Fundadora": placeholder reservado con todos los campos
--     vacíos (`isActive: false`) para un cargo aún sin ocupar — no es un
--     dato real, es una intención futura. Sembrar una fila vacía violaría
--     la regla de no fabricar datos; se deja fuera de la base hasta que
--     exista una persona real que lo ocupe.
--
-- La jerarquía (parent_id) se resuelve con subconsultas por nombre en vez
-- de CTEs (el runner de migraciones de este proyecto ejecuta statement por
-- statement con `$executeRawUnsafe`, sin estado compartido entre
-- statements) — jennifer-zuluaga se inserta primero sin padre, y cada
-- integrante siguiente referencia su id con
-- `(SELECT id FROM content.team_members WHERE name = 'Jennifer Zuluaga')`.
--
-- Seguridad de la operación: solo INSERT. No se toca ninguna fila ni tabla
-- existente (content.team_members estaba vacía). Reversible con DELETE por
-- nombre si hiciera falta.
-- ============================================================================

BEGIN;

-- 1. Jennifer Zuluaga — Socia Fundadora, raíz del organigrama.
INSERT INTO content.team_members (
  name, position, bio, photo_url, sort_order, is_active,
  profession, area, service_code, specialties, org_level
) VALUES (
  'Jennifer Zuluaga', 'Socia Fundadora',
  'Más de 15 años de experiencia en gestión financiera, contable, tributaria y administrativa.',
  '/images/nosotros/jennifer-zuluaga.jpeg', 1, true,
  'Contadora Pública', 'Dirección General', 'capital-business-services',
  '["Gestión financiera","Gestión contable","Gestión tributaria","Gestión administrativa","Organizaciones nacionales e internacionales","Transformación empresarial","Toma de decisiones","Fortalecimiento empresarial","Operaciones internacionales","NIIF","Tributación","Régimen cambiario","Gestión empresarial","SG-SST","Riesgo psicosocial"]'::jsonb,
  1
);

-- 2. Jenny Sierra — nivel 2, depende de Jennifer.
INSERT INTO content.team_members (
  name, position, bio, photo_url, sort_order, is_active,
  profession, area, service_code, specialties, certifications, certifications_label,
  org_level, parent_id
) VALUES (
  'Jenny Sierra', 'Especialista en Seguridad y Salud en el Trabajo',
  'Especialista en Seguridad y Salud en el Trabajo y en Gerencia de Seguridad y Salud en el Trabajo. Más de 15 años de experiencia.',
  '/images/nosotros/jenny-sierra.jpeg', 2, true,
  'Ingeniera Industrial', 'Capital HSE', 'capital-hse',
  '["Gestión integral del riesgo","Sistemas de gestión","Cumplimiento normativo","Oil & Gas","Sector farmacéutico","Seguridad física","Transporte","Tecnología","Diseño e implementación","Auditoría","Seguimiento","Mejora continua"]'::jsonb,
  '["ISO 9001","ISO 14001","ISO 45001","ISO 39001"]'::jsonb, 'Auditora Líder',
  2, (SELECT id FROM content.team_members WHERE name = 'Jennifer Zuluaga')
);

-- 3. Manuel Mesa — nivel 2, depende de Jennifer.
INSERT INTO content.team_members (
  name, position, bio, photo_url, sort_order, is_active,
  profession, area, service_code, specialties, org_level, parent_id
) VALUES (
  'Manuel Mesa', 'Especialista en Gestión Financiera',
  'Especialista en Gestión Financiera.',
  '/images/nosotros/manuel-mesa.jpeg', 3, true,
  'Administrador de Empresas', 'Capital Business Services', 'capital-business-services',
  '["Direccionamiento estratégico","Planeación","Gestión administrativa","Gestión financiera","Optimización de recursos","Eficiencia operacional","Generación de valor","Compras y abastecimiento","Negociación con proveedores","Capital humano","Recursos organizacionales","Sector industrial","Oil & Gas","Contratación y adquisición","Negociación de bienes y servicios"]'::jsonb,
  2, (SELECT id FROM content.team_members WHERE name = 'Jennifer Zuluaga')
);

-- 4. Felipe Reyes — nivel 3, depende de Jennifer, conector curvo a la derecha.
INSERT INTO content.team_members (
  name, position, bio, photo_url, sort_order, is_active,
  profession, area, service_code, specialties, org_level, parent_id, connector_curve
) VALUES (
  'Felipe Reyes', 'Especialista en Seguridad y Salud en el Trabajo',
  'Profesional médico especialista en Seguridad y Salud en el Trabajo.',
  '/images/nosotros/felipe-reyes.jpeg', 4, true,
  'Profesional médico', 'Capital HSE', 'capital-hse',
  '["Gestión integral de salud laboral","Prevención de riesgos","Medicina preventiva","Medicina del trabajo","Vigilancia epidemiológica","Promoción de la salud","Prevención de enfermedades laborales","Gestión de riesgos laborales"]'::jsonb,
  3, (SELECT id FROM content.team_members WHERE name = 'Jennifer Zuluaga'), 'right'
);

-- 5. Yuribel Rodríguez — nivel 3, transversal, depende de Jennifer, conector curvo a la derecha.
INSERT INTO content.team_members (
  name, position, bio, photo_url, sort_order, is_active,
  profession, area, service_code, specialties, is_transversal, org_level, parent_id, connector_curve
) VALUES (
  'Yuribel Rodríguez', 'Key Account Manager',
  'Desarrollo estratégico de negocios y gestión de clientes corporativos, articulando las diferentes líneas de servicio de Capital Consulting.',
  '/images/nosotros/yuribel-rodriguez.jpeg', 5, true,
  'Key Account Manager', 'Gestión Comercial / Clientes', 'capital-business-services',
  '["Desarrollo estratégico de negocios","Gestión de clientes corporativos","Identificación de oportunidades","Relaciones de largo plazo","Crecimiento comercial","Fidelización","Generación de oportunidades","Articulación de líneas de servicio"]'::jsonb,
  true, 3, (SELECT id FROM content.team_members WHERE name = 'Jennifer Zuluaga'), 'right'
);

-- 6. Javier Carrero — nivel 2, depende de Jennifer.
INSERT INTO content.team_members (
  name, position, bio, photo_url, sort_order, is_active,
  profession, area, service_code, specialties, org_level, parent_id
) VALUES (
  'Javier Carrero', 'Especialista en Derecho Laboral y Seguridad Social',
  E'Abogado especialista en Derecho Laboral y Seguridad Social, Derecho Contractual y Relaciones Jurídico-Negociales, Derecho Constitucional y Conciliación en Derecho. Cuenta con amplia experiencia en asesoría y acompañamiento jurídico a empresas del sector privado en asuntos laborales, contractuales y comerciales.\n\nSu experiencia comprende la asesoría en relaciones laborales, negociación y acompañamiento empresarial frente a organizaciones sindicales, así como el análisis y gestión de asuntos jurídicos orientados a la prevención de riesgos legales y la adecuada toma de decisiones empresariales.',
  '/images/nosotros/javier-carrero.jpeg', 6, true,
  'Abogado', 'Capital Business Services', 'capital-business-services',
  '["Derecho Laboral y Seguridad Social","Derecho Contractual y Relaciones Jurídico-Negociales","Derecho Constitucional","Conciliación en Derecho","Asesoría jurídica a empresas del sector privado","Negociación y acompañamiento frente a organizaciones sindicales","Prevención de riesgos legales"]'::jsonb,
  2, (SELECT id FROM content.team_members WHERE name = 'Jennifer Zuluaga')
);

COMMIT;
