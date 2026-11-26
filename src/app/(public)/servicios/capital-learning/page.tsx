import type { Metadata } from "next"
import Link from "next/link"
import { canonicalUrl } from "@/lib/seo/metadata"
import { SITE } from "@/config/site"
import {
  ShieldCheck,
  ClipboardCheck,
  BarChart3,
  Layers,
  GraduationCap,
  UsersRound,
  Building2,
  Video,
  Blend,
  PenLine,
  Search,
  PencilRuler,
  PlayCircle,
  BarChart4,
  ArrowRight,
  Brain,
  Users,
  HeartPulse,
} from "lucide-react"
import { Navbar } from "@/components/organisms/Navbar/Navbar"
import { Footer } from "@/components/organisms/Footer/Footer"
import { ServiceHero } from "@/components/organisms/ServiceHero/ServiceHero"
import { ServiceGallerySection } from "@/components/organisms/ImageGallery/ServiceGallerySection"
import { getServiceMedia } from "@/services/public/services-public.service"
import { CapitalLearningTimeline } from "@/components/organisms/CapitalLearningTimeline/CapitalLearningTimeline"
import { ScrollAnimation } from "@/components/atoms/ScrollAnimation"
import { heroImage } from "@/data/capital-learning"

/** ISR: las imágenes y vacantes administrables se reflejan en ≤ 1 minuto, aunque la API no respondiera durante el build. */
export const revalidate = 60

export const metadata: Metadata = {
  title: "Capital Learning | Capital Consulting & Services",
  description:
    "Capital Learning: portafolio de servicios de capacitación empresarial de Capital Consulting & Services. Formación que transforma el talento.",
  keywords:
    "Capital Learning, capacitación empresarial, formación empresarial, SG-SST, seguridad y salud en el trabajo, PESV, desarrollo de talento, riesgo psicosocial, brigadas de emergencia",
  alternates: { canonical: canonicalUrl("/servicios/capital-learning") },
  openGraph: {
    title: "Capital Learning | Formación que transforma el talento",
    description:
      "Portafolio de servicios de capacitación empresarial de Capital Consulting & Services.",
    type: "website",
    locale: "es_CO",
    url: canonicalUrl("/servicios/capital-learning"),
    siteName: SITE.name,
    images: [{ url: SITE.defaultOgImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Capital Learning | Formación que transforma el talento",
    description:
      "Portafolio de servicios de capacitación empresarial de Capital Consulting & Services.",
    images: [SITE.defaultOgImage],
  },
}

const valueProps = [
  {
    title: "Pertinencia normativa",
    description: "Contenidos alineados al SG-SST y a la regulación aplicable.",
    icon: ShieldCheck,
  },
  {
    title: "Aprendizaje aplicado",
    description: "Talleres, simulacros y casos reales del sector del cliente.",
    icon: ClipboardCheck,
  },
  {
    title: "Medición de impacto",
    description: "Evaluación de conocimiento y de transferencia al puesto.",
    icon: BarChart3,
  },
  {
    title: "Cobertura flexible",
    description: "Presencial, virtual y mixta, en sede o en planta.",
    icon: Layers,
  },
]

const methodology = [
  {
    percent: "70%",
    title: "Práctica en el puesto",
    icon: Building2,
  },
  {
    percent: "20%",
    title: "Aprendizaje entre pares",
    icon: UsersRound,
  },
  {
    percent: "10%",
    title: "Formación formal",
    icon: GraduationCap,
  },
]

const modalities = [
  {
    title: "Presencial",
    description: "En sede del cliente o en planta, con práctica en el puesto de trabajo.",
    icon: Building2,
  },
  {
    title: "Virtual en vivo",
    description: "Sesiones sincrónicas para equipos distribuidos en varias ciudades.",
    icon: Video,
  },
  {
    title: "Mixta (blended)",
    description: "Teoría virtual y práctica presencial para optimizar tiempo operativo.",
    icon: Blend,
  },
  {
    title: "A la medida",
    description: "Diseño instruccional propio a partir del diagnóstico de la organización.",
    icon: PenLine,
  },
]

const implementationSteps = [
  {
    step: "1",
    title: "Diagnóstico",
    description: "Levantamiento de necesidades, matriz legal y brechas por cargo.",
    icon: Search,
  },
  {
    step: "2",
    title: "Diseño",
    description: "Plan anual de formación, contenidos y cronograma por área.",
    icon: PencilRuler,
  },
  {
    step: "3",
    title: "Ejecución",
    description: "Sesiones, talleres y simulacros con control de asistencia.",
    icon: PlayCircle,
  },
  {
    step: "4",
    title: "Medición",
    description: "Evaluación de aprendizaje, transferencia e informe ejecutivo.",
    icon: BarChart4,
  },
]

export default async function CapitalLearningPage() {
  // Imagen y galería administrables (Etapa 15); sin ellas se usa la imagen estática actual.
  const media = await getServiceMedia("capital-learning")

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <ServiceHero
          image={media?.imageUrl ?? heroImage}
          imageAlt={(media?.imageUrl && media.imageAlt) || "Instructora de Capital Learning dirigiendo una sesión de formación empresarial"}
          imagePosition="80% 15%"
          eyebrow="Capital Learning"
          title="Formación que transforma el talento"
          description="Portafolio de servicios de capacitación empresarial."
          tag="Línea de negocio · Formación y desarrollo"
          primaryCta={{ label: "Solicitar propuesta", href: "/contacto" }}
          secondaryCta={{ label: "Ver líneas de formación", href: "#portafolio" }}
          highlights={[
            { label: "Formación", icon: <GraduationCap className="h-4 w-4" /> },
            { label: "Desarrollo", icon: <Brain className="h-4 w-4" /> },
            { label: "Liderazgo", icon: <Users className="h-4 w-4" /> },
            { label: "Cultura", icon: <HeartPulse className="h-4 w-4" /> },
            { label: "Desempeño", icon: <BarChart3 className="h-4 w-4" /> },
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
                  Programas prácticos, medibles y alineados a la normativa vigente
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Diseñados a la medida de cada organización.
                </p>
              </div>
            </ScrollAnimation>

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {valueProps.map((item, index) => {
                const Icon = item.icon
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
          </div>
        </section>

        {/* PORTAFOLIO — ruta visual */}
        <CapitalLearningTimeline />

        {/* METODOLOGÍA */}
        <section className="bg-slate-900 py-20 text-white md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-teal-400">
                  Metodología
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  Metodología 70·20·10
                </h2>
                <p className="mt-4 text-lg text-slate-300">
                  Con evaluación antes y después de cada programa.
                </p>
              </div>
            </ScrollAnimation>

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {methodology.map((item, index) => {
                const Icon = item.icon
                return (
                  <ScrollAnimation key={item.title} delay={index * 0.1}>
                    <div className="h-full rounded-xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-400/10 text-teal-400">
                        <Icon className="h-7 w-7" />
                      </div>
                      <p className="mt-5 font-display text-4xl font-bold text-teal-400">
                        {item.percent}
                      </p>
                      <p className="mt-2 text-base font-medium text-white">
                        {item.title}
                      </p>
                    </div>
                  </ScrollAnimation>
                )
              })}
            </div>
          </div>
        </section>

        {/* MODALIDADES */}
        <section className="bg-white py-20 dark:bg-slate-950 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Modalidades
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  Modalidades de formación
                </h2>
              </div>
            </ScrollAnimation>

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {modalities.map((item, index) => {
                const Icon = item.icon
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
          </div>
        </section>

        {/* RUTA DE IMPLEMENTACIÓN */}
        <section className="bg-slate-50 py-20 dark:bg-slate-900/50 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Ruta de implementación
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  Cuatro etapas, de principio a fin
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Desde el diagnóstico hasta la medición de impacto.
                </p>
              </div>
            </ScrollAnimation>

            <div className="relative mt-16">
              <div className="absolute left-0 right-0 top-8 hidden h-px bg-border lg:block" />

              <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {implementationSteps.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <ScrollAnimation key={item.step} delay={index * 0.1}>
                      <div className="relative text-center">
                        <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20">
                          <span className="font-display text-xl font-bold">
                            {item.step}
                          </span>
                        </div>
                        <div className="mx-auto mt-4 flex h-8 w-8 items-center justify-center text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-display text-lg font-semibold">
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
            </div>

            <ScrollAnimation delay={0.2}>
              <p className="mt-16 text-center text-sm italic text-muted-foreground">
                Cada ciclo cierra con un informe ejecutivo de cobertura,
                cumplimiento normativo e indicadores de aprendizaje.
              </p>
            </ScrollAnimation>
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
                CAPITAL LEARNING
              </span>
              <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold md:text-4xl">
                Formación que transforma el talento
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
                Construyamos juntos el plan de formación de su organización.
              </p>
              <div className="mt-10">
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90"
                >
                  Solicitar propuesta
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
