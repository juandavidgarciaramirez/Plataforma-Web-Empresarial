import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { BlogAuthorRow } from "@/components/molecules/BlogAuthorRow/BlogAuthorRow"
import type { BlogArticle } from "@/data/blog"

type BlogCardVariant = "featured" | "standard"

interface BlogCardProps {
  article: BlogArticle
  variant?: BlogCardVariant
  /** Reservar solo para la imagen visible en el primer viewport. */
  priority?: boolean
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

/**
 * Tarjeta editorial del Blog: imagen arriba, contenido debajo — a propósito
 * distinta del overlay "texto sobre foto" de `NewsCard`, para que el Blog se
 * lea como una publicación de conocimiento y no como un calco de Noticias.
 * Una variante cubre el artículo destacado (split a dos columnas en desktop)
 * y el grid estándar.
 *
 * Microinteracciones (hover + focus, nunca solo hover): zoom sutil de
 * imagen, elevación de la tarjeta, acento inferior y "Leer artículo →" que
 * se desplaza.
 */
export function BlogCard({ article, variant = "standard", priority = false }: BlogCardProps) {
  const date = formatDate(article.publishedAt)
  const isFeatured = variant === "featured"

  return (
    <Link
      href={`/blog/${article.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-white outline-none",
        "shadow-sm transition-all duration-500 ease-out",
        "hover:-translate-y-1 hover:shadow-2xl hover:shadow-corporate-dark/10",
        "focus-visible:-translate-y-1 focus-visible:shadow-2xl focus-visible:shadow-corporate-dark/10",
        "focus-visible:ring-2 focus-visible:ring-corporate-blue focus-visible:ring-offset-2",
        "dark:border-white/10 dark:bg-slate-900",
        isFeatured && "lg:grid lg:grid-cols-2 lg:items-stretch"
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden",
          isFeatured ? "aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:h-full" : "aspect-[4/3]"
        )}
      >
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          priority={priority}
          sizes={isFeatured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
        />
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col p-6",
          isFeatured ? "justify-center md:p-8 lg:p-10" : "md:p-7"
        )}
      >
        <span className="inline-flex w-fit items-center rounded-full bg-corporate-blue/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-corporate-blue">
          {article.category}
        </span>

        <h3
          className={cn(
            "mt-4 font-display font-bold leading-tight text-corporate-dark transition-colors duration-300 dark:text-white",
            "group-hover:text-corporate-blue group-focus-visible:text-corporate-blue",
            isFeatured ? "text-2xl md:text-3xl lg:text-[2.15rem]" : "text-lg md:text-xl"
          )}
        >
          {article.title}
        </h3>

        <p
          className={cn(
            "mt-3 text-slate-600 dark:text-slate-400",
            isFeatured ? "line-clamp-3 text-base md:text-lg" : "line-clamp-2 text-sm"
          )}
        >
          {article.excerpt}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-5 dark:border-white/10">
          <BlogAuthorRow author={article.author} date={date} size={isFeatured ? "md" : "sm"} />

          <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-corporate-blue">
            Leer artículo
            <ArrowRight
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-300",
                "group-hover:translate-x-1 group-focus-visible:translate-x-1"
              )}
            />
          </span>
        </div>
      </div>

      {/* Acento corporativo inferior */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-corporate-blue transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </Link>
  )
}
