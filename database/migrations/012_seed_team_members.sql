BEGIN;

-- ============================================================
-- 012_seed_team_members.sql
-- Capital Consulting
-- Migración del equipo desde src/data/team.ts
-- ============================================================

-- ------------------------------------------------------------
-- 1. Jennifer Zuluaga
-- ------------------------------------------------------------
INSERT INTO content.team_members (
    name,
    position,
    bio,
    photo_url,
    sort_order,
    is_active,
    profession,
    area,
    service_code,
    specialties,
    certifications,
    certifications_label,
    is_transversal,
    org_level
)
SELECT
    'Jennifer Zuluaga',
    'Socia Fundadora',
    'Más de 15 años de experiencia en gestión financiera, contable, tributaria y administrativa.',
    '/images/nosotros/jennifer-zuluaga.jpeg',
    1,
    true,
    'Contadora Pública',
    'Dirección General',
    'capital-business-services',
    '[
        "Gestión financiera",
        "Gestión contable",
        "Gestión tributaria",
        "Gestión administrativa",
        "Organizaciones nacionales e internacionales",
        "Transformación empresarial",
        "Toma de decisiones",
        "Fortalecimiento empresarial",
        "Operaciones internacionales",
        "NIIF",
        "Tributación",
        "Régimen cambiario",
        "Gestión empresarial",
        "SG-SST",
        "Riesgo psicosocial"
    ]'::jsonb,
    NULL,
    NULL,
    false,
    1
WHERE NOT EXISTS (
    SELECT 1
    FROM content.team_members
    WHERE name = 'Jennifer Zuluaga'
);

-- ------------------------------------------------------------
-- 2. Jenny Sierra
-- ------------------------------------------------------------
INSERT INTO content.team_members (
    name,
    position,
    bio,
    photo_url,
    sort_order,
    is_active,
    profession,
    area,
    service_code,
    specialties,
    certifications,
    certifications_label,
    is_transversal,
    org_level
)
SELECT
    'Jenny Sierra',
    'Especialista en Seguridad y Salud en el Trabajo',
    'Especialista en Seguridad y Salud en el Trabajo y en Gerencia de Seguridad y Salud en el Trabajo. Más de 15 años de experiencia.',
    '/images/nosotros/jenny-sierra.jpeg',
    2,
    true,
    'Ingeniera Industrial',
    'Capital HSE',
    'capital-hse',
    '[
        "Gestión integral del riesgo",
        "Sistemas de gestión",
        "Cumplimiento normativo",
        "Oil & Gas",
        "Sector farmacéutico",
        "Seguridad física",
        "Transporte",
        "Tecnología",
        "Diseño e implementación",
        "Auditoría",
        "Seguimiento",
        "Mejora continua"
    ]'::jsonb,
    '[
        "ISO 9001",
        "ISO 14001",
        "ISO 45001",
        "ISO 39001"
    ]'::jsonb,
    'Auditora Líder',
    false,
    2
WHERE NOT EXISTS (
    SELECT 1
    FROM content.team_members
    WHERE name = 'Jenny Sierra'
);

-- ------------------------------------------------------------
-- 3. Manuel Mesa
-- ------------------------------------------------------------
INSERT INTO content.team_members (
    name,
    position,
    bio,
    photo_url,
    sort_order,
    is_active,
    profession,
    area,
    service_code,
    specialties,
    certifications,
    certifications_label,
    is_transversal,
    org_level
)
SELECT
    'Manuel Mesa',
    'Especialista en Gestión Financiera',
    'Especialista en Gestión Financiera.',
    '/images/nosotros/manuel-mesa.jpeg',
    3,
    true,
    'Administrador de Empresas',
    'Capital Business Services',
    'capital-business-services',
    '[
        "Direccionamiento estratégico",
        "Planeación",
        "Gestión administrativa",
        "Gestión financiera",
        "Optimización de recursos",
        "Eficiencia operacional",
        "Generación de valor",
        "Compras y abastecimiento",
        "Negociación con proveedores",
        "Capital humano",
        "Recursos organizacionales",
        "Sector industrial",
        "Oil & Gas",
        "Contratación y adquisición",
        "Negociación de bienes y servicios"
    ]'::jsonb,
    NULL,
    NULL,
    false,
    2
WHERE NOT EXISTS (
    SELECT 1
    FROM content.team_members
    WHERE name = 'Manuel Mesa'
);

-- ------------------------------------------------------------
-- 4. Felipe Reyes
-- ------------------------------------------------------------
INSERT INTO content.team_members (
    name,
    position,
    bio,
    photo_url,
    sort_order,
    is_active,
    profession,
    area,
    service_code,
    specialties,
    certifications,
    certifications_label,
    is_transversal,
    org_level
)
SELECT
    'Felipe Reyes',
    'Especialista en Seguridad y Salud en el Trabajo',
    'Profesional médico especialista en Seguridad y Salud en el Trabajo.',
    '/images/nosotros/felipe-reyes.jpeg',
    4,
    true,
    'Profesional médico',
    'Capital HSE',
    'capital-hse',
    '[
        "Gestión integral de salud laboral",
        "Prevención de riesgos",
        "Medicina preventiva",
        "Medicina del trabajo",
        "Vigilancia epidemiológica",
        "Promoción de la salud",
        "Prevención de enfermedades laborales",
        "Gestión de riesgos laborales"
    ]'::jsonb,
    NULL,
    NULL,
    false,
    3
WHERE NOT EXISTS (
    SELECT 1
    FROM content.team_members
    WHERE name = 'Felipe Reyes'
);

-- ------------------------------------------------------------
-- 5. Yuribel Rodríguez
-- ------------------------------------------------------------
INSERT INTO content.team_members (
    name,
    position,
    bio,
    photo_url,
    sort_order,
    is_active,
    profession,
    area,
    service_code,
    specialties,
    certifications,
    certifications_label,
    is_transversal,
    org_level
)
SELECT
    'Yuribel Rodríguez',
    'Key Account Manager',
    'Desarrollo estratégico de negocios y gestión de clientes corporativos, articulando las diferentes líneas de servicio de Capital Consulting.',
    '/images/nosotros/yuribel-rodriguez.jpeg',
    5,
    true,
    'Key Account Manager',
    'Gestión Comercial / Clientes',
    'capital-business-services',
    '[
        "Desarrollo estratégico de negocios",
        "Gestión de clientes corporativos",
        "Identificación de oportunidades",
        "Relaciones de largo plazo",
        "Crecimiento comercial",
        "Fidelización",
        "Generación de oportunidades",
        "Articulación de líneas de servicio"
    ]'::jsonb,
    NULL,
    NULL,
    true,
    3
WHERE NOT EXISTS (
    SELECT 1
    FROM content.team_members
    WHERE name = 'Yuribel Rodríguez'
);

-- ------------------------------------------------------------
-- 6. Javier Carrero
-- ------------------------------------------------------------
INSERT INTO content.team_members (
    name,
    position,
    bio,
    photo_url,
    sort_order,
    is_active,
    profession,
    area,
    service_code,
    specialties,
    certifications,
    certifications_label,
    is_transversal,
    org_level
)
SELECT
    'Javier Carrero',
    'Especialista en Derecho Laboral y Seguridad Social',
    'Abogado especialista en Derecho Laboral y Seguridad Social, Derecho Contractual y Relaciones Jurídico-Negociales, Derecho Constitucional y Conciliación en Derecho. Cuenta con amplia experiencia en asesoría y acompañamiento jurídico a empresas del sector privado en asuntos laborales, contractuales y comerciales.

Su experiencia comprende la asesoría en relaciones laborales, negociación y acompañamiento empresarial frente a organizaciones sindicales, así como el análisis y gestión de asuntos jurídicos orientados a la prevención de riesgos legales y la adecuada toma de decisiones empresariales.',
    '/images/nosotros/javier-carrero.jpeg',
    6,
    true,
    'Abogado',
    'Capital Business Services',
    'capital-business-services',
    '[
        "Derecho Laboral y Seguridad Social",
        "Derecho Contractual y Relaciones Jurídico-Negociales",
        "Derecho Constitucional",
        "Conciliación en Derecho",
        "Asesoría jurídica a empresas del sector privado",
        "Negociación y acompañamiento frente a organizaciones sindicales",
        "Prevención de riesgos legales"
    ]'::jsonb,
    NULL,
    NULL,
    false,
    2
WHERE NOT EXISTS (
    SELECT 1
    FROM content.team_members
    WHERE name = 'Javier Carrero'
);

-- ============================================================
-- Relaciones del organigrama
-- Jennifer → Jenny
-- Jennifer → Manuel
-- Jennifer → Felipe (curva derecha)
-- Jennifer → Yuribel (curva derecha)
-- Jennifer → Javier
-- ============================================================

UPDATE content.team_members child
SET
    parent_id = parent.id,
    connector_curve = NULL
FROM content.team_members parent
WHERE parent.name = 'Jennifer Zuluaga'
  AND child.name = 'Jenny Sierra';

UPDATE content.team_members child
SET
    parent_id = parent.id,
    connector_curve = NULL
FROM content.team_members parent
WHERE parent.name = 'Jennifer Zuluaga'
  AND child.name = 'Manuel Mesa';

UPDATE content.team_members child
SET
    parent_id = parent.id,
    connector_curve = 'right'
FROM content.team_members parent
WHERE parent.name = 'Jennifer Zuluaga'
  AND child.name = 'Felipe Reyes';

UPDATE content.team_members child
SET
    parent_id = parent.id,
    connector_curve = 'right'
FROM content.team_members parent
WHERE parent.name = 'Jennifer Zuluaga'
  AND child.name = 'Yuribel Rodríguez';

UPDATE content.team_members child
SET
    parent_id = parent.id,
    connector_curve = NULL
FROM content.team_members parent
WHERE parent.name = 'Jennifer Zuluaga'
  AND child.name = 'Javier Carrero';

COMMIT;