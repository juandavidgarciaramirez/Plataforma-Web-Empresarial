import type { LucideIcon } from "lucide-react"

interface ContactCardProps {
  icon: LucideIcon
  title: string
  value: string
  href?: string
  description?: string
}

export function ContactCard({ icon: Icon, title, value, href, description }: ContactCardProps) {
  const content = (
    <div className="flex h-full flex-col rounded-2xl border border-border/40 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg dark:bg-slate-950">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-display text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 break-words text-sm font-medium text-primary">{value}</p>
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
    </div>
  )

  if (!href) return content

  return (
    <a href={href} className="block h-full">
      {content}
    </a>
  )
}
