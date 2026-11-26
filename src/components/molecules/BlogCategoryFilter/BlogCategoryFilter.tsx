"use client"

import { cn } from "@/lib/utils/cn"

interface BlogCategoryFilterProps {
  categories: string[]
  active: string
  onChange: (category: string) => void
}

export const ALL_CATEGORIES_LABEL = "TODOS"

/** Filtros de categoría del Blog (sección 2 del brief). Pastillas horizontales con scroll en mobile. */
export function BlogCategoryFilter({ categories, active, onChange }: BlogCategoryFilterProps) {
  const options = [ALL_CATEGORIES_LABEL, ...categories]

  return (
    <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
      {options.map((category) => {
        const isActive = category === active
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            aria-pressed={isActive}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition-all duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-blue focus-visible:ring-offset-2",
              isActive
                ? "border-corporate-blue bg-corporate-blue text-white shadow-md shadow-corporate-blue/25"
                : "border-border/60 bg-white text-muted-foreground hover:border-corporate-blue/40 hover:text-corporate-dark dark:bg-slate-950 dark:text-slate-400 dark:hover:text-white"
            )}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
