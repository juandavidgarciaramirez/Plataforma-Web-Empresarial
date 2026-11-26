import type { Metadata } from "next"
import Link from "next/link"
import { canonicalUrl } from "@/lib/seo/metadata"
import { SITE } from "@/config/site"
import Image from "next/image"
import {
  ArrowRight,
  Phone,
  Mail,
  ShieldCheck,
  Eye,
  RefreshCcw,
  ClipboardList,
  ClipboardCheck,
  SearchCheck,
  Brain,
  Users,
  Award,
  GraduationCap,
  FileSearch,
  Leaf,
  AlertTriangle,
  ShieldAlert,
  Siren,
  HeartPulse,
  FileCheck,
  Scale,
  Home,
  Search,
  Layers,
  BarChart3,
  CheckCircle2,
  HardHat,
} from "lucide-react"
import { Navbar } from "@/components/organisms/Navbar/Navbar"
import { Footer } from "@/components/organisms/Footer/Footer"
import { ServiceHero } from "@/components/organisms/ServiceHero/ServiceHero"
import { ServiceGallerySection } from "@/components/organisms/ImageGallery/ServiceGallerySection"
import { getServiceMedia } from "@/services/public/services-public.service"
import { ScrollAnimation } from "@/components/atoms/ScrollAnimation"
import {
  heroImage,
  positioningImage,
  portfolioImage,
  riskManagementImage,
  criticalTasksImage,
  commercialApproachImage,
  packagesImage,
  nextStepImage,
  ctaImage,
  heroEyebrow,
  heroTag,
  heroTitle,
  heroDescription,
  positioningQuote,
  pillars,
  portfolioGroupOneTitle,
  portfolioGroupOne,
  portfolioGroupTwoTitle,
  portfolioGroupTwo,
  riskCycleSteps,
  criticalTasksTitle,
  criticalTasksText,
  commercialApproachTitle,
  commercialApproachPoints,
  commercialApproachHighlight,
  packages,
  packagesNote,
  nextSteps,
  ctaTitle,
  ctaMessage,
  ctaPhone,
  ctaEmail,
} from "@/data/capital-hse"

/** ISR: las imágenes y vacantes administrables se reflejan en ≤ 1 minuto, aunque la API no respondiera durante el build. */
export const revalidate = 60

export const metadata: Metadata = {
  title: "Capital HSE | Seguridad, Salud en el Trabajo y Gestión de Riesgos | Capital Consulting",
  description:
    "Capital HSE: soluciones integrales en Seguridad, Salud en el Trabajo y Gestión de Riesgos. Un aliado estratégico para cumplir la normativa y proteger a las personas y la operación.",
  keywords:
    "Capital HSE, Capital SST, SG-SST, Seguridad y Salud en el Trabajo, gestión de riesgos laborales, estándares mínimos, riesgo psicosocial, PESV, planes de emergencia, ARL, Ministerio del Trabajo",
  alternates: { canonical: canonicalUrl("/servicios/capital-hse") },
  openGraph: {
    title: "Capital HSE | Seguridad, Salud en el Trabajo y Gestión de Riesgos",
    description:
      "Un aliado estratégico para gestionar los riesgos laborales, cumplir la normativa y proteger a las personas y la operación.",
    type: "website",
    locale: "es_CO",
    url: canonicalUrl("/servicios/capital-hse"),
    siteName: SITE.name,
    images: [{ url: SITE.defaultOgImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Capital HSE | Seguridad, Salud en el Trabajo y Gestión de Riesgos",
    description:
      "Un aliado estratégico para gestionar los riesgos laborales, cumplir la normativa y proteger a las personas y la operación.",
    images: [SITE.defaultOgImage],
  },
}

const pillarIcons = [ShieldCheck, Eye, RefreshCcw]

const groupOneIcons = [
  ClipboardList,
  ClipboardCheck,
  SearchCheck,
  Brain,
  Users,
  Award,
  GraduationCap,
  FileSearch,
  Leaf,
]

const groupTwoIcons = [
  AlertTriangle,
  ShieldAlert,
  Siren,
  HeartPulse,
  FileCheck,
  Scale,
  ShieldCheck,
  Home,
]

const riskCycleIcons = [Search, Scale, Layers, ClipboardList, RefreshCcw, BarChart3]

export default async function CapitalHsePage() {
  // Imagen y galería administrables (Etapa 15); sin ellas se usa la imagen estática actual.
  const media = await getServiceMedia("capital-hse")

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <ServiceHero
          image={media?.imageUrl ?? heroImage}
          imageAlt={(media?.imageUrl && media.imageAlt) || "Inspector de Capital HSE con casco y chaleco reflectivo de Capital Consulting revisando una lista de verificación en una planta industrial"}
          imagePosition="70% 30%"
          eyebrow={heroEyebrow}
          title={heroTitle}
          description={heroDescription}
          tag={heroTag}
          primaryCta={{ label: "Conocer nuestras soluciones", href: "#portafolio" }}
          secondaryCta={{ label: "Hablar con un asesor", href: "/contacto" }}
          highlights={[
            { label: "Seguridad", icon: <HardHat className="h-4 w-4" /> },
            { label: "Prevención", icon: <ShieldCheck className="h-4 w-4" /> },
            { label: "Salud", icon: <HeartPulse className="h-4 w-4" /> },
            { label: "Gestión", icon: <ClipboardCheck className="h-4 w-4" /> },
            { label: "Cumplimiento", icon: <BarChart3 className="h-4 w-4" /> },
          ]}
        />

        {/* NUESTRO POSICIONAMIENTO */}
        <section className="bg-white py-20 dark:bg-slate-950 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <ScrollAnimation>
                <div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                    Nuestro posicionamiento
                  </span>
                  <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                    Un aliado estratégico frente al riesgo laboral
                  </h2>
                  <div className="relative mt-6 rounded-xl border-l-4 border-emerald-500 bg-slate-50 p-6 dark:bg-slate-900">
                    <p className="text-lg italic leading-relaxed text-foreground">
                      &ldquo;{positioningQuote}&rdquo;
                    </p>
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.15} direction="right">
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src={positioningImage}
                    alt="Equipo de Capital HSE realizando una inspección de seguridad en planta con señalización de riesgos"
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </ScrollAnimation>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {pillars.map((pillar, index) => {
                const Icon = pillarIcons[index]
                return (
                  <ScrollAnimation key={pillar.number} delay={index * 0.1}>
                    <div className="group h-full rounded-xl border border-border/40 bg-slate-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-lg dark:bg-slate-900">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="mt-4 block text-xs font-semibold tracking-widest text-emerald-600 dark:text-emerald-400">
                        {pillar.number}
                      </span>
                      <h3 className="mt-1 font-display text-lg font-semibold">{pillar.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{pillar.description}</p>
                    </div>
                  </ScrollAnimation>
                )
              })}
            </div>
          </div>
        </section>

        {/* NUESTRO PORTAFOLIO */}
        <section id="portafolio" className="bg-slate-50 py-20 dark:bg-slate-900/50 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Nuestro portafolio
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  Un portafolio integral para cada frente del riesgo laboral
                </h2>
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.1}>
              <div className="relative mt-12 aspect-[16/8] overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src={portfolioImage}
                  alt="Equipo de Capital HSE revisando indicadores de seguridad en campo con tableta y documentación"
                  fill
                  sizes="90vw"
                  className="object-cover"
                  style={{ objectPosition: "50% 30%" }}
                />
              </div>
            </ScrollAnimation>

            {/* Grupo 1 */}
            <div className="mt-16">
              <ScrollAnimation>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {portfolioGroupOneTitle}
                </h3>
              </ScrollAnimation>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {portfolioGroupOne.map((service, index) => {
                  const Icon = groupOneIcons[index]
                  return (
                    <ScrollAnimation key={service.title} delay={(index % 3) * 0.08}>
                      <div className="flex h-full items-start gap-3 rounded-lg border-l-2 border-primary bg-white px-4 py-3.5 shadow-sm dark:bg-slate-950">
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-sm font-medium text-foreground">
                          {service.title}
                        </span>
                      </div>
                    </ScrollAnimation>
                  )
                })}
              </div>
            </div>

            {/* Grupo 2 */}
            <div className="mt-12">
              <ScrollAnimation>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {portfolioGroupTwoTitle}
                </h3>
              </ScrollAnimation>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {portfolioGroupTwo.map((service, index) => {
                  const Icon = groupTwoIcons[index]
                  return (
                    <ScrollAnimation key={service.title} delay={(index % 4) * 0.08}>
                      <div className="flex h-full items-start gap-3 rounded-lg border-l-2 border-emerald-500 bg-white px-4 py-3.5 shadow-sm dark:bg-slate-950">
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-medium text-foreground">
                          {service.title}
                        </span>
                      </div>
                    </ScrollAnimation>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* GESTIÓN DEL RIESGO */}
        <section className="bg-slate-900 py-20 text-white md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                  Gestión del riesgo
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  Ciclo de identificación, valoración, control y seguimiento
                </h2>
              </div>
            </ScrollAnimation>

            {/* Ruta vertical en mobile, horizontal desde lg */}
            <div className="relative mt-16">
              <div className="absolute left-0 right-0 top-8 hidden h-px bg-white/10 lg:block" />

              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
                {riskCycleSteps.map((item, index) => {
                  const Icon = riskCycleIcons[index]
                  return (
                    <ScrollAnimation key={item.step} delay={index * 0.08}>
                      <div className="relative text-center">
                        <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400 text-slate-900 shadow-lg shadow-emerald-400/20">
                          <span className="font-display text-xl font-bold">{item.step}</span>
                        </div>
                        <div className="mx-auto mt-4 flex h-8 w-8 items-center justify-center text-emerald-400">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-display text-base font-semibold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-300">{item.description}</p>
                      </div>
                    </ScrollAnimation>
                  )
                })}
              </div>
            </div>

            {/* Acompañamiento en tareas críticas */}
            <ScrollAnimation delay={0.1}>
              <div className="mt-16 grid grid-cols-1 items-center gap-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 lg:grid-cols-2">
                <div className="relative aspect-[3/2] lg:aspect-auto lg:h-full lg:min-h-[280px]">
                  <Image
                    src={criticalTasksImage}
                    alt="Técnico de Capital HSE con arnés y línea de vida realizando trabajo en altura en planta industrial"
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-8 md:p-10">
                  <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                    Presencia en campo
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-bold text-white">
                    {criticalTasksTitle}
                  </h3>
                  <p className="mt-3 text-base text-slate-300">{criticalTasksText}</p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* ENFOQUE COMERCIAL */}
        <section className="bg-white py-20 dark:bg-slate-950 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <ScrollAnimation>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src={commercialApproachImage}
                    alt="Consultor de Capital HSE presentando el modelo de consultoría en Seguridad, Salud y Medio Ambiente ante un comité de clientes"
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.15} direction="right">
                <div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                    Enfoque comercial
                  </span>
                  <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                    {commercialApproachTitle}
                  </h2>

                  <ul className="mt-6 space-y-4">
                    {commercialApproachPoints.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                        <span className="text-base text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 rounded-lg bg-corporate-dark px-6 py-4">
                    <p className="text-sm font-semibold text-white md:text-base">
                      {commercialApproachHighlight}
                    </p>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* CUATRO PAQUETES COMERCIALES */}
        <section className="bg-slate-50 py-20 dark:bg-slate-900/50 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Paquetes comerciales
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  Cuatro paquetes comerciales
                </h2>
              </div>
            </ScrollAnimation>

            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {packages.map((pkg, index) => (
                <ScrollAnimation key={pkg.number} delay={index * 0.1}>
                  <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-950">
                    <div className="flex items-center justify-between bg-corporate-dark px-5 py-4">
                      <span className="font-display text-2xl font-bold text-white">
                        {pkg.number}
                      </span>
                      <span className="h-1.5 w-8 rounded-full bg-emerald-400" />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {pkg.title}
                      </h3>
                      <span className="mt-2 block h-0.5 w-10 bg-emerald-500" />
                      <p className="mt-3 text-sm text-muted-foreground">{pkg.description}</p>
                    </div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>

            <ScrollAnimation delay={0.1}>
              <div className="mt-10 flex flex-col items-center gap-8 rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-950 md:flex-row md:p-8">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl md:w-72 md:shrink-0">
                  <Image
                    src={packagesImage}
                    alt="Equipo de Capital HSE en reunión de seguridad revisando indicadores y reglas que salvan vidas"
                    fill
                    sizes="(min-width: 768px) 288px, 90vw"
                    className="object-cover"
                  />
                </div>
                <p className="text-center text-base italic text-muted-foreground md:text-left">
                  {packagesNote}
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* SIGUIENTE PASO */}
        <section className="bg-white py-20 dark:bg-slate-950 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <ScrollAnimation>
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src={nextStepImage}
                    alt="Consultores de Capital HSE revisando la documentación del Sistema de Gestión de Seguridad y Salud en el Trabajo"
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.15} direction="right">
                <div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                    Siguiente paso
                  </span>
                  <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                    Un camino claro hacia la implementación
                  </h2>
                </div>
              </ScrollAnimation>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {nextSteps.map((step, index) => (
                <ScrollAnimation key={step.number} delay={index * 0.1}>
                  <div className="relative h-full rounded-xl border border-border/40 bg-slate-50 p-6 pt-8 dark:bg-slate-900">
                    <span className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white shadow-md shadow-emerald-500/30">
                      {step.number}
                    </span>
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section id="contacto" className="relative overflow-hidden py-20 text-white md:py-28">
          <Image
            src={ctaImage}
            alt="Equipo directivo de Capital Consulting definiendo el plan de acompañamiento en gestión de riesgos HSE"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/50" />

          <div className="container relative mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="max-w-xl">
                <span className="text-sm font-semibold tracking-[0.2em] text-emerald-400">
                  SOLICITAR ASESORÍA
                </span>
                <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">{ctaTitle}</h2>
                <p className="mt-4 text-lg text-slate-300">{ctaMessage}</p>

                <div className="mt-8 flex flex-col gap-3 text-base">
                  <a
                    href={`tel:+57${ctaPhone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2 font-semibold text-white transition-colors hover:text-emerald-400"
                  >
                    <Phone className="h-4 w-4" />
                    {ctaPhone}
                  </a>
                  <a
                    href={`mailto:${ctaEmail}`}
                    className="flex items-center gap-2 text-slate-300 transition-colors hover:text-emerald-400"
                  >
                    <Mail className="h-4 w-4" />
                    {ctaEmail}
                  </a>
                </div>

                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/contacto"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90"
                  >
                    Solicitar asesoría
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/contacto"
                    className="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/5 px-8 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
                  >
                    Hablar con un especialista
                  </Link>
                </div>
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
