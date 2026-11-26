import type { Metadata } from "next"
import Image from "next/image"
import { Sparkles, HandHeart, BookOpen, TrendingUp, Award, Briefcase } from "lucide-react"
import { Navbar } from "@/components/organisms/Navbar/Navbar"
import { Footer } from "@/components/organisms/Footer/Footer"
import { InstitutionalHero } from "@/components/organisms/InstitutionalHero/InstitutionalHero"
import { JobCard } from "@/components/organisms/JobCard/JobCard"
import { ApplicationForm } from "@/components/organisms/ApplicationForm/ApplicationForm"
import { ScrollAnimation } from "@/components/atoms/ScrollAnimation"
import { getCareersPageImages, getPublicPositions } from "@/services/public/careers-public.service"
import { canonicalUrl } from "@/lib/seo/metadata"
import { SITE } from "@/config/site"

/** ISR: las imágenes y vacantes administrables se reflejan en ≤ 1 minuto, aunque la API no respondiera durante el build. */
export const revalidate = 60

export const metadata: Metadata = {
  title: "Trabaja con nosotros | Capital Consulting and Services",
  description:
    "Conoce oportunidades profesionales y registra tu perfil en la Base de Altos Potenciales de Capital Consulting.",
  keywords: "trabaja con nosotros, vacantes, empleo, Capital Consulting, talento",
  alternates: { canonical: canonicalUrl("/trabaja-con-nosotros") },
  openGraph: {
    title: "Trabaja con nosotros | Capital Consulting and Services",
    description: "Construye tu próximo desafío profesional.",
    type: "website",
    locale: "es_CO",
    url: canonicalUrl("/trabaja-con-nosotros"),
    siteName: SITE.name,
    images: [{ url: SITE.defaultOgImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trabaja con nosotros | Capital Consulting and Services",
    description: "Construye tu próximo desafío profesional.",
    images: [SITE.defaultOgImage],
  },
}

const talentConcepts = [
  { label: "Talento", icon: Sparkles },
  { label: "Colaboración", icon: HandHeart },
  { label: "Conocimiento", icon: BookOpen },
  { label: "Desarrollo", icon: TrendingUp },
  { label: "Liderazgo", icon: Award },
]

export default async function TrabajaConNosotrosPage() {
  // Vacantes reales del backend e imágenes administrables de la sección (Etapa 15).
  const [positions, images] = await Promise.all([getPublicPositions(), getCareersPageImages()])

  return (
    <>
      <Navbar />
      <main>
        <InstitutionalHero
          eyebrow="Talento"
          title="Construye tu próximo desafío profesional."
          subtitle="Encuentra oportunidades para aportar tu experiencia, desarrollarte y hacer parte de una organización que transforma."
          image={images?.hero?.url ?? "/images/careers/hero.png"}
          imageAlt={images?.hero?.alt || "Equipo de Capital Consulting and Services colaborando en oficina"}
          imagePosition="center 28%"
          cta={{ label: "Ver oportunidades", href: "#vacantes" }}
        />

        {/* TALENTO */}
        <section className="bg-white py-20 dark:bg-slate-950 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Nuestra cultura
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  Talento que impulsa el cambio
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Capital Consulting busca personas capaces de aportar conocimiento, experiencia y nuevas
                  perspectivas para acompañar los desafíos de las organizaciones.
                </p>
              </div>
            </ScrollAnimation>

            <div className="mt-14 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <ScrollAnimation direction="right">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl shadow-xl">
                    <Image
                      src={images?.talent?.url ?? "/images/careers/talent.png"}
                      alt={images?.talent?.alt || "Equipo de Capital Consulting colaborando en un proyecto"}
                      fill
                      sizes="(min-width: 1024px) 45vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-2xl shadow-xl sm:col-span-1">
                    <Image
                      src={images?.growth?.url ?? "/images/careers/growth.png"}
                      alt={images?.growth?.alt || "Profesional de Capital Consulting en un momento de crecimiento y desarrollo"}
                      fill
                      sizes="(min-width: 1024px) 22vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.1}>
                <div className="grid grid-cols-2 gap-4">
                  {talentConcepts.map((concept) => {
                    const Icon = concept.icon
                    return (
                      <div
                        key={concept.label}
                        className="flex items-center gap-3 rounded-xl border border-border/40 p-4 transition-colors hover:border-primary/30"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="text-sm font-medium text-foreground">{concept.label}</span>
                      </div>
                    )
                  })}
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* VACANTES */}
        <section id="vacantes" className="scroll-mt-24 bg-slate-50 py-20 dark:bg-slate-900/50 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Oportunidades
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  Únete a nuestro equipo
                </h2>
              </div>
            </ScrollAnimation>

            {positions.length > 0 ? (
              <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {positions.map((position, index) => (
                  <ScrollAnimation key={position.slug} delay={index * 0.08}>
                    <JobCard position={position} />
                  </ScrollAnimation>
                ))}
              </div>
            ) : (
              <ScrollAnimation delay={0.1}>
                <div className="mx-auto mt-14 flex max-w-2xl flex-col items-center rounded-2xl border border-border/40 bg-white p-10 text-center shadow-sm dark:bg-slate-950">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Briefcase className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                    Actualmente no tenemos vacantes disponibles
                  </h3>
                  <p className="mt-2 text-muted-foreground">Déjanos tu hoja de vida y te contactaremos ante una nueva oportunidad.</p>
                </div>
              </ScrollAnimation>
            )}
          </div>
        </section>

        {/* BASE DE ALTOS POTENCIALES */}
        <section id="postulacion" className="bg-white py-20 dark:bg-slate-950 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="mx-auto max-w-2xl text-center">
              <ScrollAnimation>
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Déjanos tu hoja de vida
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">Base de Altos Potenciales</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Si quieres hacer parte de nuestra red de profesionales, completa la siguiente información y
                  podremos tenerte en cuenta para futuras oportunidades.
                </p>
              </ScrollAnimation>
            </div>

            <ScrollAnimation delay={0.1}>
              <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-border/40 bg-slate-50 p-6 shadow-sm dark:bg-slate-900/50 md:p-10">
                <ApplicationForm />
              </div>
            </ScrollAnimation>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
