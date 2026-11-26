/**
 * Equipo de Capital Consulting and Services SAS.
 * Información provista por el cliente — no incluye cargos, experiencia,
 * certificaciones ni especialidades que no hayan sido suministradas.
 */

export interface TeamMember {
  id: string
  name: string
  role: string
  profession: string
  /** Línea o área a la que pertenece (texto mostrado como badge). */
  area: string
  /** Slug del servicio relacionado en src/data/services.ts, si aplica. */
  service?: string
  image: string
  shortDescription: string
  specialties: string[]
  /** Certificaciones / normas — solo cuando fueron suministradas explícitamente. */
  certifications?: string[]
  certificationsLabel?: string
  /** Perfil transversal (no depende de una sola línea de negocio). */
  transversal?: boolean
  /** Nivel dentro del organigrama (1 = socia fundadora, 2 y 3 = equipo). */
  level: 1 | 2 | 3
  /** Orden de aparición dentro de su nivel (útil cuando lleguen los datos desde API/admin). Menor = primero. */
  displayOrder?: number
  /** Categoría lógica del perfil, pensada para la futura integración con API (p. ej. "legal", "founding-team"). No afecta el render actual. */
  category?: string
  /**
   * Controla si el integrante se muestra en el organigrama. Por defecto true.
   * Úsese false para dejar un registro preparado (p. ej. una vacante confirmada
   * sin datos finales) sin exponerlo aún en producción.
   */
  isActive?: boolean
}

const base = "/images/nosotros"

export const team: TeamMember[] = [
  {
    id: "jennifer-zuluaga",
    name: "Jennifer Zuluaga",
    role: "Socia Fundadora",
    profession: "Contadora Pública",
    area: "Dirección General",
    service: "capital-business-services",
    image: `${base}/jennifer-zuluaga.jpeg`,
    shortDescription:
      "Más de 15 años de experiencia en gestión financiera, contable, tributaria y administrativa.",
    specialties: [
      "Gestión financiera",
      "Gestión contable",
      "Gestión tributaria",
      "Gestión administrativa",
      "Organizaciones nacionales e internacionales",
      "Transformación empresarial",
      "Toma de decisiones",
      "Fortalecimiento empresarial",
      "Operaciones internacionales",
      "NIIF",
      "Tributación",
      "Régimen cambiario",
      "Gestión empresarial",
      "SG-SST",
      "Riesgo psicosocial",
    ],
    level: 1,
  },
  {
    id: "jenny-sierra",
    name: "Jenny Sierra",
    role: "Especialista en Seguridad y Salud en el Trabajo",
    profession: "Ingeniera Industrial",
    area: "Capital HSE",
    service: "capital-hse",
    image: `${base}/jenny-sierra.jpeg`,
    shortDescription:
      "Especialista en Seguridad y Salud en el Trabajo y en Gerencia de Seguridad y Salud en el Trabajo. Más de 15 años de experiencia.",
    specialties: [
      "Gestión integral del riesgo",
      "Sistemas de gestión",
      "Cumplimiento normativo",
      "Oil & Gas",
      "Sector farmacéutico",
      "Seguridad física",
      "Transporte",
      "Tecnología",
      "Diseño e implementación",
      "Auditoría",
      "Seguimiento",
      "Mejora continua",
    ],
    certifications: ["ISO 9001", "ISO 14001", "ISO 45001", "ISO 39001"],
    certificationsLabel: "Auditora Líder",
    level: 2,
  },
/**{
    id: "julio-betin",
    name: "Julio Betín",
    role: "Especialista en Movilidad y Seguridad Vial",
    profession: "Profesional en Administración de Empresas",
    area: "Capital Mobility",
    service: "capital-mobility",
    image: `${base}/julio-betin.jpeg`,
    shortDescription: "Especialista en Movilidad y Seguridad Vial.",
    specialties: [
      "Diseño de PESV",
      "Implementación de PESV",
      "Seguimiento y mejora",
      "Gestión de riesgos viales",
      "Análisis de siniestros",
      "Auditoría interna ISO 39001",
      "Capacitación",
      "Cultura de seguridad vial",
      "Consultoría y diagnóstico",
      "Acompañamiento empresarial",
    ],
    level: 2,
  },*/
 
  {
    id: "manuel-mesa",
    name: "Manuel Mesa",
    role: "Especialista en Gestión Financiera",
    profession: "Administrador de Empresas",
    area: "Capital Business Services",
    service: "capital-business-services",
    image: `${base}/manuel-mesa.jpeg`,
    shortDescription: "Especialista en Gestión Financiera.",
    specialties: [
      "Direccionamiento estratégico",
      "Planeación",
      "Gestión administrativa",
      "Gestión financiera",
      "Optimización de recursos",
      "Eficiencia operacional",
      "Generación de valor",
      "Compras y abastecimiento",
      "Negociación con proveedores",
      "Capital humano",
      "Recursos organizacionales",
      "Sector industrial",
      "Oil & Gas",
      "Contratación y adquisición",
      "Negociación de bienes y servicios",
    ],
    level: 2,
  },
  {
    id: "felipe-reyes",
    name: "Felipe Reyes",
    role: "Especialista en Seguridad y Salud en el Trabajo",
    profession: "Profesional médico",
    area: "Capital HSE",
    service: "capital-hse",
    image: `${base}/felipe-reyes.jpeg`,
    shortDescription: "Profesional médico especialista en Seguridad y Salud en el Trabajo.",
    specialties: [
      "Gestión integral de salud laboral",
      "Prevención de riesgos",
      "Medicina preventiva",
      "Medicina del trabajo",
      "Vigilancia epidemiológica",
      "Promoción de la salud",
      "Prevención de enfermedades laborales",
      "Gestión de riesgos laborales",
    ],
    level: 3,
  },
  {
    id: "yuribel-rodriguez",
    name: "Yuribel Rodríguez",
    role: "Key Account Manager",
    profession: "Key Account Manager",
    area: "Gestión Comercial / Clientes",
    service: "capital-business-services",
    image: `${base}/yuribel-rodriguez.jpeg`,
    shortDescription:
      "Desarrollo estratégico de negocios y gestión de clientes corporativos, articulando las diferentes líneas de servicio de Capital Consulting.",
    specialties: [
      "Desarrollo estratégico de negocios",
      "Gestión de clientes corporativos",
      "Identificación de oportunidades",
      "Relaciones de largo plazo",
      "Crecimiento comercial",
      "Fidelización",
      "Generación de oportunidades",
      "Articulación de líneas de servicio",
    ],
    transversal: true,
    level: 3,
  },
  {
    id: "javier-carrero",
    name: "Javier Carrero",
    role: "Especialista en Derecho Laboral y Seguridad Social",
    profession: "Abogado",
    area: "Capital Business Services",
    service: "capital-business-services",
    image: `${base}/javier-carrero.jpeg`,
    shortDescription:
      "Abogado especialista en Derecho Laboral y Seguridad Social, Derecho Contractual y Relaciones Jurídico-Negociales, Derecho Constitucional y Conciliación en Derecho. Cuenta con amplia experiencia en asesoría y acompañamiento jurídico a empresas del sector privado en asuntos laborales, contractuales y comerciales.\n\nSu experiencia comprende la asesoría en relaciones laborales, negociación y acompañamiento empresarial frente a organizaciones sindicales, así como el análisis y gestión de asuntos jurídicos orientados a la prevención de riesgos legales y la adecuada toma de decisiones empresariales.",
    specialties: [
      "Derecho Laboral y Seguridad Social",
      "Derecho Contractual y Relaciones Jurídico-Negociales",
      "Derecho Constitucional",
      "Conciliación en Derecho",
      "Asesoría jurídica a empresas del sector privado",
      "Negociación y acompañamiento frente a organizaciones sindicales",
      "Prevención de riesgos legales",
    ],
    level: 2,
    category: "legal",
    displayOrder: 7,
    isActive: true,
  },
  /**
   * Perfil reservado para la futura Socia Co-Fundadora. Se deja la estructura
   * lista (id, nivel y orden ya definidos) pero sin datos ficticios: nombre,
   * foto, especialidad y biografía llegarán cuando el cliente los suministre.
   * isActive: false lo mantiene fuera del organigrama hasta ese momento.
   */
  {
    id: "socia-cofundadora",
    name: "",
    role: "Socia Co-Fundadora",
    profession: "",
    area: "",
    image: "",
    shortDescription: "",
    specialties: [],
    level: 1,
    category: "founding-team",
    displayOrder: 8,
    isActive: false,
  },
]

/**
 * Conexiones del organigrama: id del nodo origen → id del nodo destino.
 * "curved" controla si la línea debe arquearse hacia un lado para evitar
 * superponerse a las tarjetas del nivel intermedio (caso de Yuribel, que es
 * un perfil transversal conectado directamente a la dirección general).
 */
export interface OrgEdge {
  from: string
  to: string
  curve?: "left" | "right"
}

export const orgEdges: OrgEdge[] = [
  { from: "jennifer-zuluaga", to: "jenny-sierra" },
  /* { from: "jennifer-zuluaga", to: "julio-betin" },*/
  { from: "jennifer-zuluaga", to: "manuel-mesa" },
  { from: "jennifer-zuluaga", to: "felipe-reyes", curve: "right" },
  { from: "jennifer-zuluaga", to: "yuribel-rodriguez", curve: "right" },
  { from: "jennifer-zuluaga", to: "javier-carrero" },
]
