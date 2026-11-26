BEGIN;

-- ============================================================
-- 013_seed_catalog_services.sql
-- Capital Consulting
-- Semillas oficiales del catálogo de servicios
-- ============================================================

INSERT INTO catalog.services (
    code,
    name,
    short_description,
    description,
    is_featured,
    is_active,
    sort_order
)
VALUES
(
    'capital-business-services',
    'Capital Business Services',
    'Servicios administrativos y de negocio.',
    'Servicios administrativos y de negocio.',
    false,
    true,
    1
),
(
    'capital-hse',
    'Capital HSE',
    'Seguridad, salud y medio ambiente.',
    'Seguridad, salud y medio ambiente.',
    false,
    true,
    2
),
(
    'capital-learning',
    'Capital Learning',
    'Formación y desarrollo de talento.',
    'Formación y desarrollo de talento.',
    false,
    true,
    3
),
(
    'capital-mobility',
    'Capital Mobility',
    'Soluciones para el sector transporte.',
    'Soluciones para el sector transporte.',
    false,
    true,
    4
),
(
    'capital-staffing',
    'Capital Staffing',
    'Dotación y gestión de personal.',
    'Dotación y gestión de personal.',
    false,
    true,
    5
)
ON CONFLICT (code) DO NOTHING;

COMMIT;