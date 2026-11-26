import type { Metadata } from "next"
import { Mail, MessageCircle, MapPin } from "lucide-react"
import { Navbar } from "@/components/organisms/Navbar/Navbar"
import { Footer } from "@/components/organisms/Footer/Footer"
import { InstitutionalHero } from "@/components/organisms/InstitutionalHero/InstitutionalHero"
import { ContactForm } from "@/components/organisms/ContactForm/ContactForm"
import { ContactCard } from "@/components/organisms/ContactCard/ContactCard"
import { ScrollAnimation } from "@/components/atoms/ScrollAnimation"
import { CONTACT, buildWhatsAppUrl } from "@/config/contact"
import { canonicalUrl } from "@/lib/seo/metadata"
import { SITE } from "@/config/site"

export const metadata: Metadata = {
  title: "Contacto | Capital Consulting and Services",
  description:
    "Conecta con el equipo especializado de Capital Consulting para encontrar la solución adecuada para tu organización.",
  keywords: "contacto, asesoría, Capital Consulting, servicios empresariales",
  alternates: { canonical: canonicalUrl("/contacto") },
  openGraph: {
    title: "Contacto | Capital Consulting and Services",
    description: "Hablemos de su próximo desafío empresarial.",
    type: "website",
    locale: "es_CO",
    url: canonicalUrl("/contacto"),
    siteName: SITE.name,
    images: [{ url: SITE.defaultOgImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contacto | Capital Consulting and Services",
    description: "Hablemos de su próximo desafío empresarial.",
    images: [SITE.defaultOgImage],
  },
}

export default function ContactoPage() {
  return (
    <>
      <Navbar />
      <main>
        <InstitutionalHero
          eyebrow="Hablemos"
          title="Hablemos de su próximo desafío empresarial."
          subtitle="Conecte con el equipo especializado que mejor se ajusta a la necesidad de su organización."
          image="/images/contacto/hero.png"
          imageAlt="Equipo comercial de Capital Consulting and Services en una reunión de asesoría"
          imagePosition="30% 35%"
          cta={{ label: "Solicitar asesoría", href: "#formulario" }}
        />

        {/* TARJETAS DE CONTACTO */}
        <section className="bg-white py-20 dark:bg-slate-950 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <ScrollAnimation>
                <ContactCard
                  icon={Mail}
                  title="Correo comercial"
                  value={CONTACT.emails.commercial}
                  href={`mailto:${CONTACT.emails.commercial}`}
                  description="Cotizaciones y solicitudes comerciales."
                />
              </ScrollAnimation>
              <ScrollAnimation delay={0.08}>
                <ContactCard
                  icon={MessageCircle}
                  title="WhatsApp"
                  value={CONTACT.whatsapp.display}
                  href={buildWhatsAppUrl()}
                  description="Escríbenos y te atenderemos a la brevedad."
                />
              </ScrollAnimation>
              <ScrollAnimation delay={0.16}>
                <ContactCard
                  icon={MapPin}
                  title="Oficina"
                  value="Bogotá, Colombia"
                  description="Atención en horario hábil, de lunes a viernes."
                />
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* FORMULARIO */}
        <section id="formulario" className="scroll-mt-24 bg-slate-50 py-20 dark:bg-slate-900/50 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="mx-auto max-w-2xl text-center">
              <ScrollAnimation>
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Solicitar asesoría
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  Cuéntenos sobre su organización
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Un especialista de Capital Consulting se pondrá en contacto para entender su necesidad y
                  proponer la mejor solución.
                </p>
              </ScrollAnimation>
            </div>

            <ScrollAnimation delay={0.1}>
              <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-border/40 bg-white p-6 shadow-sm dark:bg-slate-950 md:p-10">
                <ContactForm />
              </div>
            </ScrollAnimation>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
