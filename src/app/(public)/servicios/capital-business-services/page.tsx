import type { Metadata } from "next"
import Link from "next/link"
import { canonicalUrl } from "@/lib/seo/metadata"
import { SITE } from "@/config/site"
import Image from "next/image"
import {
  ArrowRight,
  Banknote,
  Calculator,
  Landmark,
  Scale,
  Workflow,
  ShieldCheck,
  BarChart3,
  SlidersHorizontal,
  Lock,
  UserCheck,
  CalendarCheck,
  Search,
  PencilRuler,
  Rocket,
  Settings,
  RefreshCcw,
} from "lucide-react"
import { Navbar } from "@/components/organisms/Navbar/Navbar"
import { Footer } from "@/components/organisms/Footer/Footer"
import { ServiceHero } from "@/components/organisms/ServiceHero/ServiceHero"
import { ServiceGallerySection } from "@/components/organisms/ImageGallery/ServiceGallerySection"
import { getServiceMedia } from "@/services/public/services-public.service"
import { ScrollAnimation } from "@/components/atoms/ScrollAnimation"
import {
  heroImage,
  processImage,
  payrollImage,
  accountingImage,
  taxImage,
  laborImage,
  contactImage,
  valueIntro,
  valueNote,
  valuePillars,
  portfolioNote,
  portfolioServices,
  payrollScope,
  payrollBenefits,
  accountingItems,
  accountingNote,
  taxItems,
  taxNote,
  laborGroups,
  laborNote,
  workflowSteps,
  workflowNote,
  ctaMessage,
  ctaSteps,
} from "@/data/capital-business-services"

/** ISR: las imágenes y vacantes administrables se reflejan en ≤ 1 minuto, aunque la API no respondiera durante el build. */
export const revalidate = 60

export const metadata: Metadata = {
  title: "Capital Business Services | Capital Consulting & Services",
  description:
    "Capital Business Services: soluciones empresariales y outsourcing de nómina, contabilidad, tributaria y laboral de Capital Consulting & Services.",
  keywords:
    "Capital Business Services, outsourcing de nómina, outsourcing contable, asesoría tributaria, asesoría laboral, nómina electrónica, PILA, DIAN",
  alternates: { canonical: canonicalUrl("/servicios/capital-business-services") },
  openGraph: {
    title: "Capital Business Services | Soluciones Empresariales y Outsourcing",
    description:
      "Nómina, contabilidad, tributaria y laboral: un solo interlocutor para la gestión administrativa de su organización.",
    type: "website",
    locale: "es_CO",
    url: canonicalUrl("/servicios/capital-business-services"),
    siteName: SITE.name,
    images: [{ url: SITE.defaultOgImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Capital Business Services | Soluciones Empresariales y Outsourcing",
    description:
      "Nómina, contabilidad, tributaria y laboral: un solo interlocutor para la gestión administrativa de su organización.",
    images: [SITE.defaultOgImage],
  },
}

const topicIcons = [Banknote, Calculator, Landmark, Scale]
const valueIcons = [Workflow, ShieldCheck, BarChart3, SlidersHorizontal]
const payrollBenefitIcons = [ShieldCheck, Lock, UserCheck, CalendarCheck]
const workflowIcons = [Search, PencilRuler, Rocket, Settings, RefreshCcw]

export default async function CapitalBusinessServicesPage() {
  // Imagen y galería administrables (Etapa 15); sin ellas se usa la imagen estática actual.
  const media = await getServiceMedia("capital-business-services")

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <ServiceHero
          image={media?.imageUrl ?? heroImage}
          imageAlt={(media?.imageUrl && media.imageAlt) || "Consultora de Capital Business Services presentando indicadores financieros en sala de juntas"}
          imagePosition="68% 30%"
          eyebrow="Capital Business Services"
          title="Soluciones Empresariales y Outsourcing"
          description={valueIntro}
          primaryCta={{ label: "Conocer nuestros servicios", href: "#portafolio" }}
          secondaryCta={{ label: "Solicitar asesoría", href: "/contacto" }}
          highlights={[
            { label: "Nómina", icon: <Banknote className="h-4 w-4" /> },
            { label: "Contabilidad", icon: <Calculator className="h-4 w-4" /> },
            { label: "Tributaria", icon: <Landmark className="h-4 w-4" /> },
            { label: "Laboral", icon: <Scale className="h-4 w-4" /> },
          ]}
        />

        {/* PROPUESTA DE VALOR */}
        <section className="bg-white py-20 dark:bg-slate-950 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Nuestra propuesta de valor
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  Gestión administrativa, financiera y laboral sin contingencias
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">{valueIntro}</p>
              </div>
            </ScrollAnimation>

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {valuePillars.map((item, index) => {
                const Icon = valueIcons[index]
                return (
                  <ScrollAnimation key={item.title} delay={index * 0.1}>
                    <div className="group h-full rounded-xl border border-border/40 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg dark:bg-slate-900">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 font-display text-lg font-semibold">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </ScrollAnimation>
                )
              })}
            </div>

            <ScrollAnimation delay={0.15}>
              <div className="mt-12 grid grid-cols-1 items-center gap-8 rounded-2xl border border-border/40 bg-slate-50 p-6 dark:bg-slate-900/50 md:grid-cols-2 md:p-8">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-lg">
                  <Image
                    src={processImage}
                    alt="Equipo de Capital Business Services revisando el flujo de procesos e indicadores de cumplimiento"
                    fill
                    sizes="(min-width: 768px) 40vw, 90vw"
                    className="object-cover"
                  />
                </div>
                <p className="text-base italic text-muted-foreground md:text-lg">
                  {valueNote}
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* PORTAFOLIO DE SERVICIOS */}
        <section id="portafolio" className="bg-slate-50 py-20 dark:bg-slate-900/50 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Nuestro portafolio
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  Portafolio de servicios
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Soluciones especializadas para las necesidades de tu organización.
                </p>
              </div>
            </ScrollAnimation>

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {portfolioServices.map((service, index) => {
                const Icon = topicIcons[index]
                return (
                  <ScrollAnimation key={service.number} delay={index * 0.1}>
                    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/40 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg dark:bg-slate-950">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 90vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                        <span className="absolute left-4 top-4 text-xs font-semibold tracking-widest text-white/80">
                          {service.number}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="mt-4 font-display text-lg font-semibold">
                          {service.title}
                        </h3>
                        <p className="mt-2 flex-1 text-sm text-muted-foreground">
                          {service.description}
                        </p>
                        <Link
                          href={service.href}
                          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                        >
                          Conocer más
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </ScrollAnimation>
                )
              })}
            </div>

            <ScrollAnimation delay={0.2}>
              <p className="mt-12 text-center text-sm italic text-muted-foreground">
                {portfolioNote}
              </p>
            </ScrollAnimation>
          </div>
        </section>

        {/* OUTSOURCING DE NÓMINA */}
        <section id="nomina" className="bg-white py-20 dark:bg-slate-950 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <ScrollAnimation>
                <div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                    01 · Outsourcing de Nómina
                  </span>
                  <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                    Outsourcing de Nómina
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Liquidación, seguridad social, parafiscales y nómina electrónica,
                    con doble revisión de cálculos y cierres a tiempo.
                  </p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.15} direction="right">
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src={payrollImage}
                    alt="Analista de Capital Business Services revisando la liquidación de nómina"
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </ScrollAnimation>
            </div>

            <ScrollAnimation delay={0.1}>
              <p className="mt-16 text-xs font-semibold uppercase tracking-wider text-foreground/70">
                Alcance del servicio
              </p>
            </ScrollAnimation>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {payrollScope.map((item, index) => (
                <ScrollAnimation key={item} delay={(index % 2) * 0.08}>
                  <div className="flex items-start gap-4 rounded-lg border border-border/40 bg-slate-50 px-4 py-3.5 dark:bg-slate-900">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                </ScrollAnimation>
              ))}
            </div>

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {payrollBenefits.map((item, index) => {
                const Icon = payrollBenefitIcons[index]
                return (
                  <ScrollAnimation key={item.title} delay={index * 0.1}>
                    <div className="h-full rounded-xl border border-white/10 bg-slate-900 p-6 text-white">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-display text-base font-semibold">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-300">{item.description}</p>
                    </div>
                  </ScrollAnimation>
                )
              })}
            </div>
          </div>
        </section>

        {/* OUTSOURCING CONTABLE */}
        <section id="contable" className="bg-slate-50 py-20 dark:bg-slate-900/50 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <ScrollAnimation>
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src={accountingImage}
                    alt="Consultor de Capital Business Services presentando el estado de resultados a un cliente"
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.15} direction="right">
                <div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                    02 · Outsourcing Contable
                  </span>
                  <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                    Outsourcing Contable
                  </h2>
                  <ul className="mt-6 space-y-2">
                    {accountingItems.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 rounded-lg bg-white px-4 py-3 text-sm italic text-muted-foreground shadow-sm dark:bg-slate-950">
                    {accountingNote}
                  </p>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* ASESORÍA TRIBUTARIA */}
        <section id="tributaria" className="bg-white py-20 dark:bg-slate-950 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <ScrollAnimation className="lg:order-2">
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src={taxImage}
                    alt="Asesor tributario de Capital Business Services explicando indicadores de cumplimiento"
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.15} className="lg:order-1">
                <div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                    03 · Asesoría Tributaria
                  </span>
                  <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                    Asesoría Tributaria
                  </h2>
                  <ul className="mt-6 space-y-2">
                    {taxItems.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 rounded-lg bg-slate-50 px-4 py-3 text-sm italic text-muted-foreground shadow-sm dark:bg-slate-900">
                    {taxNote}
                  </p>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* ASESORÍA LABORAL */}
        <section id="laboral" className="bg-slate-50 py-20 dark:bg-slate-900/50 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <ScrollAnimation>
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src={laborImage}
                    alt="Asesores de Capital Business Services cerrando un acuerdo laboral con un cliente"
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.15} direction="right">
                <div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                    04 · Asesoría Laboral
                  </span>
                  <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                    Asesoría Laboral
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">{laborNote}</p>
                </div>
              </ScrollAnimation>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {laborGroups.map((group, index) => (
                <ScrollAnimation key={group.title} delay={index * 0.1}>
                  <div className="h-full overflow-hidden rounded-xl border border-border/40 shadow-sm">
                    <div className="bg-corporate-dark px-5 py-3.5">
                      <h3 className="font-display text-base font-semibold text-white">
                        {group.title}
                      </h3>
                    </div>
                    <ul className="space-y-2 bg-white p-5 dark:bg-slate-950">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* CÓMO TRABAJAMOS */}
        <section className="bg-slate-900 py-20 text-white md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-teal-400">
                  Cómo trabajamos
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  Cinco etapas, un solo interlocutor
                </h2>
              </div>
            </ScrollAnimation>

            <div className="relative mt-16">
              {/* Línea de ruta — solo desktop */}
              <div className="absolute left-0 right-0 top-8 hidden h-px bg-white/10 lg:block" />

              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
                {workflowSteps.map((item, index) => {
                  const Icon = workflowIcons[index]
                  return (
                    <ScrollAnimation key={item.step} delay={index * 0.1}>
                      <div className="relative text-center">
                        <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-400 text-slate-900 shadow-lg shadow-teal-400/20">
                          <span className="font-display text-xl font-bold">
                            {item.step}
                          </span>
                        </div>
                        <div className="mx-auto mt-4 flex h-8 w-8 items-center justify-center text-teal-400">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-display text-lg font-semibold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-300">{item.description}</p>
                      </div>
                    </ScrollAnimation>
                  )
                })}
              </div>
            </div>

            <ScrollAnimation delay={0.2}>
              <div className="mt-16 rounded-xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm md:p-8">
                <p className="text-base font-medium text-white md:text-lg">
                  {workflowNote}
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* EL SIGUIENTE PASO / CTA FINAL */}
        <section
          id="contacto"
          className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 py-20 text-white md:py-28"
        >
          <div className="container relative mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <ScrollAnimation>
                <div>
                  <span className="text-sm font-semibold tracking-[0.2em] text-teal-400">
                    EL SIGUIENTE PASO
                  </span>
                  <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">
                    Agendemos un diagnóstico sin costo
                  </h2>
                  <p className="mt-4 text-lg text-slate-300">{ctaMessage}</p>

                  <ol className="mt-8 space-y-4">
                    {ctaSteps.map((step, index) => (
                      <li key={step} className="flex items-center gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-corporate-orange text-sm font-bold text-white">
                          {index + 1}
                        </span>
                        <span className="text-base text-white">{step}</span>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-10 flex flex-wrap gap-4">
                    <Link
                      href="/contacto"
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90"
                    >
                      Solicitar diagnóstico
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/contacto"
                      className="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/5 px-8 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
                    >
                      Contactar
                    </Link>
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.15} direction="right">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl shadow-black/40">
                  <Image
                    src={contactImage}
                    alt="Acuerdo comercial entre Capital Business Services y un cliente"
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>
        <ServiceGallerySection media={media} />
      </main>
      <Footer />
    </>
  )
}
