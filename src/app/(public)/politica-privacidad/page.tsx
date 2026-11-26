import type { Metadata } from "next"
import { Lock } from "lucide-react"
import { LegalLayout } from "@/components/organisms/LegalLayout"
import { LegalSection } from "@/components/organisms/LegalLayout/LegalSection"
import {
  PRIVACY_POLICY_IS_OFFICIAL,
  PRIVACY_POLICY_LAST_UPDATED,
  PRIVACY_POLICY_SECTIONS,
  PRIVACY_POLICY_VERSION,
} from "@/data/legal/privacy-policy"
import { canonicalUrl } from "@/lib/seo/metadata"

export const metadata: Metadata = {
  title: "Política de Privacidad | Capital Consulting",
  description:
    "Cómo Capital Consulting and Services S.A.S. trata la información recopilada a través de su sitio web.",
  alternates: { canonical: canonicalUrl("/politica-privacidad") },
  // No se indexa mientras el contenido esté pendiente de aprobación oficial (sección 25 del brief).
  robots: PRIVACY_POLICY_IS_OFFICIAL ? { index: true, follow: true } : { index: false, follow: true },
}

const lastUpdatedLabel = new Date(`${PRIVACY_POLICY_LAST_UPDATED}T00:00:00`).toLocaleDateString("es-CO", {
  day: "2-digit",
  month: "long",
  year: "numeric",
})

export default function PoliticaPrivacidadPage() {
  return (
    <LegalLayout
      icon={Lock}
      title="Política de Privacidad"
      sections={PRIVACY_POLICY_SECTIONS}
      pendingApproval={!PRIVACY_POLICY_IS_OFFICIAL}
      meta={
        <p className="text-xs text-muted-foreground/80">
          Versión {PRIVACY_POLICY_VERSION} · Última actualización: {lastUpdatedLabel}
        </p>
      }
    >
      {PRIVACY_POLICY_SECTIONS.map((section) => (
        <LegalSection key={section.id} id={section.id} title={section.title} paragraphs={section.paragraphs} />
      ))}
    </LegalLayout>
  )
}
