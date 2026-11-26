interface LegalTableOfContentsProps {
  sections: { id: string; title: string }[]
}

/**
 * Índice de la página legal. Es un enlace de anclas puro (sin JS), por lo
 * que se renderiza en servidor; en escritorio queda fijo (`sticky`) junto al
 * contenido mientras se hace scroll (sección 7 del brief).
 */
export function LegalTableOfContents({ sections }: LegalTableOfContentsProps) {
  return (
    <nav aria-label="Índice del documento" className="hidden lg:block">
      <div className="sticky top-28 rounded-2xl border border-border/40 bg-slate-50 p-5 dark:bg-slate-900/30">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Índice</p>
        <ul className="mt-3 space-y-2.5 text-sm">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="block leading-snug text-muted-foreground transition-colors hover:text-primary"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
