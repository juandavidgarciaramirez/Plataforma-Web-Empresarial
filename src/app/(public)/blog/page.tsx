import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Navbar } from "@/components/organisms/Navbar/Navbar"
import { Footer } from "@/components/organisms/Footer/Footer"
import { InstitutionalHero } from "@/components/organisms/InstitutionalHero/InstitutionalHero"
import { BlogCard } from "@/components/organisms/BlogCard/BlogCard"
import { BlogExplorer } from "@/components/organisms/BlogExplorer/BlogExplorer"
import { BlogSpecialists } from "@/components/organisms/BlogSpecialists/BlogSpecialists"
import { ScrollAnimation } from "@/components/atoms/ScrollAnimation"
import { blogPublicService } from "@/services/public/blog-public.service"
import { canonicalUrl } from "@/lib/seo/metadata"
import { SITE } from "@/config/site"

/** ISR: lo publicado en el administrador (incluidas las portadas) aparece en ≤ 1 minuto sin reconstruir el sitio. */
export const revalidate = 60

export const metadata: Metadata = {
  title: "Blog | Capital Consulting & Services",
  description:
    "Perspectivas, herramientas y análisis para fortalecer la gestión y el desempeño de las organizaciones: Gestión Humana, SST, Seguridad Vial, Formación, Gestión Empresarial y Talento.",
  keywords:
    "blog capital consulting, gestión humana, SST, seguridad vial, formación empresarial, gestión empresarial, talento",
  alternates: { canonical: canonicalUrl("/blog") },
  openGraph: {
    title: "Blog | Capital Consulting & Services",
    description: "Conocimiento que impulsa mejores decisiones.",
    type: "website",
    locale: "es_CO",
    url: canonicalUrl("/blog"),
    siteName: SITE.name,
    images: [{ url: SITE.defaultOgImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Capital Consulting & Services",
    description: "Conocimiento que impulsa mejores decisiones.",
    images: [SITE.defaultOgImage],
  },
}

export default async function BlogPage() {
  const [articles, categories] = await Promise.all([
    blogPublicService.getAll(),
    blogPublicService.getActiveCategories(),
  ])

  const featured =
    articles.find((article) => article.featured) ?? articles[0]

  const otherArticles = featured
    ? articles.filter((article) => article.slug !== featured.slug)
    : []

  return (
    <>
      <Navbar />

      <main>
        <InstitutionalHero
          eyebrow="Blog"
          title="Conocimiento que impulsa mejores decisiones."
          subtitle="Perspectivas, herramientas y análisis para fortalecer la gestión y el desempeño de las organizaciones."
          image="/images/blog/hero.png"
          imageAlt="Profesionales de Capital Consulting analizando información en una sala de juntas"
          imagePosition="65% 35%"
          cta={{
            label: "Explorar artículos",
            href: "#articulos",
          }}
        />

        <section className="bg-white py-20 dark:bg-slate-950 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">

            {/* Artículo destacado */}
            {featured && (
              <ScrollAnimation>
                <BlogCard
                  article={featured}
                  variant="featured"
                  priority
                />
              </ScrollAnimation>
            )}

            {/* Contenido del blog */}
            <div
              id="articulos"
              className="mt-20 scroll-mt-24 md:mt-28"
            >
              <ScrollAnimation>
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-corporate-blue" />

                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-corporate-blue">
                    Explora por categoría
                  </span>
                </div>

                <h2 className="mt-4 max-w-xl font-display text-3xl font-bold text-corporate-dark dark:text-white md:text-4xl">
                  Artículos y análisis
                </h2>
              </ScrollAnimation>

              <div className="mt-10">
                {articles.length > 0 ? (
                  <BlogExplorer
                    articles={otherArticles}
                    categories={categories}
                  />
                ) : (
                  <ScrollAnimation>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
                      <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
                        Próximamente encontrarás nuestros artículos
                      </h3>

                      <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
                        Estamos preparando contenidos, herramientas y
                        análisis para acompañar las decisiones de tu
                        organización.
                      </p>
                    </div>
                  </ScrollAnimation>
                )}
              </div>
            </div>
          </div>
        </section>

        <BlogSpecialists />

        {/* CTA de cierre */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-corporate-secondary py-20 text-white md:py-28">
          <div className="container relative mx-auto px-6 text-center md:px-12 lg:px-20">
            <ScrollAnimation>
              <span className="text-sm font-semibold tracking-[0.2em] text-corporate-blue">
                CAPITAL CONSULTING &amp; SERVICES
              </span>

              <h2 className="mx-auto mt-4 max-w-xl font-display text-3xl font-bold md:text-4xl">
                ¿Necesitas acompañamiento para tu organización?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
                Nuestro equipo de especialistas puede ayudarte a convertir
                este conocimiento en resultados concretos para tu empresa.
              </p>

              <div className="mt-9">
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-corporate-blue px-8 py-3 text-sm font-medium text-white shadow-lg shadow-corporate-blue/30 transition-all hover:-translate-y-0.5 hover:bg-corporate-blue/90"
                >
                  Solicitar asesoría

                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </ScrollAnimation>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}