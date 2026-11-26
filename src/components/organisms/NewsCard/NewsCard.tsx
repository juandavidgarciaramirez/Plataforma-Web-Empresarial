import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import type { NewsArticle } from "@/data/news"

type NewsCardVariant = "featured" | "standard" | "wide"

interface NewsCardProps {
  article: NewsArticle
  variant?: NewsCardVariant
  /** Reservar solo para la imagen principal visible en el primer viewport. */
  priority?: boolean
}

const aspectByVariant: Record<NewsCardVariant, string> = {
  featured: "aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/9]",
  standard: "aspect-[4/3]",
  wide: "aspect-[16/9] sm:aspect-[3/1]",
}

const titleByVariant: Record<NewsCardVariant, string> = {
  featured: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
  standard: "text-xl md:text-2xl",
  wide: "text-2xl md:text-3xl",
}

const sizesByVariant: Record<NewsCardVariant, string> = {
  featured: "100vw",
  standard: "(min-width: 768px) 50vw, 100vw",
  wide: "100vw",
}

/**
 * Tarjeta editorial de noticia: imagen protagonista con overlay de texto.
 * Un único componente cubre la noticia destacada, el grid de dos columnas
 * y la tarjeta ancha, controlado por `variant`.
 *
 * Microinteracciones (hover + focus, nunca solo hover):
 * zoom sutil de imagen, overlay azul corporativo, título que se desplaza,
 * "Leer artículo →" que aparece, elevación de la tarjeta y acento inferior.
 */
export function NewsCard({ article, variant = "standard", priority = false }: NewsCardProps) {
  return (
    <Link
      href={`/noticias/${article.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-2xl bg-corporate-dark outline-none",
        "shadow-sm transition-all duration-500 ease-out",
        "hover:-translate-y-1 hover:shadow-2xl hover:shadow-corporate-dark/25",
        "focus-visible:-translate-y-1 focus-visible:shadow-2xl focus-visible:shadow-corporate-dark/25",
        "focus-visible:ring-2 focus-visible:ring-corporate-blue focus-visible:ring-offset-2",
        aspectByVariant[variant]
      )}
    >
      <Image
        src={article.image}
        alt={article.imageAlt}
        fill
        priority={priority}
        sizes={sizesByVariant[variant]}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
      />

      {/* Scrim permanente: garantiza legibilidad del texto sobre la foto */}
      <div className="absolute inset-0 bg-gradient-to-t from-corporate-dark/95 via-corporate-dark/35 to-corporate-dark/0" />

      {/* Overlay azul corporativo, solo en hover/foco */}
      <div className="absolute inset-0 bg-corporate-blue/0 transition-colors duration-500 group-hover:bg-corporate-blue/20 group-focus-visible:bg-corporate-blue/20" />

      {/* Acento corporativo inferior */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-corporate-blue transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />

      <div
        className={cn(
          "relative flex h-full flex-col justify-end p-6 md:p-8",
          variant === "featured" && "md:p-10"
        )}
      >
        <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-white ring-1 ring-white/25 backdrop-blur-sm">
          {article.category}
        </span>

        <h3
          className={cn(
            "mt-4 max-w-xl font-display font-bold leading-tight text-white transition-transform duration-500 ease-out",
            "group-hover:translate-x-1 group-focus-visible:translate-x-1",
            titleByVariant[variant]
          )}
        >
          {article.title}
        </h3>

        <span
          className={cn(
            "mt-4 inline-flex items-center gap-2 text-sm font-medium text-white",
            "-translate-x-1 opacity-0 transition-all duration-500 ease-out",
            "group-hover:translate-x-0 group-hover:opacity-100",
            "group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
          )}
        >
          Leer artículo
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
