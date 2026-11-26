"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { EXPERIENCE_SECTORS } from "@/features/careers/careers.constants"

interface SectorSelectorProps {
  value: string[]
  onChange: (sectors: string[]) => void
  id?: string
}

/**
 * Selección múltiple de sectores de experiencia (sección 4, bloque "Sector
 * de experiencia"). Chips en vez de una lista de checkboxes tradicional,
 * para que se sienta como plataforma corporativa moderna (sección 14).
 */
export function SectorSelector({ value, onChange, id }: SectorSelectorProps) {
  const toggle = (sector: string) => {
    if (value.includes(sector)) {
      onChange(value.filter((s) => s !== sector))
    } else {
      onChange([...value, sector])
    }
  }

  return (
    <div id={id} role="group" aria-label="Sector de experiencia" className="flex flex-wrap gap-2.5">
      {EXPERIENCE_SECTORS.map((sector) => {
        const selected = value.includes(sector)
        return (
          <button
            key={sector}
            type="button"
            onClick={() => toggle(sector)}
            aria-pressed={selected}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
              selected
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border/60 bg-white text-foreground hover:border-primary/40 hover:bg-primary/5 dark:bg-slate-950"
            )}
          >
            {selected && <Check className="h-3.5 w-3.5" />}
            {sector}
          </button>
        )
      })}
    </div>
  )
}
