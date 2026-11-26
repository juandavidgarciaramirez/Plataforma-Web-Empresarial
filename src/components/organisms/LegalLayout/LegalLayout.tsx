import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { AlertTriangle } from "lucide-react"
import { Navbar } from "@/components/organisms/Navbar/Navbar"
import { Footer } from "@/components/organisms/Footer/Footer"
import { LegalTableOfContents } from "./LegalTableOfContents"

interface LegalLayoutProps {
  icon: LucideIcon
  title: string
  /** Línea corta bajo el título (razón social, versión, fecha, etc.). */
  meta?: ReactNode
  sections: { id: string; title: string }[]
  /** Si el contenido aún no es un documento oficial aprobado (sección 34 del brief). */
  pendingApproval?: boolean
  children: ReactNode
}

/**
 * Layout compartido de las páginas legales (`/politica-tratamiento-datos`,
 * `/politica-privacidad`, `/terminos-y-condiciones`): sobrio, sin hero
 * comercial, contenedor de lectura de hasta 900px e índice fijo en
 * escritorio (sección 7 del brief).
 */
export function LegalLayout({ icon: Icon, title, meta, sections, pendingApproval, children }: LegalLayoutProps) {
  return (
    <>
      <Navbar />
      <main>
        <div className="border-b border-border/40 bg-slate-50 pb-10 pt-32 dark:bg-slate-900/30 md:pt-40">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold text-foreground md:text-4xl">{title}</h1>
            {meta && <div className="mt-3 max-w-2xl text-sm text-muted-foreground">{meta}</div>}

            {pendingApproval && (
              <div className="mt-6 flex max-w-2xl items-start gap-3 rounded-xl border border-amber-300/70 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-400/30 dark:bg-amber-950/40 dark:text-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Este documento está pendiente de validación y aprobación oficial por parte de Capital Consulting
                  and Services S.A.S. Mientras tanto, prevalece lo dispuesto en nuestra{" "}
                  <a href="/politica-tratamiento-datos" className="font-medium underline underline-offset-2">
                    Política de Tratamiento de Datos Personales
                  </a>
                  .
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white py-14 dark:bg-slate-950 md:py-20">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="lg:grid lg:grid-cols-[240px_minmax(0,900px)] lg:items-start lg:gap-12">
              <LegalTableOfContents sections={sections} />
              <div className="mx-auto max-w-[900px] space-y-10 lg:mx-0">{children}</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
