"use client"

import { useState } from "react"
import { cn } from "@/lib/utils/cn"
import type { WhoWeAreConcept } from "@/hooks/useSiteContent"

interface WhoWeAreConceptsProps {
  concepts: WhoWeAreConcept[]
}

export function WhoWeAreConcepts({ concepts }: WhoWeAreConceptsProps) {
  const [activeKey, setActiveKey] = useState<string | undefined>(concepts[0]?.key)
  const active = concepts.find((c) => c.key === activeKey) ?? concepts[0]

  if (!active) return null

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {concepts.map((concept) => {
          const isActive = concept.key === activeKey
          return (
            <button
              key={concept.key}
              type="button"
              onMouseEnter={() => setActiveKey(concept.key)}
              onFocus={() => setActiveKey(concept.key)}
              onClick={() => setActiveKey(concept.key)}
              className={cn(
                "rounded-full border px-5 py-2.5 text-sm font-semibold uppercase tracking-wider transition-all duration-300",
                isActive
                  ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                  : "border-border/50 bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {concept.label}
            </button>
          )
        })}
      </div>

      <div className="relative mt-6 min-h-[72px] overflow-hidden rounded-xl border-l-2 border-primary bg-slate-50 px-6 py-5 dark:bg-slate-900">
        <p key={active.key} className="text-base text-muted-foreground">
          {active.description}
        </p>
      </div>
    </div>
  )
}
