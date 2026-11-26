import type { Metadata } from "next"
import { ShieldCheck } from "lucide-react"
import { LegalLayout } from "@/components/organisms/LegalLayout"
import { LegalSection } from "@/components/organisms/LegalLayout/LegalSection"
import {
  COMPANY_LEGAL_INFO,
  DATA_POLICY_LAST_UPDATED,
  DATA_POLICY_SECTIONS,
  DATA_POLICY_VERSION,
} from "@/data/legal/data-policy"
import { canonicalUrl } from "@/lib/seo/metadata"

export const metadata: Metadata = {
  title: "Política de Tratamiento de Datos | Capital Consulting",
  description:
    "Política de Tratamiento de Datos Personales de Capital Consulting and Services S.A.S., conforme a la Ley 1581 de 2012 y el Decreto 1074 de 2015.",
  alternates: { canonical: canonicalUrl("/politica-tratamiento-datos") },
  robots: { index: true, follow: true },
}

const lastUpdatedLabel = new Date(`${DATA_POLICY_LAST_UPDATED}T00:00:00`).toLocaleDateString("es-CO", {
  day: "2-digit",
  month: "long",
  year: "numeric",
})

export default function PoliticaTratamientoDatosPage() {
  return (
    <LegalLayout
      icon={ShieldCheck}
      title="Política de Tratamiento de Datos Personales"
      sections={DATA_POLICY_SECTIONS}
      meta={
        <>
          <p>
            {COMPANY_LEGAL_INFO.razonSocial} · NIT {COMPANY_LEGAL_INFO.nit} · {COMPANY_LEGAL_INFO.direccion},{" "}
            {COMPANY_LEGAL_INFO.domicilio}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/80">
            Versión {DATA_POLICY_VERSION} · Última actualización: {lastUpdatedLabel}
          </p>
        </>
      }
    >
      {DATA_POLICY_SECTIONS.map((section) => (
        <LegalSection key={section.id} id={section.id} title={section.title} paragraphs={section.paragraphs} />
      ))}
    </LegalLayout>
  )
}
