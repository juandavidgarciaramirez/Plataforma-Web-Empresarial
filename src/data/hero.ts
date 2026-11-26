import type { LucideIcon } from "lucide-react"
import {
  GraduationCap,
  Truck,
  ShieldCheck,
  Users,
  TrendingUp,
  BookOpen,
  Brain,
  UserRound,
  HeartPulse,
  BarChart3,
  Route,
  ClipboardCheck,
  HardHat,
  Building2,
  Handshake,
  Target,
  Lightbulb,
} from "lucide-react"

export interface HeroSlide {
  id: string
  nameWhite: string
  nameBlue: string
  title: string
  description: string
  image: string
  /** Posición del punto focal de la imagen (object-position). Por defecto "center". */
  imagePosition?: string
  href: string
  items: {
    label: string
    icon: LucideIcon
  }[]
}

export const heroSlides: HeroSlide[] = [
  {
    id: "capital-learning",
    nameWhite: "CAPITAL",
    nameBlue: "LEARNING",
    title: "Desarrollamos el talento que transforma organizaciones.",
    description:
      "Soluciones de formación y desarrollo para fortalecer las capacidades de las personas y potenciar el desempeño organizacional.",
    image: "/images/heroprincipal/capital-learning.png",
    href: "/servicios/capital-learning",

    items: [
      {
        label: "Formación",
        icon: GraduationCap,
      },
      {
        label: "Desarrollo",
        icon: Brain,
      },
      {
        label: "Liderazgo",
        icon: Users,
      },
      {
        label: "Cultura",
        icon: HeartPulse,
      },
      {
        label: "Desempeño",
        icon: BarChart3,
      },
    ],
  },

  {
    id: "capital-mobility",
    nameWhite: "CAPITAL",
    nameBlue: "MOBILITY",
    title: "Movilidad segura para organizaciones más eficientes.",
    description:
      "Gestionamos la seguridad vial y la movilidad empresarial para reducir riesgos y fortalecer la operación.",
    image: "/images/heroprincipal/capital-mobility.png",
    href: "/servicios/capital-mobility",

    items: [
      {
        label: "Seguridad vial",
        icon: ShieldCheck,
      },
      {
        label: "Movilidad",
        icon: Truck,
      },
      {
        label: "Gestión del riesgo",
        icon: Route,
      },
      {
        label: "Prevención",
        icon: ClipboardCheck,
      },
      {
        label: "Operación",
        icon: Target,
      },
    ],
  },

  {
    id: "capital-hse",
    nameWhite: "CAPITAL",
    nameBlue: "HSE",
    title: "Prevenir riesgos. Proteger personas. Fortalecer organizaciones.",
    description:
      "Soluciones integrales de Seguridad y Salud en el Trabajo orientadas a la prevención y gestión del riesgo.",
    image: "/images/heroprincipal/capital-sst.png",
    href: "/servicios/capital-hse",

    items: [
      {
        label: "Seguridad",
        icon: HardHat,
      },
      {
        label: "Prevención",
        icon: ShieldCheck,
      },
      {
        label: "Salud",
        icon: HeartPulse,
      },
      {
        label: "Gestión",
        icon: ClipboardCheck,
      },
      {
        label: "Cumplimiento",
        icon: BarChart3,
      },
    ],
  },

  {
    id: "capital-talento-humano",
    nameWhite: "CAPITAL",
    nameBlue: "STAFFING",
    title: "Personas que impulsan organizaciones extraordinarias.",
    description:
      "Estrategias para fortalecer el talento, la cultura y las relaciones que construyen organizaciones sostenibles.",
    image: "/images/heroprincipal/capital-talento-humano.png",
    href: "/servicios/capital-staffing",

    items: [
      {
        label: "Talento",
        icon: UserRound,
      },
      {
        label: "Cultura",
        icon: Users,
      },
      {
        label: "Liderazgo",
        icon: Target,
      },
      {
        label: "Bienestar",
        icon: HeartPulse,
      },
      {
        label: "Productividad",
        icon: TrendingUp,
      },
    ],
  },

  {
    id: "capital-soluciones-empresariales",
    nameWhite: "CAPITAL",
    nameBlue: "BUSINESS SERVICES",
    title: "Estrategia, innovación y crecimiento para tu organización.",
    description:
      "Acompañamiento estratégico para convertir los desafíos empresariales en oportunidades de crecimiento.",
    image: "/images/heroprincipal/capital-soluciones-empresariales.png",
    href: "/servicios/capital-business-services",

    items: [
      {
        label: "Estrategia",
        icon: Target,
      },
      {
        label: "Innovación",
        icon: Lightbulb,
      },
      {
        label: "Consultoría",
        icon: Handshake,
      },
      {
        label: "Gestión",
        icon: Building2,
      },
      {
        label: "Crecimiento",
        icon: TrendingUp,
      },
    ],
  },
]