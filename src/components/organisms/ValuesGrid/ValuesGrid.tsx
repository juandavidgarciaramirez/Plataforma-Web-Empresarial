"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils/cn"
import { getIcon } from "@/lib/icon-registry"
import type { CompanyValue } from "@/hooks/useSiteContent"

interface ValuesGridProps {
  values: CompanyValue[]
}

export function ValuesGrid({ values }: ValuesGridProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-3 md:h-[440px] md:flex-row">
      {values.map((value) => {
        const Icon = getIcon(value.iconKey)
        const isActive = activeKey === value.key
        const isDimmed = activeKey !== null && !isActive

        return (
          <button
            key={value.key}
            type="button"
            onMouseEnter={() => setActiveKey(value.key)}
            onMouseLeave={() => setActiveKey(null)}
            onClick={() => setActiveKey((k) => (k === value.key ? null : value.key))}
            aria-expanded={isActive}
            className={cn(
              "group relative flex min-h-[220px] flex-col overflow-hidden rounded-2xl border border-border/40 text-left shadow-sm transition-all duration-500 ease-out",
              "md:min-w-[72px]",
              isActive ? "md:flex-[3]" : "md:flex-[1]",
              isDimmed && "md:opacity-70"
            )}
            style={{ transitionProperty: "flex-grow, opacity" }}
          >
            {value.imageUrl && (
              <Image
                src={value.imageUrl}
                alt={`Valor ${value.title} de Capital Consulting`}
                fill
                sizes="(min-width: 768px) 30vw, 90vw"
                className={cn(
                  "object-cover transition-transform duration-700 ease-out",
                  isActive ? "scale-100" : "scale-105 group-hover:scale-100"
                )}
              />
            )}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/20 transition-opacity duration-500",
                isActive && "from-slate-950/95 via-slate-950/70"
              )}
            />

            <div className="relative z-10 flex h-full flex-col p-6">
              <span
                className={cn(
                  "h-0.5 w-8 rounded-full bg-white/70 transition-all duration-500",
                  isActive && "w-14 bg-white"
                )}
              />
              <Icon className="mt-4 h-7 w-7 text-white" />

              <div className="mt-auto">
                <h3 className="font-display text-lg font-semibold text-white md:text-xl">
                  {value.title}
                </h3>
                {value.description && (
                  <p
                    className={cn(
                      "mt-3 max-w-xs text-sm text-white/85 transition-all duration-500",
                      "max-h-40 opacity-100",
                      "md:max-h-0 md:opacity-0",
                      isActive && "md:max-h-40 md:opacity-100"
                    )}
                  >
                    {value.description}
                  </p>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
