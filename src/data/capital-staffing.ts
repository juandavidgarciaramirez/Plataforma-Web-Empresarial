/**
 * Contenido de la página Capital Staffing — Reclutamiento y Selección.
 * Fuente exclusiva: "Presentacion_CAPITAL_STAFFING.pdf" (Capital Consulting
 * and Services S.A.S.). No incluye información que no esté respaldada por
 * ese documento.
 */

const base = "/images/capital-staffing"

export const heroImage = `${base}/hero.png`
export const contextImage = `${base}/contexto.png`
export const positioningImage = `${base}/posicionamiento.png`
export const recruitmentImage = `${base}/reclutamiento.png`
export const validationImage = `${base}/validacion.png`
export const processImage = `${base}/metodologia.png`
export const positionsImage = `${base}/cargos.png`
export const sectorsImage = `${base}/sectores.png`
export const addedValueImage = `${base}/valor-agregado.png`
export const ctaImage = `${base}/cta.png`

/** "El contexto" — lo que cuesta una vacante abierta. */
export const contextIntroTitle = "Contratar tarde o contratar mal es un costo de operación."
export const contextIntroText =
  "Cada vacante sin cubrir y cada ingreso sin verificar se traducen en sobrecarga de los equipos, incumplimientos con el cliente y reprocesos de selección."

export interface ContextItem {
  title: string
  description: string
}

export const contextItems: ContextItem[] = [
  {
    title: "Operación expuesta",
    description: "Turnos y frentes de trabajo sin cubrir frenan la producción y el servicio.",
  },
  {
    title: "Rotación que se repite",
    description: "Perfiles mal ajustados al cargo salen pronto y reinician el ciclo.",
  },
  {
    title: "Riesgo sin verificar",
    description: "Ingresos sin estudios ni referencias exponen activos, personas e información.",
  },
]

/** "¿Qué es Capital Staffing?" */
export const positioningIntroTitle = "Línea especializada en reclutamiento y selección."
export const positioningIntroText =
  "No entregamos hojas de vida: entregamos decisiones de contratación validadas, con trazabilidad y respaldo en cada etapa del proceso."

export interface PositioningItem {
  title: string
  description: string
}

export const positioningItems: PositioningItem[] = [
  {
    title: "El reto",
    description: "Vacantes abiertas, rotación alta y contrataciones sin verificar.",
  },
  {
    title: "Nuestro rol",
    description: "Atraer, evaluar y validar el perfil correcto para cada cargo.",
  },
  {
    title: "El resultado",
    description: "Equipos estables y decisiones de talento con menor riesgo.",
  },
]

/** "Nuestros servicios" */
export const servicesIntro =
  "Un servicio integral que cubre el ciclo completo, desde la atracción del candidato hasta su incorporación efectiva."

export interface StaffingService {
  number: string
  title: string
  description: string
}

export const staffingServices: StaffingService[] = [
  {
    number: "01",
    title: "Reclutamiento",
    description: "Atracción dirigida de candidatos según el perfil del cargo.",
  },
  {
    number: "02",
    title: "Selección",
    description: "Evaluación por competencias alineada a la operación.",
  },
  {
    number: "03",
    title: "Estudios de seguridad",
    description: "Validación de antecedentes para reducir el riesgo.",
  },
  {
    number: "04",
    title: "Visitas domiciliarias",
    description: "Verificación del entorno y condiciones del candidato.",
  },
  {
    number: "05",
    title: "Verificación de referencias",
    description: "Confirmación de experiencia y desempeño previo.",
  },
  {
    number: "06",
    title: "Incorporación",
    description: "Acompañamiento en el ingreso y adaptación al cargo.",
  },
]

/** "Proceso" */
export const processIntro =
  "Seis etapas estructuradas que dan trazabilidad, control y previsibilidad a cada contratación."

export interface ProcessStep {
  step: string
  title: string
  description: string
}

export const staffingProcess: ProcessStep[] = [
  { step: "01", title: "Perfil", description: "Definimos el cargo, competencias y criterios de éxito." },
  { step: "02", title: "Reclutamiento", description: "Búsqueda activa en fuentes y bases especializadas." },
  { step: "03", title: "Evaluación", description: "Pruebas y entrevistas por competencias." },
  { step: "04", title: "Validación", description: "Estudios de seguridad, visitas y referencias." },
  { step: "05", title: "Presentación", description: "Terna con informe comparativo para decidir." },
  { step: "06", title: "Seguimiento", description: "Acompañamiento posterior a la contratación." },
]

/** "Cargos que cubrimos" */
export const positionsIntro = "Atendemos toda la estructura organizacional, con la misma rigurosidad en cada nivel."

export interface PositionLevel {
  number: string
  title: string
  description: string
}

export const positionLevels: PositionLevel[] = [
  { number: "01", title: "Operativos", description: "Volumen y reposición rápida para sostener la operación." },
  { number: "02", title: "Administrativos", description: "Perfiles de soporte con foco en confiabilidad." },
  { number: "03", title: "Profesionales", description: "Especialistas técnicos para áreas críticas." },
  { number: "04", title: "Ejecutivos", description: "Búsqueda dirigida para posiciones de decisión." },
]

/** "Sectores" */
export const sectorsIntro = "Conocemos las exigencias, los riesgos y los perfiles propios de cada industria."

export interface Sector {
  title: string
  description: string
}

export const sectors: Sector[] = [
  { title: "Hidrocarburos", description: "Perfiles técnicos con exigencias de seguridad." },
  { title: "Construcción", description: "Cuadrillas y mandos medios por proyecto." },
  { title: "Transporte", description: "Personal operativo con validación reforzada." },
  { title: "Manufactura", description: "Producción y mantenimiento por turnos." },
  { title: "Salud", description: "Perfiles asistenciales y administrativos." },
  { title: "Tecnología", description: "Talento especializado y de alta demanda." },
]

/** "¿Por qué Capital Consulting?" */
export interface Differentiator {
  number: string
  title: string
  description: string
}

export const differentiators: Differentiator[] = [
  {
    number: "01",
    title: "Experiencia",
    description:
      "Profesionales especializados en gestión del talento humano y seguridad organizacional.",
  },
  {
    number: "02",
    title: "Confidencialidad",
    description: "Procesos desarrollados bajo estrictos protocolos de protección de datos.",
  },
  {
    number: "03",
    title: "Cobertura",
    description: "Atención a empresas en todo el territorio nacional.",
  },
  {
    number: "04",
    title: "Calidad",
    description: "Informes claros, oportunos y orientados a la toma de decisiones.",
  },
  {
    number: "05",
    title: "Acompañamiento",
    description: "Asesoría personalizada durante todo el proceso.",
  },
]

/** "Más allá de la selección" */
export const addedValueIntro =
  "Servicios complementarios que fortalecen la gestión humana después de la contratación."

export interface AddedValueItem {
  title: string
  description: string
}

export const addedValueItems: AddedValueItem[] = [
  { title: "SG-SST", description: "Apoyo en seguridad y salud en el trabajo." },
  { title: "Clima organizacional", description: "Medición y lectura del ambiente laboral." },
  { title: "Riesgo psicosocial", description: "Diagnóstico y gestión del riesgo en los equipos." },
  { title: "Capacitación", description: "Formación orientada al desempeño del cargo." },
]

/** "Beneficios para su empresa" */
export const benefits: string[] = [
  "Reduce riesgos de contratación",
  "Disminuye pérdidas económicas",
  "Previene fraude interno",
  "Valida la información suministrada",
  "Mejora los procesos de selección",
  "Incrementa la confiabilidad de las contrataciones",
  "Protege la reputación organizacional",
  "Aporta información objetiva para la toma de decisiones",
]

/** CTA final */
export const ctaTitle = "Hablemos de sus vacantes críticas"
export const ctaMessage =
  "Agendemos una sesión para revisar sus perfiles prioritarios y definir un plan de cobertura."
export const ctaPhone = "311 863 6746"
export const ctaEmail = "ejecutivacomercial@capitalconsulting.com.co"
