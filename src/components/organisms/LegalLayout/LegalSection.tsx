interface LegalSectionProps {
  id: string
  title: string
  paragraphs: string[]
}

/** Una sección numerada del documento legal, con su propio anchor para el índice. */
export function LegalSection({ id, title, paragraphs }: LegalSectionProps) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 text-muted-foreground">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  )
}
