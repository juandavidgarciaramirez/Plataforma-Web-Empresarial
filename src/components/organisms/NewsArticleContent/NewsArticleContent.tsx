import { Info } from "lucide-react"
import type { NewsContentBlock } from "@/data/news"

interface NewsArticleContentProps {
  content: NewsContentBlock[]
}

/** Renderiza el cuerpo estructurado de una noticia (ver `src/data/news.ts`). */
export function NewsArticleContent({ content }: NewsArticleContentProps) {
  return (
    <div className="space-y-6">
      {content.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={index}
                className="pt-4 font-display text-2xl font-bold text-corporate-dark dark:text-white md:text-3xl"
              >
                {block.text}
              </h2>
            )
          case "paragraph":
            return (
              <p
                key={index}
                className="text-lg leading-relaxed text-slate-700 dark:text-slate-300"
              >
                {block.text}
              </p>
            )
          case "list":
            return (
              <ul key={index} className="space-y-3">
                {block.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex items-start gap-3 text-lg leading-relaxed text-slate-700 dark:text-slate-300"
                  >
                    <span
                      aria-hidden
                      className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-corporate-blue"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )
          case "note":
            return (
              <div
                key={index}
                className="flex gap-3 rounded-lg border-l-4 border-corporate-blue bg-slate-50 p-5 dark:bg-slate-900/50"
              >
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-corporate-blue" aria-hidden />
                <p className="text-sm italic leading-relaxed text-muted-foreground">
                  {block.text}
                </p>
              </div>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
