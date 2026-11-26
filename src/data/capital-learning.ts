export interface CapitalLearningLine {
  number: string
  title: string
  /** Título oficial usado en el slide de detalle, cuando difiere del nombre del índice del portafolio. */
  detailTitle?: string
  description?: string
  temasLabel?: string
  temas?: string[]
  entregable?: string
  image: string
}

export const heroImage = "/images/capital-learning/hero.png"

/**
 * Las siete líneas de formación de Capital Learning.
 * Contenido (nombres, descripciones, temas y entregables) proviene exclusivamente
 * del portafolio oficial "Capital Learning — Formación que transforma el talento".
 * La línea 03 no tiene slide de detalle en el documento fuente: solo se registra su nombre.
 */
export const capitalLearningLines: CapitalLearningLine[] = [
  {
    number: "01",
    title: "SST y prevención de riesgos laborales",
    description:
      "Capacitación obligatoria y especializada para sostener el SG-SST y reducir la accidentalidad.",
    temasLabel: "Temas clave",
    temas: [
      "Inducción y reinducción en SST",
      "Identificación de peligros y matriz de riesgos",
      "Trabajo en alturas, espacios confinados y energías peligrosas",
      "COPASST y Comité de Convivencia",
      "Investigación de incidentes y accidentes",
    ],
    entregable:
      "Certificados de asistencia, evaluación de conocimiento e informe de cierre.",
    image: "/images/capital-learning/linea-01.png",
  },
  {
    number: "02",
    title: "Desarrollo de competencias laborales",
    description:
      "Cierre de brechas técnicas y transversales para elevar el desempeño de los equipos.",
    temasLabel: "Temas clave",
    temas: [
      "Diagnóstico de brechas por cargo y proceso",
      "Competencias técnicas y operativas",
      "Comunicación efectiva y trabajo en equipo",
      "Servicio al cliente y orientación a resultados",
      "Herramientas digitales y ofimática aplicada",
    ],
    entregable:
      "Matriz de competencias, plan de formación anual y tablero de avance.",
    image: "/images/capital-learning/linea-02.png",
  },
  {
    number: "03",
    title: "Riesgo psicosocial y bienestar laboral",
    image: "/images/capital-learning/linea-03.png",
  },
  {
    number: "04",
    title: "Seguridad vial y PESV",
    detailTitle: "Seguridad vial: capacitaciones y campañas",
    description:
      "Formamos a conductores y colaboradores y activamos campañas de sensibilización que apoyan el PESV.",
    temasLabel: "Capacitaciones y campañas",
    temas: [
      "Capacitación en conducción defensiva y manejo seguro",
      "Talleres de prevención de fatiga y consumo de sustancias",
      "Formación en inspección preoperacional de vehículos",
      "Campañas de sensibilización para conductores, peatones y motociclistas",
      "Jornadas y semanas de la seguridad vial dentro de la empresa",
    ],
    entregable:
      "Cronograma de capacitaciones y campañas, piezas de comunicación y registros de asistencia.",
    image: "/images/capital-learning/linea-04.png",
  },
  {
    number: "05",
    title: "Emergencias, brigadas y primeros auxilios",
    description: "Preparación real de la organización para responder ante emergencias.",
    temasLabel: "Temas clave",
    temas: [
      "Conformación y entrenamiento de brigadas",
      "Primeros auxilios y RCP básico",
      "Prevención y control de incendios",
      "Evacuación, rescate y simulacros",
      "Plan de emergencias y análisis de vulnerabilidad",
    ],
    entregable: "Plan de emergencias actualizado y acta de simulacro.",
    image: "/images/capital-learning/linea-05.png",
  },
  {
    number: "06",
    title: "Formación para líderes y mandos medios",
    description: "Fortalecimiento del liderazgo operativo, donde se ejecuta la estrategia.",
    temasLabel: "Temas clave",
    temas: [
      "Liderazgo situacional y delegación",
      "Conversaciones difíciles y retroalimentación",
      "Gestión del desempeño del equipo",
      "Liderazgo visible en seguridad",
      "Resolución de conflictos y toma de decisiones",
    ],
    entregable: "Plan de desarrollo individual por líder y seguimiento a 90 días.",
    image: "/images/capital-learning/linea-06.png",
  },
  {
    number: "07",
    title: "Cultura organizacional",
    detailTitle: "Talleres de cultura organizacional",
    description:
      "Talleres experienciales que alinean comportamientos con los valores de la empresa.",
    temasLabel: "Temas clave",
    temas: [
      "Valores corporativos y comportamientos esperados",
      "Cultura de autocuidado y seguridad",
      "Diversidad, equidad e inclusión",
      "Gestión del cambio",
      "Integración de equipos y team building",
    ],
    entregable: "Diagnóstico de cultura y ruta de intervención por área.",
    image: "/images/capital-learning/linea-07.png",
  },
]
