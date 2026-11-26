import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { ScrollAnimation } from "@/components/atoms/ScrollAnimation"
import { getAllArticles, type BlogArticle } from "@/data/blog"

/**
 * "Desde la perspectiva de nuestros especialistas" (sección 5 del brief).
 * Se construye a partir de los artículos que ya tienen un especialista
 * confirmado (`author.image` presente) — no se listan especialistas por
 * fuera del contenido publicado, y no se inventa ninguno para las
 * categorías que aún se publican a nombre del equipo.
 */
export function BlogSpecialists() {
  const specialists = getAllArticles().reduce<{ article: BlogArticle }[]>((acc, article) => {
    if (article.author.image && !acc.some((entry) => entry.article.author.name === article.author.name)) {
      acc.push({ article })
    }
    return acc
  }, [])

  if (specialists.length === 0) return null

  return (
    <section className="bg-corporate-dark py-20 text-white md:py-28">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <ScrollAnimation>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-corporate-blue" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-corporate-blue">
              Desde la perspectiva de nuestros especialistas
            </span>
          </div>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-bold md:text-4xl">
            Conocimiento respaldado por experiencia real
          </h2>
        </ScrollAnimation>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {specialists.map(({ article }, index) => (
            <ScrollAnimation key={article.author.name} delay={index * 0.1}>
              <Link
                href={`/blog/${article.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-corporate-blue/40 hover:bg-white/[0.07] focus-visible:-translate-y-1 focus-visible:border-corporate-blue/40 focus-visible:outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-white/15">
                    <Image
                      src={article.author.image!}
                      alt={article.author.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg font-semibold text-white">
                      {article.author.name}
                    </p>
                    <p className="text-sm text-white/60">{article.author.role}</p>
                  </div>
                </div>

                <p className="mt-5 line-clamp-2 text-sm text-white/70">
                  &ldquo;{article.excerpt}&rdquo;
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-corporate-blue transition-transform duration-300 group-hover:translate-x-1">
                  Leer su análisis
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
