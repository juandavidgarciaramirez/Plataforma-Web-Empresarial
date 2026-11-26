import type { Metadata } from "next"
import Image from "next/image"
import { ShieldCheck, MessageCircleHeart } from "lucide-react"
import { Navbar } from "@/components/organisms/Navbar/Navbar"
import { Footer } from "@/components/organisms/Footer/Footer"
import { InstitutionalHero } from "@/components/organisms/InstitutionalHero/InstitutionalHero"
import { PQRForm } from "@/components/organisms/PQRForm/PQRForm"
import { ScrollAnimation } from "@/components/atoms/ScrollAnimation"
import { CONTACT } from "@/config/contact"
import { canonicalUrl } from "@/lib/seo/metadata"
import { SITE } from "@/config/site"

export const metadata: Metadata = {
  title: "PQR | Capital Consulting and Services",
  description:
    "Presenta tus peticiones, quejas, reclamos, sugerencias o felicitaciones ante Capital Consulting. Gestionamos tu solicitud con responsabilidad y confidencialidad.",
  keywords: "PQR, peticiones, quejas, reclamos, sugerencias, Capital Consulting",
  alternates: { canonical: canonicalUrl("/pqr") },
  openGraph: {
    title: "PQR | Capital Consulting and Services",
    description: "Estamos para escucharte.",
    type: "website",
    locale: "es_CO",
    url: canonicalUrl("/pqr"),
    siteName: SITE.name,
    images: [{ url: SITE.defaultOgImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PQR | Capital Consulting and Services",
    description: "Estamos para escucharte.",
    images: [SITE.defaultOgImage],
  },
}

export default function PqrPage() {
  return (
    <>
      <Navbar />
      <main>
        <InstitutionalHero
          eyebrow="Atención al cliente"
          title="Estamos para escucharte."
          subtitle="Queremos conocer tus inquietudes, solicitudes y oportunidades de mejora."
          image="/images/pqr/hero.png"
          imageAlt="Equipo de Capital Consulting and Services atendiendo una solicitud"
          imagePosition="center 32%"
          cta={{ label: "Presentar una PQR", href: "#formulario" }}
        />

        {/* INFORMACIÓN */}
        <section className="bg-white py-20 dark:bg-slate-950 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <ScrollAnimation>
                <div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                    Tu opinión nos ayuda a mejorar
                  </span>
                  <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                    Gestionamos cada solicitud con responsabilidad
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    En Capital Consulting and Services SAS gestionamos tus solicitudes con responsabilidad,
                    confidencialidad y orientación al servicio.
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3 rounded-xl border border-border/40 p-4">
                      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Confidencialidad y tratamiento responsable de tus datos.
                      </p>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl border border-border/40 p-4">
                      <MessageCircleHeart className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Seguimiento cercano hasta la respuesta de tu solicitud.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.15} direction="right">
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src="/images/pqr/communication.png"
                    alt="Asesor de Capital Consulting atendiendo una comunicación con un cliente"
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* FORMULARIO */}
        <section id="formulario" className="scroll-mt-24 bg-slate-50 py-20 dark:bg-slate-900/50 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="mx-auto max-w-2xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Formulario PQR
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  Cuéntanos tu solicitud
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Todas las solicitudes se gestionan a través de{" "}
                  <a href={`mailto:${CONTACT.emails.pqr}`} className="font-medium text-primary hover:underline">
                    {CONTACT.emails.pqr}
                  </a>
                  .
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.1}>
              <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-border/40 bg-white p-6 shadow-sm dark:bg-slate-950 md:p-10">
                <PQRForm />
              </div>
            </ScrollAnimation>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
