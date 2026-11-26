import type { Metadata } from "next"
import { Navbar } from "@/components/organisms/Navbar/Navbar"
import { Footer } from "@/components/organisms/Footer/Footer"
import { InstitutionalHero } from "@/components/organisms/InstitutionalHero/InstitutionalHero"
import { NewsCard } from "@/components/organisms/NewsCard/NewsCard"
import { ScrollAnimation } from "@/components/atoms/ScrollAnimation"
import { newsPublicService } from "@/services/public/news-public.service"
import { canonicalUrl } from "@/lib/seo/metadata"
import { SITE } from "@/config/site"

/** ISR: lo publicado en el administrador (incluidas las portadas) aparece en ≤ 1 minuto sin reconstruir el sitio. */
export const revalidate = 60

export const metadata: Metadata = {
  title: "Noticias | Capital Consulting & Services",
  description:
    "Actualidad, análisis y contenidos de Gestión Humana y consultoría empresarial para acompañar las decisiones de tu organización.",
  keywords:
    "noticias, gestión humana, consultoría empresarial, capital consulting, actualidad laboral",
  alternates: { canonical: canonicalUrl("/noticias") },
  openGraph: {
    title: "Noticias | Capital Consulting & Services",
    description: "Actualidad que impacta a tu organización.",
    type: "website",
    locale: "es_CO",
    url: canonicalUrl("/noticias"),
    siteName: SITE.name,
    images: [{ url: SITE.defaultOgImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Noticias | Capital Consulting & Services",
    description: "Actualidad que impacta a tu organización.",
    images: [SITE.defaultOgImage],
  },
}

export default async function NoticiasPage() {
  const articles = await newsPublicService.getAll()

  const featured = articles.find((article) => article.featured) ?? articles[0]
  const otherNews = featured
    ? articles.filter((article) => article.slug !== featured.slug)
    : []

  return (
    <>
      <Navbar />

      <main>
        <InstitutionalHero
          eyebrow="Actualidad"
          title="Lo que está cambiando en las organizaciones."
          subtitle="Noticias, novedades y contenidos relevantes para acompañar las decisiones de tu empresa."
          image="/images/noticias/hero.png"
          imageAlt="Equipo editorial de Capital Consulting presentando la actualidad corporativa"
          imagePosition="center 38%"
          cta={{ label: "Explorar noticias", href: "#noticias" }}
        />

        <section
          id="noticias"
          className="scroll-mt-24 bg-white py-20 dark:bg-slate-950 md:py-28"
        >
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            {featured ? (
              <>
                {/* Noticia destacada */}
                <ScrollAnimation>
                  <NewsCard
                    article={featured}
                    variant="featured"
                    priority
                  />
                </ScrollAnimation>

                {/* Grid editorial */}
                {otherNews.length > 0 && (
                  <div className="mt-8 grid grid-cols-1 gap-8 md:mt-12 md:grid-cols-2">
                    {otherNews.map((article, index) => {
                      const isWide = index % 3 === 2

                      return (
                        <ScrollAnimation
                          key={article.slug}
                          delay={(index % 3) * 0.1}
                          className={isWide ? "md:col-span-2" : undefined}
                        >
                          <NewsCard
                            article={article}
                            variant={isWide ? "wide" : "standard"}
                          />
                        </ScrollAnimation>
                      )
                    })}
                  </div>
                )}
              </>
            ) : (
              <ScrollAnimation>
                <div className="mx-auto max-w-3xl py-16 text-center">
                  <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
                    Próximamente encontrarás nuestras noticias
                  </h2>

                  <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                    Estamos preparando contenidos, novedades y análisis
                    relevantes para acompañar las decisiones de tu organización.
                  </p>
                </div>
              </ScrollAnimation>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
