import {
  Truck,
  HardHat,
  BriefcaseBusiness,
  UsersRound,
  GraduationCap,
  type LucideIcon,
} from "lucide-react"

export interface Service {
  slug: string
  name: string
  href: string
  description: string
  icon: LucideIcon
}

export const services: Service[] = [
  {
    slug: "capital-learning",
    name: "Capital Learning",
    href: "/servicios/capital-learning",
    description:
      "Formación que transforma el talento: portafolio de servicios de capacitación empresarial.",
    icon: GraduationCap,
  },
  {
    slug: "capital-mobility",
    name: "Capital Mobility",
    href: "/servicios/capital-mobility",
    description:
      "Seguridad vial: consultoría, implementación y gestión del riesgo vial para organizaciones con flota.",
    icon: Truck,
  },
  {
    slug: "capital-business-services",
    name: "Capital Business Services",
    href: "/servicios/capital-business-services",
    description:
      "Soluciones empresariales: nómina, contabilidad, tributaria y laboral.",
    icon: BriefcaseBusiness,
  },
  {
    slug: "capital-staffing",
    name: "Capital Staffing",
    href: "/servicios/capital-staffing",
    description:
      "Conectamos el mejor talento con las mejores empresas: reclutamiento que reduce el riesgo, acelera la operación y sostiene el crecimiento.",
    icon: UsersRound,
  },
  {
    slug: "capital-hse",
    name: "Capital HSE",
    href: "/servicios/capital-hse",
    description:
      "Seguridad y Salud en el Trabajo, riesgos laborales y bienestar.",
    icon: HardHat,
  },
]
