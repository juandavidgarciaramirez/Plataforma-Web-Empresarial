/**
 * Contenido de la página Capital HSE — Seguridad, Salud en el Trabajo y
 * Gestión de Riesgos. Fuente exclusiva: "Capital HSE.pdf" (Capital
 * Consulting and Services S.A.S.). No incluye información que no esté
 * respaldada por ese documento.
 *
 * En el portafolio general del sitio esta línea puede listarse como
 * "Capital SST" (ver src/data/services.ts), pero el contenido de la página
 * respeta el nombre oficial del documento: Capital HSE.
 */

const base = "/images/capital-hse"

export const heroImage = `${base}/hero.png`
export const positioningImage = `${base}/posicionamiento.png`
export const portfolioImage = `${base}/portafolio.png`
export const riskManagementImage = `${base}/gestion-riesgo.png`
export const criticalTasksImage = `${base}/tareas-criticas.png`
export const commercialApproachImage = `${base}/enfoque-comercial.png`
export const packagesImage = `${base}/paquetes.png`
export const nextStepImage = `${base}/siguiente-paso.png`
export const ctaImage = `${base}/cta.png`

/** Hero */
export const heroEyebrow = "Capital HSE"
export const heroTag = "Seguridad · Salud en el Trabajo · Gestión de Riesgos"
export const heroTitle =
  "Soluciones integrales en Seguridad, Salud en el Trabajo y Gestión de Riesgos"
export const heroDescription =
  "Un aliado estratégico para gestionar los riesgos laborales, cumplir la normativa y proteger a las personas y la operación."

/** Nuestro posicionamiento */
export const positioningQuote =
  "Un aliado estratégico para gestionar los riesgos laborales, cumplir la normativa y proteger a las personas y la operación de las empresas."

export interface Pillar {
  number: string
  title: string
  description: string
}

export const pillars: Pillar[] = [
  {
    number: "01",
    title: "Cumplimiento",
    description:
      "Normativa vigente de SST, estándares mínimos y requerimientos de ARL y Ministerio del Trabajo.",
  },
  {
    number: "02",
    title: "Prevención",
    description:
      "Identificación de peligros, control de riesgos y cultura de autocuidado en la operación.",
  },
  {
    number: "03",
    title: "Continuidad",
    description:
      "Preparación para emergencias y respuesta que protege a las personas y al negocio.",
  },
]

/** Portafolio de servicios */
export interface PortfolioService {
  title: string
}

export const portfolioGroupOneTitle = "Gestión del sistema, cumplimiento y factor humano"
export const portfolioGroupOne: PortfolioService[] = [
  { title: "SG-SST: diseño, implementación, administración y mantenimiento" },
  { title: "Evaluación de Estándares Mínimos y acompañamiento para su cumplimiento" },
  { title: "Auditorías de SG-SST" },
  { title: "Batería de Riesgo Psicosocial" },
  { title: "Intervención de riesgo psicosocial y clima organizacional" },
  { title: "Auditorías de Calidad ISO 9001" },
  { title: "Capacitaciones en SST" },
  { title: "Investigación de accidentes e incidentes de trabajo" },
  { title: "Programas de gestión Ambiental — Medición de huella de carbono" },
]

export const portfolioGroupTwoTitle =
  "Riesgo operativo, emergencias, salud y acompañamiento normativo"
export const portfolioGroupTwo: PortfolioService[] = [
  { title: "Identificación de peligros y valoración de riesgos" },
  { title: "Planes de emergencia y preparación para emergencias" },
  { title: "Simulacros y capacitación para brigadas" },
  { title: "Medicina preventiva y promoción de la salud, según el alcance contratado" },
  { title: "Acompañamiento en requerimientos de ARL y Ministerio del Trabajo" },
  { title: "Asesoría y acompañamiento en cumplimiento normativo de SST" },
  { title: "Programas de prevención y control de riesgos laborales" },
  { title: "Visitas domiciliarias y evaluación de condiciones de trabajo" },
]

/** Gestión del riesgo */
export interface RiskCycleStep {
  step: string
  title: string
  description: string
}

export const riskCycleSteps: RiskCycleStep[] = [
  {
    step: "01",
    title: "Identificación de peligros",
    description: "Recorridos, tareas críticas y reporte de condiciones.",
  },
  {
    step: "02",
    title: "Valoración del riesgo",
    description: "Matriz IPEVR con criterios de severidad y probabilidad.",
  },
  {
    step: "03",
    title: "Controles jerarquizados",
    description: "Eliminación, sustitución, ingeniería, administración y EPP.",
  },
  {
    step: "04",
    title: "Planes de intervención",
    description: "Actividades, responsables y plazos por riesgo prioritario.",
  },
  {
    step: "05",
    title: "Gestión del cambio",
    description: "Evaluación previa de nuevos procesos, equipos y contratistas.",
  },
  {
    step: "06",
    title: "Seguimiento y auditoría",
    description: "Indicadores, verificación de eficacia y cierre de hallazgos.",
  },
]

export const criticalTasksTitle = "Acompañamiento en actividades y tareas críticas"
export const criticalTasksText =
  "Presencia en campo con verificación de permisos de trabajo y controles en alturas, izajes, espacios confinados, trabajo en caliente y energías peligrosas."

/** Enfoque comercial */
export const commercialApproachTitle = "Más allá de “hacer el SG-SST”"

export const commercialApproachPoints: string[] = [
  "Acompañamos la estrategia de riesgos, no solo el trámite documental.",
  "Traducimos la normativa en decisiones operativas para la empresa.",
  "Protegemos a las personas y la continuidad de la operación.",
  "Servicios modulares en cuatro paquetes según la madurez del cliente.",
]

export const commercialApproachHighlight = "Aliado estratégico en gestión de riesgos laborales"

/** Cuatro paquetes comerciales */
export interface Package {
  number: string
  title: string
  description: string
}

export const packages: Package[] = [
  {
    number: "01",
    title: "HSE Básico",
    description: "Cumplimiento de SG-SST y estándares mínimos.",
  },
  {
    number: "02",
    title: "HSE Integral",
    description: "SG-SST, auditoría, capacitación, inspecciones y acompañamiento.",
  },
  {
    number: "03",
    title: "HSE Psicosocial",
    description:
      "Batería de riesgo psicosocial, diagnóstico, intervención y clima organizacional.",
  },
  {
    number: "04",
    title: "HSE Operacional",
    description:
      "SG-SST, PESV, emergencias, inspecciones, investigación de accidentes y capacitación.",
  },
]

export const packagesNote =
  "Paquetes modulares y combinables según el alcance contratado por cada cliente."

/** Siguiente paso */
export interface NextStep {
  number: string
  title: string
  description: string
}

export const nextSteps: NextStep[] = [
  {
    number: "01",
    title: "Diagnóstico inicial",
    description: "Evaluación de estándares mínimos y estado actual del SG-SST.",
  },
  {
    number: "02",
    title: "Definición del paquete",
    description: "Selección del alcance según riesgos, sector y tamaño de la operación.",
  },
  {
    number: "03",
    title: "Implementación y acompañamiento",
    description: "Ejecución, capacitación y seguimiento continuo con indicadores.",
  },
]

/** CTA final */
export const ctaTitle = "Protejamos juntos a las personas y la operación."
export const ctaMessage =
  "Empecemos por el diagnóstico de estándares mínimos y definamos, a la medida de su operación, el paquete HSE adecuado."
export const ctaPhone = "311 863 6746"
export const ctaEmail = "contacto@capitalconsulting.com.co"
