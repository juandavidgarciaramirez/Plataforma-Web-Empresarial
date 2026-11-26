import {
  type LucideIcon,
  GraduationCap,
  Brain,
  Users,
  HeartPulse,
  BarChart3,
  ShieldCheck,
  Truck,
  Route,
  ClipboardCheck,
  Target,
  HardHat,
  UserRound,
  TrendingUp,
  Lightbulb,
  Handshake,
  Building2,
  Lock,
  Award,
  Circle,
} from "lucide-react"

/**
 * Registro de iconos de lucide-react direccionable por nombre (string).
 * El backend guarda el nombre del icono como texto (`content.hero_slides.items[].icon`,
 * `content.company_values.icon_key`) en vez de una referencia a código, así
 * un cambio de icono es un dato editable desde el admin, no un deploy.
 * `Circle` es el respaldo para un nombre que todavía no esté registrado aquí.
 */
export const iconRegistry: Record<string, LucideIcon> = {
  GraduationCap,
  Brain,
  Users,
  HeartPulse,
  BarChart3,
  ShieldCheck,
  Truck,
  Route,
  ClipboardCheck,
  Target,
  HardHat,
  UserRound,
  TrendingUp,
  Lightbulb,
  Handshake,
  Building2,
  Lock,
  Award,
}

export function getIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Circle
  return iconRegistry[name] ?? Circle
}
