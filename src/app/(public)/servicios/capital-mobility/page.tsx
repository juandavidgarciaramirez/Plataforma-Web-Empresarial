import type { Metadata } from "next"
import Link from "next/link"
import { canonicalUrl } from "@/lib/seo/metadata"
import { SITE } from "@/config/site"
import Image from "next/image"
import {
  Truck,
  Fuel,
  HardHat,
  Warehouse,
  CarFront,
  Route,
  ClipboardCheck,
  SearchCheck,
  AlertTriangle,
  GraduationCap,
  UsersRound,
  ClipboardList,
  BarChart3,
  Scale,
  Megaphone,
  UserPlus,
  Gauge,
  RotateCcw,
  ShieldAlert,
  Navigation,
  CheckCircle2,
  HeartPulse,
  ArrowRight,
  ShieldCheck,
  Target,
} from "lucide-react"
import { Navbar } from "@/components/organisms/Navbar/Navbar"
import { Footer } from "@/components/organisms/Footer/Footer"
import { ServiceHero } from "@/components/organisms/ServiceHero/ServiceHero"
import { ServiceGallerySection } from "@/components/organisms/ImageGallery/ServiceGallerySection"
import { getServiceMedia } from "@/services/public/services-public.service"
import { ScrollAnimation } from "@/components/atoms/ScrollAnimation"
import { ProcessSteps } from "@/components/molecules/ProcessSteps/ProcessSteps"
import {
  heroImage,
  strategicImage,
  strategicSectors,
  portfolioItems,
  pesvImage,
  pesvAuditImage,
  pesvSteps,
  pesvComplementaryServices,
  trainingImage,
  trainingTopics,
  driverManagementImage,
  driverManagementBlocks,
  inspectionsImage,
  inspectionItems,
  investigationImage,
  investigationItems,
  indicatorsImage,
  indicatorsItems,
  complianceImage,
  complianceItems,
  campaignsImage,
  campaignCards,
} from "@/data/capital-mobility"

/** ISR: las imágenes y vacantes administrables se reflejan en ≤ 1 minuto, aunque la API no respondiera durante el build. */
export const revalidate = 60

export const metadata: Metadata = {
  title: "Capital Mobility | Seguridad Vial | Capital Consulting",
  description:
    "Consultoría, implementación y gestión del riesgo vial para organizaciones con flota.",
  keywords:
    "Capital Mobility, seguridad vial, PESV, Plan Estratégico de Seguridad Vial, gestión del riesgo vial, auditorías al PESV, capacitación de conductores, campañas de cultura vial, siniestralidad",
  alternates: { canonical: canonicalUrl("/servicios/capital-mobility") },
  openGraph: {
    title: "Capital Mobility | Seguridad Vial",
    description:
      "Consultoría, implementación y gestión del riesgo vial para organizaciones con flota.",
    type: "website",
    locale: "es_CO",
    url: canonicalUrl("/servicios/capital-mobility"),
    siteName: SITE.name,
    images: [{ url: SITE.defaultOgImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Capital Mobility | Seguridad Vial",
    description:
      "Consultoría, implementación y gestión del riesgo vial para organizaciones con flota.",
    images: [SITE.defaultOgImage],
  },
}

const sectorIcons = [Truck, Fuel, HardHat, Warehouse, CarFront]

const portfolioIcons = [
  Route,
  ClipboardCheck,
  SearchCheck,
  AlertTriangle,
  GraduationCap,
  UsersRound,
  ClipboardList,
  BarChart3,
  Scale,
  Megaphone,
]

const driverManagementIcons = [ClipboardCheck, Gauge, UserPlus, RotateCcw]

const campaignIcons = [ShieldAlert, Navigation, CheckCircle2, HeartPulse]

export default async function CapitalMobilityPage() {
  // Imagen y galería administrables (Etapa 15); sin ellas se usa la imagen estática actual.
  const media = await getServiceMedia("capital-mobility")

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <ServiceHero
          image={media?.imageUrl ?? heroImage}
          imageAlt={(media?.imageUrl && media.imageAlt) || "Operación de transporte con vehículos de Capital Consulting en puerto, supervisada con tablet"}
          eyebrow="Capital Mobility"
          title="Seguridad Vial"
          description="Línea de negocio: consultoría, implementación y gestión del riesgo vial para organizaciones con flota."
          tag="Portafolio de servicios"
          primaryCta={{ label: "Solicitar asesoría", href: "/contacto" }}
          secondaryCta={{ label: "Ver portafolio de servicios", href: "#portafolio" }}
          highlights={[
            { label: "Seguridad vial", icon: <ShieldCheck className="h-4 w-4" /> },
            { label: "Movilidad", icon: <Truck className="h-4 w-4" /> },
            { label: "Gestión del riesgo", icon: <Route className="h-4 w-4" /> },
            { label: "Prevención", icon: <ClipboardCheck className="h-4 w-4" /> },
            { label: "Operación", icon: <Target className="h-4 w-4" /> },
          ]}
        />

        {/* POR QUÉ ES ESTRATÉGICA */}
        <section className="bg-white py-20 dark:bg-slate-950 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <ScrollAnimation>
                <div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                    Por qué esta línea es estratégica
                  </span>
                  <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                    Cumplimiento normativo y reducción real de costos
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    La seguridad vial es una obligación normativa y, a la vez, una
                    palanca directa de reducción de costos operativos, siniestralidad
                    y pérdidas por indisponibilidad de flota.
                  </p>

                  <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-foreground/70">
                    Sectores objetivo
                  </p>
                  <div className="mt-4 space-y-3">
                    {strategicSectors.map((sector, index) => {
                      const Icon = sectorIcons[index]
                      return (
                        <div
                          key={sector}
                          className="flex items-center gap-3 rounded-lg border-l-2 border-primary bg-slate-50 px-4 py-3 dark:bg-slate-900"
                        >
                          <Icon className="h-4 w-4 shrink-0 text-primary" />
                          <span className="text-sm text-foreground">{sector}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.15} direction="right">
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src={strategicImage}
                    alt="Equipo de Capital Consulting realizando un diagnóstico de seguridad vial en carretera"
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* PORTAFOLIO DE SERVICIOS */}
        <section id="portafolio" className="bg-slate-50 py-20 dark:bg-slate-900/50 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Portafolio de servicios
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  Diez frentes para gestionar el riesgo vial
                </h2>
              </div>
            </ScrollAnimation>

            <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
              {portfolioItems.map((item, index) => {
                const Icon = portfolioIcons[index]
                return (
                  <ScrollAnimation key={item.number} delay={(index % 2) * 0.1}>
                    <div className="group flex h-full items-start gap-4 rounded-xl border border-border/40 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg dark:bg-slate-950">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold tracking-widest text-primary">
                          {item.number}
                        </span>
                        <h3 className="mt-1 font-display text-lg font-semibold">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </ScrollAnimation>
                )
              })}
            </div>
          </div>
        </section>

        {/* PESV */}
        <section className="bg-slate-900 py-20 text-white md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-teal-400">
                  PESV
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  Plan Estratégico de Seguridad Vial
                </h2>
                <p className="mt-4 text-lg text-slate-300">
                  Acompañamos el ciclo completo del PESV, desde el diseño documental
                  hasta la mejora continua verificada en campo.
                </p>
              </div>
            </ScrollAnimation>

            <div className="mt-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <ScrollAnimation>
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-2xl shadow-black/40">
                  <Image
                    src={pesvImage}
                    alt="Materiales del Plan Estratégico de Seguridad Vial (PESV) de Capital Consulting"
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.15}>
                <ProcessSteps steps={pesvSteps} theme="dark" />
              </ScrollAnimation>
            </div>

            <ScrollAnimation delay={0.2}>
              <div className="mt-16 flex flex-col items-start gap-6 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:flex-row sm:items-center md:p-8">
                <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-40">
                  <Image
                    src={pesvAuditImage}
                    alt="Auditoría al PESV de Capital Consulting en operación de carga"
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                    Servicios complementarios
                  </p>
                  <p className="mt-2 text-sm text-slate-300 md:text-base">
                    {pesvComplementaryServices.join(" · ")}
                  </p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* CAPACITACIÓN DE CONDUCTORES */}
        <section className="bg-white py-20 dark:bg-slate-950 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <ScrollAnimation className="lg:order-2">
                <div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                    Capacitación
                  </span>
                  <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                    Capacitación de conductores
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Programas presenciales y virtuales orientados a modificar
                    comportamientos de riesgo al volante.
                  </p>

                  <ul className="mt-6 space-y-2">
                    {trainingTopics.map((topic) => (
                      <li key={topic} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.15} direction="right" className="lg:order-1">
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src={trainingImage}
                    alt="Sesión de capacitación en seguridad vial para conductores de Capital Consulting"
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* GESTIÓN DE CONDUCTORES */}
        <section className="bg-slate-50 py-20 dark:bg-slate-900/50 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <ScrollAnimation>
                <div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                    Gestión de conductores
                  </span>
                  <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                    El conductor, factor crítico del riesgo vial
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Estructuramos su ciclo de gestión completo dentro de la
                    organización.
                  </p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.15} direction="right">
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src={driverManagementImage}
                    alt="Dashboard de gestión de conductores de Capital Consulting"
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </ScrollAnimation>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {driverManagementBlocks.map((block, index) => {
                const Icon = driverManagementIcons[index]
                return (
                  <ScrollAnimation key={block.title} delay={index * 0.1}>
                    <div className="h-full rounded-xl border border-border/40 bg-white p-6 shadow-sm dark:bg-slate-950">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-display text-base font-semibold">
                        {block.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {block.description}
                      </p>
                    </div>
                  </ScrollAnimation>
                )
              })}
            </div>
          </div>
        </section>

        {/* INSPECCIONES E INVESTIGACIÓN DE ACCIDENTES */}
        <section className="bg-white py-20 dark:bg-slate-950 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Control en campo
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  Inspecciones e investigación de accidentes
                </h2>
              </div>
            </ScrollAnimation>

            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
              <ScrollAnimation>
                <div className="h-full rounded-2xl border border-border/40 bg-white p-6 shadow-sm dark:bg-slate-900 md:p-8">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-xl">
                    <Image
                      src={inspectionsImage}
                      alt="Inspección de vehículos de carga realizada por Capital Consulting"
                      fill
                      sizes="(min-width: 768px) 45vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold">Inspecciones</h3>
                  <ul className="mt-3 space-y-1.5">
                    {inspectionItems.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.1}>
                <div className="h-full rounded-2xl border border-border/40 bg-white p-6 shadow-sm dark:bg-slate-900 md:p-8">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-xl">
                    <Image
                      src={investigationImage}
                      alt="Investigación de un accidente de tránsito laboral por Capital Consulting"
                      fill
                      sizes="(min-width: 768px) 45vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold">
                    Investigación de accidentes de tránsito laborales
                  </h3>
                  <ul className="mt-3 space-y-1.5">
                    {investigationItems.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* INDICADORES Y CONSULTORÍA NORMATIVA */}
        <section className="bg-slate-50 py-20 dark:bg-slate-900/50 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Medición y cumplimiento
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  Indicadores y consultoría normativa
                </h2>
              </div>
            </ScrollAnimation>

            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
              <ScrollAnimation>
                <div className="h-full overflow-hidden rounded-2xl border border-border/40 bg-white shadow-sm dark:bg-slate-950">
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={indicatorsImage}
                      alt="Tablero de indicadores de seguridad vial de Capital Consulting"
                      fill
                      sizes="(min-width: 768px) 45vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-xl font-semibold">Indicadores</h3>
                    <ul className="mt-3 space-y-1.5">
                      {indicatorsItems.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.1}>
                <div className="h-full overflow-hidden rounded-2xl border border-border/40 bg-white shadow-sm dark:bg-slate-950">
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={complianceImage}
                      alt="Sesión de consultoría normativa en seguridad vial de Capital Consulting"
                      fill
                      sizes="(min-width: 768px) 45vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Scale className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-xl font-semibold">
                      Consultoría normativa
                    </h3>
                    <ul className="mt-3 space-y-1.5">
                      {complianceItems.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* CAMPAÑAS DE CULTURA VIAL */}
        <section className="bg-white py-20 dark:bg-slate-950 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <ScrollAnimation>
                <div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                    Cultura vial
                  </span>
                  <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                    Campañas de cultura vial
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Intervenciones de comunicación y sensibilización que sostienen en
                    el tiempo los resultados del PESV.
                  </p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.15} direction="right">
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src={campaignsImage}
                    alt="Campaña de cultura vial de Capital Consulting con material impreso para conductores"
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </ScrollAnimation>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {campaignCards.map((card, index) => {
                const Icon = campaignIcons[index]
                return (
                  <ScrollAnimation key={card.title} delay={index * 0.1}>
                    <div className="group h-full rounded-xl border border-border/40 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg dark:bg-slate-900">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 font-display text-lg font-semibold">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {card.description}
                      </p>
                    </div>
                  </ScrollAnimation>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section
          id="contacto"
          className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 py-20 text-white md:py-28"
        >
          <div className="container relative mx-auto px-6 text-center md:px-12 lg:px-20">
            <ScrollAnimation>
              <span className="text-sm font-semibold tracking-[0.2em] text-teal-400">
                CAPITAL MOBILITY · SEGURIDAD VIAL
              </span>
              <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold md:text-4xl">
                Menos siniestros, más operación disponible
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
                Capital Mobility acompaña a su organización en el diseño, la
                implementación y la sostenibilidad de la gestión del riesgo vial.
              </p>
              <div className="mt-10">
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90"
                >
                  Solicitar asesoría
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </ScrollAnimation>
          </div>
        </section>
        <ServiceGallerySection media={media} />
      </main>
      <Footer />
    </>
  )
}
