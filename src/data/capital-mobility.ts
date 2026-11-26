/**
 * Contenido de la página Capital Mobility — Seguridad Vial.
 * Fuente exclusiva: portafolio oficial "Capital Mobility — Seguridad Vial"
 * (línea de negocio: consultoría, implementación y gestión del riesgo vial
 * para organizaciones con flota).
 */

export const heroImage = "/images/capital-mobility/hero.png"

export const strategicImage = "/images/capital-mobility/diagnostico-seguridad-vial.png"

export const strategicSectors = [
  "Transporte de carga y pasajeros",
  "Hidrocarburos y energía",
  "Construcción e infraestructura",
  "Logística y distribución",
  "Empresas con flota propia o contratada",
]

export interface PortfolioItem {
  number: string
  title: string
  description: string
}

export const portfolioItems: PortfolioItem[] = [
  { number: "01", title: "PESV", description: "Diseño, implementación, actualización y seguimiento." },
  { number: "02", title: "Auditorías al PESV", description: "Verificación de cumplimiento y planes de cierre." },
  { number: "03", title: "Diagnóstico de seguridad vial", description: "Línea base del riesgo y brechas." },
  { number: "04", title: "Investigación de accidentes", description: "Siniestros de tránsito laborales." },
  { number: "05", title: "Capacitación", description: "Formación técnica y comportamental de conductores." },
  { number: "06", title: "Gestión de conductores", description: "Competencias, desempeño, inducción." },
  { number: "07", title: "Inspecciones", description: "Vehículos, equipos y documentación." },
  { number: "08", title: "Indicadores", description: "Siniestralidad, seguimiento y estadística." },
  { number: "09", title: "Consultoría normativa", description: "Cumplimiento legal y acompañamiento." },
  { number: "10", title: "Campañas de cultura vial", description: "Prevención, movilidad segura, autocuidado." },
]

export const pesvImage = "/images/capital-mobility/pesv.png"
export const pesvAuditImage = "/images/capital-mobility/auditorias-pesv.png"

export const pesvSteps = [
  {
    step: "01",
    title: "Diseño",
    description: "Estructura del plan conforme a la normativa vigente y al riesgo real de la operación.",
  },
  {
    step: "02",
    title: "Implementación",
    description: "Despliegue de procedimientos, roles, controles y evidencias en la operación.",
  },
  {
    step: "03",
    title: "Actualización",
    description: "Ajuste del plan ante cambios normativos, de flota o de operación.",
  },
  {
    step: "04",
    title: "Seguimiento",
    description: "Monitoreo de avance, indicadores y planes de acción.",
  },
]

export const pesvComplementaryServices = [
  "Auditorías al PESV",
  "Diagnóstico de seguridad vial",
  "Cierre de hallazgos y planes de mejora",
]

export const trainingImage = "/images/capital-mobility/capacitacion-conductores.png"

export const trainingTopics = [
  "Conducción defensiva",
  "Manejo preventivo",
  "Fatiga y sueño",
  "Distracción al conducir",
  "Manejo en condiciones adversas",
]

export const driverManagementImage = "/images/capital-mobility/gestion-conductores.png"

export const driverManagementBlocks = [
  {
    title: "Evaluación de competencias",
    description: "Pruebas teóricas y prácticas de habilidad al volante.",
  },
  {
    title: "Evaluación de desempeño",
    description: "Seguimiento de conducta vial, infracciones y siniestros.",
  },
  {
    title: "Inducción",
    description: "Ingreso con reglas, rutas y riesgos claros desde el día uno.",
  },
  {
    title: "Reinducción",
    description: "Refuerzo periódico y tras eventos o cambios de operación.",
  },
]

export const inspectionsImage = "/images/capital-mobility/inspecciones.png"
export const inspectionItems = ["Vehículos", "Equipos", "Documentación"]

export const investigationImage = "/images/capital-mobility/investigacion-accidentes.png"
export const investigationItems = [
  "Reconstrucción del evento y análisis de causa raíz",
  "Determinación de factores humanos, vehiculares y de vía",
  "Medidas correctivas y lecciones aprendidas divulgables",
]

export const indicatorsImage = "/images/capital-mobility/indicadores.png"
export const indicatorsItems = [
  "Siniestralidad: frecuencia, severidad y costo",
  "Seguimiento del PESV: avance y cumplimiento",
  "Análisis estadístico y tableros de control",
  "Reportes periódicos a la alta dirección",
]

export const complianceImage = "/images/capital-mobility/consultoria-normativa.png"
export const complianceItems = [
  "Cumplimiento de la legislación en seguridad vial",
  "Acompañamiento en auditorías e inspecciones",
  "Interpretación de requisitos aplicables a la operación",
  "Preparación documental y de evidencias",
]

export const campaignsImage = "/images/capital-mobility/campanas-cultura-vial.png"

export const campaignCards = [
  {
    title: "Prevención de accidentes",
    description: "Mensajes focalizados en los riesgos reales de cada operación.",
  },
  {
    title: "Movilidad segura",
    description: "Buenas prácticas dentro y fuera de la jornada laboral.",
  },
  {
    title: "Comportamientos seguros",
    description: "Refuerzo de conductas críticas: velocidad, cinturón, celular.",
  },
  {
    title: "Promoción del autocuidado",
    description: "Descanso, salud y estado óptimo para conducir.",
  },
]
