/**
 * Contenido de la página Capital Business Services — Soluciones Empresariales
 * y Outsourcing. Fuente exclusiva: documento oficial "Capital Business
 * Services · Línea de negocio 03" (Nómina · Contabilidad · Tributaria ·
 * Laboral). No incluye información que no esté respaldada por ese documento.
 */

const base = "/images/capital-business-services"

export const heroImage = `${base}/hero-business-services.png`
export const processImage = `${base}/business-process.png`
export const payrollImage = `${base}/business-payroll.png`
export const accountingImage = `${base}/business-accounting.png`
export const taxImage = `${base}/business-tax.png`
export const laborImage = `${base}/business-labor.png`
export const contactImage = `${base}/business-contact.png`

/** Párrafo de propuesta de valor, tomado tal cual del documento fuente. */
export const valueIntro =
  "Apoyamos la gestión administrativa, financiera y laboral de las organizaciones mediante servicios especializados que optimizan procesos y garantizan el cumplimiento de las obligaciones legales."

export const valueNote =
  "Optimización de procesos y auditorías internas como eje transversal de todos nuestros servicios."

export interface ValuePillar {
  title: string
  description: string
}

export const valuePillars: ValuePillar[] = [
  {
    title: "Eficiencia operativa",
    description: "Procesos estandarizados que liberan capacidad interna.",
  },
  {
    title: "Cumplimiento garantizado",
    description: "Actualización normativa permanente y cero contingencias.",
  },
  {
    title: "Información para decidir",
    description: "Reportes e indicadores oportunos para la alta dirección.",
  },
  {
    title: "Costo variable",
    description: "Estructura flexible que se ajusta al tamaño de su operación.",
  },
]

export interface PortfolioService {
  number: string
  title: string
  description: string
  image: string
  href: string
}

export const portfolioNote =
  "Servicios modulares: se contratan de forma independiente o como solución integral."

export const portfolioServices: PortfolioService[] = [
  {
    number: "01",
    title: "Outsourcing de Nómina",
    description: "Liquidación, seguridad social, parafiscales y nómina electrónica.",
    image: payrollImage,
    href: "#nomina",
  },
  {
    number: "02",
    title: "Outsourcing Contable",
    description: "Registro, conciliaciones, cierres y estados financieros.",
    image: accountingImage,
    href: "#contable",
  },
  {
    number: "03",
    title: "Asesoría Tributaria",
    description: "Planeación, declaraciones y atención de requerimientos DIAN.",
    image: taxImage,
    href: "#tributaria",
  },
  {
    number: "04",
    title: "Asesoría Laboral",
    description: "Contratación, disciplinarios, auditoría y acompañamiento MinTrabajo.",
    image: laborImage,
    href: "#laboral",
  },
]

/** Los diez frentes del alcance de Outsourcing de Nómina (documento, página 4). */
export const payrollScope: string[] = [
  "Procesamiento de novedades, contabilización y conciliación de gastos laborales.",
  "Liquidación y revisión de retención en la fuente conforme a la normatividad vigente.",
  "Liquidación y revisión de seguridad social sobre pagos salariales y no salariales.",
  "Preparación del archivo de pago para los empleados.",
  "Cargue de planilla de seguridad social y parafiscales al operador PILA.",
  "Soportes de pago para cada uno de los terceros liquidados en la nómina.",
  "Generación de reportes de cierre mensual y anual.",
  "Liquidación de primas y prestaciones sociales.",
  "Creación del módulo de autogestión para los empleados.",
  "Proceso de transmisión de la nómina electrónica.",
]

export interface PayrollBenefit {
  title: string
  description: string
}

export const payrollBenefits: PayrollBenefit[] = [
  {
    title: "Cero riesgo sancionatorio",
    description:
      "Cumplimiento en PILA, retención en la fuente y nómina electrónica ante la DIAN.",
  },
  {
    title: "Confidencialidad y control",
    description:
      "Manejo especializado de información sensible con doble revisión de cálculos.",
  },
  {
    title: "Empleados autogestionados",
    description:
      "Módulo de consulta de desprendibles y certificados sin carga para el área.",
  },
  {
    title: "Cierres a tiempo",
    description: "Reportes mensuales y anuales listos para contabilidad y dirección.",
  },
]

export const accountingItems: string[] = [
  "Registro contable",
  "Estados financieros",
  "Conciliaciones bancarias",
  "Cierres contables",
  "Informes financieros",
  "Análisis financiero",
]

export const accountingNote =
  "Información contable confiable, al día y lista para la toma de decisiones."

export const taxItems: string[] = [
  "Planeación tributaria",
  "Declaraciones tributarias",
  "Actualización normativa",
  "Atención de requerimientos DIAN",
  "Diagnósticos fiscales",
]

export const taxNote = "Carga impositiva optimizada dentro del marco legal vigente."

export interface LaborGroup {
  title: string
  items: string[]
}

export const laborGroups: LaborGroup[] = [
  {
    title: "Relación laboral",
    items: ["Contratos de trabajo", "Reglamentos internos", "Conceptos laborales"],
  },
  {
    title: "Gestión disciplinaria",
    items: [
      "Procesos disciplinarios",
      "Terminaciones de contrato",
      "Acompañamiento ante el Ministerio del Trabajo",
    ],
  },
  {
    title: "Control y mejora",
    items: ["Auditoría laboral", "Auditorías internas", "Optimización de procesos"],
  },
]

export const laborNote =
  "Prevención antes que litigio: reducimos la exposición jurídica de la empresa desde la contratación."

export interface WorkflowStep {
  step: string
  title: string
  description: string
}

export const workflowSteps: WorkflowStep[] = [
  {
    step: "01",
    title: "Diagnóstico",
    description: "Levantamos procesos, riesgos y obligaciones vigentes.",
  },
  {
    step: "02",
    title: "Diseño",
    description: "Definimos alcance, cronograma y entregables por servicio.",
  },
  {
    step: "03",
    title: "Implementación",
    description: "Migración de información y puesta en marcha controlada.",
  },
  {
    step: "04",
    title: "Operación",
    description: "Ejecución mensual con doble revisión y entregas en fecha.",
  },
  {
    step: "05",
    title: "Mejora continua",
    description: "Auditorías internas e indicadores para optimizar.",
  },
]

export const workflowNote =
  "Un solo interlocutor responsable de nómina, contabilidad, impuestos y asuntos laborales."

export const ctaMessage =
  "Agendemos un diagnóstico sin costo de su operación administrativa, contable y laboral, e identifiquemos juntos las oportunidades de optimización y los riesgos de cumplimiento."

export const ctaSteps: string[] = [
  "Diagnóstico inicial sin costo",
  "Propuesta con alcance y cronograma",
  "Implementación en 30 días",
]
