/**
 * Fuente de datos de la sección Noticias.
 *
 * Todo el contenido editorial vive aquí para que los componentes de
 * `noticias` (listado, tarjetas, artículo) permanezcan genéricos. Agregar
 * una noticia nueva es agregar un objeto a `newsArticles`: no requiere
 * tocar componentes ni rutas.
 */

export type NewsContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "note"; text: string }

/** Imagen adicional administrable (galería al final del artículo, Etapa 15). */
export interface GalleryImage {
  url: string
  alt: string | null
  width: number | null
  height: number | null
}

export interface NewsArticle {
  id: string
  slug: string
  title: string
  subtitle: string
  category: string
  image: string
  imageAlt: string
  excerpt: string
  content: NewsContentBlock[]
  /** Galería de imágenes adicionales cargadas desde el administrador. */
  gallery?: GalleryImage[]
  /** La noticia destacada se muestra en el bloque hero del listado. */
  featured: boolean
  /** ISO date de publicación (solo disponible para noticias reales del backend); usada en JSON-LD/OG `publishedTime`. */
  publishedAt?: string
  seo: {
    title: string
    description: string
  }
}

export const newsArticles: NewsArticle[] = [
  {
    id: "proteccion-maternidad-lactancia",
    slug: "proteccion-maternidad-lactancia",
    title: "Protección laboral de la maternidad y la lactancia en Colombia",
    subtitle:
      "Un compromiso legal y humano que las organizaciones deben conocer",
    category: "GESTIÓN HUMANA",
    image: "/images/noticias/maternidad-lactancia.png",
    imageAlt:
      "Profesional de Capital Consulting atendiendo una videollamada de asesoría desde su oficina",
    excerpt:
      "La maternidad y la lactancia cuentan con una protección laboral especial en Colombia. Un repaso al compromiso legal y humano que toda organización debe incorporar en su gestión.",
    featured: true,
    content: [
      {
        type: "paragraph",
        text: "La maternidad y la lactancia gozan en Colombia de una protección laboral especial, que compromete tanto a la ley como a la cultura de cada organización. Para las áreas de Gestión Humana, entender el alcance de esta protección no es opcional: es un pilar de la relación laboral y de la reputación de la empresa.",
      },
      {
        type: "heading",
        text: "Estabilidad laboral para madres gestantes y lactantes",
      },
      {
        type: "paragraph",
        text: "La protección laboral de la maternidad se traduce, ante todo, en estabilidad laboral: la trabajadora en estado de embarazo o en período de lactancia cuenta con garantías especiales frente a la terminación de su contrato, que exigen a la organización actuar con especial cuidado, información y respaldo documental en cada decisión que involucre su cargo.",
      },
      {
        type: "heading",
        text: "La lactancia como derecho que se sostiene en el día a día",
      },
      {
        type: "paragraph",
        text: "La protección no termina con el nacimiento. El período de lactancia implica ajustes concretos en la jornada y en la organización del trabajo, y requiere que la empresa disponga los tiempos y las condiciones necesarias para que la trabajadora pueda ejercer este derecho sin que ello se traduzca en una desventaja laboral.",
      },
      {
        type: "heading",
        text: "Gestión del riesgo laboral y jurídico",
      },
      {
        type: "list",
        items: [
          "Identificar oportunamente la novedad de embarazo o lactancia y dejar constancia formal de la misma.",
          "Revisar el cargo, las funciones y las condiciones de riesgo asociadas al puesto de trabajo.",
          "Acompañar documentalmente cada etapa, desde la notificación hasta el reintegro.",
          "Hacer seguimiento a los tiempos de protección legal aplicables a cada caso.",
          "Coordinar de forma permanente entre Gestión Humana y el equipo jurídico.",
        ],
      },
      {
        type: "note",
        text: "Este contenido tiene fines informativos y de gestión organizacional. No constituye asesoría jurídica personalizada: cada situación debe analizarse a la luz de sus particularidades y, de ser necesario, con acompañamiento especializado.",
      },
      {
        type: "heading",
        text: "Políticas de Gestión Humana que marcan la diferencia",
      },
      {
        type: "paragraph",
        text: "Las organizaciones que cuentan con políticas claras de protección a la maternidad y la lactancia no solo reducen su exposición al riesgo laboral y jurídico: envían un mensaje contundente sobre su compromiso con el bienestar y la equidad. Cumplir la ley es el punto de partida; construir una cultura que la respalde es lo que distingue a una organización madura.",
      },
    ],
    seo: {
      title: "Protección laboral de la maternidad y la lactancia en Colombia",
      description:
        "La maternidad y la lactancia cuentan con una protección laboral especial en Colombia. Un repaso al compromiso legal y humano que toda organización debe incorporar en su gestión.",
    },
  },
  {
    id: "fuero-paternidad",
    slug: "fuero-paternidad",
    title: "Fuero de paternidad en Colombia",
    subtitle: "Protección laboral y corresponsabilidad familiar",
    category: "GESTIÓN HUMANA · LABORAL",
    image: "/images/noticias/fuero-paternidad.png",
    imageAlt:
      "Profesional de Capital Consulting trabajando en su oficina junto a su hijo, en un ambiente de equilibrio entre la vida laboral y familiar",
    excerpt:
      "La protección laboral del padre trabajador se consolida como una expresión de corresponsabilidad familiar. Qué deben revisar las áreas de Gestión Humana a partir de la Sentencia C-517 de 2024.",
    featured: false,
    content: [
      {
        type: "paragraph",
        text: "La corresponsabilidad familiar ha ganado un lugar cada vez más claro en la protección laboral colombiana, y el fuero de paternidad es una de sus expresiones más concretas. Para Gestión Humana, se trata de un tema que exige actualización permanente y coordinación estrecha con el equipo jurídico.",
      },
      {
        type: "heading",
        text: "Qué reconoce la protección al padre trabajador",
      },
      {
        type: "paragraph",
        text: "El fuero de paternidad busca proteger la estabilidad laboral del padre trabajador frente a situaciones asociadas al nacimiento o cuidado de un hijo, reconociendo que la responsabilidad frente a la familia no recae únicamente en la madre.",
      },
      {
        type: "heading",
        text: "El pronunciamiento de la Corte Constitucional",
      },
      {
        type: "paragraph",
        text: "Mediante la Sentencia C-517 de 2024, la Corte Constitucional se pronunció sobre el fuero de paternidad, reafirmando la protección laboral del padre trabajador como una expresión del principio de corresponsabilidad familiar.",
      },
      {
        type: "note",
        text: "El alcance y la aplicación específica de la Sentencia C-517 de 2024 a cada caso deben verificarse con acompañamiento jurídico especializado. Este contenido es informativo y no sustituye dicho análisis.",
      },
      {
        type: "heading",
        text: "Corresponsabilidad familiar y Gestión Humana",
      },
      {
        type: "paragraph",
        text: "Incorporar la corresponsabilidad familiar en la gestión del talento implica revisar políticas, procesos y comunicación interna, de modo que la organización responda de forma consistente cuando un colaborador informa una situación relacionada con la paternidad.",
      },
      {
        type: "list",
        items: [
          "Actualizar las políticas internas conforme a los criterios vigentes.",
          "Comunicar con claridad a los colaboradores sus derechos y los procedimientos internos.",
          "Coordinar con el equipo jurídico antes de tomar decisiones sobre el cargo.",
          "Dejar registro documental de cada etapa del proceso.",
          "Promover una cultura organizacional que reconozca la corresponsabilidad familiar.",
        ],
      },
      {
        type: "heading",
        text: "Cumplimiento como parte de la estrategia organizacional",
      },
      {
        type: "paragraph",
        text: "Gestionar correctamente el fuero de paternidad no es solo una obligación legal: es una oportunidad para que la organización demuestre coherencia entre lo que declara y lo que practica frente al equilibrio entre la vida laboral y familiar de su equipo.",
      },
    ],
    seo: {
      title: "Fuero de paternidad en Colombia",
      description:
        "La protección laboral del padre trabajador se consolida como una expresión de corresponsabilidad familiar. Qué deben revisar las áreas de Gestión Humana a partir de la Sentencia C-517 de 2024.",
    },
  },
  {
    id: "gestion-humana-estrategica",
    slug: "gestion-humana-estrategica",
    title: "Gestión Humana Estratégica: Personas, Procesos y Resultados",
    subtitle: "Tu equipo necesita más que una administración de personal.",
    category: "CAPITAL TALENTO HUMANO",
    image: "/images/noticias/gestion-humana-estrategica.png",
    imageAlt:
      "Equipo de Capital Consulting reunido analizando estrategia y resultados de gestión humana en sala de juntas",
    excerpt:
      "La gestión humana dejó de ser solo administración de personal. Selección, desempeño, bienestar, liderazgo y cumplimiento: los frentes que Capital Talento Humano acompaña como parte de tu equipo.",
    featured: false,
    content: [
      {
        type: "paragraph",
        text: "Durante mucho tiempo, la gestión humana se entendió como una función administrativa: contratar, pagar la nómina y tramitar novedades. Hoy, ese alcance se queda corto. Las organizaciones que gestionan bien a sus personas gestionan mejor sus resultados.",
      },
      {
        type: "heading",
        text: "De la administración de personal a la gestión estratégica",
      },
      {
        type: "paragraph",
        text: "Un equipo necesita más que una administración de personal: necesita procesos claros, acompañamiento constante y una visión que conecte a las personas con los resultados del negocio.",
      },
      {
        type: "heading",
        text: "Los frentes que sostienen una gestión humana sólida",
      },
      {
        type: "list",
        items: [
          "Selección: encontrar el talento adecuado para cada posición.",
          "Administración de procesos y documentos: soporte y trazabilidad de cada etapa del ciclo laboral.",
          "Novedades laborales: gestión oportuna y correcta de cada cambio contractual.",
          "Desempeño: seguimiento y evaluación del aporte de cada colaborador.",
          "Clima organizacional: medición y gestión del ambiente de trabajo.",
          "Bienestar: programas que cuidan a las personas más allá de lo operativo.",
          "Desarrollo: formación y crecimiento del talento interno.",
          "Liderazgo: fortalecimiento de quienes guían equipos.",
          "Políticas y cumplimiento: marcos claros, alineados a la normativa vigente.",
        ],
      },
      {
        type: "heading",
        text: "Capital se convierte en parte de tu equipo",
      },
      {
        type: "paragraph",
        text: "Capital Talento Humano acompaña a las organizaciones en las distintas etapas del ciclo de vida del colaborador, a través de alternativas de acompañamiento y outsourcing que se ajustan a la realidad y al ritmo de cada empresa.",
      },
      {
        type: "paragraph",
        text: "Esto permite que la organización se enfoque en su negocio, con la tranquilidad de que la gestión de sus personas está en manos de un equipo especializado, comprometido con los procesos, el cumplimiento y los resultados.",
      },
    ],
    seo: {
      title: "Gestión Humana Estratégica: Personas, Procesos y Resultados",
      description:
        "La gestión humana dejó de ser solo administración de personal. Selección, desempeño, bienestar, liderazgo y cumplimiento: los frentes que Capital Talento Humano acompaña como parte de tu equipo.",
    },
  },
  {
    id: "permisos-laborales",
    slug: "permisos-laborales",
    title: "Permisos laborales por situaciones familiares",
    subtitle:
      "Una gestión adecuada también significa entender las necesidades de las personas.",
    category: "GESTIÓN HUMANA · LABORAL",
    image: "/images/noticias/permisos-laborales.png",
    imageAlt:
      "Asesora de Gestión Humana de Capital Consulting revisando documentación laboral junto a un colaborador",
    excerpt:
      "Calamidad doméstica, nacimiento de un hijo, adopción o fallecimiento de un familiar: cómo debe gestionar Gestión Humana los permisos laborales por situaciones familiares.",
    featured: false,
    content: [
      {
        type: "paragraph",
        text: "La vida de los colaboradores no se detiene en la puerta de la oficina. Situaciones familiares imprevistas o esperadas requieren, en distintos momentos, un permiso laboral. Gestionarlas bien es, a la vez, una responsabilidad legal y una muestra de que la organización entiende a las personas que la conforman.",
      },
      {
        type: "heading",
        text: "Situaciones frecuentes que requieren un permiso laboral",
      },
      {
        type: "list",
        items: [
          "Calamidad doméstica.",
          "Nacimiento de un hijo.",
          "Adopción.",
          "Fallecimiento de un familiar.",
          "Otras situaciones familiares que ameriten acompañamiento por parte de la organización.",
        ],
      },
      {
        type: "heading",
        text: "Cómo debe proceder Gestión Humana",
      },
      {
        type: "paragraph",
        text: "Ante cada solicitud, Gestión Humana cumple un rol clave que combina rigor y sensibilidad:",
      },
      {
        type: "list",
        items: [
          "Revisar el derecho aplicable a cada situación particular.",
          "Solicitar y verificar los soportes correspondientes.",
          "Registrar adecuadamente la novedad en los sistemas de la organización.",
          "Comunicar con claridad al trabajador las condiciones del permiso otorgado.",
        ],
      },
      {
        type: "note",
        text: "Este contenido es informativo y de gestión organizacional. La aplicación de cada permiso depende del derecho vigente y de las particularidades del caso; ante la duda, es recomendable el acompañamiento de un especialista.",
      },
      {
        type: "heading",
        text: "Personas, Gestión Humana y cumplimiento",
      },
      {
        type: "paragraph",
        text: "Una gestión adecuada de los permisos laborales no se limita a cumplir un trámite: significa entender las necesidades de las personas, sostener el cumplimiento normativo y fortalecer la confianza entre el colaborador y la organización.",
      },
    ],
    seo: {
      title: "Permisos laborales por situaciones familiares",
      description:
        "Calamidad doméstica, nacimiento de un hijo, adopción o fallecimiento de un familiar: cómo debe gestionar Gestión Humana los permisos laborales por situaciones familiares.",
    },
  },
]

export function getAllNews(): NewsArticle[] {
  return newsArticles
}

export function getFeaturedNews(): NewsArticle {
  return newsArticles.find((article) => article.featured) ?? newsArticles[0]
}

/** El resto de noticias, en el orden en que deben aparecer en el grid editorial. */
export function getOtherNews(): NewsArticle[] {
  const featured = getFeaturedNews()
  return newsArticles.filter((article) => article.slug !== featured.slug)
}

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return newsArticles.find((article) => article.slug === slug)
}

export function getRelatedNews(slug: string, limit = 3): NewsArticle[] {
  return newsArticles
    .filter((article) => article.slug !== slug)
    .slice(0, limit)
}
