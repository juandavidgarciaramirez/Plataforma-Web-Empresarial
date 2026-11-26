/**
 * Contenido institucional de la página "Nosotros" (/about).
 * Centraliza hero, presentación, misión, visión y valores.
 *
 * ⚠️ MISIÓN Y VISIÓN 2030: el texto de estas dos secciones aún NO ha sido
 * suministrado por el cliente como documento oficial. Se dejó una versión
 * de marcador de posición, corta y sin cifras ni afirmaciones inventadas,
 * para que la estructura visual quede lista. Debe reemplazarse por el
 * texto institucional exacto apenas esté disponible — es el único
 * contenido de esta página que no proviene de una fuente confirmada.
 */

export const heroTitle = "Personas, conocimiento y visión para transformar organizaciones."
export const heroSubtitle =
  "Conoce el equipo, la experiencia y la visión que hacen parte de Capital Consulting."
export const heroImage = "/images/nosotros/hero.png"

/** Quiénes somos */
export const whoWeAreTitle = "Una visión integral de las organizaciones"
export const whoWeAreText =
  "Acompañamos a las organizaciones desde una mirada que conecta a las personas, la operación y el negocio, con equipos especializados en cada frente de riesgo y de gestión."
export const whoWeAreImage = "/images/nosotros/quienes-somos.png"

export interface WhoWeAreConcept {
  key: string
  label: string
  description: string
}

export const whoWeAreConcepts: WhoWeAreConcept[] = [
  {
    key: "personas",
    label: "Personas",
    description:
      "Equipos multidisciplinarios que ponen su conocimiento especializado al servicio de cada cliente.",
  },
  {
    key: "operacion",
    label: "Operación",
    description:
      "Acompañamiento en campo y en el día a día, donde el riesgo y la operación realmente ocurren.",
  },
  {
    key: "negocio",
    label: "Negocio",
    description:
      "Decisiones traducidas en valor: cumplimiento, continuidad y crecimiento para la organización.",
  },
]

/** Misión — placeholder, ver nota superior. */
export const missionText =
  "Brindar soluciones integrales de consultoría que fortalezcan la gestión financiera, administrativa, de riesgos y del talento humano de nuestros clientes, con conocimiento especializado y compromiso genuino con sus resultados."
export const missionImage = "/images/nosotros/mision.png"

/** Visión 2030 — placeholder, ver nota superior. */
export const visionYear = ""
export const visionText =
  "Ser reconocidos como un aliado estratégico de referencia para las organizaciones, por la calidad, integridad y especialización con la que acompañamos cada una de sus líneas de negocio."
export const visionImage = "/images/nosotros/vision.png"

/** Valores */
export interface Value {
  key: string
  title: string
  description: string
  image: string
}

const valuesBase = "/images/nosotros"

export const values: Value[] = [
  {
    key: "integridad",
    title: "Integridad",
    description: "Actuamos con coherencia entre lo que decimos y lo que hacemos, siempre.",
    image: `${valuesBase}/valor-integridad.png`,
  },
  {
    key: "privacidad",
    title: "Privacidad",
    description: "Protegemos la información de cada cliente bajo estrictos protocolos de confidencialidad.",
    image: `${valuesBase}/valor-privacidad.png`,
  },
  {
    key: "excelencia",
    title: "Excelencia",
    description: "Buscamos el estándar más alto en cada proyecto, con rigor técnico y atención al detalle.",
    image: `${valuesBase}/valor-excelencia.png`,
  },
  {
    key: "innovacion",
    title: "Innovación",
    description: "Evolucionamos nuestras soluciones para responder a los retos reales de cada operación.",
    image: `${valuesBase}/valor-innovacion.png`,
  },
  {
    key: "compromiso",
    title: "Compromiso",
    description: "Nos involucramos con los resultados de nuestros clientes como si fueran propios.",
    image: `${valuesBase}/valor-compromiso.png`,
  },
]

/** Ecosistema Capital */
export const ecosystemTitle = "Cinco líneas. Una visión."
export const ecosystemText =
  "Cada línea de Capital Consulting responde a un frente distinto de la organización, conectadas por el mismo equipo y la misma visión integral."

/** Sección equipo */
export const teamTitle = "Las personas detrás de Capital"
export const teamSubtitle =
  "Conocimiento especializado, experiencia y diferentes perspectivas para acompañar cada desafío empresarial."

/** CTA final */
export const ctaTitle = "Hablemos de su próximo desafío empresarial"
export const ctaMessage =
  "Conecte con el equipo especializado que mejor se ajusta a la necesidad de su organización."
export const ctaImage = "/images/nosotros/cta-contactanos.png"
