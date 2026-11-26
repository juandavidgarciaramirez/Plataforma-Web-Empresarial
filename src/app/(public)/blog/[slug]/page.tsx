import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/organisms/Navbar/Navbar"
import { Footer } from "@/components/organisms/Footer/Footer"
import { BlogArticleContent } from "@/components/organisms/BlogArticleContent/BlogArticleContent"
import { RelatedBlogArticles } from "@/components/organisms/RelatedBlogArticles/RelatedBlogArticles"
import { BlogAuthorRow } from "@/components/molecules/BlogAuthorRow/BlogAuthorRow"
import { ImageGallery } from "@/components/organisms/ImageGallery/ImageGallery"
import { ScrollAnimation } from "@/components/atoms/ScrollAnimation"
import { blogPublicService } from "@/services/public/blog-public.service"
import { buildPageSeo } from "@/lib/seo/metadata"

interface BlogArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await blogPublicService.getBySlug(slug)

  if (!article) {
    return { title: "Artículo no encontrado" }
  }

  return {
    title: article.seo.title,
    description: article.seo.description,
    keywords: article.tags.join(", "),
    ...buildPageSeo({
      title: article.seo.title,
      description: article.seo.description,
      path: `/blog/${article.slug}`,
      image: article.image || undefined,
      type: "article",
      publishedTime: article.publishedAt || undefined,
      authors: [article.author.name],
    }),
  }
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params
  const article = await blogPublicService.getBySlug(slug)

  if (!article) {
    notFound()
  }

  const related = await blogPublicService.getRelated(article.slug, 3)
  const date = formatDate(article.publishedAt)

  return (
    <>
      <Navbar />
      <main>
        <article>
          {/* Encabezado editorial */}
          <header className="bg-white pb-12 pt-32 dark:bg-slate-950 md:pb-16 md:pt-40">
            <div className="container mx-auto px-6 md:px-12 lg:px-20">
              <ScrollAnimation>
                <div className="mx-auto flex max-w-3xl flex-col">
                  <Link
                    href="/blog"
                    className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-corporate-blue"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Blog
                  </Link>

                  <span className="mt-6 inline-flex w-fit items-center rounded-full bg-corporate-blue/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-corporate-blue">
                    {article.category}
                  </span>

                  <h1 className="mt-5 font-display text-3xl font-bold leading-tight text-corporate-dark dark:text-white md:text-5xl">
                    {article.title}
                  </h1>

                  <p className="mt-5 text-lg text-muted-foreground md:text-xl">{article.subtitle}</p>

                  <div className="mt-8">
                    <BlogAuthorRow author={article.author} date={date} />
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </header>

          {/* Imagen principal */}
          <ScrollAnimation>
            <div className="container mx-auto px-6 md:px-12 lg:px-20">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-xl md:aspect-[21/9]">
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </ScrollAnimation>

          {/* Cuerpo del artículo */}
          <div className="bg-white py-16 dark:bg-slate-950 md:py-20">
            <div className="container mx-auto px-6 md:px-12 lg:px-20">
              <div className="mx-auto max-w-3xl">
                <ScrollAnimation>
                  <BlogArticleContent content={article.content} conclusion={article.conclusion} />
                </ScrollAnimation>
                {article.gallery && article.gallery.length > 0 && (
                  <ImageGallery images={article.gallery} fallbackAlt={article.title} title="Galería" className="mt-12" />
                )}

                {/* CTA de la línea de servicio relacionada */}
                <ScrollAnimation>
                  <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-corporate-blue/20 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between dark:bg-slate-900/50">
                    <p className="text-base font-medium text-corporate-dark dark:text-white">
                      ¿Quieres profundizar en {article.category.toLowerCase()}?
                    </p>
                    <Link
                      href={article.cta.href}
                      className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-corporate-blue transition-transform hover:translate-x-0.5"
                    >
                      {article.cta.label}
                    </Link>
                  </div>
                </ScrollAnimation>
              </div>
            </div>
          </div>

          {/* CTA */}
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
                  Nuestro equipo puede ayudarte a resolver este y otros retos
                  de gestión en tu organización.
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

          {/* Artículos relacionados */}
          <RelatedBlogArticles articles={related} />
        </article>
      </main>
      <Footer />
    </>
  )
}
