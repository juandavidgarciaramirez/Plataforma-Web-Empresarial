/**
 * Fuente de datos de la sección Blog.
 *
 * El Blog es contenido de conocimiento (análisis, guías, buenas prácticas,
 * opinión experta) y se diferencia deliberadamente de `src/data/news.ts`
 * (actualidad, cambios normativos, comunicados). Todo el contenido editorial
 * vive aquí para que los componentes de `blog` (listado, tarjetas, artículo)
 * permanezcan genéricos. Agregar un artículo nuevo es agregar un objeto a
 * `blogArticles`: no requiere tocar componentes ni rutas.
 *
 * Esta es la única fuente de verdad de las categorías (`BLOG_CATEGORIES`):
 * el backend (`src/features/blog`) las reexporta desde aquí en lugar de
 * definirlas por duplicado.
 *
 * Reemplazo futuro por PostgreSQL: ver `src/features/blog/blog.repository.ts`.
 */

export type BlogContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "note"; text: string }

/** Las 8 categorías del Blog (sección 2 del brief). "TODOS" es un filtro de UI, no una categoría de contenido. */
export const BLOG_CATEGORIES = [
  "GESTIÓN HUMANA",
  "SST",
  "SEGURIDAD VIAL",
  "FORMACIÓN",
  "GESTIÓN EMPRESARIAL",
  "FINANZAS",
  "CONSULTORÍA",
  "TALENTO",
] as const

export type BlogCategory = (typeof BLOG_CATEGORIES)[number]

export interface BlogAuthor {
  name: string
  role: string
  /** Solo presente cuando hay un especialista confirmado con foto (ver `src/data/team.ts`). */
  image?: string
}

/**
 * Autor por defecto cuando un artículo todavía no tiene un especialista
 * asignado. No se inventan autores (sección 5 del brief): mientras no exista
 * un especialista confirmado para una categoría, el artículo se publica a
 * nombre del equipo.
 */
export const DEFAULT_BLOG_AUTHOR: BlogAuthor = {
  name: "Equipo Capital Consulting",
  role: "Capital Consulting and Services SAS",
}

import type { GalleryImage } from "./news"

export interface BlogArticle {
  id: string
  slug: string
  title: string
  subtitle: string
  excerpt: string
  content: BlogContentBlock[]
  /** Conclusiones: 2-4 ideas de cierre, mostradas en un bloque propio antes del CTA. */
  conclusion: string[]
  image: string
  imageAlt: string
  /** Galería de imágenes adicionales cargadas desde el administrador (Etapa 15). */
  gallery?: GalleryImage[]
  category: BlogCategory
  author: BlogAuthor
  /** ISO date (YYYY-MM-DD). */
  publishedAt: string
  /** El artículo destacado se muestra en el bloque hero del listado. */
  featured: boolean
  tags: string[]
  /** CTA hacia la línea de servicio relacionada con la categoría del artículo. */
  cta: { label: string; href: string }
  seo: {
    title: string
    description: string
  }
}

const jennySierra: BlogAuthor = {
  name: "Jenny Sierra",
  role: "Especialista en Seguridad y Salud en el Trabajo",
  image: "/images/nosotros/jenny-sierra.jpeg",
}

/**const julioBetin: BlogAuthor = {
  name: "Julio Betín",
  role: "Especialista en Movilidad y Seguridad Vial",
  image: "/images/nosotros/julio-betin.jpeg",
}*/

const manuelMesa: BlogAuthor = {
  name: "Manuel Mesa",
  role: "Especialista en Gestión Financiera",
  image: "/images/nosotros/manuel-mesa.jpeg",
}

export const blogArticles: BlogArticle[] = [
  {
    id: "estrategia-gestion-humana-resultados",
    slug: "estrategia-gestion-humana-resultados",
    title: "¿Cómo construir una estrategia de Gestión Humana que genere resultados?",
    subtitle:
      "De la administración de personal a un modelo que conecta talento, cultura, liderazgo y desempeño con los resultados del negocio.",
    category: "GESTIÓN HUMANA",
    image: "/images/blog/blog-01.png",
    imageAlt:
      "Equipo directivo de Capital Consulting analizando un plan estratégico de talento humano en sala de juntas",
    excerpt:
      "Una estrategia de Gestión Humana que genera resultados no se limita a administrar personal: articula talento, cultura, liderazgo, desempeño y bienestar alrededor de un mismo propósito. Estos son los pilares que la sostienen.",
    featured: true,
    author: DEFAULT_BLOG_AUTHOR,
    publishedAt: "2026-08-18",
    tags: [
      "gestión humana",
      "talento",
      "cultura organizacional",
      "liderazgo",
      "desempeño",
      "bienestar",
      "productividad",
    ],
    content: [
      {
        type: "paragraph",
        text: "Durante años, la Gestión Humana se midió por su capacidad de ejecutar: contratar a tiempo, pagar la nómina sin errores, tramitar novedades. Esa base sigue siendo indispensable, pero ya no es suficiente. Las organizaciones que hoy obtienen mejores resultados son las que entendieron que el talento no se administra: se dirige con la misma intención estratégica con la que se dirige el negocio.",
      },
      {
        type: "heading",
        text: "Talento: el punto de partida, no el destino",
      },
      {
        type: "paragraph",
        text: "Atraer talento no es llenar vacantes; es incorporar a las personas correctas para el momento correcto de la organización. Una estrategia de talento madura empieza por definir qué perfiles necesita el negocio en los próximos años, no solo qué cargo está vacante hoy, y construye desde ahí sus procesos de selección, inducción y plan de carrera.",
      },
      {
        type: "heading",
        text: "Cultura: el terreno donde crece —o se estanca— el desempeño",
      },
      {
        type: "paragraph",
        text: "La cultura organizacional es el conjunto de comportamientos que la empresa premia, tolera o corrige todos los días, más allá de lo que declaran sus valores corporativos. Ninguna estrategia de Gestión Humana funciona si la cultura real contradice lo que se busca lograr: una organización no puede pedir innovación si castiga el error, ni exigir colaboración si mide y reconoce solo el desempeño individual.",
      },
      {
        type: "heading",
        text: "Liderazgo: quien sostiene la estrategia en el día a día",
      },
      {
        type: "paragraph",
        text: "La estrategia de Gestión Humana no la ejecuta un área: la ejecutan los líderes de cada equipo, en cada conversación de desempeño, en cada decisión de reconocimiento y en cada momento de retroalimentación. Fortalecer el liderazgo —con criterios claros, herramientas y acompañamiento— es lo que permite que una estrategia diseñada en el nivel directivo realmente llegue a las personas.",
      },
      {
        type: "heading",
        text: "Desempeño y bienestar: dos caras de la misma moneda",
      },
      {
        type: "paragraph",
        text: "Gestionar el desempeño sin atender el bienestar produce resultados de corto plazo y desgaste de largo plazo. Una estrategia sólida conecta ambos frentes:",
      },
      {
        type: "list",
        items: [
          "Objetivos claros y medibles, conectados con la estrategia del negocio.",
          "Seguimiento continuo del desempeño, no solo evaluaciones anuales.",
          "Programas de bienestar que respondan a necesidades reales del equipo.",
          "Espacios formales de reconocimiento y retroalimentación.",
          "Indicadores de clima organizacional revisados con la misma disciplina que los indicadores financieros.",
        ],
      },
      {
        type: "note",
        text: "El bienestar no es un beneficio adicional que se activa cuando sobra presupuesto: es una condición para sostener la productividad en el tiempo. Tratarlo como estrategia, y no como iniciativa aislada, es lo que marca la diferencia.",
      },
      {
        type: "heading",
        text: "De la intención a la ejecución",
      },
      {
        type: "paragraph",
        text: "Una estrategia de Gestión Humana que genera resultados no se mide por cuántas políticas existen en un documento, sino por cuánto de eso realmente ocurre en el día a día de la organización. Ese es el reto: pasar de la intención a la ejecución sostenida, con procesos, indicadores y acompañamiento que permitan corregir el rumbo cuando sea necesario.",
      },
    ],
    conclusion: [
      "El talento, la cultura, el liderazgo, el desempeño y el bienestar no son iniciativas independientes: son piezas de un mismo sistema.",
      "Una estrategia de Gestión Humana genera resultados cuando se ejecuta con la misma disciplina y seguimiento que cualquier otra área del negocio.",
      "Invertir en las personas de forma estructurada es, hoy, una decisión de productividad tanto como una decisión humana.",
    ],
    cta: { label: "Conoce Capital Talento Humano →", href: "/servicios/capital-staffing" },
    seo: {
      title: "¿Cómo construir una estrategia de Gestión Humana que genere resultados?",
      description:
        "Talento, cultura, liderazgo, desempeño y bienestar: los pilares de una estrategia de Gestión Humana que realmente impacta los resultados de la organización.",
    },
  },
  {
    id: "revisar-sistema-gestion-sst",
    slug: "revisar-sistema-gestion-sst",
    title: "5 aspectos que toda organización debería revisar en su Sistema de Gestión de SST",
    subtitle:
      "Una revisión periódica del SG-SST no es un trámite administrativo: es la base para prevenir, cumplir y proteger a las personas.",
    category: "SST",
    image: "/images/blog/blog-02.png",
    imageAlt:
      "Especialista de Capital Consulting revisando con un equipo operativo los estándares de Seguridad y Salud en el Trabajo en planta",
    excerpt:
      "Identificación de riesgos, cumplimiento normativo, auditorías, prevención y mejora continua: cinco frentes que toda organización debería revisar en su Sistema de Gestión de Seguridad y Salud en el Trabajo.",
    featured: false,
    author: jennySierra,
    publishedAt: "2026-08-05",
    tags: ["SST", "SG-SST", "gestión de riesgos", "cumplimiento", "auditoría", "mejora continua"],
    content: [
      {
        type: "paragraph",
        text: "El Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST) no es un documento que se construye una vez y se archiva: es un sistema vivo que debe revisarse con la misma frecuencia con la que cambian los riesgos, los procesos y la normativa. Muchas organizaciones cumplen en el papel, pero no han revisado a fondo si su sistema realmente está previniendo lo que debería prevenir. Estos son cinco aspectos que vale la pena poner sobre la mesa.",
      },
      {
        type: "heading",
        text: "1. Identificación de riesgos actualizada a la operación real",
      },
      {
        type: "paragraph",
        text: "La matriz de peligros y riesgos debe reflejar la operación tal como es hoy, no como era cuando se diseñó el sistema. Cambios en procesos, en maquinaria, en personal o en instalaciones deben traducirse en una actualización de la identificación de peligros; de lo contrario, el sistema protege frente a riesgos que ya no existen y deja sin cubrir los que sí.",
      },
      {
        type: "heading",
        text: "2. Cumplimiento frente a los Estándares Mínimos vigentes",
      },
      {
        type: "paragraph",
        text: "Revisar el cumplimiento no debería limitarse a la autoevaluación anual exigida por la normativa. Es una oportunidad para verificar, con evidencia real, que cada estándar aplicable a la organización tiene soporte documental, responsables definidos y seguimiento activo —no solo una casilla marcada.",
      },
      {
        type: "heading",
        text: "3. Auditorías internas que realmente cuestionan el sistema",
      },
      {
        type: "paragraph",
        text: "Una auditoría que solo confirma lo que ya se sabe no aporta valor. Las auditorías internas de SG-SST deben estar diseñadas para encontrar brechas: procesos que no se ejecutan como están documentados, controles que existen en el papel pero no en el terreno, o indicadores que no reflejan la realidad operativa.",
      },
      {
        type: "heading",
        text: "4. Prevención como prioridad sobre la reacción",
      },
      {
        type: "paragraph",
        text: "Un sistema maduro se reconoce porque invierte más en prevenir que en reaccionar. Eso implica revisar si los programas de prevención —inspecciones, capacitación, controles de ingeniería, elementos de protección— están dimensionados según el nivel de riesgo real de cada proceso, y no distribuidos de forma uniforme sin importar la exposición de cada área.",
      },
      {
        type: "heading",
        text: "5. Mejora continua con base en datos, no en percepciones",
      },
      {
        type: "paragraph",
        text: "La investigación de incidentes, los reportes de condiciones inseguras y los indicadores de gestión deben alimentar decisiones concretas de mejora. Un SG-SST que no cambia después de un incidente, o que repite las mismas acciones correctivas una y otra vez, no está aprendiendo de su propia información.",
      },
      {
        type: "note",
        text: "Este contenido tiene fines informativos y de gestión organizacional. La aplicación de cada estándar depende de la actividad económica, el número de trabajadores y el nivel de riesgo de cada organización; el diagnóstico específico debe realizarlo un especialista en SST.",
      },
    ],
    conclusion: [
      "Un SG-SST se fortalece cuando se revisa con la misma disciplina con la que se revisan los indicadores financieros u operativos.",
      "La identificación de riesgos actualizada y las auditorías internas rigurosas son la base para que la prevención funcione, no solo para cumplir.",
      "La mejora continua exige datos: sin ellos, el sistema repite errores en lugar de corregirlos.",
    ],
    cta: { label: "Conoce Capital SST →", href: "/servicios/capital-hse" },
    seo: {
      title: "5 aspectos que toda organización debería revisar en su Sistema de Gestión de SST",
      description:
        "Identificación de riesgos, cumplimiento, auditorías, prevención y mejora continua: cinco frentes clave para fortalecer el Sistema de Gestión de SST de tu organización.",
    },
  },
  {
    id: "estrategia-seguridad-vial-empresarial",
    slug: "estrategia-seguridad-vial-empresarial",
    title: "¿Qué debe tener una estrategia efectiva de Seguridad Vial empresarial?",
    subtitle:
      "El PESV es el punto de partida normativo; la gestión del riesgo vial es un compromiso permanente con la vida.",
    category: "SEGURIDAD VIAL",
    image: "/images/blog/blog-03.png",
    imageAlt:
      "Especialista de Capital Mobility revisando el plan estratégico de seguridad vial junto a un equipo operativo y su flota",
    excerpt:
      "PESV, gestión del riesgo vial, comportamiento, capacitación e indicadores: los componentes que sostienen una estrategia de Seguridad Vial empresarial capaz de proteger vidas y reducir la siniestralidad.",
    featured: false,
    author: DEFAULT_BLOG_AUTHOR,
    publishedAt: "2026-07-24",
    tags: ["seguridad vial", "PESV", "gestión del riesgo vial", "capacitación", "indicadores"],
    content: [
      {
        type: "paragraph",
        text: "Para cualquier organización con flota propia, contratada o colaboradores que se movilizan como parte de su labor, la seguridad vial no es un tema secundario: es un riesgo que puede costar vidas. Una estrategia efectiva va más allá de cumplir con el Plan Estratégico de Seguridad Vial (PESV): construye una gestión permanente del riesgo vial dentro de la cultura de la organización.",
      },
      {
        type: "heading",
        text: "PESV: el punto de partida normativo",
      },
      {
        type: "paragraph",
        text: "El PESV es el marco que exige la normativa colombiana para organizaciones con exposición al riesgo vial, y define las acciones mínimas frente a vehículos, conductores, infraestructura y comportamiento. Cumplirlo es obligatorio, pero tratarlo únicamente como un requisito documental es el primer error: un PESV bien diseñado debe convertirse en la hoja de ruta operativa de la seguridad vial de la organización, no en un archivo que se actualiza solo quando lo pide una auditoría.",
      },
      {
        type: "heading",
        text: "Gestión del riesgo vial: más allá del cumplimiento",
      },
      {
        type: "paragraph",
        text: "Gestionar el riesgo vial significa identificar, en cada ruta y cada tipo de operación, qué puede salir mal —fatiga, exceso de velocidad, condiciones de la vía, estado del vehículo— y actuar sobre esas causas antes de que se conviertan en un siniestro. Es un ejercicio de análisis constante, no una lista de controles que se revisa una vez al año.",
      },
      {
        type: "heading",
        text: "Comportamiento: el factor que más pesa en la siniestralidad",
      },
      {
        type: "paragraph",
        text: "La mayoría de los siniestros viales no se explican por fallas mecánicas, sino por decisiones humanas: velocidad inadecuada, distracción, fatiga o no uso del cinturón de seguridad. Una estrategia efectiva pone el comportamiento del conductor en el centro, con seguimiento cercano y no solo con señalización o recordatorios genéricos.",
      },
      {
        type: "heading",
        text: "Capacitación que forma cultura, no solo cumple horas",
      },
      {
        type: "paragraph",
        text: "La capacitación en seguridad vial pierde su propósito cuando se reduce a completar un número de horas exigido. Una capacitación efectiva se diseña según los riesgos específicos de cada tipo de conductor y de cada ruta, y se refuerza de forma constante, no en una sola jornada anual.",
      },
      {
        type: "heading",
        text: "Indicadores: lo que no se mide, no mejora",
      },
      {
        type: "paragraph",
        text: "Una estrategia de seguridad vial madura hace seguimiento a indicadores concretos —cuasi accidentes, incidentes, comportamientos de riesgo detectados, cumplimiento de mantenimiento preventivo— y los revisa con la misma frecuencia y rigor que cualquier otro indicador crítico del negocio.",
      },
      {
        type: "list",
        items: [
          "PESV como hoja de ruta operativa, no como documento de cumplimiento.",
          "Gestión activa del riesgo vial por ruta y tipo de operación.",
          "Comportamiento del conductor como foco central de intervención.",
          "Capacitación diseñada según el riesgo real, con refuerzo constante.",
          "Indicadores de seguridad vial revisados con la misma disciplina que los indicadores del negocio.",
        ],
      },
    ],
    conclusion: [
      "El PESV es el punto de partida obligatorio, pero la seguridad vial efectiva se construye en la gestión diaria del riesgo.",
      "El comportamiento humano es el factor de mayor peso en la siniestralidad, y debe ser el centro de cualquier estrategia.",
      "Medir y hacer seguimiento constante es lo que permite anticipar un siniestro antes de que ocurra, no solo reaccionar después.",
    ],
    cta: { label: "Conoce Capital Mobility →", href: "/servicios/capital-mobility" },
    seo: {
      title: "¿Qué debe tener una estrategia efectiva de Seguridad Vial empresarial?",
      description:
        "PESV, gestión del riesgo vial, comportamiento, capacitación e indicadores: los componentes de una estrategia de Seguridad Vial empresarial que realmente protege vidas.",
    },
  },
  {
    id: "desarrollo-talento-desempeno-organizacional",
    slug: "desarrollo-talento-desempeno-organizacional",
    title: "El desarrollo del talento como estrategia para mejorar el desempeño organizacional",
    subtitle:
      "Capacitar no basta: se necesita un modelo de desarrollo que convierta el aprendizaje en desempeño real.",
    category: "FORMACIÓN",
    image: "/images/blog/blog-04.png",
    imageAlt:
      "Facilitador de Capital Consulting liderando una sesión de formación empresarial con un equipo directivo",
    excerpt:
      "Capacitación, desarrollo, competencias, liderazgo y aprendizaje: por qué formar al talento es una de las estrategias más rentables para mejorar el desempeño organizacional.",
    featured: false,
    author: DEFAULT_BLOG_AUTHOR,
    publishedAt: "2026-07-12",
    tags: ["formación", "desarrollo del talento", "competencias", "liderazgo", "aprendizaje"],
    content: [
      {
        type: "paragraph",
        text: "Cuando una organización enfrenta resultados por debajo de lo esperado, la primera pregunta suele ser sobre procesos, estrategia o recursos. Pocas veces se pregunta si el equipo cuenta con las competencias necesarias para ejecutar lo que se le está pidiendo. El desarrollo del talento es, con frecuencia, la palanca de desempeño menos explorada y más rentable.",
      },
      {
        type: "heading",
        text: "De la capacitación aislada al desarrollo continuo",
      },
      {
        type: "paragraph",
        text: "Una capacitación puntual —un curso, un taller, una charla— puede transmitir información, pero rara vez cambia un comportamiento de forma sostenida. El desarrollo del talento es distinto: es un proceso continuo que combina formación, práctica, retroalimentación y seguimiento, diseñado para que el aprendizaje se traduzca en una forma diferente de trabajar.",
      },
      {
        type: "heading",
        text: "Competencias: el lenguaje común entre la estrategia y las personas",
      },
      {
        type: "paragraph",
        text: "Definir las competencias que cada rol necesita —técnicas y conductuales— es lo que permite conectar la estrategia de la organización con el desarrollo individual de cada colaborador. Sin ese mapa, la formación se vuelve genérica: se capacita en lo disponible, no en lo que la organización realmente necesita para avanzar.",
      },
      {
        type: "heading",
        text: "Liderazgo: el efecto multiplicador de invertir en quienes forman equipos",
      },
      {
        type: "paragraph",
        text: "Formar líderes tiene un efecto multiplicador que rara vez tiene otra inversión en desarrollo: un líder mejor preparado no solo mejora su propio desempeño, sino que influye directamente en el desempeño, la motivación y la permanencia de todo su equipo.",
      },
      {
        type: "heading",
        text: "Aprendizaje que se traduce en desempeño",
      },
      {
        type: "paragraph",
        text: "El verdadero indicador de éxito de un programa de formación no es la asistencia ni la satisfacción de los participantes: es el cambio observable en los indicadores de desempeño después de aplicarlo. Eso exige diseñar la formación con objetivos de negocio claros desde el inicio, y no solo como una actividad de bienestar o cumplimiento.",
      },
      {
        type: "list",
        items: [
          "Diagnóstico de competencias antes de diseñar cualquier programa de formación.",
          "Procesos de desarrollo continuo, no eventos de capacitación aislados.",
          "Inversión prioritaria en el desarrollo de quienes lideran equipos.",
          "Objetivos de desempeño definidos desde el diseño del programa.",
          "Seguimiento posterior a la formación para verificar el cambio real en el trabajo.",
        ],
      },
    ],
    conclusion: [
      "El desarrollo del talento funciona como estrategia cuando se diseña con base en competencias reales y objetivos de negocio, no en la oferta disponible de cursos.",
      "Invertir en el desarrollo de los líderes multiplica el impacto de cualquier programa de formación.",
      "El aprendizaje solo se convierte en resultado cuando hay seguimiento después de la capacitación, no solo durante ella.",
    ],
    cta: { label: "Conoce Capital Learning →", href: "/servicios/capital-learning" },
    seo: {
      title: "El desarrollo del talento como estrategia para mejorar el desempeño organizacional",
      description:
        "Capacitación, desarrollo, competencias, liderazgo y aprendizaje: por qué formar al talento es una de las estrategias más rentables para mejorar el desempeño organizacional.",
    },
  },
  {
    id: "problemas-empresariales-oportunidades-crecimiento",
    slug: "problemas-empresariales-oportunidades-crecimiento",
    title: "De los problemas empresariales a las oportunidades de crecimiento",
    subtitle: "Cada problema recurrente en la operación es, en realidad, una oportunidad de mejora sin explorar.",
    category: "GESTIÓN EMPRESARIAL",
    image: "/images/blog/blog-05.png",
    imageAlt:
      "Consultor de Capital Consulting presentando un análisis estratégico a un equipo directivo en sala de juntas",
    excerpt:
      "Estrategia, procesos, productividad, innovación y toma de decisiones: cómo transformar los problemas empresariales más comunes en oportunidades reales de crecimiento.",
    featured: false,
    author: manuelMesa,
    publishedAt: "2026-06-30",
    tags: ["gestión empresarial", "estrategia", "procesos", "productividad", "innovación", "toma de decisiones"],
    content: [
      {
        type: "paragraph",
        text: "Toda organización convive con problemas: procesos que se atrasan, costos que crecen sin explicación clara, decisiones que tardan más de lo debido. La diferencia entre una empresa que se estanca y una que crece no es la ausencia de problemas, sino la capacidad de leerlos como información valiosa para mejorar.",
      },
      {
        type: "heading",
        text: "Cuando el problema es la falta de estrategia",
      },
      {
        type: "paragraph",
        text: "Muchos problemas operativos son, en realidad, síntomas de una estrategia poco clara o mal comunicada. Cuando los equipos no entienden hacia dónde va la organización, cada área termina optimizando lo suyo sin conexión con el resto, generando fricciones que parecen operativas pero son estratégicas.",
      },
      {
        type: "heading",
        text: "Procesos que frenan en lugar de impulsar",
      },
      {
        type: "paragraph",
        text: "Un proceso que se diseñó para controlar un riesgo puntual puede, con el tiempo, convertirse en un obstáculo que ralentiza toda la operación. Revisar los procesos con una mirada crítica —¿esto sigue siendo necesario tal como está diseñado?— suele revelar oportunidades de simplificación que ninguna auditoría formal detecta.",
      },
      {
        type: "heading",
        text: "Productividad: hacer más con lo que ya se tiene",
      },
      {
        type: "paragraph",
        text: "Antes de asumir que un problema de resultados requiere más recursos, vale la pena revisar si los recursos actuales están siendo bien aprovechados. La mayoría de las organizaciones tiene margen de mejora en productividad que no requiere inversión adicional, solo mejor gestión.",
      },
      {
        type: "heading",
        text: "Innovación: la disposición a cambiar lo que ya no funciona",
      },
      {
        type: "paragraph",
        text: "Innovar no siempre significa crear algo nuevo desde cero; con frecuencia significa tener la disposición de cambiar una forma de trabajar que alguna vez funcionó, pero que ya no responde a la realidad actual del negocio o del mercado.",
      },
      {
        type: "heading",
        text: "Toma de decisiones informadas, no decisiones apresuradas",
      },
      {
        type: "paragraph",
        text: "Los problemas empresariales, cuando se abordan con presión y sin datos suficientes, tienden a resolverse con decisiones apresuradas que generan nuevos problemas. Un buen diagnóstico, aunque tome más tiempo al inicio, reduce el riesgo de repetir el mismo error meses después.",
      },
    ],
    conclusion: [
      "Los problemas recurrentes casi siempre señalan una oportunidad de mejora estructural, no solo un incidente aislado.",
      "Revisar procesos y productividad con frecuencia evita que la organización busque soluciones costosas para problemas que se resuelven con mejor gestión.",
      "Las decisiones informadas, aunque tomen más tiempo, generan crecimiento más sostenible que las decisiones apresuradas.",
    ],
    cta: {
      label: "Conoce Capital Soluciones Empresariales →",
      href: "/servicios/capital-business-services",
    },
    seo: {
      title: "De los problemas empresariales a las oportunidades de crecimiento",
      description:
        "Estrategia, procesos, productividad, innovación y toma de decisiones: cómo transformar los problemas empresariales más comunes en oportunidades reales de crecimiento.",
    },
  },
  {
    id: "identificar-desarrollar-talento-alto-potencial",
    slug: "identificar-desarrollar-talento-alto-potencial",
    title: "¿Cómo identificar y desarrollar el talento de alto potencial en una organización?",
    subtitle:
      "No todo alto desempeño es alto potencial: la diferencia define en quién vale la pena invertir tiempo de desarrollo.",
    category: "TALENTO",
    image: "/images/blog/blog-06.png",
    imageAlt:
      "Líder de Capital Consulting presentando un modelo de desarrollo de liderazgo de alto potencial a su equipo",
    excerpt:
      "Identificación, evaluación, desarrollo, seguimiento y retención: la ruta para identificar el talento de alto potencial en una organización y convertirlo en su ventaja competitiva.",
    featured: false,
    author: DEFAULT_BLOG_AUTHOR,
    publishedAt: "2026-06-18",
    tags: ["talento", "alto potencial", "evaluación", "desarrollo", "retención"],
    content: [
      {
        type: "paragraph",
        text: "Es común que las organizaciones confundan el alto desempeño con el alto potencial, y traten ambos conceptos como si fueran lo mismo. No lo son: un colaborador de alto desempeño sobresale en su rol actual; un colaborador de alto potencial tiene la capacidad de asumir roles de mayor complejidad en el futuro. Identificar esa diferencia es el primer paso para diseñar una estrategia de desarrollo que realmente funcione.",
      },
      {
        type: "heading",
        text: "Identificación: separar el alto desempeño del alto potencial",
      },
      {
        type: "paragraph",
        text: "La identificación del talento de alto potencial no debería basarse únicamente en los resultados del último período de evaluación. Requiere observar comportamientos como la capacidad de aprendizaje, la adaptabilidad ante el cambio y la forma en que la persona influye en otros, más allá del cumplimiento de sus metas individuales.",
      },
      {
        type: "heading",
        text: "Evaluación: criterios objetivos, no solo percepción",
      },
      {
        type: "paragraph",
        text: "Confiar únicamente en la percepción de un jefe directo introduce sesgos importantes en la identificación de alto potencial. Un proceso de evaluación robusto combina múltiples fuentes de información —desempeño, competencias, retroalimentación de pares— para construir una visión más objetiva de cada colaborador.",
      },
      {
        type: "heading",
        text: "Desarrollo: planes a la medida de cada perfil",
      },
      {
        type: "paragraph",
        text: "Una vez identificado, el talento de alto potencial necesita un plan de desarrollo diseñado según sus brechas y aspiraciones específicas, no un programa genérico igual para todos. Proyectos retadores, mentoría y exposición a otras áreas del negocio suelen tener más impacto que la formación tradicional en aula.",
      },
      {
        type: "heading",
        text: "Seguimiento: el potencial se confirma en el tiempo",
      },
      {
        type: "paragraph",
        text: "El potencial identificado en un momento dado debe confirmarse con el tiempo, a través de un seguimiento cercano de la evolución de cada persona frente a los nuevos retos que se le asignan. No hacerlo genera el riesgo de invertir en desarrollo sin verificar si realmente está generando el crecimiento esperado.",
      },
      {
        type: "heading",
        text: "Retención: el talento que se desarrolla, se queda",
      },
      {
        type: "paragraph",
        text: "Identificar y desarrollar talento de alto potencial sin una estrategia de retención es, en la práctica, formar profesionales para que otras organizaciones se beneficien de ellos. La retención efectiva combina proyección de carrera clara, reconocimiento y condiciones competitivas frente al mercado.",
      },
    ],
    conclusion: [
      "El alto potencial no es lo mismo que el alto desempeño: confundirlos lleva a invertir en desarrollo en las personas equivocadas.",
      "Una identificación objetiva, con múltiples fuentes de información, reduce el sesgo y mejora la calidad de las decisiones de desarrollo.",
      "Identificar y desarrollar talento sin una estrategia de retención expone a la organización a perder justamente a quienes más invirtió en formar.",
    ],
    cta: { label: "Conoce Capital Talento Humano →", href: "/servicios/capital-staffing" },
    seo: {
      title: "¿Cómo identificar y desarrollar el talento de alto potencial en una organización?",
      description:
        "Identificación, evaluación, desarrollo, seguimiento y retención: la ruta para identificar el talento de alto potencial en una organización y convertirlo en su ventaja competitiva.",
    },
  },
]

export function getAllArticles(): BlogArticle[] {
  return blogArticles
}

export function getFeaturedArticle(): BlogArticle {
  return blogArticles.find((article) => article.featured) ?? blogArticles[0]
}

/** El resto de artículos, en el orden en que deben aparecer en el grid editorial. */
export function getOtherArticles(): BlogArticle[] {
  const featured = getFeaturedArticle()
  return blogArticles.filter((article) => article.slug !== featured.slug)
}

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return blogArticles.find((article) => article.slug === slug)
}

/** Categorías con al menos un artículo publicado, en el orden fijo de `BLOG_CATEGORIES`. */
export function getActiveCategories(): BlogCategory[] {
  const present = new Set(blogArticles.map((article) => article.category))
  return BLOG_CATEGORIES.filter((category) => present.has(category))
}

/** Artículos relacionados: prioriza la misma categoría y completa con los más recientes. */
export function getRelatedArticles(slug: string, limit = 3): BlogArticle[] {
  const current = getArticleBySlug(slug)
  const rest = blogArticles.filter((article) => article.slug !== slug)

  if (!current) return rest.slice(0, limit)

  const sameCategory = rest.filter((article) => article.category === current.category)
  const others = rest.filter((article) => article.category !== current.category)

  return [...sameCategory, ...others].slice(0, limit)
}
