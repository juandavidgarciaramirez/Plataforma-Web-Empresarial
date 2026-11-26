import { cn } from "@/lib/utils/cn"
import { NewsCard } from "@/components/organisms/NewsCard/NewsCard"
import type { NewsArticle } from "@/data/news"

interface RelatedNewsProps {
  articles: NewsArticle[]
}

/** Bloque "También puede interesarte" al cierre de un artículo. */
export function RelatedNews({ articles }: RelatedNewsProps) {
  if (articles.length === 0) return null

  return (
    <section className="border-t border-border/60 bg-slate-50 py-20 dark:bg-slate-900/50 md:py-28">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-corporate-blue" />
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-corporate-blue">
            También puede interesarte
          </span>
        </div>

        <div
          className={cn(
            "mt-10 grid grid-cols-1 gap-8",
            articles.length > 1 && "sm:grid-cols-2",
            articles.length > 2 && "lg:grid-cols-3"
          )}
        >
          {articles.map((article) => (
            <NewsCard key={article.slug} article={article} variant="standard" />
          ))}
        </div>
      </div>
    </section>
  )
}
