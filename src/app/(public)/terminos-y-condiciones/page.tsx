import type { Metadata } from "next"
import { FileText } from "lucide-react"
import { LegalLayout } from "@/components/organisms/LegalLayout"
import { LegalSection } from "@/components/organisms/LegalLayout/LegalSection"
import { TERMS_IS_OFFICIAL, TERMS_LAST_UPDATED, TERMS_SECTIONS, TERMS_VERSION } from "@/data/legal/terms"
import { canonicalUrl } from "@/lib/seo/metadata"

export const metadata: Metadata = {
  title: "Términos y Condiciones | Capital Consulting",
  description: "Términos y condiciones de uso del sitio web de Capital Consulting and Services S.A.S.",
  alternates: { canonical: canonicalUrl("/terminos-y-condiciones") },
  // No se indexa mientras el contenido esté pendiente de aprobación oficial (sección 25 del brief).
  robots: TERMS_IS_OFFICIAL ? { index: true, follow: true } : { index: false, follow: true },
}

const lastUpdatedLabel = new Date(`${TERMS_LAST_UPDATED}T00:00:00`).toLocaleDateString("es-CO", {
  day: "2-digit",
  month: "long",
  year: "numeric",
})

export default function TerminosYCondicionesPage() {
  return (
    <LegalLayout
      icon={FileText}
      title="Términos y Condiciones"
      sections={TERMS_SECTIONS}
      pendingApproval={!TERMS_IS_OFFICIAL}
      meta={
        <p className="text-xs text-muted-foreground/80">
          Versión {TERMS_VERSION} · Última actualización: {lastUpdatedLabel}
        </p>
      }
    >
      {TERMS_SECTIONS.map((section) => (
        <LegalSection key={section.id} id={section.id} title={section.title} paragraphs={section.paragraphs} />
      ))}
    </LegalLayout>
  )
}
