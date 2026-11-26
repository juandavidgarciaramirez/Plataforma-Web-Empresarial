"use client"

import { useMemo, useState } from "react"
import { FileSearch } from "lucide-react"
import { BlogCategoryFilter, ALL_CATEGORIES_LABEL } from "@/components/molecules/BlogCategoryFilter/BlogCategoryFilter"
import { BlogCard } from "@/components/organisms/BlogCard/BlogCard"
import { ScrollAnimation } from "@/components/atoms/ScrollAnimation"
import type { BlogArticle } from "@/data/blog"

interface BlogExplorerProps {
  articles: BlogArticle[]
  categories: string[]
}

/**
 * Filtros de categoría + grid de artículos (secciones 2 y 9 del brief).
 * Vive en un único client component para que el filtrado sea instantáneo,
 * mientras la página del listado (`/blog`) permanece un server component
 * para metadata y datos.
 */
export function BlogExplorer({ articles, categories }: BlogExplorerProps) {
  const [active, setActive] = useState<string>(ALL_CATEGORIES_LABEL)

  const filtered = useMemo(() => {
    if (active === ALL_CATEGORIES_LABEL) return articles
    return articles.filter((article) => article.category === active)
  }, [articles, active])

  return (
    <div>
      <BlogCategoryFilter categories={categories} active={active} onChange={setActive} />

      {filtered.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-8 md:mt-12 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article, index) => (
            <ScrollAnimation key={article.slug} delay={(index % 3) * 0.08}>
              <BlogCard article={article} variant="standard" />
            </ScrollAnimation>
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-border/60 bg-slate-50 px-6 py-16 text-center dark:bg-slate-900/40">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-corporate-blue/10 text-corporate-blue">
            <FileSearch className="h-5 w-5" aria-hidden />
          </span>
          <h3 className="mt-4 font-display text-lg font-semibold text-corporate-dark dark:text-white">
            Todavía no hay artículos en esta categoría
          </h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Estamos preparando nuevos contenidos. Explora las demás categorías mientras tanto.
          </p>
        </div>
      )}
    </div>
  )
}
