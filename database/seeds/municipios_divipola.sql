-- =====================================================
-- DIVIPOLA MGN 2025 - MUNICIPIOS DE COLOMBIA
-- Fuente: DANE
-- Generado automáticamente
-- =====================================================


BEGIN;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MEDELLÍN',
    '05001',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ABEJORRAL',
    '05002',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ABRIAQUÍ',
    '05004',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ALEJANDRÍA',
    '05021',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'AMAGÁ',
    '05030',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'AMALFI',
    '05031',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ANDES',
    '05034',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ANGELÓPOLIS',
    '05036',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ANGOSTURA',
    '05038',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ANORÍ',
    '05040',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTA FÉ DE ANTIOQUIA',
    '05042',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ANZÁ',
    '05044',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'APARTADÓ',
    '05045',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ARBOLETES',
    '05051',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ARGELIA',
    '05055',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ARMENIA',
    '05059',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BARBOSA',
    '05079',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BELMIRA',
    '05086',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BELLO',
    '05088',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BETANIA',
    '05091',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BETULIA',
    '05093',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CIUDAD BOLÍVAR',
    '05101',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BRICEÑO',
    '05107',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BURITICÁ',
    '05113',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CÁCERES',
    '05120',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CAICEDO',
    '05125',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CALDAS',
    '05129',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CAMPAMENTO',
    '05134',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CAÑASGORDAS',
    '05138',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CARACOLÍ',
    '05142',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CARAMANTA',
    '05145',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CAREPA',
    '05147',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL CARMEN DE VIBORAL',
    '05148',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CAROLINA',
    '05150',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CAUCASIA',
    '05154',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHIGORODÓ',
    '05172',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CISNEROS',
    '05190',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'COCORNÁ',
    '05197',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CONCEPCIÓN',
    '05206',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CONCORDIA',
    '05209',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'COPACABANA',
    '05212',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'DABEIBA',
    '05234',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'DONMATÍAS',
    '05237',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EBÉJICO',
    '05240',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL BAGRE',
    '05250',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ENTRERRÍOS',
    '05264',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ENVIGADO',
    '05266',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FREDONIA',
    '05282',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FRONTINO',
    '05284',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GIRALDO',
    '05306',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GIRARDOTA',
    '05308',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GÓMEZ PLATA',
    '05310',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GRANADA',
    '05313',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUADALUPE',
    '05315',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUARNE',
    '05318',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUATAPÉ',
    '05321',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'HELICONIA',
    '05347',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'HISPANIA',
    '05353',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ITAGÜÍ',
    '05360',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ITUANGO',
    '05361',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'JARDÍN',
    '05364',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'JERICÓ',
    '05368',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA CEJA',
    '05376',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA ESTRELLA',
    '05380',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA PINTADA',
    '05390',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA UNIÓN',
    '05400',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LIBORINA',
    '05411',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MACEO',
    '05425',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MARINILLA',
    '05440',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MONTEBELLO',
    '05467',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MURINDÓ',
    '05475',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MUTATÁ',
    '05480',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'NARIÑO',
    '05483',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'NECOCLÍ',
    '05490',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'NECHÍ',
    '05495',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'OLAYA',
    '05501',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PEÑOL',
    '05541',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PEQUE',
    '05543',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUEBLORRICO',
    '05576',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO BERRÍO',
    '05579',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO NARE',
    '05585',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO TRIUNFO',
    '05591',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'REMEDIOS',
    '05604',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RETIRO',
    '05607',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RIONEGRO',
    '05615',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SABANALARGA',
    '05628',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SABANETA',
    '05631',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SALGAR',
    '05642',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN ANDRÉS DE CUERQUÍA',
    '05647',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN CARLOS',
    '05649',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN FRANCISCO',
    '05652',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN JERÓNIMO',
    '05656',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN JOSÉ DE LA MONTAÑA',
    '05658',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN JUAN DE URABÁ',
    '05659',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN LUIS',
    '05660',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN PEDRO DE LOS MILAGROS',
    '05664',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN PEDRO DE URABÁ',
    '05665',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN RAFAEL',
    '05667',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN ROQUE',
    '05670',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN VICENTE FERRER',
    '05674',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTA BÁRBARA',
    '05679',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTA ROSA DE OSOS',
    '05686',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTO DOMINGO',
    '05690',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL SANTUARIO',
    '05697',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SEGOVIA',
    '05736',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SONSÓN',
    '05756',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SOPETRÁN',
    '05761',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TÁMESIS',
    '05789',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TARAZÁ',
    '05790',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TARSO',
    '05792',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TITIRIBÍ',
    '05809',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TOLEDO',
    '05819',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TURBO',
    '05837',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'URAMITA',
    '05842',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'URRAO',
    '05847',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VALDIVIA',
    '05854',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VALPARAÍSO',
    '05856',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VEGACHÍ',
    '05858',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VENECIA',
    '05861',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VIGÍA DEL FUERTE',
    '05873',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'YALÍ',
    '05885',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'YARUMAL',
    '05887',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'YOLOMBÓ',
    '05890',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'YONDÓ',
    '05893',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ZARAGOZA',
    '05895',
    true
FROM core.states s
WHERE s.divipola_code = '05'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BARRANQUILLA',
    '08001',
    true
FROM core.states s
WHERE s.divipola_code = '08'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BARANOA',
    '08078',
    true
FROM core.states s
WHERE s.divipola_code = '08'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CAMPO DE LA CRUZ',
    '08137',
    true
FROM core.states s
WHERE s.divipola_code = '08'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CANDELARIA',
    '08141',
    true
FROM core.states s
WHERE s.divipola_code = '08'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GALAPA',
    '08296',
    true
FROM core.states s
WHERE s.divipola_code = '08'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'JUAN DE ACOSTA',
    '08372',
    true
FROM core.states s
WHERE s.divipola_code = '08'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LURUACO',
    '08421',
    true
FROM core.states s
WHERE s.divipola_code = '08'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MALAMBO',
    '08433',
    true
FROM core.states s
WHERE s.divipola_code = '08'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MANATÍ',
    '08436',
    true
FROM core.states s
WHERE s.divipola_code = '08'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PALMAR DE VARELA',
    '08520',
    true
FROM core.states s
WHERE s.divipola_code = '08'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PIOJÓ',
    '08549',
    true
FROM core.states s
WHERE s.divipola_code = '08'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'POLONUEVO',
    '08558',
    true
FROM core.states s
WHERE s.divipola_code = '08'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PONEDERA',
    '08560',
    true
FROM core.states s
WHERE s.divipola_code = '08'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO COLOMBIA',
    '08573',
    true
FROM core.states s
WHERE s.divipola_code = '08'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'REPELÓN',
    '08606',
    true
FROM core.states s
WHERE s.divipola_code = '08'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SABANAGRANDE',
    '08634',
    true
FROM core.states s
WHERE s.divipola_code = '08'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SABANALARGA',
    '08638',
    true
FROM core.states s
WHERE s.divipola_code = '08'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTA LUCÍA',
    '08675',
    true
FROM core.states s
WHERE s.divipola_code = '08'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTO TOMÁS',
    '08685',
    true
FROM core.states s
WHERE s.divipola_code = '08'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SOLEDAD',
    '08758',
    true
FROM core.states s
WHERE s.divipola_code = '08'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SUAN',
    '08770',
    true
FROM core.states s
WHERE s.divipola_code = '08'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TUBARÁ',
    '08832',
    true
FROM core.states s
WHERE s.divipola_code = '08'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'USIACURÍ',
    '08849',
    true
FROM core.states s
WHERE s.divipola_code = '08'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BOGOTÁ, D.C.',
    '11001',
    true
FROM core.states s
WHERE s.divipola_code = '11'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CARTAGENA DE INDIAS',
    '13001',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ACHÍ',
    '13006',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ALTOS DEL ROSARIO',
    '13030',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ARENAL',
    '13042',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ARJONA',
    '13052',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ARROYOHONDO',
    '13062',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BARRANCO DE LOBA',
    '13074',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CALAMAR',
    '13140',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CANTAGALLO',
    '13160',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CICUCO',
    '13188',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CÓRDOBA',
    '13212',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CLEMENCIA',
    '13222',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL CARMEN DE BOLÍVAR',
    '13244',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL GUAMO',
    '13248',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL PEÑÓN',
    '13268',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'HATILLO DE LOBA',
    '13300',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MAGANGUÉ',
    '13430',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MAHATES',
    '13433',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MARGARITA',
    '13440',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MARÍA LA BAJA',
    '13442',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MONTECRISTO',
    '13458',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTA CRUZ DE MOMPOX',
    '13468',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MORALES',
    '13473',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'NOROSÍ',
    '13490',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PINILLOS',
    '13549',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'REGIDOR',
    '13580',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RÍO VIEJO',
    '13600',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN CRISTÓBAL',
    '13620',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN ESTANISLAO',
    '13647',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN FERNANDO',
    '13650',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN JACINTO',
    '13654',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN JACINTO DEL CAUCA',
    '13655',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN JUAN NEPOMUCENO',
    '13657',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN MARTÍN DE LOBA',
    '13667',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN PABLO',
    '13670',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTA CATALINA',
    '13673',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTA ROSA',
    '13683',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTA ROSA DEL SUR',
    '13688',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SIMITÍ',
    '13744',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SOPLAVIENTO',
    '13760',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TALAIGUA NUEVO',
    '13780',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TIQUISIO',
    '13810',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TURBACO',
    '13836',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TURBANA',
    '13838',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VILLANUEVA',
    '13873',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ZAMBRANO',
    '13894',
    true
FROM core.states s
WHERE s.divipola_code = '13'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TUNJA',
    '15001',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ALMEIDA',
    '15022',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'AQUITANIA',
    '15047',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ARCABUCO',
    '15051',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BELÉN',
    '15087',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BERBEO',
    '15090',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BETÉITIVA',
    '15092',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BOAVITA',
    '15097',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BOYACÁ',
    '15104',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BRICEÑO',
    '15106',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BUENAVISTA',
    '15109',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BUSBANZÁ',
    '15114',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CALDAS',
    '15131',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CAMPOHERMOSO',
    '15135',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CERINZA',
    '15162',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHINAVITA',
    '15172',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHIQUINQUIRÁ',
    '15176',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHISCAS',
    '15180',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHITA',
    '15183',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHITARAQUE',
    '15185',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHIVATÁ',
    '15187',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CIÉNEGA',
    '15189',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CÓMBITA',
    '15204',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'COPER',
    '15212',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CORRALES',
    '15215',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'COVARACHÍA',
    '15218',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CUBARÁ',
    '15223',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CUCAITA',
    '15224',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CUÍTIVA',
    '15226',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHÍQUIZA',
    '15232',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHIVOR',
    '15236',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'DUITAMA',
    '15238',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL COCUY',
    '15244',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL ESPINO',
    '15248',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FIRAVITOBA',
    '15272',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FLORESTA',
    '15276',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GACHANTIVÁ',
    '15293',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GÁMEZA',
    '15296',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GARAGOA',
    '15299',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUACAMAYAS',
    '15317',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUATEQUE',
    '15322',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUAYATÁ',
    '15325',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GÜICÁN DE LA SIERRA',
    '15332',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'IZA',
    '15362',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'JENESANO',
    '15367',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'JERICÓ',
    '15368',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LABRANZAGRANDE',
    '15377',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA CAPILLA',
    '15380',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA VICTORIA',
    '15401',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA UVITA',
    '15403',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VILLA DE LEYVA',
    '15407',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MACANAL',
    '15425',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MARIPÍ',
    '15442',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MIRAFLORES',
    '15455',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MONGUA',
    '15464',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MONGUÍ',
    '15466',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MONIQUIRÁ',
    '15469',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MOTAVITA',
    '15476',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MUZO',
    '15480',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'NOBSA',
    '15491',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'NUEVO COLÓN',
    '15494',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'OICATÁ',
    '15500',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'OTANCHE',
    '15507',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PACHAVITA',
    '15511',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PÁEZ',
    '15514',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PAIPA',
    '15516',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PAJARITO',
    '15518',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PANQUEBA',
    '15522',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PAUNA',
    '15531',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PAYA',
    '15533',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PAZ DE RÍO',
    '15537',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PESCA',
    '15542',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PISBA',
    '15550',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO BOYACÁ',
    '15572',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'QUÍPAMA',
    '15580',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RAMIRIQUÍ',
    '15599',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RÁQUIRA',
    '15600',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RONDÓN',
    '15621',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SABOYÁ',
    '15632',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SÁCHICA',
    '15638',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAMACÁ',
    '15646',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN EDUARDO',
    '15660',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN JOSÉ DE PARE',
    '15664',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN LUIS DE GACENO',
    '15667',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN MATEO',
    '15673',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN MIGUEL DE SEMA',
    '15676',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN PABLO DE BORBUR',
    '15681',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTANA',
    '15686',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTA MARÍA',
    '15690',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTA ROSA DE VITERBO',
    '15693',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTA SOFÍA',
    '15696',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SATIVANORTE',
    '15720',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SATIVASUR',
    '15723',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SIACHOQUE',
    '15740',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SOATÁ',
    '15753',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SOCOTÁ',
    '15755',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SOCHA',
    '15757',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SOGAMOSO',
    '15759',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SOMONDOCO',
    '15761',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SORA',
    '15762',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SOTAQUIRÁ',
    '15763',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SORACÁ',
    '15764',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SUSACÓN',
    '15774',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SUTAMARCHÁN',
    '15776',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SUTATENZA',
    '15778',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TASCO',
    '15790',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TENZA',
    '15798',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TIBANÁ',
    '15804',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TIBASOSA',
    '15806',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TINJACÁ',
    '15808',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TIPACOQUE',
    '15810',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TOCA',
    '15814',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TOGÜÍ',
    '15816',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TÓPAGA',
    '15820',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TOTA',
    '15822',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TUNUNGUÁ',
    '15832',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TURMEQUÉ',
    '15835',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TUTA',
    '15837',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TUTAZÁ',
    '15839',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ÚMBITA',
    '15842',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VENTAQUEMADA',
    '15861',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VIRACACHÁ',
    '15879',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ZETAQUIRA',
    '15897',
    true
FROM core.states s
WHERE s.divipola_code = '15'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MANIZALES',
    '17001',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'AGUADAS',
    '17013',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ANSERMA',
    '17042',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ARANZAZU',
    '17050',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BELALCÁZAR',
    '17088',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHINCHINÁ',
    '17174',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FILADELFIA',
    '17272',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA DORADA',
    '17380',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA MERCED',
    '17388',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MANZANARES',
    '17433',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MARMATO',
    '17442',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MARQUETALIA',
    '17444',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MARULANDA',
    '17446',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'NEIRA',
    '17486',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'NORCASIA',
    '17495',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PÁCORA',
    '17513',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PALESTINA',
    '17524',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PENSILVANIA',
    '17541',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RIOSUCIO',
    '17614',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RISARALDA',
    '17616',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SALAMINA',
    '17653',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAMANÁ',
    '17662',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN JOSÉ',
    '17665',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SUPÍA',
    '17777',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VICTORIA',
    '17867',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VILLAMARÍA',
    '17873',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VITERBO',
    '17877',
    true
FROM core.states s
WHERE s.divipola_code = '17'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FLORENCIA',
    '18001',
    true
FROM core.states s
WHERE s.divipola_code = '18'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ALBANIA',
    '18029',
    true
FROM core.states s
WHERE s.divipola_code = '18'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BELÉN DE LOS ANDAQUÍES',
    '18094',
    true
FROM core.states s
WHERE s.divipola_code = '18'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CARTAGENA DEL CHAIRÁ',
    '18150',
    true
FROM core.states s
WHERE s.divipola_code = '18'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CURILLO',
    '18205',
    true
FROM core.states s
WHERE s.divipola_code = '18'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL DONCELLO',
    '18247',
    true
FROM core.states s
WHERE s.divipola_code = '18'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL PAUJÍL',
    '18256',
    true
FROM core.states s
WHERE s.divipola_code = '18'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA MONTAÑITA',
    '18410',
    true
FROM core.states s
WHERE s.divipola_code = '18'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MILÁN',
    '18460',
    true
FROM core.states s
WHERE s.divipola_code = '18'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MORELIA',
    '18479',
    true
FROM core.states s
WHERE s.divipola_code = '18'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO RICO',
    '18592',
    true
FROM core.states s
WHERE s.divipola_code = '18'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN JOSÉ DEL FRAGUA',
    '18610',
    true
FROM core.states s
WHERE s.divipola_code = '18'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN VICENTE DEL CAGUÁN',
    '18753',
    true
FROM core.states s
WHERE s.divipola_code = '18'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SOLANO',
    '18756',
    true
FROM core.states s
WHERE s.divipola_code = '18'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SOLITA',
    '18785',
    true
FROM core.states s
WHERE s.divipola_code = '18'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VALPARAÍSO',
    '18860',
    true
FROM core.states s
WHERE s.divipola_code = '18'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'POPAYÁN',
    '19001',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ALMAGUER',
    '19022',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ARGELIA',
    '19050',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BALBOA',
    '19075',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BOLÍVAR',
    '19100',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BUENOS AIRES',
    '19110',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CAJIBÍO',
    '19130',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CALDONO',
    '19137',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CALOTO',
    '19142',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CORINTO',
    '19212',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL TAMBO',
    '19256',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FLORENCIA',
    '19290',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUACHENÉ',
    '19300',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUAPI',
    '19318',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'INZÁ',
    '19355',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'JAMBALÓ',
    '19364',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA SIERRA',
    '19392',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA VEGA',
    '19397',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LÓPEZ DE MICAY',
    '19418',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MERCADERES',
    '19450',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MIRANDA',
    '19455',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MORALES',
    '19473',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PADILLA',
    '19513',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PÁEZ',
    '19517',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PATÍA',
    '19532',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PIAMONTE',
    '19533',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PIENDAMÓ - TUNÍA',
    '19548',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO TEJADA',
    '19573',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PURACÉ',
    '19585',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ROSAS',
    '19622',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN SEBASTIÁN',
    '19693',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTANDER DE QUILICHAO',
    '19698',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTA ROSA',
    '19701',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SILVIA',
    '19743',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SOTARÁ PAISPAMBA',
    '19760',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SUÁREZ',
    '19780',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SUCRE',
    '19785',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TIMBÍO',
    '19807',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TIMBIQUÍ',
    '19809',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TORIBÍO',
    '19821',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TOTORÓ',
    '19824',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VILLA RICA',
    '19845',
    true
FROM core.states s
WHERE s.divipola_code = '19'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VALLEDUPAR',
    '20001',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'AGUACHICA',
    '20011',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'AGUSTÍN CODAZZI',
    '20013',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ASTREA',
    '20032',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BECERRIL',
    '20045',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BOSCONIA',
    '20060',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHIMICHAGUA',
    '20175',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHIRIGUANÁ',
    '20178',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CURUMANÍ',
    '20228',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL COPEY',
    '20238',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL PASO',
    '20250',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GAMARRA',
    '20295',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GONZÁLEZ',
    '20310',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA GLORIA',
    '20383',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA JAGUA DE IBIRICO',
    '20400',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MANAURE BALCÓN DEL CESAR',
    '20443',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PAILITAS',
    '20517',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PELAYA',
    '20550',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUEBLO BELLO',
    '20570',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RÍO DE ORO',
    '20614',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA PAZ',
    '20621',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN ALBERTO',
    '20710',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN DIEGO',
    '20750',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN MARTÍN',
    '20770',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TAMALAMEQUE',
    '20787',
    true
FROM core.states s
WHERE s.divipola_code = '20'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MONTERÍA',
    '23001',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'AYAPEL',
    '23068',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BUENAVISTA',
    '23079',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CANALETE',
    '23090',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CERETÉ',
    '23162',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHIMÁ',
    '23168',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHINÚ',
    '23182',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CIÉNAGA DE ORO',
    '23189',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'COTORRA',
    '23300',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA APARTADA',
    '23350',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LORICA',
    '23417',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LOS CÓRDOBAS',
    '23419',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MOMIL',
    '23464',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MONTELÍBANO',
    '23466',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MOÑITOS',
    '23500',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PLANETA RICA',
    '23555',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUEBLO NUEVO',
    '23570',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO ESCONDIDO',
    '23574',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO LIBERTADOR',
    '23580',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PURÍSIMA DE LA CONCEPCIÓN',
    '23586',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAHAGÚN',
    '23660',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN ANDRÉS DE SOTAVENTO',
    '23670',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN ANTERO',
    '23672',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN BERNARDO DEL VIENTO',
    '23675',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN CARLOS',
    '23678',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN JOSÉ DE URÉ',
    '23682',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN PELAYO',
    '23686',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TIERRALTA',
    '23807',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TUCHÍN',
    '23815',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VALENCIA',
    '23855',
    true
FROM core.states s
WHERE s.divipola_code = '23'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'AGUA DE DIOS',
    '25001',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ALBÁN',
    '25019',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ANAPOIMA',
    '25035',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ANOLAIMA',
    '25040',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ARBELÁEZ',
    '25053',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BELTRÁN',
    '25086',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BITUIMA',
    '25095',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BOJACÁ',
    '25099',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CABRERA',
    '25120',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CACHIPAY',
    '25123',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CAJICÁ',
    '25126',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CAPARRAPÍ',
    '25148',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CÁQUEZA',
    '25151',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CARMEN DE CARUPA',
    '25154',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHAGUANÍ',
    '25168',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHÍA',
    '25175',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHIPAQUE',
    '25178',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHOACHÍ',
    '25181',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHOCONTÁ',
    '25183',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'COGUA',
    '25200',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'COTA',
    '25214',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CUCUNUBÁ',
    '25224',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL COLEGIO',
    '25245',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL PEÑÓN',
    '25258',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL ROSAL',
    '25260',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FACATATIVÁ',
    '25269',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FÓMEQUE',
    '25279',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FOSCA',
    '25281',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FUNZA',
    '25286',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FÚQUENE',
    '25288',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FUSAGASUGÁ',
    '25290',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GACHALÁ',
    '25293',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GACHANCIPÁ',
    '25295',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GACHETÁ',
    '25297',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GAMA',
    '25299',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GIRARDOT',
    '25307',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GRANADA',
    '25312',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUACHETÁ',
    '25317',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUADUAS',
    '25320',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUASCA',
    '25322',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUATAQUÍ',
    '25324',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUATAVITA',
    '25326',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUAYABAL DE SÍQUIMA',
    '25328',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUAYABETAL',
    '25335',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUTIÉRREZ',
    '25339',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'JERUSALÉN',
    '25368',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'JUNÍN',
    '25372',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA CALERA',
    '25377',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA MESA',
    '25386',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA PALMA',
    '25394',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA PEÑA',
    '25398',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA VEGA',
    '25402',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LENGUAZAQUE',
    '25407',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MACHETÁ',
    '25426',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MADRID',
    '25430',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MANTA',
    '25436',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MEDINA',
    '25438',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MOSQUERA',
    '25473',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'NARIÑO',
    '25483',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'NEMOCÓN',
    '25486',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'NILO',
    '25488',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'NIMAIMA',
    '25489',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'NOCAIMA',
    '25491',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VENECIA',
    '25506',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PACHO',
    '25513',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PAIME',
    '25518',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PANDI',
    '25524',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PARATEBUENO',
    '25530',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PASCA',
    '25535',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO SALGAR',
    '25572',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PULÍ',
    '25580',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'QUEBRADANEGRA',
    '25592',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'QUETAME',
    '25594',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'QUIPILE',
    '25596',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'APULO',
    '25599',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RICAURTE',
    '25612',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN ANTONIO DEL TEQUENDAMA',
    '25645',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN BERNARDO',
    '25649',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN CAYETANO',
    '25653',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN FRANCISCO',
    '25658',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN JUAN DE RIOSECO',
    '25662',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SASAIMA',
    '25718',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SESQUILÉ',
    '25736',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SIBATÉ',
    '25740',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SILVANIA',
    '25743',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SIMIJACA',
    '25745',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SOACHA',
    '25754',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SOPÓ',
    '25758',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SUBACHOQUE',
    '25769',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SUESCA',
    '25772',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SUPATÁ',
    '25777',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SUSA',
    '25779',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SUTATAUSA',
    '25781',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TABIO',
    '25785',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TAUSA',
    '25793',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TENA',
    '25797',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TENJO',
    '25799',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TIBACUY',
    '25805',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TIBIRITA',
    '25807',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TOCAIMA',
    '25815',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TOCANCIPÁ',
    '25817',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TOPAIPÍ',
    '25823',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'UBALÁ',
    '25839',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'UBAQUE',
    '25841',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VILLA DE SAN DIEGO DE UBATÉ',
    '25843',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'UNE',
    '25845',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ÚTICA',
    '25851',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VERGARA',
    '25862',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VIANÍ',
    '25867',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VILLAGÓMEZ',
    '25871',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VILLAPINZÓN',
    '25873',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VILLETA',
    '25875',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VIOTÁ',
    '25878',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'YACOPÍ',
    '25885',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ZIPACÓN',
    '25898',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ZIPAQUIRÁ',
    '25899',
    true
FROM core.states s
WHERE s.divipola_code = '25'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'QUIBDÓ',
    '27001',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ACANDÍ',
    '27006',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ALTO BAUDÓ',
    '27025',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ATRATO',
    '27050',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BAGADÓ',
    '27073',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BAHÍA SOLANO',
    '27075',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BAJO BAUDÓ',
    '27077',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BOJAYÁ',
    '27099',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL CANTÓN DEL SAN PABLO',
    '27135',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CARMEN DEL DARIÉN',
    '27150',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CÉRTEGUI',
    '27160',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CONDOTO',
    '27205',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL CARMEN DE ATRATO',
    '27245',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL LITORAL DEL SAN JUAN',
    '27250',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ISTMINA',
    '27361',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'JURADÓ',
    '27372',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LLORÓ',
    '27413',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MEDIO ATRATO',
    '27425',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MEDIO BAUDÓ',
    '27430',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MEDIO SAN JUAN',
    '27450',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'NÓVITA',
    '27491',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'NUEVO BELÉN DE BAJIRÁ',
    '27493',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'NUQUÍ',
    '27495',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RÍO IRÓ',
    '27580',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RÍO QUITO',
    '27600',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RIOSUCIO',
    '27615',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN JOSÉ DEL PALMAR',
    '27660',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SIPÍ',
    '27745',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TADÓ',
    '27787',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'UNGUÍA',
    '27800',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'UNIÓN PANAMERICANA',
    '27810',
    true
FROM core.states s
WHERE s.divipola_code = '27'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'NEIVA',
    '41001',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ACEVEDO',
    '41006',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'AGRADO',
    '41013',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'AIPE',
    '41016',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ALGECIRAS',
    '41020',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ALTAMIRA',
    '41026',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BARAYA',
    '41078',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CAMPOALEGRE',
    '41132',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'COLOMBIA',
    '41206',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ELÍAS',
    '41244',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GARZÓN',
    '41298',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GIGANTE',
    '41306',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUADALUPE',
    '41319',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'HOBO',
    '41349',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ÍQUIRA',
    '41357',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ISNOS',
    '41359',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA ARGENTINA',
    '41378',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA PLATA',
    '41396',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'NÁTAGA',
    '41483',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'OPORAPA',
    '41503',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PAICOL',
    '41518',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PALERMO',
    '41524',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PALESTINA',
    '41530',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PITAL',
    '41548',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PITALITO',
    '41551',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RIVERA',
    '41615',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SALADOBLANCO',
    '41660',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN AGUSTÍN',
    '41668',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTA MARÍA',
    '41676',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SUAZA',
    '41770',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TARQUI',
    '41791',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TESALIA',
    '41797',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TELLO',
    '41799',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TERUEL',
    '41801',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TIMANÁ',
    '41807',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VILLAVIEJA',
    '41872',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'YAGUARÁ',
    '41885',
    true
FROM core.states s
WHERE s.divipola_code = '41'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RIOHACHA',
    '44001',
    true
FROM core.states s
WHERE s.divipola_code = '44'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ALBANIA',
    '44035',
    true
FROM core.states s
WHERE s.divipola_code = '44'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BARRANCAS',
    '44078',
    true
FROM core.states s
WHERE s.divipola_code = '44'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'DIBULLA',
    '44090',
    true
FROM core.states s
WHERE s.divipola_code = '44'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'DISTRACCIÓN',
    '44098',
    true
FROM core.states s
WHERE s.divipola_code = '44'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL MOLINO',
    '44110',
    true
FROM core.states s
WHERE s.divipola_code = '44'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FONSECA',
    '44279',
    true
FROM core.states s
WHERE s.divipola_code = '44'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'HATONUEVO',
    '44378',
    true
FROM core.states s
WHERE s.divipola_code = '44'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA JAGUA DEL PILAR',
    '44420',
    true
FROM core.states s
WHERE s.divipola_code = '44'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MAICAO',
    '44430',
    true
FROM core.states s
WHERE s.divipola_code = '44'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MANAURE',
    '44560',
    true
FROM core.states s
WHERE s.divipola_code = '44'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN JUAN DEL CESAR',
    '44650',
    true
FROM core.states s
WHERE s.divipola_code = '44'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'URIBIA',
    '44847',
    true
FROM core.states s
WHERE s.divipola_code = '44'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'URUMITA',
    '44855',
    true
FROM core.states s
WHERE s.divipola_code = '44'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VILLANUEVA',
    '44874',
    true
FROM core.states s
WHERE s.divipola_code = '44'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTA MARTA',
    '47001',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ALGARROBO',
    '47030',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ARACATACA',
    '47053',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ARIGUANÍ',
    '47058',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CERRO DE SAN ANTONIO',
    '47161',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHIVOLO',
    '47170',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CIÉNAGA',
    '47189',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CONCORDIA',
    '47205',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL BANCO',
    '47245',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL PIÑÓN',
    '47258',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL RETÉN',
    '47268',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FUNDACIÓN',
    '47288',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUAMAL',
    '47318',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'NUEVA GRANADA',
    '47460',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PEDRAZA',
    '47541',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PIJIÑO DEL CARMEN',
    '47545',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PIVIJAY',
    '47551',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PLATO',
    '47555',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUEBLOVIEJO',
    '47570',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'REMOLINO',
    '47605',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SABANAS DE SAN ÁNGEL',
    '47660',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SALAMINA',
    '47675',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN SEBASTIÁN DE BUENAVISTA',
    '47692',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN ZENÓN',
    '47703',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTA ANA',
    '47707',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTA BÁRBARA DE PINTO',
    '47720',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SITIONUEVO',
    '47745',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TENERIFE',
    '47798',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ZAPAYÁN',
    '47960',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ZONA BANANERA',
    '47980',
    true
FROM core.states s
WHERE s.divipola_code = '47'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VILLAVICENCIO',
    '50001',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ACACÍAS',
    '50006',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BARRANCA DE UPÍA',
    '50110',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CABUYARO',
    '50124',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CASTILLA LA NUEVA',
    '50150',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CUBARRAL',
    '50223',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CUMARAL',
    '50226',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL CALVARIO',
    '50245',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL CASTILLO',
    '50251',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL DORADO',
    '50270',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FUENTE DE ORO',
    '50287',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GRANADA',
    '50313',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUAMAL',
    '50318',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MAPIRIPÁN',
    '50325',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MESETAS',
    '50330',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA MACARENA',
    '50350',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'URIBE',
    '50370',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LEJANÍAS',
    '50400',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO CONCORDIA',
    '50450',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO GAITÁN',
    '50568',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO LÓPEZ',
    '50573',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO LLERAS',
    '50577',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO RICO',
    '50590',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RESTREPO',
    '50606',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN CARLOS DE GUAROA',
    '50680',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN JUAN DE ARAMA',
    '50683',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN JUANITO',
    '50686',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN MARTÍN',
    '50689',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VISTAHERMOSA',
    '50711',
    true
FROM core.states s
WHERE s.divipola_code = '50'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PASTO',
    '52001',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ALBÁN',
    '52019',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ALDANA',
    '52022',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ANCUYA',
    '52036',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ARBOLEDA',
    '52051',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BARBACOAS',
    '52079',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BELÉN',
    '52083',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BUESACO',
    '52110',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'COLÓN',
    '52203',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CONSACÁ',
    '52207',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CONTADERO',
    '52210',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CÓRDOBA',
    '52215',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CUASPUD CARLOSAMA',
    '52224',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CUMBAL',
    '52227',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CUMBITARA',
    '52233',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHACHAGÜÍ',
    '52240',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL CHARCO',
    '52250',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL PEÑOL',
    '52254',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL ROSARIO',
    '52256',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL TABLÓN DE GÓMEZ',
    '52258',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL TAMBO',
    '52260',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FUNES',
    '52287',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUACHUCAL',
    '52317',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUAITARILLA',
    '52320',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUALMATÁN',
    '52323',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ILES',
    '52352',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'IMUÉS',
    '52354',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'IPIALES',
    '52356',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA CRUZ',
    '52378',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA FLORIDA',
    '52381',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA LLANADA',
    '52385',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA TOLA',
    '52390',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA UNIÓN',
    '52399',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LEIVA',
    '52405',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LINARES',
    '52411',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LOS ANDES',
    '52418',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MAGÜÍ',
    '52427',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MALLAMA',
    '52435',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MOSQUERA',
    '52473',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'NARIÑO',
    '52480',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'OLAYA HERRERA',
    '52490',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'OSPINA',
    '52506',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FRANCISCO PIZARRO',
    '52520',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'POLICARPA',
    '52540',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'POTOSÍ',
    '52560',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PROVIDENCIA',
    '52565',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERRES',
    '52573',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUPIALES',
    '52585',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RICAURTE',
    '52612',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ROBERTO PAYÁN',
    '52621',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAMANIEGO',
    '52678',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANDONÁ',
    '52683',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN BERNARDO',
    '52685',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN LORENZO',
    '52687',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN PABLO',
    '52693',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN PEDRO DE CARTAGO',
    '52694',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTA BÁRBARA',
    '52696',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTACRUZ',
    '52699',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAPUYES',
    '52720',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TAMINANGO',
    '52786',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TANGUA',
    '52788',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN ANDRÉS DE TUMACO',
    '52835',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TÚQUERRES',
    '52838',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'YACUANQUER',
    '52885',
    true
FROM core.states s
WHERE s.divipola_code = '52'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN JOSÉ DE CÚCUTA',
    '54001',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ÁBREGO',
    '54003',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ARBOLEDAS',
    '54051',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BOCHALEMA',
    '54099',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BUCARASICA',
    '54109',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CÁCOTA',
    '54125',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CÁCHIRA',
    '54128',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHINÁCOTA',
    '54172',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHITAGÁ',
    '54174',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CONVENCIÓN',
    '54206',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CUCUTILLA',
    '54223',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'DURANIA',
    '54239',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL CARMEN',
    '54245',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL TARRA',
    '54250',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL ZULIA',
    '54261',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GRAMALOTE',
    '54313',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'HACARÍ',
    '54344',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'HERRÁN',
    '54347',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LABATECA',
    '54377',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA ESPERANZA',
    '54385',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA PLAYA',
    '54398',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LOS PATIOS',
    '54405',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LOURDES',
    '54418',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MUTISCUA',
    '54480',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'OCAÑA',
    '54498',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PAMPLONA',
    '54518',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PAMPLONITA',
    '54520',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO SANTANDER',
    '54553',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RAGONVALIA',
    '54599',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SALAZAR',
    '54660',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN CALIXTO',
    '54670',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN CAYETANO',
    '54673',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTIAGO',
    '54680',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SARDINATA',
    '54720',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SILOS',
    '54743',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TEORAMA',
    '54800',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TIBÚ',
    '54810',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TOLEDO',
    '54820',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VILLA CARO',
    '54871',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VILLA DEL ROSARIO',
    '54874',
    true
FROM core.states s
WHERE s.divipola_code = '54'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ARMENIA',
    '63001',
    true
FROM core.states s
WHERE s.divipola_code = '63'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BUENAVISTA',
    '63111',
    true
FROM core.states s
WHERE s.divipola_code = '63'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CALARCÁ',
    '63130',
    true
FROM core.states s
WHERE s.divipola_code = '63'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CIRCASIA',
    '63190',
    true
FROM core.states s
WHERE s.divipola_code = '63'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CÓRDOBA',
    '63212',
    true
FROM core.states s
WHERE s.divipola_code = '63'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FILANDIA',
    '63272',
    true
FROM core.states s
WHERE s.divipola_code = '63'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GÉNOVA',
    '63302',
    true
FROM core.states s
WHERE s.divipola_code = '63'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA TEBAIDA',
    '63401',
    true
FROM core.states s
WHERE s.divipola_code = '63'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MONTENEGRO',
    '63470',
    true
FROM core.states s
WHERE s.divipola_code = '63'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PIJAO',
    '63548',
    true
FROM core.states s
WHERE s.divipola_code = '63'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'QUIMBAYA',
    '63594',
    true
FROM core.states s
WHERE s.divipola_code = '63'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SALENTO',
    '63690',
    true
FROM core.states s
WHERE s.divipola_code = '63'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PEREIRA',
    '66001',
    true
FROM core.states s
WHERE s.divipola_code = '66'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'APÍA',
    '66045',
    true
FROM core.states s
WHERE s.divipola_code = '66'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BALBOA',
    '66075',
    true
FROM core.states s
WHERE s.divipola_code = '66'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BELÉN DE UMBRÍA',
    '66088',
    true
FROM core.states s
WHERE s.divipola_code = '66'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'DOSQUEBRADAS',
    '66170',
    true
FROM core.states s
WHERE s.divipola_code = '66'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUÁTICA',
    '66318',
    true
FROM core.states s
WHERE s.divipola_code = '66'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA CELIA',
    '66383',
    true
FROM core.states s
WHERE s.divipola_code = '66'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA VIRGINIA',
    '66400',
    true
FROM core.states s
WHERE s.divipola_code = '66'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MARSELLA',
    '66440',
    true
FROM core.states s
WHERE s.divipola_code = '66'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MISTRATÓ',
    '66456',
    true
FROM core.states s
WHERE s.divipola_code = '66'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUEBLO RICO',
    '66572',
    true
FROM core.states s
WHERE s.divipola_code = '66'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'QUINCHÍA',
    '66594',
    true
FROM core.states s
WHERE s.divipola_code = '66'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTA ROSA DE CABAL',
    '66682',
    true
FROM core.states s
WHERE s.divipola_code = '66'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTUARIO',
    '66687',
    true
FROM core.states s
WHERE s.divipola_code = '66'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BUCARAMANGA',
    '68001',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'AGUADA',
    '68013',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ALBANIA',
    '68020',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ARATOCA',
    '68051',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BARBOSA',
    '68077',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BARICHARA',
    '68079',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BARRANCABERMEJA',
    '68081',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BETULIA',
    '68092',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BOLÍVAR',
    '68101',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CABRERA',
    '68121',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CALIFORNIA',
    '68132',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CAPITANEJO',
    '68147',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CARCASÍ',
    '68152',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CEPITÁ',
    '68160',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CERRITO',
    '68162',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHARALÁ',
    '68167',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHARTA',
    '68169',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHIMA',
    '68176',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHIPATÁ',
    '68179',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CIMITARRA',
    '68190',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CONCEPCIÓN',
    '68207',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CONFINES',
    '68209',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CONTRATACIÓN',
    '68211',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'COROMORO',
    '68217',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CURITÍ',
    '68229',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL CARMEN DE CHUCURÍ',
    '68235',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL GUACAMAYO',
    '68245',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL PEÑÓN',
    '68250',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL PLAYÓN',
    '68255',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ENCINO',
    '68264',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ENCISO',
    '68266',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FLORIÁN',
    '68271',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FLORIDABLANCA',
    '68276',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GALÁN',
    '68296',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GÁMBITA',
    '68298',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GIRÓN',
    '68307',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUACA',
    '68318',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUADALUPE',
    '68320',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUAPOTÁ',
    '68322',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUAVATÁ',
    '68324',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GÜEPSA',
    '68327',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'HATO',
    '68344',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'JESÚS MARÍA',
    '68368',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'JORDÁN',
    '68370',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA BELLEZA',
    '68377',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LANDÁZURI',
    '68385',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA PAZ',
    '68397',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LEBRIJA',
    '68406',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LOS SANTOS',
    '68418',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MACARAVITA',
    '68425',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MÁLAGA',
    '68432',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MATANZA',
    '68444',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MOGOTES',
    '68464',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MOLAGAVITA',
    '68468',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'OCAMONTE',
    '68498',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'OIBA',
    '68500',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ONZAGA',
    '68502',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PALMAR',
    '68522',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PALMAS DEL SOCORRO',
    '68524',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PÁRAMO',
    '68533',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PIEDECUESTA',
    '68547',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PINCHOTE',
    '68549',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUENTE NACIONAL',
    '68572',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO PARRA',
    '68573',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO WILCHES',
    '68575',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RIONEGRO',
    '68615',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SABANA DE TORRES',
    '68655',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN ANDRÉS',
    '68669',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN BENITO',
    '68673',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN GIL',
    '68679',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN JOAQUÍN',
    '68682',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN JOSÉ DE MIRANDA',
    '68684',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN MIGUEL',
    '68686',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN VICENTE DE CHUCURÍ',
    '68689',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTA BÁRBARA',
    '68705',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTA HELENA DEL OPÓN',
    '68720',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SIMACOTA',
    '68745',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SOCORRO',
    '68755',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SUAITA',
    '68770',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SUCRE',
    '68773',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SURATÁ',
    '68780',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TONA',
    '68820',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VALLE DE SAN JOSÉ',
    '68855',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VÉLEZ',
    '68861',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VETAS',
    '68867',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VILLANUEVA',
    '68872',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ZAPATOCA',
    '68895',
    true
FROM core.states s
WHERE s.divipola_code = '68'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SINCELEJO',
    '70001',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BUENAVISTA',
    '70110',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CAIMITO',
    '70124',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'COLOSÓ',
    '70204',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'COROZAL',
    '70215',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'COVEÑAS',
    '70221',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHALÁN',
    '70230',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL ROBLE',
    '70233',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GALERAS',
    '70235',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUARANDA',
    '70265',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA UNIÓN',
    '70400',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LOS PALMITOS',
    '70418',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MAJAGUAL',
    '70429',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MORROA',
    '70473',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'OVEJAS',
    '70508',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PALMITO',
    '70523',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAMPUÉS',
    '70670',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN BENITO ABAD',
    '70678',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN JUAN DE BETULIA',
    '70702',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN MARCOS',
    '70708',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN ONOFRE',
    '70713',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN PEDRO',
    '70717',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN LUIS DE SINCÉ',
    '70742',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SUCRE',
    '70771',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTIAGO DE TOLÚ',
    '70820',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN JOSÉ DE TOLUVIEJO',
    '70823',
    true
FROM core.states s
WHERE s.divipola_code = '70'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'IBAGUÉ',
    '73001',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ALPUJARRA',
    '73024',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ALVARADO',
    '73026',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'AMBALEMA',
    '73030',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ANZOÁTEGUI',
    '73043',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ARMERO',
    '73055',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ATACO',
    '73067',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CAJAMARCA',
    '73124',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CARMEN DE APICALÁ',
    '73148',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CASABIANCA',
    '73152',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHAPARRAL',
    '73168',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'COELLO',
    '73200',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'COYAIMA',
    '73217',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CUNDAY',
    '73226',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'DOLORES',
    '73236',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ESPINAL',
    '73268',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FALAN',
    '73270',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FLANDES',
    '73275',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FRESNO',
    '73283',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUAMO',
    '73319',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'HERVEO',
    '73347',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'HONDA',
    '73349',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ICONONZO',
    '73352',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LÉRIDA',
    '73408',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LÍBANO',
    '73411',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN SEBASTIÁN DE MARIQUITA',
    '73443',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MELGAR',
    '73449',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MURILLO',
    '73461',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'NATAGAIMA',
    '73483',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ORTEGA',
    '73504',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PALOCABILDO',
    '73520',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PIEDRAS',
    '73547',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PLANADAS',
    '73555',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PRADO',
    '73563',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PURIFICACIÓN',
    '73585',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RIOBLANCO',
    '73616',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RONCESVALLES',
    '73622',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ROVIRA',
    '73624',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SALDAÑA',
    '73671',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN ANTONIO',
    '73675',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN LUIS',
    '73678',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTA ISABEL',
    '73686',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SUÁREZ',
    '73770',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VALLE DE SAN JUAN',
    '73854',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VENADILLO',
    '73861',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VILLAHERMOSA',
    '73870',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VILLARRICA',
    '73873',
    true
FROM core.states s
WHERE s.divipola_code = '73'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTIAGO DE CALI',
    '76001',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ALCALÁ',
    '76020',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ANDALUCÍA',
    '76036',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ANSERMANUEVO',
    '76041',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ARGELIA',
    '76054',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BOLÍVAR',
    '76100',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BUENAVENTURA',
    '76109',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUADALAJARA DE BUGA',
    '76111',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BUGALAGRANDE',
    '76113',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CAICEDONIA',
    '76122',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CALIMA',
    '76126',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CANDELARIA',
    '76130',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CARTAGO',
    '76147',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'DAGUA',
    '76233',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL ÁGUILA',
    '76243',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL CAIRO',
    '76246',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL CERRITO',
    '76248',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL DOVIO',
    '76250',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FLORIDA',
    '76275',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GINEBRA',
    '76306',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'GUACARÍ',
    '76318',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'JAMUNDÍ',
    '76364',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA CUMBRE',
    '76377',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA UNIÓN',
    '76400',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA VICTORIA',
    '76403',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'OBANDO',
    '76497',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PALMIRA',
    '76520',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PRADERA',
    '76563',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RESTREPO',
    '76606',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RIOFRÍO',
    '76616',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ROLDANILLO',
    '76622',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN PEDRO',
    '76670',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SEVILLA',
    '76736',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TORO',
    '76823',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TRUJILLO',
    '76828',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TULUÁ',
    '76834',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ULLOA',
    '76845',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VERSALLES',
    '76863',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VIJES',
    '76869',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'YOTOCO',
    '76890',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'YUMBO',
    '76892',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ZARZAL',
    '76895',
    true
FROM core.states s
WHERE s.divipola_code = '76'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ARAUCA',
    '81001',
    true
FROM core.states s
WHERE s.divipola_code = '81'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ARAUQUITA',
    '81065',
    true
FROM core.states s
WHERE s.divipola_code = '81'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CRAVO NORTE',
    '81220',
    true
FROM core.states s
WHERE s.divipola_code = '81'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'FORTUL',
    '81300',
    true
FROM core.states s
WHERE s.divipola_code = '81'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO RONDÓN',
    '81591',
    true
FROM core.states s
WHERE s.divipola_code = '81'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SARAVENA',
    '81736',
    true
FROM core.states s
WHERE s.divipola_code = '81'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TAME',
    '81794',
    true
FROM core.states s
WHERE s.divipola_code = '81'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'YOPAL',
    '85001',
    true
FROM core.states s
WHERE s.divipola_code = '85'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'AGUAZUL',
    '85010',
    true
FROM core.states s
WHERE s.divipola_code = '85'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CHÁMEZA',
    '85015',
    true
FROM core.states s
WHERE s.divipola_code = '85'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'HATO COROZAL',
    '85125',
    true
FROM core.states s
WHERE s.divipola_code = '85'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA SALINA',
    '85136',
    true
FROM core.states s
WHERE s.divipola_code = '85'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MANÍ',
    '85139',
    true
FROM core.states s
WHERE s.divipola_code = '85'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MONTERREY',
    '85162',
    true
FROM core.states s
WHERE s.divipola_code = '85'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'NUNCHÍA',
    '85225',
    true
FROM core.states s
WHERE s.divipola_code = '85'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'OROCUÉ',
    '85230',
    true
FROM core.states s
WHERE s.divipola_code = '85'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PAZ DE ARIPORO',
    '85250',
    true
FROM core.states s
WHERE s.divipola_code = '85'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PORE',
    '85263',
    true
FROM core.states s
WHERE s.divipola_code = '85'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'RECETOR',
    '85279',
    true
FROM core.states s
WHERE s.divipola_code = '85'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SABANALARGA',
    '85300',
    true
FROM core.states s
WHERE s.divipola_code = '85'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SÁCAMA',
    '85315',
    true
FROM core.states s
WHERE s.divipola_code = '85'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN LUIS DE PALENQUE',
    '85325',
    true
FROM core.states s
WHERE s.divipola_code = '85'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TÁMARA',
    '85400',
    true
FROM core.states s
WHERE s.divipola_code = '85'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TAURAMENA',
    '85410',
    true
FROM core.states s
WHERE s.divipola_code = '85'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TRINIDAD',
    '85430',
    true
FROM core.states s
WHERE s.divipola_code = '85'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VILLANUEVA',
    '85440',
    true
FROM core.states s
WHERE s.divipola_code = '85'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MOCOA',
    '86001',
    true
FROM core.states s
WHERE s.divipola_code = '86'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'COLÓN',
    '86219',
    true
FROM core.states s
WHERE s.divipola_code = '86'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'ORITO',
    '86320',
    true
FROM core.states s
WHERE s.divipola_code = '86'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO ASÍS',
    '86568',
    true
FROM core.states s
WHERE s.divipola_code = '86'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO CAICEDO',
    '86569',
    true
FROM core.states s
WHERE s.divipola_code = '86'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO GUZMÁN',
    '86571',
    true
FROM core.states s
WHERE s.divipola_code = '86'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO LEGUÍZAMO',
    '86573',
    true
FROM core.states s
WHERE s.divipola_code = '86'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SIBUNDOY',
    '86749',
    true
FROM core.states s
WHERE s.divipola_code = '86'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN FRANCISCO',
    '86755',
    true
FROM core.states s
WHERE s.divipola_code = '86'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN MIGUEL',
    '86757',
    true
FROM core.states s
WHERE s.divipola_code = '86'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTIAGO',
    '86760',
    true
FROM core.states s
WHERE s.divipola_code = '86'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VALLE DEL GUAMUEZ',
    '86865',
    true
FROM core.states s
WHERE s.divipola_code = '86'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'VILLAGARZÓN',
    '86885',
    true
FROM core.states s
WHERE s.divipola_code = '86'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN ANDRÉS',
    '88001',
    true
FROM core.states s
WHERE s.divipola_code = '88'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PROVIDENCIA',
    '88564',
    true
FROM core.states s
WHERE s.divipola_code = '88'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LETICIA',
    '91001',
    true
FROM core.states s
WHERE s.divipola_code = '91'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL ENCANTO',
    '91263',
    true
FROM core.states s
WHERE s.divipola_code = '91'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA CHORRERA',
    '91405',
    true
FROM core.states s
WHERE s.divipola_code = '91'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA PEDRERA',
    '91407',
    true
FROM core.states s
WHERE s.divipola_code = '91'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA VICTORIA',
    '91430',
    true
FROM core.states s
WHERE s.divipola_code = '91'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MIRITÍ - PARANÁ',
    '91460',
    true
FROM core.states s
WHERE s.divipola_code = '91'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO ALEGRÍA',
    '91530',
    true
FROM core.states s
WHERE s.divipola_code = '91'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO ARICA',
    '91536',
    true
FROM core.states s
WHERE s.divipola_code = '91'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO NARIÑO',
    '91540',
    true
FROM core.states s
WHERE s.divipola_code = '91'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO SANTANDER',
    '91669',
    true
FROM core.states s
WHERE s.divipola_code = '91'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TARAPACÁ',
    '91798',
    true
FROM core.states s
WHERE s.divipola_code = '91'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'INÍRIDA',
    '94001',
    true
FROM core.states s
WHERE s.divipola_code = '94'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'BARRANCOMINAS',
    '94343',
    true
FROM core.states s
WHERE s.divipola_code = '94'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN FELIPE',
    '94883',
    true
FROM core.states s
WHERE s.divipola_code = '94'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO COLOMBIA',
    '94884',
    true
FROM core.states s
WHERE s.divipola_code = '94'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA GUADALUPE',
    '94885',
    true
FROM core.states s
WHERE s.divipola_code = '94'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CACAHUAL',
    '94886',
    true
FROM core.states s
WHERE s.divipola_code = '94'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PANA PANA',
    '94887',
    true
FROM core.states s
WHERE s.divipola_code = '94'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MORICHAL',
    '94888',
    true
FROM core.states s
WHERE s.divipola_code = '94'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SAN JOSÉ DEL GUAVIARE',
    '95001',
    true
FROM core.states s
WHERE s.divipola_code = '95'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CALAMAR',
    '95015',
    true
FROM core.states s
WHERE s.divipola_code = '95'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'EL RETORNO',
    '95025',
    true
FROM core.states s
WHERE s.divipola_code = '95'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MIRAFLORES',
    '95200',
    true
FROM core.states s
WHERE s.divipola_code = '95'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'MITÚ',
    '97001',
    true
FROM core.states s
WHERE s.divipola_code = '97'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CARURÚ',
    '97161',
    true
FROM core.states s
WHERE s.divipola_code = '97'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PACOA',
    '97511',
    true
FROM core.states s
WHERE s.divipola_code = '97'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'TARAIRA',
    '97666',
    true
FROM core.states s
WHERE s.divipola_code = '97'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PAPUNAHUA',
    '97777',
    true
FROM core.states s
WHERE s.divipola_code = '97'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'YAVARATÉ',
    '97889',
    true
FROM core.states s
WHERE s.divipola_code = '97'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'PUERTO CARREÑO',
    '99001',
    true
FROM core.states s
WHERE s.divipola_code = '99'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'LA PRIMAVERA',
    '99524',
    true
FROM core.states s
WHERE s.divipola_code = '99'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'SANTA ROSALÍA',
    '99624',
    true
FROM core.states s
WHERE s.divipola_code = '99'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    'CUMARIBO',
    '99773',
    true
FROM core.states s
WHERE s.divipola_code = '99'
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;


COMMIT;


SELECT
    COUNT(*) AS total_municipios,
    COUNT(divipola_code) AS con_divipola,
    COUNT(*) - COUNT(divipola_code) AS sin_divipola,
    COUNT(DISTINCT divipola_code) AS divipolas_unicas
FROM core.cities;



SELECT
    COUNT(*) AS municipios_huerfanos
FROM core.cities c
LEFT JOIN core.states s
    ON s.id = c.state_id
WHERE s.id IS NULL;



SELECT
    COUNT(*) AS divipolas_con_departamento_incorrecto
FROM core.cities c
JOIN core.states s
    ON s.id = c.state_id
WHERE LEFT(c.divipola_code, 2) <> s.divipola_code;






