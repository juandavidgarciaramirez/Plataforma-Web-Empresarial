import Image from "next/image"
import { cn } from "@/lib/utils/cn"
import type { BlogAuthor } from "@/data/blog"

interface BlogAuthorRowProps {
  author: BlogAuthor
  /** Fecha ya formateada (es-CO), la calcula quien consume el componente. */
  date: string
  size?: "sm" | "md"
  /** Sobre fondo oscuro (p. ej. encabezado del artículo) invierte los tonos de texto. */
  onDark?: boolean
  className?: string
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

/**
 * Autoría del Blog (sección 5 del brief): foto, nombre, cargo y fecha.
 * Cuando el artículo no tiene un especialista confirmado, `author` es
 * `DEFAULT_BLOG_AUTHOR` ("Equipo Capital Consulting") y se muestra un
 * avatar con las iniciales de la marca en lugar de una foto inventada.
 */
export function BlogAuthorRow({ author, date, size = "md", onDark = false, className }: BlogAuthorRowProps) {
  const avatarSize = size === "sm" ? "h-9 w-9" : "h-11 w-11"

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {author.image ? (
        <div className={cn("relative shrink-0 overflow-hidden rounded-full ring-2 ring-white/80", avatarSize)}>
          <Image src={author.image} alt={author.name} fill sizes="48px" className="object-cover" />
        </div>
      ) : (
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full font-display text-xs font-semibold",
            avatarSize,
            onDark ? "bg-white/10 text-white ring-2 ring-white/20" : "bg-corporate-blue/10 text-corporate-blue"
          )}
        >
          {initials(author.name)}
        </div>
      )}

      <div className="flex min-w-0 flex-col">
        <span className={cn("truncate text-sm font-semibold", onDark ? "text-white" : "text-corporate-dark dark:text-white")}>
          {author.name}
        </span>
        <span className={cn("truncate text-xs", onDark ? "text-white/60" : "text-muted-foreground")}>
          {author.role} · {date}
        </span>
      </div>
    </div>
  )
}
