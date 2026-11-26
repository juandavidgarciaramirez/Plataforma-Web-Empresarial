-- ============================================================================
-- MIGRACIÓN AUTOMÁTICA BLOG + NEWS
-- Generada desde src/data/blog.ts y src/data/news.ts
-- NO ejecutar sin revisar.
-- ============================================================================

BEGIN;


INSERT INTO content.post_categories (
  name,
  slug,
  is_active
)
VALUES (
  'GESTIÓN HUMANA',
  'gestion-humana',
  true
)
ON CONFLICT (name)
DO UPDATE SET
  is_active = true;

INSERT INTO content.post_categories (
  name,
  slug,
  is_active
)
VALUES (
  'SST',
  'sst',
  true
)
ON CONFLICT (name)
DO UPDATE SET
  is_active = true;

INSERT INTO content.post_categories (
  name,
  slug,
  is_active
)
VALUES (
  'SEGURIDAD VIAL',
  'seguridad-vial',
  true
)
ON CONFLICT (name)
DO UPDATE SET
  is_active = true;

INSERT INTO content.post_categories (
  name,
  slug,
  is_active
)
VALUES (
  'FORMACIÓN',
  'formacion',
  true
)
ON CONFLICT (name)
DO UPDATE SET
  is_active = true;

INSERT INTO content.post_categories (
  name,
  slug,
  is_active
)
VALUES (
  'GESTIÓN EMPRESARIAL',
  'gestion-empresarial',
  true
)
ON CONFLICT (name)
DO UPDATE SET
  is_active = true;

INSERT INTO content.post_categories (
  name,
  slug,
  is_active
)
VALUES (
  'TALENTO',
  'talento',
  true
)
ON CONFLICT (name)
DO UPDATE SET
  is_active = true;

INSERT INTO content.post_categories (
  name,
  slug,
  is_active
)
VALUES (
  'GESTIÓN HUMANA · LABORAL',
  'gestion-humana-laboral',
  true
)
ON CONFLICT (name)
DO UPDATE SET
  is_active = true;

INSERT INTO content.post_categories (
  name,
  slug,
  is_active
)
VALUES (
  'CAPITAL TALENTO HUMANO',
  'capital-talento-humano',
  true
)
ON CONFLICT (name)
DO UPDATE SET
  is_active = true;


INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'gestión humana',
  'gestion-humana'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'talento',
  'talento'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'cultura organizacional',
  'cultura-organizacional'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'liderazgo',
  'liderazgo'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'desempeño',
  'desempeno'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'bienestar',
  'bienestar'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'productividad',
  'productividad'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'SST',
  'sst'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'SG-SST',
  'sg-sst'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'gestión de riesgos',
  'gestion-de-riesgos'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'cumplimiento',
  'cumplimiento'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'auditoría',
  'auditoria'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'mejora continua',
  'mejora-continua'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'seguridad vial',
  'seguridad-vial'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'PESV',
  'pesv'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'gestión del riesgo vial',
  'gestion-del-riesgo-vial'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'capacitación',
  'capacitacion'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'indicadores',
  'indicadores'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'formación',
  'formacion'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'desarrollo del talento',
  'desarrollo-del-talento'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'competencias',
  'competencias'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'aprendizaje',
  'aprendizaje'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'gestión empresarial',
  'gestion-empresarial'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'estrategia',
  'estrategia'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'procesos',
  'procesos'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'innovación',
  'innovacion'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'toma de decisiones',
  'toma-de-decisiones'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'alto potencial',
  'alto-potencial'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'evaluación',
  'evaluacion'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'desarrollo',
  'desarrollo'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;

INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  'retención',
  'retencion'
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;


INSERT INTO content.posts (
  slug,
  title,
  subtitle,
  excerpt,
  content,
  cover_image_url,
  author_name,
  author_role,
  author_image_url,
  image_alt,
  content_blocks,
  conclusion,
  cta_label,
  cta_href,
  seo_title,
  seo_description,
  tags,
  is_featured,
  status,
  published_at,
  post_type
)
VALUES (
  'estrategia-gestion-humana-resultados',
  '¿Cómo construir una estrategia de Gestión Humana que genere resultados?',
  'De la administración de personal a un modelo que conecta talento, cultura, liderazgo y desempeño con los resultados del negocio.',
  'Una estrategia de Gestión Humana que genera resultados no se limita a administrar personal: articula talento, cultura, liderazgo, desempeño y bienestar alrededor de un mismo propósito. Estos son los pilares que la sostienen.',
  'Durante años, la Gestión Humana se midió por su capacidad de ejecutar: contratar a tiempo, pagar la nómina sin errores, tramitar novedades. Esa base sigue siendo indispensable, pero ya no es suficiente. Las organizaciones que hoy obtienen mejores resultados son las que entendieron que el talento no se administra: se dirige con la misma intención estratégica con la que se dirige el negocio.

Talento: el punto de partida, no el destino

Atraer talento no es llenar vacantes; es incorporar a las personas correctas para el momento correcto de la organización. Una estrategia de talento madura empieza por definir qué perfiles necesita el negocio en los próximos años, no solo qué cargo está vacante hoy, y construye desde ahí sus procesos de selección, inducción y plan de carrera.

Cultura: el terreno donde crece —o se estanca— el desempeño

La cultura organizacional es el conjunto de comportamientos que la empresa premia, tolera o corrige todos los días, más allá de lo que declaran sus valores corporativos. Ninguna estrategia de Gestión Humana funciona si la cultura real contradice lo que se busca lograr: una organización no puede pedir innovación si castiga el error, ni exigir colaboración si mide y reconoce solo el desempeño individual.

Liderazgo: quien sostiene la estrategia en el día a día

La estrategia de Gestión Humana no la ejecuta un área: la ejecutan los líderes de cada equipo, en cada conversación de desempeño, en cada decisión de reconocimiento y en cada momento de retroalimentación. Fortalecer el liderazgo —con criterios claros, herramientas y acompañamiento— es lo que permite que una estrategia diseñada en el nivel directivo realmente llegue a las personas.

Desempeño y bienestar: dos caras de la misma moneda

Gestionar el desempeño sin atender el bienestar produce resultados de corto plazo y desgaste de largo plazo. Una estrategia sólida conecta ambos frentes:

Objetivos claros y medibles, conectados con la estrategia del negocio.
Seguimiento continuo del desempeño, no solo evaluaciones anuales.
Programas de bienestar que respondan a necesidades reales del equipo.
Espacios formales de reconocimiento y retroalimentación.
Indicadores de clima organizacional revisados con la misma disciplina que los indicadores financieros.

El bienestar no es un beneficio adicional que se activa cuando sobra presupuesto: es una condición para sostener la productividad en el tiempo. Tratarlo como estrategia, y no como iniciativa aislada, es lo que marca la diferencia.

De la intención a la ejecución

Una estrategia de Gestión Humana que genera resultados no se mide por cuántas políticas existen en un documento, sino por cuánto de eso realmente ocurre en el día a día de la organización. Ese es el reto: pasar de la intención a la ejecución sostenida, con procesos, indicadores y acompañamiento que permitan corregir el rumbo cuando sea necesario.',
  '/images/blog/blog-01.png',
  'Equipo Capital Consulting',
  'Capital Consulting and Services SAS',
  NULL,
  'Equipo directivo de Capital Consulting analizando un plan estratégico de talento humano en sala de juntas',
  '[{"type":"paragraph","text":"Durante años, la Gestión Humana se midió por su capacidad de ejecutar: contratar a tiempo, pagar la nómina sin errores, tramitar novedades. Esa base sigue siendo indispensable, pero ya no es suficiente. Las organizaciones que hoy obtienen mejores resultados son las que entendieron que el talento no se administra: se dirige con la misma intención estratégica con la que se dirige el negocio."},{"type":"heading","text":"Talento: el punto de partida, no el destino"},{"type":"paragraph","text":"Atraer talento no es llenar vacantes; es incorporar a las personas correctas para el momento correcto de la organización. Una estrategia de talento madura empieza por definir qué perfiles necesita el negocio en los próximos años, no solo qué cargo está vacante hoy, y construye desde ahí sus procesos de selección, inducción y plan de carrera."},{"type":"heading","text":"Cultura: el terreno donde crece —o se estanca— el desempeño"},{"type":"paragraph","text":"La cultura organizacional es el conjunto de comportamientos que la empresa premia, tolera o corrige todos los días, más allá de lo que declaran sus valores corporativos. Ninguna estrategia de Gestión Humana funciona si la cultura real contradice lo que se busca lograr: una organización no puede pedir innovación si castiga el error, ni exigir colaboración si mide y reconoce solo el desempeño individual."},{"type":"heading","text":"Liderazgo: quien sostiene la estrategia en el día a día"},{"type":"paragraph","text":"La estrategia de Gestión Humana no la ejecuta un área: la ejecutan los líderes de cada equipo, en cada conversación de desempeño, en cada decisión de reconocimiento y en cada momento de retroalimentación. Fortalecer el liderazgo —con criterios claros, herramientas y acompañamiento— es lo que permite que una estrategia diseñada en el nivel directivo realmente llegue a las personas."},{"type":"heading","text":"Desempeño y bienestar: dos caras de la misma moneda"},{"type":"paragraph","text":"Gestionar el desempeño sin atender el bienestar produce resultados de corto plazo y desgaste de largo plazo. Una estrategia sólida conecta ambos frentes:"},{"type":"list","items":["Objetivos claros y medibles, conectados con la estrategia del negocio.","Seguimiento continuo del desempeño, no solo evaluaciones anuales.","Programas de bienestar que respondan a necesidades reales del equipo.","Espacios formales de reconocimiento y retroalimentación.","Indicadores de clima organizacional revisados con la misma disciplina que los indicadores financieros."]},{"type":"note","text":"El bienestar no es un beneficio adicional que se activa cuando sobra presupuesto: es una condición para sostener la productividad en el tiempo. Tratarlo como estrategia, y no como iniciativa aislada, es lo que marca la diferencia."},{"type":"heading","text":"De la intención a la ejecución"},{"type":"paragraph","text":"Una estrategia de Gestión Humana que genera resultados no se mide por cuántas políticas existen en un documento, sino por cuánto de eso realmente ocurre en el día a día de la organización. Ese es el reto: pasar de la intención a la ejecución sostenida, con procesos, indicadores y acompañamiento que permitan corregir el rumbo cuando sea necesario."}]'::jsonb,
  '["El talento, la cultura, el liderazgo, el desempeño y el bienestar no son iniciativas independientes: son piezas de un mismo sistema.","Una estrategia de Gestión Humana genera resultados cuando se ejecuta con la misma disciplina y seguimiento que cualquier otra área del negocio.","Invertir en las personas de forma estructurada es, hoy, una decisión de productividad tanto como una decisión humana."]'::jsonb,
  'Conoce Capital Talento Humano →',
  '/servicios/capital-staffing',
  '¿Cómo construir una estrategia de Gestión Humana que genere resultados?',
  'Talento, cultura, liderazgo, desempeño y bienestar: los pilares de una estrategia de Gestión Humana que realmente impacta los resultados de la organización.',
  '["gestión humana","talento","cultura organizacional","liderazgo","desempeño","bienestar","productividad"]'::jsonb,
  true,
  'PUBLISHED',
  '2026-08-18'::timestamptz,
  'BLOG'
)
ON CONFLICT (slug)
DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image_url = EXCLUDED.cover_image_url,
  author_name = EXCLUDED.author_name,
  author_role = EXCLUDED.author_role,
  author_image_url = EXCLUDED.author_image_url,
  image_alt = EXCLUDED.image_alt,
  content_blocks = EXCLUDED.content_blocks,
  conclusion = EXCLUDED.conclusion,
  cta_label = EXCLUDED.cta_label,
  cta_href = EXCLUDED.cta_href,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  tags = EXCLUDED.tags,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  post_type = EXCLUDED.post_type,
  updated_at = now();

INSERT INTO content.posts (
  slug,
  title,
  subtitle,
  excerpt,
  content,
  cover_image_url,
  author_name,
  author_role,
  author_image_url,
  image_alt,
  content_blocks,
  conclusion,
  cta_label,
  cta_href,
  seo_title,
  seo_description,
  tags,
  is_featured,
  status,
  published_at,
  post_type
)
VALUES (
  'revisar-sistema-gestion-sst',
  '5 aspectos que toda organización debería revisar en su Sistema de Gestión de SST',
  'Una revisión periódica del SG-SST no es un trámite administrativo: es la base para prevenir, cumplir y proteger a las personas.',
  'Identificación de riesgos, cumplimiento normativo, auditorías, prevención y mejora continua: cinco frentes que toda organización debería revisar en su Sistema de Gestión de Seguridad y Salud en el Trabajo.',
  'El Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST) no es un documento que se construye una vez y se archiva: es un sistema vivo que debe revisarse con la misma frecuencia con la que cambian los riesgos, los procesos y la normativa. Muchas organizaciones cumplen en el papel, pero no han revisado a fondo si su sistema realmente está previniendo lo que debería prevenir. Estos son cinco aspectos que vale la pena poner sobre la mesa.

1. Identificación de riesgos actualizada a la operación real

La matriz de peligros y riesgos debe reflejar la operación tal como es hoy, no como era cuando se diseñó el sistema. Cambios en procesos, en maquinaria, en personal o en instalaciones deben traducirse en una actualización de la identificación de peligros; de lo contrario, el sistema protege frente a riesgos que ya no existen y deja sin cubrir los que sí.

2. Cumplimiento frente a los Estándares Mínimos vigentes

Revisar el cumplimiento no debería limitarse a la autoevaluación anual exigida por la normativa. Es una oportunidad para verificar, con evidencia real, que cada estándar aplicable a la organización tiene soporte documental, responsables definidos y seguimiento activo —no solo una casilla marcada.

3. Auditorías internas que realmente cuestionan el sistema

Una auditoría que solo confirma lo que ya se sabe no aporta valor. Las auditorías internas de SG-SST deben estar diseñadas para encontrar brechas: procesos que no se ejecutan como están documentados, controles que existen en el papel pero no en el terreno, o indicadores que no reflejan la realidad operativa.

4. Prevención como prioridad sobre la reacción

Un sistema maduro se reconoce porque invierte más en prevenir que en reaccionar. Eso implica revisar si los programas de prevención —inspecciones, capacitación, controles de ingeniería, elementos de protección— están dimensionados según el nivel de riesgo real de cada proceso, y no distribuidos de forma uniforme sin importar la exposición de cada área.

5. Mejora continua con base en datos, no en percepciones

La investigación de incidentes, los reportes de condiciones inseguras y los indicadores de gestión deben alimentar decisiones concretas de mejora. Un SG-SST que no cambia después de un incidente, o que repite las mismas acciones correctivas una y otra vez, no está aprendiendo de su propia información.

Este contenido tiene fines informativos y de gestión organizacional. La aplicación de cada estándar depende de la actividad económica, el número de trabajadores y el nivel de riesgo de cada organización; el diagnóstico específico debe realizarlo un especialista en SST.',
  '/images/blog/blog-02.png',
  'Jenny Sierra',
  'Especialista en Seguridad y Salud en el Trabajo',
  '/images/nosotros/jenny-sierra.jpeg',
  'Especialista de Capital Consulting revisando con un equipo operativo los estándares de Seguridad y Salud en el Trabajo en planta',
  '[{"type":"paragraph","text":"El Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST) no es un documento que se construye una vez y se archiva: es un sistema vivo que debe revisarse con la misma frecuencia con la que cambian los riesgos, los procesos y la normativa. Muchas organizaciones cumplen en el papel, pero no han revisado a fondo si su sistema realmente está previniendo lo que debería prevenir. Estos son cinco aspectos que vale la pena poner sobre la mesa."},{"type":"heading","text":"1. Identificación de riesgos actualizada a la operación real"},{"type":"paragraph","text":"La matriz de peligros y riesgos debe reflejar la operación tal como es hoy, no como era cuando se diseñó el sistema. Cambios en procesos, en maquinaria, en personal o en instalaciones deben traducirse en una actualización de la identificación de peligros; de lo contrario, el sistema protege frente a riesgos que ya no existen y deja sin cubrir los que sí."},{"type":"heading","text":"2. Cumplimiento frente a los Estándares Mínimos vigentes"},{"type":"paragraph","text":"Revisar el cumplimiento no debería limitarse a la autoevaluación anual exigida por la normativa. Es una oportunidad para verificar, con evidencia real, que cada estándar aplicable a la organización tiene soporte documental, responsables definidos y seguimiento activo —no solo una casilla marcada."},{"type":"heading","text":"3. Auditorías internas que realmente cuestionan el sistema"},{"type":"paragraph","text":"Una auditoría que solo confirma lo que ya se sabe no aporta valor. Las auditorías internas de SG-SST deben estar diseñadas para encontrar brechas: procesos que no se ejecutan como están documentados, controles que existen en el papel pero no en el terreno, o indicadores que no reflejan la realidad operativa."},{"type":"heading","text":"4. Prevención como prioridad sobre la reacción"},{"type":"paragraph","text":"Un sistema maduro se reconoce porque invierte más en prevenir que en reaccionar. Eso implica revisar si los programas de prevención —inspecciones, capacitación, controles de ingeniería, elementos de protección— están dimensionados según el nivel de riesgo real de cada proceso, y no distribuidos de forma uniforme sin importar la exposición de cada área."},{"type":"heading","text":"5. Mejora continua con base en datos, no en percepciones"},{"type":"paragraph","text":"La investigación de incidentes, los reportes de condiciones inseguras y los indicadores de gestión deben alimentar decisiones concretas de mejora. Un SG-SST que no cambia después de un incidente, o que repite las mismas acciones correctivas una y otra vez, no está aprendiendo de su propia información."},{"type":"note","text":"Este contenido tiene fines informativos y de gestión organizacional. La aplicación de cada estándar depende de la actividad económica, el número de trabajadores y el nivel de riesgo de cada organización; el diagnóstico específico debe realizarlo un especialista en SST."}]'::jsonb,
  '["Un SG-SST se fortalece cuando se revisa con la misma disciplina con la que se revisan los indicadores financieros u operativos.","La identificación de riesgos actualizada y las auditorías internas rigurosas son la base para que la prevención funcione, no solo para cumplir.","La mejora continua exige datos: sin ellos, el sistema repite errores en lugar de corregirlos."]'::jsonb,
  'Conoce Capital SST →',
  '/servicios/capital-hse',
  '5 aspectos que toda organización debería revisar en su Sistema de Gestión de SST',
  'Identificación de riesgos, cumplimiento, auditorías, prevención y mejora continua: cinco frentes clave para fortalecer el Sistema de Gestión de SST de tu organización.',
  '["SST","SG-SST","gestión de riesgos","cumplimiento","auditoría","mejora continua"]'::jsonb,
  false,
  'PUBLISHED',
  '2026-08-05'::timestamptz,
  'BLOG'
)
ON CONFLICT (slug)
DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image_url = EXCLUDED.cover_image_url,
  author_name = EXCLUDED.author_name,
  author_role = EXCLUDED.author_role,
  author_image_url = EXCLUDED.author_image_url,
  image_alt = EXCLUDED.image_alt,
  content_blocks = EXCLUDED.content_blocks,
  conclusion = EXCLUDED.conclusion,
  cta_label = EXCLUDED.cta_label,
  cta_href = EXCLUDED.cta_href,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  tags = EXCLUDED.tags,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  post_type = EXCLUDED.post_type,
  updated_at = now();

INSERT INTO content.posts (
  slug,
  title,
  subtitle,
  excerpt,
  content,
  cover_image_url,
  author_name,
  author_role,
  author_image_url,
  image_alt,
  content_blocks,
  conclusion,
  cta_label,
  cta_href,
  seo_title,
  seo_description,
  tags,
  is_featured,
  status,
  published_at,
  post_type
)
VALUES (
  'estrategia-seguridad-vial-empresarial',
  '¿Qué debe tener una estrategia efectiva de Seguridad Vial empresarial?',
  'El PESV es el punto de partida normativo; la gestión del riesgo vial es un compromiso permanente con la vida.',
  'PESV, gestión del riesgo vial, comportamiento, capacitación e indicadores: los componentes que sostienen una estrategia de Seguridad Vial empresarial capaz de proteger vidas y reducir la siniestralidad.',
  'Para cualquier organización con flota propia, contratada o colaboradores que se movilizan como parte de su labor, la seguridad vial no es un tema secundario: es un riesgo que puede costar vidas. Una estrategia efectiva va más allá de cumplir con el Plan Estratégico de Seguridad Vial (PESV): construye una gestión permanente del riesgo vial dentro de la cultura de la organización.

PESV: el punto de partida normativo

El PESV es el marco que exige la normativa colombiana para organizaciones con exposición al riesgo vial, y define las acciones mínimas frente a vehículos, conductores, infraestructura y comportamiento. Cumplirlo es obligatorio, pero tratarlo únicamente como un requisito documental es el primer error: un PESV bien diseñado debe convertirse en la hoja de ruta operativa de la seguridad vial de la organización, no en un archivo que se actualiza solo quando lo pide una auditoría.

Gestión del riesgo vial: más allá del cumplimiento

Gestionar el riesgo vial significa identificar, en cada ruta y cada tipo de operación, qué puede salir mal —fatiga, exceso de velocidad, condiciones de la vía, estado del vehículo— y actuar sobre esas causas antes de que se conviertan en un siniestro. Es un ejercicio de análisis constante, no una lista de controles que se revisa una vez al año.

Comportamiento: el factor que más pesa en la siniestralidad

La mayoría de los siniestros viales no se explican por fallas mecánicas, sino por decisiones humanas: velocidad inadecuada, distracción, fatiga o no uso del cinturón de seguridad. Una estrategia efectiva pone el comportamiento del conductor en el centro, con seguimiento cercano y no solo con señalización o recordatorios genéricos.

Capacitación que forma cultura, no solo cumple horas

La capacitación en seguridad vial pierde su propósito cuando se reduce a completar un número de horas exigido. Una capacitación efectiva se diseña según los riesgos específicos de cada tipo de conductor y de cada ruta, y se refuerza de forma constante, no en una sola jornada anual.

Indicadores: lo que no se mide, no mejora

Una estrategia de seguridad vial madura hace seguimiento a indicadores concretos —cuasi accidentes, incidentes, comportamientos de riesgo detectados, cumplimiento de mantenimiento preventivo— y los revisa con la misma frecuencia y rigor que cualquier otro indicador crítico del negocio.

PESV como hoja de ruta operativa, no como documento de cumplimiento.
Gestión activa del riesgo vial por ruta y tipo de operación.
Comportamiento del conductor como foco central de intervención.
Capacitación diseñada según el riesgo real, con refuerzo constante.
Indicadores de seguridad vial revisados con la misma disciplina que los indicadores del negocio.',
  '/images/blog/blog-03.png',
  'Equipo Capital Consulting',
  'Capital Consulting and Services SAS',
  NULL,
  'Especialista de Capital Mobility revisando el plan estratégico de seguridad vial junto a un equipo operativo y su flota',
  '[{"type":"paragraph","text":"Para cualquier organización con flota propia, contratada o colaboradores que se movilizan como parte de su labor, la seguridad vial no es un tema secundario: es un riesgo que puede costar vidas. Una estrategia efectiva va más allá de cumplir con el Plan Estratégico de Seguridad Vial (PESV): construye una gestión permanente del riesgo vial dentro de la cultura de la organización."},{"type":"heading","text":"PESV: el punto de partida normativo"},{"type":"paragraph","text":"El PESV es el marco que exige la normativa colombiana para organizaciones con exposición al riesgo vial, y define las acciones mínimas frente a vehículos, conductores, infraestructura y comportamiento. Cumplirlo es obligatorio, pero tratarlo únicamente como un requisito documental es el primer error: un PESV bien diseñado debe convertirse en la hoja de ruta operativa de la seguridad vial de la organización, no en un archivo que se actualiza solo quando lo pide una auditoría."},{"type":"heading","text":"Gestión del riesgo vial: más allá del cumplimiento"},{"type":"paragraph","text":"Gestionar el riesgo vial significa identificar, en cada ruta y cada tipo de operación, qué puede salir mal —fatiga, exceso de velocidad, condiciones de la vía, estado del vehículo— y actuar sobre esas causas antes de que se conviertan en un siniestro. Es un ejercicio de análisis constante, no una lista de controles que se revisa una vez al año."},{"type":"heading","text":"Comportamiento: el factor que más pesa en la siniestralidad"},{"type":"paragraph","text":"La mayoría de los siniestros viales no se explican por fallas mecánicas, sino por decisiones humanas: velocidad inadecuada, distracción, fatiga o no uso del cinturón de seguridad. Una estrategia efectiva pone el comportamiento del conductor en el centro, con seguimiento cercano y no solo con señalización o recordatorios genéricos."},{"type":"heading","text":"Capacitación que forma cultura, no solo cumple horas"},{"type":"paragraph","text":"La capacitación en seguridad vial pierde su propósito cuando se reduce a completar un número de horas exigido. Una capacitación efectiva se diseña según los riesgos específicos de cada tipo de conductor y de cada ruta, y se refuerza de forma constante, no en una sola jornada anual."},{"type":"heading","text":"Indicadores: lo que no se mide, no mejora"},{"type":"paragraph","text":"Una estrategia de seguridad vial madura hace seguimiento a indicadores concretos —cuasi accidentes, incidentes, comportamientos de riesgo detectados, cumplimiento de mantenimiento preventivo— y los revisa con la misma frecuencia y rigor que cualquier otro indicador crítico del negocio."},{"type":"list","items":["PESV como hoja de ruta operativa, no como documento de cumplimiento.","Gestión activa del riesgo vial por ruta y tipo de operación.","Comportamiento del conductor como foco central de intervención.","Capacitación diseñada según el riesgo real, con refuerzo constante.","Indicadores de seguridad vial revisados con la misma disciplina que los indicadores del negocio."]}]'::jsonb,
  '["El PESV es el punto de partida obligatorio, pero la seguridad vial efectiva se construye en la gestión diaria del riesgo.","El comportamiento humano es el factor de mayor peso en la siniestralidad, y debe ser el centro de cualquier estrategia.","Medir y hacer seguimiento constante es lo que permite anticipar un siniestro antes de que ocurra, no solo reaccionar después."]'::jsonb,
  'Conoce Capital Mobility →',
  '/servicios/capital-mobility',
  '¿Qué debe tener una estrategia efectiva de Seguridad Vial empresarial?',
  'PESV, gestión del riesgo vial, comportamiento, capacitación e indicadores: los componentes de una estrategia de Seguridad Vial empresarial que realmente protege vidas.',
  '["seguridad vial","PESV","gestión del riesgo vial","capacitación","indicadores"]'::jsonb,
  false,
  'PUBLISHED',
  '2026-07-24'::timestamptz,
  'BLOG'
)
ON CONFLICT (slug)
DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image_url = EXCLUDED.cover_image_url,
  author_name = EXCLUDED.author_name,
  author_role = EXCLUDED.author_role,
  author_image_url = EXCLUDED.author_image_url,
  image_alt = EXCLUDED.image_alt,
  content_blocks = EXCLUDED.content_blocks,
  conclusion = EXCLUDED.conclusion,
  cta_label = EXCLUDED.cta_label,
  cta_href = EXCLUDED.cta_href,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  tags = EXCLUDED.tags,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  post_type = EXCLUDED.post_type,
  updated_at = now();

INSERT INTO content.posts (
  slug,
  title,
  subtitle,
  excerpt,
  content,
  cover_image_url,
  author_name,
  author_role,
  author_image_url,
  image_alt,
  content_blocks,
  conclusion,
  cta_label,
  cta_href,
  seo_title,
  seo_description,
  tags,
  is_featured,
  status,
  published_at,
  post_type
)
VALUES (
  'desarrollo-talento-desempeno-organizacional',
  'El desarrollo del talento como estrategia para mejorar el desempeño organizacional',
  'Capacitar no basta: se necesita un modelo de desarrollo que convierta el aprendizaje en desempeño real.',
  'Capacitación, desarrollo, competencias, liderazgo y aprendizaje: por qué formar al talento es una de las estrategias más rentables para mejorar el desempeño organizacional.',
  'Cuando una organización enfrenta resultados por debajo de lo esperado, la primera pregunta suele ser sobre procesos, estrategia o recursos. Pocas veces se pregunta si el equipo cuenta con las competencias necesarias para ejecutar lo que se le está pidiendo. El desarrollo del talento es, con frecuencia, la palanca de desempeño menos explorada y más rentable.

De la capacitación aislada al desarrollo continuo

Una capacitación puntual —un curso, un taller, una charla— puede transmitir información, pero rara vez cambia un comportamiento de forma sostenida. El desarrollo del talento es distinto: es un proceso continuo que combina formación, práctica, retroalimentación y seguimiento, diseñado para que el aprendizaje se traduzca en una forma diferente de trabajar.

Competencias: el lenguaje común entre la estrategia y las personas

Definir las competencias que cada rol necesita —técnicas y conductuales— es lo que permite conectar la estrategia de la organización con el desarrollo individual de cada colaborador. Sin ese mapa, la formación se vuelve genérica: se capacita en lo disponible, no en lo que la organización realmente necesita para avanzar.

Liderazgo: el efecto multiplicador de invertir en quienes forman equipos

Formar líderes tiene un efecto multiplicador que rara vez tiene otra inversión en desarrollo: un líder mejor preparado no solo mejora su propio desempeño, sino que influye directamente en el desempeño, la motivación y la permanencia de todo su equipo.

Aprendizaje que se traduce en desempeño

El verdadero indicador de éxito de un programa de formación no es la asistencia ni la satisfacción de los participantes: es el cambio observable en los indicadores de desempeño después de aplicarlo. Eso exige diseñar la formación con objetivos de negocio claros desde el inicio, y no solo como una actividad de bienestar o cumplimiento.

Diagnóstico de competencias antes de diseñar cualquier programa de formación.
Procesos de desarrollo continuo, no eventos de capacitación aislados.
Inversión prioritaria en el desarrollo de quienes lideran equipos.
Objetivos de desempeño definidos desde el diseño del programa.
Seguimiento posterior a la formación para verificar el cambio real en el trabajo.',
  '/images/blog/blog-04.png',
  'Equipo Capital Consulting',
  'Capital Consulting and Services SAS',
  NULL,
  'Facilitador de Capital Consulting liderando una sesión de formación empresarial con un equipo directivo',
  '[{"type":"paragraph","text":"Cuando una organización enfrenta resultados por debajo de lo esperado, la primera pregunta suele ser sobre procesos, estrategia o recursos. Pocas veces se pregunta si el equipo cuenta con las competencias necesarias para ejecutar lo que se le está pidiendo. El desarrollo del talento es, con frecuencia, la palanca de desempeño menos explorada y más rentable."},{"type":"heading","text":"De la capacitación aislada al desarrollo continuo"},{"type":"paragraph","text":"Una capacitación puntual —un curso, un taller, una charla— puede transmitir información, pero rara vez cambia un comportamiento de forma sostenida. El desarrollo del talento es distinto: es un proceso continuo que combina formación, práctica, retroalimentación y seguimiento, diseñado para que el aprendizaje se traduzca en una forma diferente de trabajar."},{"type":"heading","text":"Competencias: el lenguaje común entre la estrategia y las personas"},{"type":"paragraph","text":"Definir las competencias que cada rol necesita —técnicas y conductuales— es lo que permite conectar la estrategia de la organización con el desarrollo individual de cada colaborador. Sin ese mapa, la formación se vuelve genérica: se capacita en lo disponible, no en lo que la organización realmente necesita para avanzar."},{"type":"heading","text":"Liderazgo: el efecto multiplicador de invertir en quienes forman equipos"},{"type":"paragraph","text":"Formar líderes tiene un efecto multiplicador que rara vez tiene otra inversión en desarrollo: un líder mejor preparado no solo mejora su propio desempeño, sino que influye directamente en el desempeño, la motivación y la permanencia de todo su equipo."},{"type":"heading","text":"Aprendizaje que se traduce en desempeño"},{"type":"paragraph","text":"El verdadero indicador de éxito de un programa de formación no es la asistencia ni la satisfacción de los participantes: es el cambio observable en los indicadores de desempeño después de aplicarlo. Eso exige diseñar la formación con objetivos de negocio claros desde el inicio, y no solo como una actividad de bienestar o cumplimiento."},{"type":"list","items":["Diagnóstico de competencias antes de diseñar cualquier programa de formación.","Procesos de desarrollo continuo, no eventos de capacitación aislados.","Inversión prioritaria en el desarrollo de quienes lideran equipos.","Objetivos de desempeño definidos desde el diseño del programa.","Seguimiento posterior a la formación para verificar el cambio real en el trabajo."]}]'::jsonb,
  '["El desarrollo del talento funciona como estrategia cuando se diseña con base en competencias reales y objetivos de negocio, no en la oferta disponible de cursos.","Invertir en el desarrollo de los líderes multiplica el impacto de cualquier programa de formación.","El aprendizaje solo se convierte en resultado cuando hay seguimiento después de la capacitación, no solo durante ella."]'::jsonb,
  'Conoce Capital Learning →',
  '/servicios/capital-learning',
  'El desarrollo del talento como estrategia para mejorar el desempeño organizacional',
  'Capacitación, desarrollo, competencias, liderazgo y aprendizaje: por qué formar al talento es una de las estrategias más rentables para mejorar el desempeño organizacional.',
  '["formación","desarrollo del talento","competencias","liderazgo","aprendizaje"]'::jsonb,
  false,
  'PUBLISHED',
  '2026-07-12'::timestamptz,
  'BLOG'
)
ON CONFLICT (slug)
DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image_url = EXCLUDED.cover_image_url,
  author_name = EXCLUDED.author_name,
  author_role = EXCLUDED.author_role,
  author_image_url = EXCLUDED.author_image_url,
  image_alt = EXCLUDED.image_alt,
  content_blocks = EXCLUDED.content_blocks,
  conclusion = EXCLUDED.conclusion,
  cta_label = EXCLUDED.cta_label,
  cta_href = EXCLUDED.cta_href,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  tags = EXCLUDED.tags,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  post_type = EXCLUDED.post_type,
  updated_at = now();

INSERT INTO content.posts (
  slug,
  title,
  subtitle,
  excerpt,
  content,
  cover_image_url,
  author_name,
  author_role,
  author_image_url,
  image_alt,
  content_blocks,
  conclusion,
  cta_label,
  cta_href,
  seo_title,
  seo_description,
  tags,
  is_featured,
  status,
  published_at,
  post_type
)
VALUES (
  'problemas-empresariales-oportunidades-crecimiento',
  'De los problemas empresariales a las oportunidades de crecimiento',
  'Cada problema recurrente en la operación es, en realidad, una oportunidad de mejora sin explorar.',
  'Estrategia, procesos, productividad, innovación y toma de decisiones: cómo transformar los problemas empresariales más comunes en oportunidades reales de crecimiento.',
  'Toda organización convive con problemas: procesos que se atrasan, costos que crecen sin explicación clara, decisiones que tardan más de lo debido. La diferencia entre una empresa que se estanca y una que crece no es la ausencia de problemas, sino la capacidad de leerlos como información valiosa para mejorar.

Cuando el problema es la falta de estrategia

Muchos problemas operativos son, en realidad, síntomas de una estrategia poco clara o mal comunicada. Cuando los equipos no entienden hacia dónde va la organización, cada área termina optimizando lo suyo sin conexión con el resto, generando fricciones que parecen operativas pero son estratégicas.

Procesos que frenan en lugar de impulsar

Un proceso que se diseñó para controlar un riesgo puntual puede, con el tiempo, convertirse en un obstáculo que ralentiza toda la operación. Revisar los procesos con una mirada crítica —¿esto sigue siendo necesario tal como está diseñado?— suele revelar oportunidades de simplificación que ninguna auditoría formal detecta.

Productividad: hacer más con lo que ya se tiene

Antes de asumir que un problema de resultados requiere más recursos, vale la pena revisar si los recursos actuales están siendo bien aprovechados. La mayoría de las organizaciones tiene margen de mejora en productividad que no requiere inversión adicional, solo mejor gestión.

Innovación: la disposición a cambiar lo que ya no funciona

Innovar no siempre significa crear algo nuevo desde cero; con frecuencia significa tener la disposición de cambiar una forma de trabajar que alguna vez funcionó, pero que ya no responde a la realidad actual del negocio o del mercado.

Toma de decisiones informadas, no decisiones apresuradas

Los problemas empresariales, cuando se abordan con presión y sin datos suficientes, tienden a resolverse con decisiones apresuradas que generan nuevos problemas. Un buen diagnóstico, aunque tome más tiempo al inicio, reduce el riesgo de repetir el mismo error meses después.',
  '/images/blog/blog-05.png',
  'Manuel Mesa',
  'Especialista en Gestión Financiera',
  '/images/nosotros/manuel-mesa.jpeg',
  'Consultor de Capital Consulting presentando un análisis estratégico a un equipo directivo en sala de juntas',
  '[{"type":"paragraph","text":"Toda organización convive con problemas: procesos que se atrasan, costos que crecen sin explicación clara, decisiones que tardan más de lo debido. La diferencia entre una empresa que se estanca y una que crece no es la ausencia de problemas, sino la capacidad de leerlos como información valiosa para mejorar."},{"type":"heading","text":"Cuando el problema es la falta de estrategia"},{"type":"paragraph","text":"Muchos problemas operativos son, en realidad, síntomas de una estrategia poco clara o mal comunicada. Cuando los equipos no entienden hacia dónde va la organización, cada área termina optimizando lo suyo sin conexión con el resto, generando fricciones que parecen operativas pero son estratégicas."},{"type":"heading","text":"Procesos que frenan en lugar de impulsar"},{"type":"paragraph","text":"Un proceso que se diseñó para controlar un riesgo puntual puede, con el tiempo, convertirse en un obstáculo que ralentiza toda la operación. Revisar los procesos con una mirada crítica —¿esto sigue siendo necesario tal como está diseñado?— suele revelar oportunidades de simplificación que ninguna auditoría formal detecta."},{"type":"heading","text":"Productividad: hacer más con lo que ya se tiene"},{"type":"paragraph","text":"Antes de asumir que un problema de resultados requiere más recursos, vale la pena revisar si los recursos actuales están siendo bien aprovechados. La mayoría de las organizaciones tiene margen de mejora en productividad que no requiere inversión adicional, solo mejor gestión."},{"type":"heading","text":"Innovación: la disposición a cambiar lo que ya no funciona"},{"type":"paragraph","text":"Innovar no siempre significa crear algo nuevo desde cero; con frecuencia significa tener la disposición de cambiar una forma de trabajar que alguna vez funcionó, pero que ya no responde a la realidad actual del negocio o del mercado."},{"type":"heading","text":"Toma de decisiones informadas, no decisiones apresuradas"},{"type":"paragraph","text":"Los problemas empresariales, cuando se abordan con presión y sin datos suficientes, tienden a resolverse con decisiones apresuradas que generan nuevos problemas. Un buen diagnóstico, aunque tome más tiempo al inicio, reduce el riesgo de repetir el mismo error meses después."}]'::jsonb,
  '["Los problemas recurrentes casi siempre señalan una oportunidad de mejora estructural, no solo un incidente aislado.","Revisar procesos y productividad con frecuencia evita que la organización busque soluciones costosas para problemas que se resuelven con mejor gestión.","Las decisiones informadas, aunque tomen más tiempo, generan crecimiento más sostenible que las decisiones apresuradas."]'::jsonb,
  'Conoce Capital Soluciones Empresariales →',
  '/servicios/capital-business-services',
  'De los problemas empresariales a las oportunidades de crecimiento',
  'Estrategia, procesos, productividad, innovación y toma de decisiones: cómo transformar los problemas empresariales más comunes en oportunidades reales de crecimiento.',
  '["gestión empresarial","estrategia","procesos","productividad","innovación","toma de decisiones"]'::jsonb,
  false,
  'PUBLISHED',
  '2026-06-30'::timestamptz,
  'BLOG'
)
ON CONFLICT (slug)
DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image_url = EXCLUDED.cover_image_url,
  author_name = EXCLUDED.author_name,
  author_role = EXCLUDED.author_role,
  author_image_url = EXCLUDED.author_image_url,
  image_alt = EXCLUDED.image_alt,
  content_blocks = EXCLUDED.content_blocks,
  conclusion = EXCLUDED.conclusion,
  cta_label = EXCLUDED.cta_label,
  cta_href = EXCLUDED.cta_href,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  tags = EXCLUDED.tags,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  post_type = EXCLUDED.post_type,
  updated_at = now();

INSERT INTO content.posts (
  slug,
  title,
  subtitle,
  excerpt,
  content,
  cover_image_url,
  author_name,
  author_role,
  author_image_url,
  image_alt,
  content_blocks,
  conclusion,
  cta_label,
  cta_href,
  seo_title,
  seo_description,
  tags,
  is_featured,
  status,
  published_at,
  post_type
)
VALUES (
  'identificar-desarrollar-talento-alto-potencial',
  '¿Cómo identificar y desarrollar el talento de alto potencial en una organización?',
  'No todo alto desempeño es alto potencial: la diferencia define en quién vale la pena invertir tiempo de desarrollo.',
  'Identificación, evaluación, desarrollo, seguimiento y retención: la ruta para identificar el talento de alto potencial en una organización y convertirlo en su ventaja competitiva.',
  'Es común que las organizaciones confundan el alto desempeño con el alto potencial, y traten ambos conceptos como si fueran lo mismo. No lo son: un colaborador de alto desempeño sobresale en su rol actual; un colaborador de alto potencial tiene la capacidad de asumir roles de mayor complejidad en el futuro. Identificar esa diferencia es el primer paso para diseñar una estrategia de desarrollo que realmente funcione.

Identificación: separar el alto desempeño del alto potencial

La identificación del talento de alto potencial no debería basarse únicamente en los resultados del último período de evaluación. Requiere observar comportamientos como la capacidad de aprendizaje, la adaptabilidad ante el cambio y la forma en que la persona influye en otros, más allá del cumplimiento de sus metas individuales.

Evaluación: criterios objetivos, no solo percepción

Confiar únicamente en la percepción de un jefe directo introduce sesgos importantes en la identificación de alto potencial. Un proceso de evaluación robusto combina múltiples fuentes de información —desempeño, competencias, retroalimentación de pares— para construir una visión más objetiva de cada colaborador.

Desarrollo: planes a la medida de cada perfil

Una vez identificado, el talento de alto potencial necesita un plan de desarrollo diseñado según sus brechas y aspiraciones específicas, no un programa genérico igual para todos. Proyectos retadores, mentoría y exposición a otras áreas del negocio suelen tener más impacto que la formación tradicional en aula.

Seguimiento: el potencial se confirma en el tiempo

El potencial identificado en un momento dado debe confirmarse con el tiempo, a través de un seguimiento cercano de la evolución de cada persona frente a los nuevos retos que se le asignan. No hacerlo genera el riesgo de invertir en desarrollo sin verificar si realmente está generando el crecimiento esperado.

Retención: el talento que se desarrolla, se queda

Identificar y desarrollar talento de alto potencial sin una estrategia de retención es, en la práctica, formar profesionales para que otras organizaciones se beneficien de ellos. La retención efectiva combina proyección de carrera clara, reconocimiento y condiciones competitivas frente al mercado.',
  '/images/blog/blog-06.png',
  'Equipo Capital Consulting',
  'Capital Consulting and Services SAS',
  NULL,
  'Líder de Capital Consulting presentando un modelo de desarrollo de liderazgo de alto potencial a su equipo',
  '[{"type":"paragraph","text":"Es común que las organizaciones confundan el alto desempeño con el alto potencial, y traten ambos conceptos como si fueran lo mismo. No lo son: un colaborador de alto desempeño sobresale en su rol actual; un colaborador de alto potencial tiene la capacidad de asumir roles de mayor complejidad en el futuro. Identificar esa diferencia es el primer paso para diseñar una estrategia de desarrollo que realmente funcione."},{"type":"heading","text":"Identificación: separar el alto desempeño del alto potencial"},{"type":"paragraph","text":"La identificación del talento de alto potencial no debería basarse únicamente en los resultados del último período de evaluación. Requiere observar comportamientos como la capacidad de aprendizaje, la adaptabilidad ante el cambio y la forma en que la persona influye en otros, más allá del cumplimiento de sus metas individuales."},{"type":"heading","text":"Evaluación: criterios objetivos, no solo percepción"},{"type":"paragraph","text":"Confiar únicamente en la percepción de un jefe directo introduce sesgos importantes en la identificación de alto potencial. Un proceso de evaluación robusto combina múltiples fuentes de información —desempeño, competencias, retroalimentación de pares— para construir una visión más objetiva de cada colaborador."},{"type":"heading","text":"Desarrollo: planes a la medida de cada perfil"},{"type":"paragraph","text":"Una vez identificado, el talento de alto potencial necesita un plan de desarrollo diseñado según sus brechas y aspiraciones específicas, no un programa genérico igual para todos. Proyectos retadores, mentoría y exposición a otras áreas del negocio suelen tener más impacto que la formación tradicional en aula."},{"type":"heading","text":"Seguimiento: el potencial se confirma en el tiempo"},{"type":"paragraph","text":"El potencial identificado en un momento dado debe confirmarse con el tiempo, a través de un seguimiento cercano de la evolución de cada persona frente a los nuevos retos que se le asignan. No hacerlo genera el riesgo de invertir en desarrollo sin verificar si realmente está generando el crecimiento esperado."},{"type":"heading","text":"Retención: el talento que se desarrolla, se queda"},{"type":"paragraph","text":"Identificar y desarrollar talento de alto potencial sin una estrategia de retención es, en la práctica, formar profesionales para que otras organizaciones se beneficien de ellos. La retención efectiva combina proyección de carrera clara, reconocimiento y condiciones competitivas frente al mercado."}]'::jsonb,
  '["El alto potencial no es lo mismo que el alto desempeño: confundirlos lleva a invertir en desarrollo en las personas equivocadas.","Una identificación objetiva, con múltiples fuentes de información, reduce el sesgo y mejora la calidad de las decisiones de desarrollo.","Identificar y desarrollar talento sin una estrategia de retención expone a la organización a perder justamente a quienes más invirtió en formar."]'::jsonb,
  'Conoce Capital Talento Humano →',
  '/servicios/capital-staffing',
  '¿Cómo identificar y desarrollar el talento de alto potencial en una organización?',
  'Identificación, evaluación, desarrollo, seguimiento y retención: la ruta para identificar el talento de alto potencial en una organización y convertirlo en su ventaja competitiva.',
  '["talento","alto potencial","evaluación","desarrollo","retención"]'::jsonb,
  false,
  'PUBLISHED',
  '2026-06-18'::timestamptz,
  'BLOG'
)
ON CONFLICT (slug)
DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image_url = EXCLUDED.cover_image_url,
  author_name = EXCLUDED.author_name,
  author_role = EXCLUDED.author_role,
  author_image_url = EXCLUDED.author_image_url,
  image_alt = EXCLUDED.image_alt,
  content_blocks = EXCLUDED.content_blocks,
  conclusion = EXCLUDED.conclusion,
  cta_label = EXCLUDED.cta_label,
  cta_href = EXCLUDED.cta_href,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  tags = EXCLUDED.tags,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  post_type = EXCLUDED.post_type,
  updated_at = now();

INSERT INTO content.posts (
  slug,
  title,
  subtitle,
  excerpt,
  content,
  cover_image_url,
  author_name,
  author_role,
  author_image_url,
  image_alt,
  content_blocks,
  conclusion,
  cta_label,
  cta_href,
  seo_title,
  seo_description,
  tags,
  is_featured,
  status,
  published_at,
  post_type
)
VALUES (
  'proteccion-maternidad-lactancia',
  'Protección laboral de la maternidad y la lactancia en Colombia',
  'Un compromiso legal y humano que las organizaciones deben conocer',
  'La maternidad y la lactancia cuentan con una protección laboral especial en Colombia. Un repaso al compromiso legal y humano que toda organización debe incorporar en su gestión.',
  'La maternidad y la lactancia gozan en Colombia de una protección laboral especial, que compromete tanto a la ley como a la cultura de cada organización. Para las áreas de Gestión Humana, entender el alcance de esta protección no es opcional: es un pilar de la relación laboral y de la reputación de la empresa.

Estabilidad laboral para madres gestantes y lactantes

La protección laboral de la maternidad se traduce, ante todo, en estabilidad laboral: la trabajadora en estado de embarazo o en período de lactancia cuenta con garantías especiales frente a la terminación de su contrato, que exigen a la organización actuar con especial cuidado, información y respaldo documental en cada decisión que involucre su cargo.

La lactancia como derecho que se sostiene en el día a día

La protección no termina con el nacimiento. El período de lactancia implica ajustes concretos en la jornada y en la organización del trabajo, y requiere que la empresa disponga los tiempos y las condiciones necesarias para que la trabajadora pueda ejercer este derecho sin que ello se traduzca en una desventaja laboral.

Gestión del riesgo laboral y jurídico

Identificar oportunamente la novedad de embarazo o lactancia y dejar constancia formal de la misma.
Revisar el cargo, las funciones y las condiciones de riesgo asociadas al puesto de trabajo.
Acompañar documentalmente cada etapa, desde la notificación hasta el reintegro.
Hacer seguimiento a los tiempos de protección legal aplicables a cada caso.
Coordinar de forma permanente entre Gestión Humana y el equipo jurídico.

Este contenido tiene fines informativos y de gestión organizacional. No constituye asesoría jurídica personalizada: cada situación debe analizarse a la luz de sus particularidades y, de ser necesario, con acompañamiento especializado.

Políticas de Gestión Humana que marcan la diferencia

Las organizaciones que cuentan con políticas claras de protección a la maternidad y la lactancia no solo reducen su exposición al riesgo laboral y jurídico: envían un mensaje contundente sobre su compromiso con el bienestar y la equidad. Cumplir la ley es el punto de partida; construir una cultura que la respalde es lo que distingue a una organización madura.',
  '/images/noticias/maternidad-lactancia.png',
  NULL,
  NULL,
  NULL,
  'Profesional de Capital Consulting atendiendo una videollamada de asesoría desde su oficina',
  '[{"type":"paragraph","text":"La maternidad y la lactancia gozan en Colombia de una protección laboral especial, que compromete tanto a la ley como a la cultura de cada organización. Para las áreas de Gestión Humana, entender el alcance de esta protección no es opcional: es un pilar de la relación laboral y de la reputación de la empresa."},{"type":"heading","text":"Estabilidad laboral para madres gestantes y lactantes"},{"type":"paragraph","text":"La protección laboral de la maternidad se traduce, ante todo, en estabilidad laboral: la trabajadora en estado de embarazo o en período de lactancia cuenta con garantías especiales frente a la terminación de su contrato, que exigen a la organización actuar con especial cuidado, información y respaldo documental en cada decisión que involucre su cargo."},{"type":"heading","text":"La lactancia como derecho que se sostiene en el día a día"},{"type":"paragraph","text":"La protección no termina con el nacimiento. El período de lactancia implica ajustes concretos en la jornada y en la organización del trabajo, y requiere que la empresa disponga los tiempos y las condiciones necesarias para que la trabajadora pueda ejercer este derecho sin que ello se traduzca en una desventaja laboral."},{"type":"heading","text":"Gestión del riesgo laboral y jurídico"},{"type":"list","items":["Identificar oportunamente la novedad de embarazo o lactancia y dejar constancia formal de la misma.","Revisar el cargo, las funciones y las condiciones de riesgo asociadas al puesto de trabajo.","Acompañar documentalmente cada etapa, desde la notificación hasta el reintegro.","Hacer seguimiento a los tiempos de protección legal aplicables a cada caso.","Coordinar de forma permanente entre Gestión Humana y el equipo jurídico."]},{"type":"note","text":"Este contenido tiene fines informativos y de gestión organizacional. No constituye asesoría jurídica personalizada: cada situación debe analizarse a la luz de sus particularidades y, de ser necesario, con acompañamiento especializado."},{"type":"heading","text":"Políticas de Gestión Humana que marcan la diferencia"},{"type":"paragraph","text":"Las organizaciones que cuentan con políticas claras de protección a la maternidad y la lactancia no solo reducen su exposición al riesgo laboral y jurídico: envían un mensaje contundente sobre su compromiso con el bienestar y la equidad. Cumplir la ley es el punto de partida; construir una cultura que la respalde es lo que distingue a una organización madura."}]'::jsonb,
  NULL,
  NULL,
  NULL,
  'Protección laboral de la maternidad y la lactancia en Colombia',
  'La maternidad y la lactancia cuentan con una protección laboral especial en Colombia. Un repaso al compromiso legal y humano que toda organización debe incorporar en su gestión.',
  NULL,
  true,
  'PUBLISHED',
  NULL,
  'NEWS'
)
ON CONFLICT (slug)
DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image_url = EXCLUDED.cover_image_url,
  author_name = EXCLUDED.author_name,
  author_role = EXCLUDED.author_role,
  author_image_url = EXCLUDED.author_image_url,
  image_alt = EXCLUDED.image_alt,
  content_blocks = EXCLUDED.content_blocks,
  conclusion = EXCLUDED.conclusion,
  cta_label = EXCLUDED.cta_label,
  cta_href = EXCLUDED.cta_href,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  tags = EXCLUDED.tags,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  post_type = EXCLUDED.post_type,
  updated_at = now();

INSERT INTO content.posts (
  slug,
  title,
  subtitle,
  excerpt,
  content,
  cover_image_url,
  author_name,
  author_role,
  author_image_url,
  image_alt,
  content_blocks,
  conclusion,
  cta_label,
  cta_href,
  seo_title,
  seo_description,
  tags,
  is_featured,
  status,
  published_at,
  post_type
)
VALUES (
  'fuero-paternidad',
  'Fuero de paternidad en Colombia',
  'Protección laboral y corresponsabilidad familiar',
  'La protección laboral del padre trabajador se consolida como una expresión de corresponsabilidad familiar. Qué deben revisar las áreas de Gestión Humana a partir de la Sentencia C-517 de 2024.',
  'La corresponsabilidad familiar ha ganado un lugar cada vez más claro en la protección laboral colombiana, y el fuero de paternidad es una de sus expresiones más concretas. Para Gestión Humana, se trata de un tema que exige actualización permanente y coordinación estrecha con el equipo jurídico.

Qué reconoce la protección al padre trabajador

El fuero de paternidad busca proteger la estabilidad laboral del padre trabajador frente a situaciones asociadas al nacimiento o cuidado de un hijo, reconociendo que la responsabilidad frente a la familia no recae únicamente en la madre.

El pronunciamiento de la Corte Constitucional

Mediante la Sentencia C-517 de 2024, la Corte Constitucional se pronunció sobre el fuero de paternidad, reafirmando la protección laboral del padre trabajador como una expresión del principio de corresponsabilidad familiar.

El alcance y la aplicación específica de la Sentencia C-517 de 2024 a cada caso deben verificarse con acompañamiento jurídico especializado. Este contenido es informativo y no sustituye dicho análisis.

Corresponsabilidad familiar y Gestión Humana

Incorporar la corresponsabilidad familiar en la gestión del talento implica revisar políticas, procesos y comunicación interna, de modo que la organización responda de forma consistente cuando un colaborador informa una situación relacionada con la paternidad.

Actualizar las políticas internas conforme a los criterios vigentes.
Comunicar con claridad a los colaboradores sus derechos y los procedimientos internos.
Coordinar con el equipo jurídico antes de tomar decisiones sobre el cargo.
Dejar registro documental de cada etapa del proceso.
Promover una cultura organizacional que reconozca la corresponsabilidad familiar.

Cumplimiento como parte de la estrategia organizacional

Gestionar correctamente el fuero de paternidad no es solo una obligación legal: es una oportunidad para que la organización demuestre coherencia entre lo que declara y lo que practica frente al equilibrio entre la vida laboral y familiar de su equipo.',
  '/images/noticias/fuero-paternidad.png',
  NULL,
  NULL,
  NULL,
  'Profesional de Capital Consulting trabajando en su oficina junto a su hijo, en un ambiente de equilibrio entre la vida laboral y familiar',
  '[{"type":"paragraph","text":"La corresponsabilidad familiar ha ganado un lugar cada vez más claro en la protección laboral colombiana, y el fuero de paternidad es una de sus expresiones más concretas. Para Gestión Humana, se trata de un tema que exige actualización permanente y coordinación estrecha con el equipo jurídico."},{"type":"heading","text":"Qué reconoce la protección al padre trabajador"},{"type":"paragraph","text":"El fuero de paternidad busca proteger la estabilidad laboral del padre trabajador frente a situaciones asociadas al nacimiento o cuidado de un hijo, reconociendo que la responsabilidad frente a la familia no recae únicamente en la madre."},{"type":"heading","text":"El pronunciamiento de la Corte Constitucional"},{"type":"paragraph","text":"Mediante la Sentencia C-517 de 2024, la Corte Constitucional se pronunció sobre el fuero de paternidad, reafirmando la protección laboral del padre trabajador como una expresión del principio de corresponsabilidad familiar."},{"type":"note","text":"El alcance y la aplicación específica de la Sentencia C-517 de 2024 a cada caso deben verificarse con acompañamiento jurídico especializado. Este contenido es informativo y no sustituye dicho análisis."},{"type":"heading","text":"Corresponsabilidad familiar y Gestión Humana"},{"type":"paragraph","text":"Incorporar la corresponsabilidad familiar en la gestión del talento implica revisar políticas, procesos y comunicación interna, de modo que la organización responda de forma consistente cuando un colaborador informa una situación relacionada con la paternidad."},{"type":"list","items":["Actualizar las políticas internas conforme a los criterios vigentes.","Comunicar con claridad a los colaboradores sus derechos y los procedimientos internos.","Coordinar con el equipo jurídico antes de tomar decisiones sobre el cargo.","Dejar registro documental de cada etapa del proceso.","Promover una cultura organizacional que reconozca la corresponsabilidad familiar."]},{"type":"heading","text":"Cumplimiento como parte de la estrategia organizacional"},{"type":"paragraph","text":"Gestionar correctamente el fuero de paternidad no es solo una obligación legal: es una oportunidad para que la organización demuestre coherencia entre lo que declara y lo que practica frente al equilibrio entre la vida laboral y familiar de su equipo."}]'::jsonb,
  NULL,
  NULL,
  NULL,
  'Fuero de paternidad en Colombia',
  'La protección laboral del padre trabajador se consolida como una expresión de corresponsabilidad familiar. Qué deben revisar las áreas de Gestión Humana a partir de la Sentencia C-517 de 2024.',
  NULL,
  false,
  'PUBLISHED',
  NULL,
  'NEWS'
)
ON CONFLICT (slug)
DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image_url = EXCLUDED.cover_image_url,
  author_name = EXCLUDED.author_name,
  author_role = EXCLUDED.author_role,
  author_image_url = EXCLUDED.author_image_url,
  image_alt = EXCLUDED.image_alt,
  content_blocks = EXCLUDED.content_blocks,
  conclusion = EXCLUDED.conclusion,
  cta_label = EXCLUDED.cta_label,
  cta_href = EXCLUDED.cta_href,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  tags = EXCLUDED.tags,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  post_type = EXCLUDED.post_type,
  updated_at = now();

INSERT INTO content.posts (
  slug,
  title,
  subtitle,
  excerpt,
  content,
  cover_image_url,
  author_name,
  author_role,
  author_image_url,
  image_alt,
  content_blocks,
  conclusion,
  cta_label,
  cta_href,
  seo_title,
  seo_description,
  tags,
  is_featured,
  status,
  published_at,
  post_type
)
VALUES (
  'gestion-humana-estrategica',
  'Gestión Humana Estratégica: Personas, Procesos y Resultados',
  'Tu equipo necesita más que una administración de personal.',
  'La gestión humana dejó de ser solo administración de personal. Selección, desempeño, bienestar, liderazgo y cumplimiento: los frentes que Capital Talento Humano acompaña como parte de tu equipo.',
  'Durante mucho tiempo, la gestión humana se entendió como una función administrativa: contratar, pagar la nómina y tramitar novedades. Hoy, ese alcance se queda corto. Las organizaciones que gestionan bien a sus personas gestionan mejor sus resultados.

De la administración de personal a la gestión estratégica

Un equipo necesita más que una administración de personal: necesita procesos claros, acompañamiento constante y una visión que conecte a las personas con los resultados del negocio.

Los frentes que sostienen una gestión humana sólida

Selección: encontrar el talento adecuado para cada posición.
Administración de procesos y documentos: soporte y trazabilidad de cada etapa del ciclo laboral.
Novedades laborales: gestión oportuna y correcta de cada cambio contractual.
Desempeño: seguimiento y evaluación del aporte de cada colaborador.
Clima organizacional: medición y gestión del ambiente de trabajo.
Bienestar: programas que cuidan a las personas más allá de lo operativo.
Desarrollo: formación y crecimiento del talento interno.
Liderazgo: fortalecimiento de quienes guían equipos.
Políticas y cumplimiento: marcos claros, alineados a la normativa vigente.

Capital se convierte en parte de tu equipo

Capital Talento Humano acompaña a las organizaciones en las distintas etapas del ciclo de vida del colaborador, a través de alternativas de acompañamiento y outsourcing que se ajustan a la realidad y al ritmo de cada empresa.

Esto permite que la organización se enfoque en su negocio, con la tranquilidad de que la gestión de sus personas está en manos de un equipo especializado, comprometido con los procesos, el cumplimiento y los resultados.',
  '/images/noticias/gestion-humana-estrategica.png',
  NULL,
  NULL,
  NULL,
  'Equipo de Capital Consulting reunido analizando estrategia y resultados de gestión humana en sala de juntas',
  '[{"type":"paragraph","text":"Durante mucho tiempo, la gestión humana se entendió como una función administrativa: contratar, pagar la nómina y tramitar novedades. Hoy, ese alcance se queda corto. Las organizaciones que gestionan bien a sus personas gestionan mejor sus resultados."},{"type":"heading","text":"De la administración de personal a la gestión estratégica"},{"type":"paragraph","text":"Un equipo necesita más que una administración de personal: necesita procesos claros, acompañamiento constante y una visión que conecte a las personas con los resultados del negocio."},{"type":"heading","text":"Los frentes que sostienen una gestión humana sólida"},{"type":"list","items":["Selección: encontrar el talento adecuado para cada posición.","Administración de procesos y documentos: soporte y trazabilidad de cada etapa del ciclo laboral.","Novedades laborales: gestión oportuna y correcta de cada cambio contractual.","Desempeño: seguimiento y evaluación del aporte de cada colaborador.","Clima organizacional: medición y gestión del ambiente de trabajo.","Bienestar: programas que cuidan a las personas más allá de lo operativo.","Desarrollo: formación y crecimiento del talento interno.","Liderazgo: fortalecimiento de quienes guían equipos.","Políticas y cumplimiento: marcos claros, alineados a la normativa vigente."]},{"type":"heading","text":"Capital se convierte en parte de tu equipo"},{"type":"paragraph","text":"Capital Talento Humano acompaña a las organizaciones en las distintas etapas del ciclo de vida del colaborador, a través de alternativas de acompañamiento y outsourcing que se ajustan a la realidad y al ritmo de cada empresa."},{"type":"paragraph","text":"Esto permite que la organización se enfoque en su negocio, con la tranquilidad de que la gestión de sus personas está en manos de un equipo especializado, comprometido con los procesos, el cumplimiento y los resultados."}]'::jsonb,
  NULL,
  NULL,
  NULL,
  'Gestión Humana Estratégica: Personas, Procesos y Resultados',
  'La gestión humana dejó de ser solo administración de personal. Selección, desempeño, bienestar, liderazgo y cumplimiento: los frentes que Capital Talento Humano acompaña como parte de tu equipo.',
  NULL,
  false,
  'PUBLISHED',
  NULL,
  'NEWS'
)
ON CONFLICT (slug)
DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image_url = EXCLUDED.cover_image_url,
  author_name = EXCLUDED.author_name,
  author_role = EXCLUDED.author_role,
  author_image_url = EXCLUDED.author_image_url,
  image_alt = EXCLUDED.image_alt,
  content_blocks = EXCLUDED.content_blocks,
  conclusion = EXCLUDED.conclusion,
  cta_label = EXCLUDED.cta_label,
  cta_href = EXCLUDED.cta_href,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  tags = EXCLUDED.tags,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  post_type = EXCLUDED.post_type,
  updated_at = now();

INSERT INTO content.posts (
  slug,
  title,
  subtitle,
  excerpt,
  content,
  cover_image_url,
  author_name,
  author_role,
  author_image_url,
  image_alt,
  content_blocks,
  conclusion,
  cta_label,
  cta_href,
  seo_title,
  seo_description,
  tags,
  is_featured,
  status,
  published_at,
  post_type
)
VALUES (
  'permisos-laborales',
  'Permisos laborales por situaciones familiares',
  'Una gestión adecuada también significa entender las necesidades de las personas.',
  'Calamidad doméstica, nacimiento de un hijo, adopción o fallecimiento de un familiar: cómo debe gestionar Gestión Humana los permisos laborales por situaciones familiares.',
  'La vida de los colaboradores no se detiene en la puerta de la oficina. Situaciones familiares imprevistas o esperadas requieren, en distintos momentos, un permiso laboral. Gestionarlas bien es, a la vez, una responsabilidad legal y una muestra de que la organización entiende a las personas que la conforman.

Situaciones frecuentes que requieren un permiso laboral

Calamidad doméstica.
Nacimiento de un hijo.
Adopción.
Fallecimiento de un familiar.
Otras situaciones familiares que ameriten acompañamiento por parte de la organización.

Cómo debe proceder Gestión Humana

Ante cada solicitud, Gestión Humana cumple un rol clave que combina rigor y sensibilidad:

Revisar el derecho aplicable a cada situación particular.
Solicitar y verificar los soportes correspondientes.
Registrar adecuadamente la novedad en los sistemas de la organización.
Comunicar con claridad al trabajador las condiciones del permiso otorgado.

Este contenido es informativo y de gestión organizacional. La aplicación de cada permiso depende del derecho vigente y de las particularidades del caso; ante la duda, es recomendable el acompañamiento de un especialista.

Personas, Gestión Humana y cumplimiento

Una gestión adecuada de los permisos laborales no se limita a cumplir un trámite: significa entender las necesidades de las personas, sostener el cumplimiento normativo y fortalecer la confianza entre el colaborador y la organización.',
  '/images/noticias/permisos-laborales.png',
  NULL,
  NULL,
  NULL,
  'Asesora de Gestión Humana de Capital Consulting revisando documentación laboral junto a un colaborador',
  '[{"type":"paragraph","text":"La vida de los colaboradores no se detiene en la puerta de la oficina. Situaciones familiares imprevistas o esperadas requieren, en distintos momentos, un permiso laboral. Gestionarlas bien es, a la vez, una responsabilidad legal y una muestra de que la organización entiende a las personas que la conforman."},{"type":"heading","text":"Situaciones frecuentes que requieren un permiso laboral"},{"type":"list","items":["Calamidad doméstica.","Nacimiento de un hijo.","Adopción.","Fallecimiento de un familiar.","Otras situaciones familiares que ameriten acompañamiento por parte de la organización."]},{"type":"heading","text":"Cómo debe proceder Gestión Humana"},{"type":"paragraph","text":"Ante cada solicitud, Gestión Humana cumple un rol clave que combina rigor y sensibilidad:"},{"type":"list","items":["Revisar el derecho aplicable a cada situación particular.","Solicitar y verificar los soportes correspondientes.","Registrar adecuadamente la novedad en los sistemas de la organización.","Comunicar con claridad al trabajador las condiciones del permiso otorgado."]},{"type":"note","text":"Este contenido es informativo y de gestión organizacional. La aplicación de cada permiso depende del derecho vigente y de las particularidades del caso; ante la duda, es recomendable el acompañamiento de un especialista."},{"type":"heading","text":"Personas, Gestión Humana y cumplimiento"},{"type":"paragraph","text":"Una gestión adecuada de los permisos laborales no se limita a cumplir un trámite: significa entender las necesidades de las personas, sostener el cumplimiento normativo y fortalecer la confianza entre el colaborador y la organización."}]'::jsonb,
  NULL,
  NULL,
  NULL,
  'Permisos laborales por situaciones familiares',
  'Calamidad doméstica, nacimiento de un hijo, adopción o fallecimiento de un familiar: cómo debe gestionar Gestión Humana los permisos laborales por situaciones familiares.',
  NULL,
  false,
  'PUBLISHED',
  NULL,
  'NEWS'
)
ON CONFLICT (slug)
DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image_url = EXCLUDED.cover_image_url,
  author_name = EXCLUDED.author_name,
  author_role = EXCLUDED.author_role,
  author_image_url = EXCLUDED.author_image_url,
  image_alt = EXCLUDED.image_alt,
  content_blocks = EXCLUDED.content_blocks,
  conclusion = EXCLUDED.conclusion,
  cta_label = EXCLUDED.cta_label,
  cta_href = EXCLUDED.cta_href,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  tags = EXCLUDED.tags,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  post_type = EXCLUDED.post_type,
  updated_at = now();


INSERT INTO content.post_category_relations (
  post_id,
  category_id
)
SELECT
  p.id,
  c.id
FROM content.posts p
JOIN content.post_categories c
  ON lower(c.name) = lower('GESTIÓN HUMANA')
WHERE p.slug = 'estrategia-gestion-humana-resultados'
ON CONFLICT (post_id, category_id)
DO NOTHING;

INSERT INTO content.post_category_relations (
  post_id,
  category_id
)
SELECT
  p.id,
  c.id
FROM content.posts p
JOIN content.post_categories c
  ON lower(c.name) = lower('SST')
WHERE p.slug = 'revisar-sistema-gestion-sst'
ON CONFLICT (post_id, category_id)
DO NOTHING;

INSERT INTO content.post_category_relations (
  post_id,
  category_id
)
SELECT
  p.id,
  c.id
FROM content.posts p
JOIN content.post_categories c
  ON lower(c.name) = lower('SEGURIDAD VIAL')
WHERE p.slug = 'estrategia-seguridad-vial-empresarial'
ON CONFLICT (post_id, category_id)
DO NOTHING;

INSERT INTO content.post_category_relations (
  post_id,
  category_id
)
SELECT
  p.id,
  c.id
FROM content.posts p
JOIN content.post_categories c
  ON lower(c.name) = lower('FORMACIÓN')
WHERE p.slug = 'desarrollo-talento-desempeno-organizacional'
ON CONFLICT (post_id, category_id)
DO NOTHING;

INSERT INTO content.post_category_relations (
  post_id,
  category_id
)
SELECT
  p.id,
  c.id
FROM content.posts p
JOIN content.post_categories c
  ON lower(c.name) = lower('GESTIÓN EMPRESARIAL')
WHERE p.slug = 'problemas-empresariales-oportunidades-crecimiento'
ON CONFLICT (post_id, category_id)
DO NOTHING;

INSERT INTO content.post_category_relations (
  post_id,
  category_id
)
SELECT
  p.id,
  c.id
FROM content.posts p
JOIN content.post_categories c
  ON lower(c.name) = lower('TALENTO')
WHERE p.slug = 'identificar-desarrollar-talento-alto-potencial'
ON CONFLICT (post_id, category_id)
DO NOTHING;

INSERT INTO content.post_category_relations (
  post_id,
  category_id
)
SELECT
  p.id,
  c.id
FROM content.posts p
JOIN content.post_categories c
  ON lower(c.name) = lower('GESTIÓN HUMANA')
WHERE p.slug = 'proteccion-maternidad-lactancia'
ON CONFLICT (post_id, category_id)
DO NOTHING;

INSERT INTO content.post_category_relations (
  post_id,
  category_id
)
SELECT
  p.id,
  c.id
FROM content.posts p
JOIN content.post_categories c
  ON lower(c.name) = lower('GESTIÓN HUMANA · LABORAL')
WHERE p.slug = 'fuero-paternidad'
ON CONFLICT (post_id, category_id)
DO NOTHING;

INSERT INTO content.post_category_relations (
  post_id,
  category_id
)
SELECT
  p.id,
  c.id
FROM content.posts p
JOIN content.post_categories c
  ON lower(c.name) = lower('CAPITAL TALENTO HUMANO')
WHERE p.slug = 'gestion-humana-estrategica'
ON CONFLICT (post_id, category_id)
DO NOTHING;

INSERT INTO content.post_category_relations (
  post_id,
  category_id
)
SELECT
  p.id,
  c.id
FROM content.posts p
JOIN content.post_categories c
  ON lower(c.name) = lower('GESTIÓN HUMANA · LABORAL')
WHERE p.slug = 'permisos-laborales'
ON CONFLICT (post_id, category_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('gestión humana')
WHERE p.slug = 'estrategia-gestion-humana-resultados'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('talento')
WHERE p.slug = 'estrategia-gestion-humana-resultados'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('cultura organizacional')
WHERE p.slug = 'estrategia-gestion-humana-resultados'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('liderazgo')
WHERE p.slug = 'estrategia-gestion-humana-resultados'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('desempeño')
WHERE p.slug = 'estrategia-gestion-humana-resultados'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('bienestar')
WHERE p.slug = 'estrategia-gestion-humana-resultados'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('productividad')
WHERE p.slug = 'estrategia-gestion-humana-resultados'
ON CONFLICT (post_id, tag_id)
DO NOTHING;

INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('SST')
WHERE p.slug = 'revisar-sistema-gestion-sst'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('SG-SST')
WHERE p.slug = 'revisar-sistema-gestion-sst'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('gestión de riesgos')
WHERE p.slug = 'revisar-sistema-gestion-sst'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('cumplimiento')
WHERE p.slug = 'revisar-sistema-gestion-sst'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('auditoría')
WHERE p.slug = 'revisar-sistema-gestion-sst'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('mejora continua')
WHERE p.slug = 'revisar-sistema-gestion-sst'
ON CONFLICT (post_id, tag_id)
DO NOTHING;

INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('seguridad vial')
WHERE p.slug = 'estrategia-seguridad-vial-empresarial'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('PESV')
WHERE p.slug = 'estrategia-seguridad-vial-empresarial'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('gestión del riesgo vial')
WHERE p.slug = 'estrategia-seguridad-vial-empresarial'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('capacitación')
WHERE p.slug = 'estrategia-seguridad-vial-empresarial'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('indicadores')
WHERE p.slug = 'estrategia-seguridad-vial-empresarial'
ON CONFLICT (post_id, tag_id)
DO NOTHING;

INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('formación')
WHERE p.slug = 'desarrollo-talento-desempeno-organizacional'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('desarrollo del talento')
WHERE p.slug = 'desarrollo-talento-desempeno-organizacional'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('competencias')
WHERE p.slug = 'desarrollo-talento-desempeno-organizacional'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('liderazgo')
WHERE p.slug = 'desarrollo-talento-desempeno-organizacional'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('aprendizaje')
WHERE p.slug = 'desarrollo-talento-desempeno-organizacional'
ON CONFLICT (post_id, tag_id)
DO NOTHING;

INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('gestión empresarial')
WHERE p.slug = 'problemas-empresariales-oportunidades-crecimiento'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('estrategia')
WHERE p.slug = 'problemas-empresariales-oportunidades-crecimiento'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('procesos')
WHERE p.slug = 'problemas-empresariales-oportunidades-crecimiento'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('productividad')
WHERE p.slug = 'problemas-empresariales-oportunidades-crecimiento'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('innovación')
WHERE p.slug = 'problemas-empresariales-oportunidades-crecimiento'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('toma de decisiones')
WHERE p.slug = 'problemas-empresariales-oportunidades-crecimiento'
ON CONFLICT (post_id, tag_id)
DO NOTHING;

INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('talento')
WHERE p.slug = 'identificar-desarrollar-talento-alto-potencial'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('alto potencial')
WHERE p.slug = 'identificar-desarrollar-talento-alto-potencial'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('evaluación')
WHERE p.slug = 'identificar-desarrollar-talento-alto-potencial'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('desarrollo')
WHERE p.slug = 'identificar-desarrollar-talento-alto-potencial'
ON CONFLICT (post_id, tag_id)
DO NOTHING;


INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower('retención')
WHERE p.slug = 'identificar-desarrollar-talento-alto-potencial'
ON CONFLICT (post_id, tag_id)
DO NOTHING;

COMMIT;
