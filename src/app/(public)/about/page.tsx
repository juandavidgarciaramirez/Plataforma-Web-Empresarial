import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Phone, Mail } from "lucide-react"
import { Navbar } from "@/components/organisms/Navbar/Navbar"
import { Footer } from "@/components/organisms/Footer/Footer"
import { InstitutionalHero } from "@/components/organisms/InstitutionalHero/InstitutionalHero"
import { ScrollAnimation } from "@/components/atoms/ScrollAnimation"
import { WhoWeAreConcepts } from "@/components/organisms/WhoWeAreConcepts/WhoWeAreConcepts"
import { ValuesGrid } from "@/components/organisms/ValuesGrid/ValuesGrid"
import { TeamOrgChart } from "@/components/organisms/TeamOrgChart/TeamOrgChart"
import { services } from "@/data/services"
import { apiGet } from "@/lib/api/client"
import { canonicalUrl } from "@/lib/seo/metadata"
import { SITE } from "@/config/site"
import type {
  CompanyProfile,
  CompanyValue,
  WhoWeAreConcept,
  PublicTeamMember,
} from "@/hooks/useSiteContent"

export const metadata: Metadata = {
  title: "Nosotros | Capital Consulting and Services",
  description:
    "Conozca al equipo de Capital Consulting and Services: profesionales especializados en Seguridad y Salud en el Trabajo, Seguridad Vial, Gestión Humana, Formación y Soluciones Empresariales.",
  keywords:
    "Capital Consulting, nosotros, equipo, Jennifer Zuluaga, misión, visión, valores, consultoría empresarial",
  alternates: { canonical: canonicalUrl("/about") },
  openGraph: {
    title: "Nosotros | Capital Consulting and Services",
    description: "Las personas detrás de Capital Consulting and Services.",
    type: "website",
    locale: "es_CO",
    url: canonicalUrl("/about"),
    siteName: SITE.name,
    images: [{ url: SITE.defaultOgImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nosotros | Capital Consulting and Services",
    description: "Las personas detrás de Capital Consulting and Services.",
    images: [SITE.defaultOgImage],
  },
}

/** Contenido institucional real (backend NestJS, Etapa 7/8). Revalida cada minuto. */
async function getAboutContent() {
  const init: RequestInit = { next: { revalidate: 60 } }
  const [profile, values, concepts, team] = await Promise.all([
    apiGet<CompanyProfile>("/public/company-profile", init),
    apiGet<CompanyValue[]>("/public/company-values", init),
    apiGet<WhoWeAreConcept[]>("/public/who-we-are-concepts", init),
    apiGet<PublicTeamMember[]>("/public/team", init),
  ])
  return { profile, values, concepts, team }
}

export default async function AboutPage() {
  const { profile, values, concepts, team } = await getAboutContent()

  return (
    <>
      <Navbar />
      <main>
        {/* HERO institucional: panel de contenido + imagen protagonista,
            sin overlay sobre la foto (ver InstitutionalHero). */}
        <InstitutionalHero
          eyebrow="Nosotros"
          title={profile.aboutHeroTitle ?? "Nosotros"}
          subtitle={profile.aboutHeroSubtitle ?? ""}
          image={profile.aboutHeroImageUrl ?? ""}
          imageAlt="Equipo de Capital Consulting and Services SAS"
          imagePosition="center 20%"
          cta={{ label: "Conocer nuestro equipo", href: "#equipo" }}
        />

        {/* QUIÉNES SOMOS */}
        {profile.aboutWhoTitle && (
          <section className="bg-white py-20 dark:bg-slate-950 md:py-28">
            <div className="container mx-auto px-6 md:px-12 lg:px-20">
              <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
                <ScrollAnimation>
                  <div>
                    <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                      Quiénes somos
                    </span>
                    <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                      {profile.aboutWhoTitle}
                    </h2>
                    {profile.aboutWhoText && (
                      <p className="mt-4 text-lg text-muted-foreground">{profile.aboutWhoText}</p>
                    )}

                    {concepts.length > 0 && (
                      <div className="mt-8">
                        <WhoWeAreConcepts concepts={concepts} />
                      </div>
                    )}
                  </div>
                </ScrollAnimation>

                {profile.aboutWhoImageUrl && (
                  <ScrollAnimation delay={0.15} direction="right">
                    <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-xl">
                      <Image
                        src={profile.aboutWhoImageUrl}
                        alt="Equipo de Capital Consulting analizando personas, operación y negocio de un cliente"
                        fill
                        sizes="(min-width: 1024px) 45vw, 90vw"
                        className="object-cover"
                      />
                    </div>
                  </ScrollAnimation>
                )}
              </div>
            </div>
          </section>
        )}

        {/* MISIÓN */}
        {profile.aboutMissionText && (
          <section className="relative overflow-hidden bg-corporate-dark py-24 text-white md:py-32">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="container relative mx-auto px-6 md:px-12 lg:px-20">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr,1.1fr] lg:items-center lg:gap-16">
                {profile.aboutMissionImageUrl && (
                  <ScrollAnimation>
                    <div className="relative">
                      <span className="pointer-events-none absolute -left-4 -top-10 select-none font-display text-[96px] font-bold leading-none text-white/10 md:text-[140px]">
                        01
                      </span>
                      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-2xl shadow-black/40">
                        <Image
                          src={profile.aboutMissionImageUrl}
                          alt="Equipo de Capital Consulting definiendo la estrategia de un proyecto"
                          fill
                          sizes="(min-width: 1024px) 45vw, 90vw"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </ScrollAnimation>
                )}
                <ScrollAnimation delay={0.1}>
                  <div className="max-w-2xl">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                      Nuestra misión
                    </span>
                    <p className="mt-5 font-display text-2xl font-medium leading-snug text-white md:text-4xl">
                      {profile.aboutMissionText}
                    </p>
                  </div>
                </ScrollAnimation>
              </div>
            </div>
          </section>
        )}

        {/* VISIÓN */}
        {profile.aboutVisionText && (
          <section className="relative overflow-hidden bg-white py-24 dark:bg-slate-950 md:py-32">
            <div className="container relative mx-auto px-6 md:px-12 lg:px-20">
              <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:gap-16">
                <ScrollAnimation direction="right">
                  <div className="max-w-xl">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                      Visión {profile.aboutVisionYear}
                    </span>
                    <p className="mt-5 text-xl leading-relaxed text-foreground md:text-2xl">
                      {profile.aboutVisionText}
                    </p>
                  </div>
                </ScrollAnimation>
                {profile.aboutVisionImageUrl && (
                  <ScrollAnimation>
                    <div className="relative">
                      {profile.aboutVisionYear && (
                        <span className="pointer-events-none absolute -right-4 -top-14 select-none font-display text-[110px] font-bold leading-none tracking-tight text-primary/10 md:text-[170px]">
                          {profile.aboutVisionYear}
                        </span>
                      )}
                      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-xl">
                        <Image
                          src={profile.aboutVisionImageUrl}
                          alt="Profesionales de Capital Consulting proyectando el crecimiento sostenible de la organización"
                          fill
                          sizes="(min-width: 1024px) 45vw, 90vw"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </ScrollAnimation>
                )}
              </div>
            </div>
          </section>
        )}

        {/* VALORES */}
        {values.length > 0 && (
          <section className="bg-slate-50 py-20 dark:bg-slate-900/50 md:py-28">
            <div className="container mx-auto px-6 md:px-12 lg:px-20">
              <ScrollAnimation>
                <div className="mx-auto max-w-3xl text-center">
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                    Lo que nos mueve
                  </span>
                  <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                    Nuestros valores
                  </h2>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.1}>
                <div className="mt-14">
                  <ValuesGrid values={values} />
                </div>
              </ScrollAnimation>
            </div>
          </section>
        )}

        {/* EQUIPO */}
        <section id="equipo" className="scroll-mt-24 bg-white py-20 dark:bg-slate-950 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Nuestro equipo
                </span>
                {profile.aboutTeamTitle && (
                  <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                    {profile.aboutTeamTitle}
                  </h2>
                )}
                {profile.aboutTeamSubtitle && (
                  <p className="mt-4 text-lg text-muted-foreground">{profile.aboutTeamSubtitle}</p>
                )}
              </div>
            </ScrollAnimation>

            <div className="mt-16">
              <TeamOrgChart members={team} />
            </div>
          </div>
        </section>

        {/* ECOSISTEMA CAPITAL */}
        {profile.aboutEcosystemTitle && (
          <section className="bg-slate-50 py-20 dark:bg-slate-900/50 md:py-28">
            <div className="container mx-auto px-6 md:px-12 lg:px-20">
              <ScrollAnimation>
                <div className="mx-auto max-w-3xl text-center">
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                    Ecosistema Capital
                  </span>
                  <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                    {profile.aboutEcosystemTitle}
                  </h2>
                  {profile.aboutEcosystemText && (
                    <p className="mt-4 text-lg text-muted-foreground">{profile.aboutEcosystemText}</p>
                  )}
                </div>
              </ScrollAnimation>

              <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
                {services.map((service, index) => {
                  const Icon = service.icon
                  return (
                    <ScrollAnimation key={service.slug} delay={index * 0.08}>
                      <Link
                        href={service.href}
                        className="group flex h-full flex-col rounded-2xl border border-border/40 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl dark:bg-slate-950"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                          {service.name}
                        </h3>
                        <p className="mt-2 flex-1 text-sm text-muted-foreground">
                          {service.description}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                          Conocer más
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </Link>
                    </ScrollAnimation>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* CTA FINAL */}
        {profile.aboutCtaTitle && (
          <section className="relative overflow-hidden py-20 text-white md:py-28">
            {profile.aboutCtaImageUrl && (
              <Image
                src={profile.aboutCtaImageUrl}
                alt="Asesor de Capital Consulting atendiendo a un cliente para agendar una asesoría"
                fill
                sizes="100vw"
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/90 to-slate-950/80" />

            <div className="container relative mx-auto px-6 md:px-12 lg:px-20">
              <ScrollAnimation>
                <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
                  <h2 className="font-display text-3xl font-bold md:text-4xl">{profile.aboutCtaTitle}</h2>
                  {profile.aboutCtaMessage && (
                    <p className="mt-4 text-lg text-slate-300">{profile.aboutCtaMessage}</p>
                  )}

                  <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    <Link
                      href="/contacto"
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90"
                    >
                      Solicitar asesoría
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a
                      href="tel:+573118636746"
                      className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 bg-white/5 px-8 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
                    >
                      <Phone className="h-4 w-4" />
                      311 863 6746
                    </a>
                  </div>

                  <a
                    href="mailto:contacto@capitalconsulting.com.co"
                    className="mt-6 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    <Mail className="h-4 w-4" />
                    contacto@capitalconsulting.com.co
                  </a>
                </div>
              </ScrollAnimation>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
